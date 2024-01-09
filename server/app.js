const express = require("express");
const app = express();
const port = 3000;
const indexHTML = "./views/index.html/";

app.get("/", (req, res) => {
  res.send(indexHTML);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
