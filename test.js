var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login_system",
});

// con.connect(function (err) {
//   if (err) throw err;
//   //Select all customers and return the result object:
//   con.query("SELECT * FROM users", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql =
    "INSERT INTO users (id,username, password) VALUES ('3', 'siam2','siam2')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
