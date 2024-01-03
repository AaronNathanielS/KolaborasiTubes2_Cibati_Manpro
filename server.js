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

function convertDate(input) {
    if (typeof input === 'number') {
        // Excel date
        return excelDateToJSDate(input);
    } else {
        // String date in DD/MM/YYYY format
        let date = moment(input, "DD/MM/YYYY");
        if (date.isValid()) {
            return date.toDate();
        } else {
            console.error(`Invalid date: ${input}`);
            return null;
        }
    }
}

function excelDateToJSDate(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

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

  const values = data.map((row) => {
    let date = convertDate(row.Dt_Customer);
    if (date !== null) {
        // Format the JavaScript Date object to YYYY-MM-DD
        date = moment(date).format("YYYY-MM-DD");
    }
    return [
        row.ID,
        row.Year_Birth,
        row.Education,
        row.Marital_Status,
        row.Income,
        row.Kidhome,
        row.Teenhome,
        date,
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
    ];
}).filter(row => row !== null);


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

  let sqlQuery;
  if (!(groupByColumn === '')) {
    if (selectOperation === 'MIN' || selectOperation === 'MAX') {
      sqlQuery = `SELECT ${groupByColumn}, 
      ${selectOperation}(${selectColumn}) AS ${selectOperation}_${selectColumn} 
      FROM Marketing_Campaign 
      GROUP BY ${groupByColumn}`;
    } else {
      sqlQuery = `SELECT ${groupByColumn}, ${selectOperation}(${selectColumn}) AS ${selectColumn} FROM Marketing_Campaign GROUP BY ${groupByColumn}`;
    }
  } else {
    if (selectOperation === 'MIN' || selectOperation === 'MAX') {
      sqlQuery = `SELECT ${selectOperation}(${selectColumn}) AS ${selectOperation}_${selectColumn} 
      FROM Marketing_Campaign`;
    } else {
      sqlQuery = `SELECT ${selectColumn}, ${selectOperation}(${selectColumn}) AS ${selectColumn} FROM Marketing_Campaign`;
    }
  } 

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


app.get("/api/bar-data", (req, res) => {
  const columnX = req.query.columnX;
  const columnY = req.query.columnY;
  const aggregateX = req.query.aggregateX || '';
  const aggregateY = req.query.aggregateY || '';

  let query;
  if (aggregateX && aggregateY) {
    query = `SELECT ${aggregateX}(??) AS ${aggregateX}_${columnX}, ${aggregateY}(??) AS ${aggregateY}_${columnY} FROM Marketing_Campaign GROUP BY ??, ??`;
  } else if (aggregateX) {
    query = `SELECT ${aggregateX}(??) AS ${aggregateX}_${columnX}, ?? FROM Marketing_Campaign GROUP BY ??, ??`;
  } else if (aggregateY) {
    query = `SELECT ??, ${aggregateY}(??) AS ${aggregateY}_${columnY} FROM Marketing_Campaign GROUP BY ??, ??`;
  } else {
    query = `SELECT ??, ?? FROM Marketing_Campaign`;
  }
  console.log(aggregateX);
  console.log(aggregateY);

  pool.query(query, [columnX, columnY, columnX, columnY], (err, results) => {
    if (err) {
      console.error("Error fetching bar chart data:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

