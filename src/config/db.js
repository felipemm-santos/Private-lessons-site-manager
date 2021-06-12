const {Pool} = require("pg");

module.exports = new Pool({
    user: "postgres",
  password: "01/03/2021",
  host: "localhost",
  port: "5432",
  database: "my_teacher",
})