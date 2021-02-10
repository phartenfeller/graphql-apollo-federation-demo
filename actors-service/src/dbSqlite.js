const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const data = require('../../data/actors.json');

const DB_NAME = 'actors.sqlite';

class Db {
  constructor() {
    this.db = null;
    this.initDb();
  }

  createDb() {
    const actorDb = path.join(__dirname, '..', 'data', DB_NAME);

    const mydb = new sqlite3.Database(actorDb, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`Successful connection to the database '${DB_NAME}'`);
      }
    });

    this.db = mydb;
  }

  initTables() {
    return new Promise((resolve, reject) => {
      const sqlCreate1 = `
        CREATE TABLE IF NOT EXISTS ACTORS (
          ACTOR_ID INTEGER PRIMARY KEY NOT NULL
        , NAME VARCHAR(200) NOT NULL
        , GENDER VARCHAR(64) NOT NULL
        );
        `;

      const sqlCreate2 = `
      CREATE TABLE IF NOT EXISTS MOVIE_ROLES (
        ACTOR_ID INTEGER NOT NULL
      , MOVIE_ID INTEGER NOT NULL
      , ROLE VARCHAR(200) NOT NULL
      , PRIMARY KEY (ACTOR_ID, MOVIE_ID)
      , FOREIGN KEY(ACTOR_ID) REFERENCES ACTORS(ACTOR_ID)
      );`;

      this.db.run(sqlCreate1, (_, err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }

        this.db.run(sqlCreate2, (__, err2) => {
          if (err2) {
            console.error(err.message);
            reject(err);
          }
          resolve(1);
        });
      });
    });
  }

  runStatement(statement) {
    return new Promise((resolve, reject) => {
      this.db.run(statement, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  queryRow(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }

  queryRows(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  insertRows(statement, values) {
    return new Promise((resolve, reject) => {
      const st = this.db.prepare(statement);

      this.db.run('BEGIN TRANSACTION');

      values.forEach((val) => {
        st.run(val);
      });

      st.finalize((err) => {
        if (err) {
          this.db.run('ROLLBACK TRANSACTION');
          reject(err);
        }
        this.db.run('COMMIT TRANSACTION');
        resolve(1);
      });
    });
  }

  async fillData() {
    const sql = `select count(*) as cnt from actors`;
    const row = await this.queryRow(sql);

    if (row.cnt === 0) {
      console.log('No data found, populating tables...');

      const actors = [];
      const actorMovies = [];

      data.forEach(({ personId, name, gender, movies }) => {
        actors.push([personId, name, gender]);
        movies.forEach(({ role, movieId }) => {
          actorMovies.push([personId, movieId, role]);
        });
      });

      const insert1 = `INSERT INTO actors (actor_id, name, gender) values (?, ?, ?)`;
      await this.insertRows(insert1, actors);

      const insert2 = `INSERT INTO movie_roles (actor_id, movie_id, role) values (?, ?, ?)`;
      await this.insertRows(insert2, actorMovies);

      console.log('Finished populating data...');
    } else {
      console.log('Data found');
    }
  }

  async initDb() {
    this.createDb();

    // performance options
    await this.runStatement('PRAGMA synchronous=OFF');
    await this.runStatement('PRAGMA count_changes=OFF');
    await this.runStatement('PRAGMA journal_mode=MEMORY');
    await this.runStatement('PRAGMA temp_store=MEMORY');

    await this.initTables();
    await this.fillData();
  }
}

const dbInstance = new Db();

const getDb = () => dbInstance;

module.exports = getDb;
