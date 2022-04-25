const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "35.238.146.57",
  user: "root",
  database: "wahah",
  password: "Yasser29",
});

module.exports = pool.promise();
