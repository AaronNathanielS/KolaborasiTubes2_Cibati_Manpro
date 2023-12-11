const express = require("express");
const mysql = require("mysql");

const port = 8000;
const app = express();
app.set("view engine", "ejs");

const pool = mysql.createPool({
  multipleStatements: true,
  user: "root",
  password: "",
  database: "Manpro",
  host: "127.0.0.1",
  port: 3306,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to database");
    connection.release();
  }
});

app.get("/", (req, res) => {
  res.render("Home");
});

app.get("/addfile", (req, res) => {
  res.render("AddFile");
});

app.get("/summarizedata", (req, res) => {
  res.render("SummarizeData");
});

app.get("/grafikbar", (req, res) => {
  res.render("GrafikBar");
});

app.get("/grafikscatter", (req, res) => {
  res.render("GrafikScatter");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


