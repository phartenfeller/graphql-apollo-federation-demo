const fs = require('fs');
const path = require('path');
const data = require('./data/movies.json');

const moviesArr = [];
const castArr = [];

data.forEach(({ id, title, year, runtime, genres, cast }) => {
  moviesArr.push({ id, title, year, runtime, genres });

  cast.forEach(({ role, name }) => castArr.push({ id, role, name }));
});

fs.writeFileSync(
  path.join(__dirname, 'data', 'movies_list.json'),
  JSON.stringify(moviesArr)
);

fs.writeFileSync(
  path.join(__dirname, 'data', 'actors_list.json'),
  JSON.stringify(castArr)
);
