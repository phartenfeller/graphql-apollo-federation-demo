const getDb = require('./dbSqlite');

const db = getDb();

const getAllActors = async () => {
  const sql = `select a.actor_id as actorId
                    , a.name as name
                    , a.gender as gender
                 from actors a
              `;

  const rows = await db.queryRows(sql);
  return rows;
};

const getActorById = async (actorId) => {
  const sql = `select a.actor_id as actorId
                    , a.name as name
                    , a.gender as gender
                 from actors a
                where actor_id = ?
              `;

  const row = await db.queryRow(sql, [actorId]);
  return row;
};

const getActorRoles = async (actorId) => {
  const sql = `select m.role as role
                    , m.movie_id as movieId
                 from movie_roles m
                where actor_id = ?
              `;

  const rows = await db.queryRows(sql, [actorId]);
  return rows;
};

const getActorsByName = async (name) => {
  const sql = `select a.actor_id as actorId
                    , a.name as name
                    , a.gender as gender
                 from actors a
                where a.name like ?
             `;

  const rows = await db.queryRows(sql, [`%${name.toLowerCase()}%`]);
  return rows;
};

module.exports = { getAllActors, getActorRoles, getActorById, getActorsByName };
