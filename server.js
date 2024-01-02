const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const xlsx = require("xlsx");

const port = 8000;
const app = express();
app.set("view engine", "ejs");

const moment = require("moment");

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  multipleStatements: true,
  user: "root",
  password: "",
  database: "Manpro",
  host: "127.0.0.1",
  port: 3306,
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  const selectAllDataQuery = "SELECT * FROM Marketing_Campaign";

  pool.query(selectAllDataQuery, (err, result) => {
    if (err) {
      console.error(
        "Error retrieving data from Marketing_Campaign table:",
        err.message
      );
      res
        .status(500)
        .send("Error retrieving data from the Marketing_Campaign table");
    } else {
      const data = result;
      res.render("SummarizeData", { data });
    }
  });
});

app.get("/grafikbar", (req, res) => {
  res.render("GrafikBar");
});

app.get("/grafikscatter", (req, res) => {
  res.render("GrafikScatter");
});

app.get("/api/scatter-data", (req, res) => {
  const kolomX = req.query.kolomX;
  const kolomY = req.query.kolomY;

  const query = `SELECT ??, ?? FROM Marketing_Campaign`; // Gunakan placeholder ?? untuk mencegah SQL injection
  pool.query(query, [kolomX, kolomY], (err, results) => {
    if (err) {
      console.error("Error fetching scatter plot data:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

//file upload CSV/Excel
app.post("/upload", upload.single("file"), (req, res) => {
  const fileBuffer = req.file.buffer;
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(worksheet);

  const insertDataQuery = `
    INSERT INTO Marketing_Campaign (
      ID, Year_Birth, Education, Marital_Status, Income, Kidhome, Teenhome,
      Dt_Customer, Recency, MntWines, MntFruits, MntMeatProducts, MntFishProducts,
      MntSweetProducts, MntGoldProds, NumDealsPurchases, NumWebPurchases,
      NumCatalogPurchases, NumStorePurchases, NumWebVisitsMonth, AcceptedCmp1,
      AcceptedCmp2, AcceptedCmp3, AcceptedCmp4, AcceptedCmp5, Complain,
      Z_CostContact, Z_Revenue, Response
    ) VALUES ?`;

  const values = data.map((row) => [
    row.ID,
    row.Year_Birth,
    row.Education,
    row.Marital_Status,
    row.Income,
    row.Kidhome,
    row.Teenhome,
    moment(row.Dt_Customer, "DD-MM-YYYY").format("YYYY-MM-DD"),
    row.Recency,
    row.MntWines,
    row.MntFruits,
    row.MntMeatProducts,
    row.MntFishProducts,
    row.MntSweetProducts,
    row.MntGoldProds,
    row.NumDealsPurchases,
    row.NumWebPurchases,
    row.NumCatalogPurchases,
    row.NumStorePurchases,
    row.NumWebVisitsMonth,
    row.AcceptedCmp1,
    row.AcceptedCmp2,
    row.AcceptedCmp3,
    row.AcceptedCmp4,
    row.AcceptedCmp5,
    row.Complain,
    row.Z_CostContact,
    row.Z_Revenue,
    row.Response,
  ]);

  pool.query(insertDataQuery, [values], (err, result) => {
    if (err) {
      console.error(
        "Error inserting data into Marketing_Campaign table:",
        err.message
      );
      res
        .status(500)
        .send("Error inserting data into the Marketing_Campaign table");
    } else {
      console.log("Data inserted into Marketing_Campaign table successfully");
      res.redirect("/addfile?success=true"); // Redirect to the addfile page after successful upload
    }
  });
});

app.post("/SummarizeData", (req, res) => {
  const { selectColumn, selectOperation, groupByColumn } = req.body;

  let sqlQuery = `SELECT ${groupByColumn}, ${selectOperation}(${selectColumn}) AS ${selectColumn} FROM Marketing_Campaign GROUP BY ${groupByColumn}`;

  // Eksekusi kueri SQL dan kirim hasilnya ke halaman EJS
  pool.query(sqlQuery, (err, data) => {
    if (err) {
      // Handle kesalahan jika ada
      console.error(err);
      res.send("Error occurred");
    } else {
      res.render("SummarizeData", { data });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
