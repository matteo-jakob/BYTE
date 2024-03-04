const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const indexHTML = "index.html";

app.get("/", (req, res) => {
  res.send(indexHTML);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
