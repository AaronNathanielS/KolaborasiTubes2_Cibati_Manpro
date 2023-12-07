const express = require("express");

const app = express();
app.set("view engine", "ejs");
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

app.listen(3000);
