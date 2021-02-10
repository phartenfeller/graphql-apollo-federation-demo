const fs = require("fs");
const data = require("./data/movies.json");

let movArr = [];

data.forEach(({ movieId, title, year, runtime, descr }) => {
  movArr.push({ movieId, title, year, runtime, descr });
});

fs.writeFileSync("./data/movies.json", JSON.stringify(movArr, null, 2));
