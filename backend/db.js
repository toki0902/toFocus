const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  port: 3306,
  host: "localhost",
  user: "root",
  password: "Toki_1226",
  database: "toConc",
  namedPlaceholders: true,
});

//単一のクエリの場合にはpool.query()の方がrelease()も行ってくれて便利
//複数のクエリを実行する場合にはpool.getConnection()を行い、クエリを実行後release()を行うことでコストがかからない。

exports.pool = pool;
