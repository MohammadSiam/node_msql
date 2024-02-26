const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const app = express();

// Middleware to parse request body
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Add your MySQL password here
  database: "login_system", // Change to your database name
  port: 3307,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Route to handle form submission
app.post("/submit", (req, res) => {
  try {
    const { Name, Password } = req.body;
    console.log(Name, Password);

    // Check if the data already exists in the database
    const checkQuery = "SELECT * FROM users WHERE Name = ? AND Password=?";
    db.query(checkQuery, [Name, Password], async (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking data in MySQL:", checkErr);
        return res.status(500).send("Error checking data in MySQL");
      }

      // If data already exists, send a response indicating it
      if (checkResult.length > 0) {
        const user = checkResult[0];
        const token = jwt.sign(
          { id: user.id, Name: user.Name },
          "your_secret_key"
        );
        return res.status(200).json({ token });
      } else {
        // If user doesn't exist, send an error response
        return res.status(401).send("Invalid username or password");
      }

      // If user doesn't exist, hash the password
      const hashedPassword = await argon2.hash(Password);

      // If data doesn't exist, insert it into MySQL
      const insertQuery = "INSERT INTO users (Name, Password) VALUES (?, ?)";
      db.query(
        insertQuery,
        [Name, hashedPassword],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting data into MySQL:", insertErr);
            return res.status(500).send("Error inserting data into MySQL");
          }
          console.log("Data inserted into MySQL:", insertResult);
          return res.status(200).send("Data inserted successfully");
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
