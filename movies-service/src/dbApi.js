const getDb = require('./dbSqlite');

const db = getDb();

const getMoviesByTitle = async (title) => {
  const sql = `select movie_id as movieId
                    , title as title
                    , year as year
                    , runtime as runtime
                    , description as description
                 from movies
                where lower(title) like ?
             `;

  const rows = await db.queryRows(sql, [`%${title.toLowerCase()}%`]);
  return rows;
};

module.exports = { getMoviesByTitle };
