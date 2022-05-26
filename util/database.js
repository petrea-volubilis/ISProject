const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: "wahah",
  password: "12345678",
});

module.exports = pool.promise();
