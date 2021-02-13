const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const movies = require('../../src_data/movies.json');

const DB_NAME = 'movies.sqlite';

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
        CREATE TABLE IF NOT EXISTS MOVIES (
          MOVIE_ID INTEGER PRIMARY KEY NOT NULL
        , TITLE VARCHAR(200) NOT NULL
        , YEAR NUMBER(4) NOT NULL
        , RUNTIME NUMBER(4)
        , DESCRIPTION TEXT
        );
        `;

      this.db.run(sqlCreate1, (_, err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(1);
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
    const sql = `select count(*) as cnt from movies`;
    const row = await this.queryRow(sql);

    if (row.cnt === 0) {
      console.log('No data found, populating tables...');

      const moviesArr = [];

      movies.forEach(({ movieId, title, year, runtime, description }) => {
        moviesArr.push([movieId, title, year, runtime, description]);
      });

      const insert = `INSERT INTO movies (movie_id, title, year, runtime, description) values (?, ?, ?, ?, ?)`;
      await this.insertRows(insert, moviesArr);

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
    await this.runStatement('PRAGMA cache_size=-64000');

    await this.initTables();
    await this.fillData();
  }
}

const dbInstance = new Db();

const getDb = () => dbInstance;

module.exports = getDb;
