const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const xlsx = require("xlsx");

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
  res.render("SummarizeData");
});

app.get("/grafikbar", (req, res) => {
  res.render("GrafikBar");
});

app.get("/grafikscatter", (req, res) => {
  res.render("GrafikScatter");
});

//file upload
app.post("/upload", upload.single("file"), (req, res) => {
  const fileBuffer = req.file.buffer;
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(worksheet);

  // Insert data into the People table
  const insertPeopleQuery = "INSERT INTO People (ID, Year_Birth, Education, Marital_Status, Income, Kidhome, Teenhome, Dt_Customer, Recency, Complain) VALUES ?";
  const peopleValues = data.map(row => [row.ID, row.Year_Birth, row.Education, row.Marital_Status, row.Income, row.Kidhome, row.Teenhome, row.Dt_Customer, row.Recency, row.Complain]);
  pool.query(insertPeopleQuery, [peopleValues], (err, result) => {
    if (err) {
      console.error("Error inserting data into People table:", err.message);
      res.status(500).send("Error inserting data into the People table");
    } else {
      console.log("Data inserted into People table successfully");
    }
  });

  // Insert data into the Products table
  const insertProductsQuery = "INSERT INTO Products (ID, MntWines, MntFruits, MntMeatProducts, MntFishProducts, MntSweetProducts, MntGoldProds) VALUES ?";
  const productsValues = data.map(row => [row.ID, row.MntWines, row.MntFruits, row.MntMeatProducts, row.MntFishProducts, row.MntSweetProducts, row.MntGoldProds]);
  pool.query(insertProductsQuery, [productsValues], (err, result) => {
    if (err) {
      console.error("Error inserting data into Products table:", err.message);
      res.status(500).send("Error inserting data into the Products table");
    } else {
      console.log("Data inserted into Products table successfully");
    }
  });

  // Insert data into the Promotion table
  const insertPromotionQuery = "INSERT INTO Promotion (ID, NumDealsPurchases, AcceptedCmp1, AcceptedCmp2, AcceptedCmp3, AcceptedCmp4, AcceptedCmp5, Response) VALUES ?";
  const promotionValues = data.map(row => [row.ID, row.NumDealsPurchases, row.AcceptedCmp1, row.AcceptedCmp2, row.AcceptedCmp3, row.AcceptedCmp4, row.AcceptedCmp5, row.Response]);
  pool.query(insertPromotionQuery, [promotionValues], (err, result) => {
    if (err) {
      console.error("Error inserting data into Promotion table:", err.message);
      res.status(500).send("Error inserting data into the Promotion table");
    } else {
      console.log("Data inserted into Promotion table successfully");
    }
  });

  // Insert data into the Place table
  const insertPlaceQuery = "INSERT INTO Place (ID, NumWebPurchases, NumCatalogPurchases, NumStorePurchases, NumWebVisitsMonth) VALUES ?";
  const placeValues = data.map(row => [row.ID, row.NumWebPurchases, row.NumCatalogPurchases, row.NumStorePurchases, row.NumWebVisitsMonth]);
  pool.query(insertPlaceQuery, [placeValues], (err, result) => {
    if (err) {
      console.error("Error inserting data into Place table:", err.message);
      res.status(500).send("Error inserting data into the Place table");
    } else {
      console.log("Data inserted into Place table successfully");
    }
  });

  res.redirect("/addfile?success=true"); // Redirect to the addfile page after successful upload
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});