const express = require("express");
const fs = require("fs");
const path = require("path")

const app = express();
const port = 3000;

const indexHTML = fs.readFileSync("views/index.html", "utf8");
const bestellenHTML = fs.readFileSync("views/bestellen.html", "utf8");

app.use(express.static("../client"))



// ------------------- API ------------------

var warenkorb = [];
const waren = [
  {
    id: 0,
    item: "Pizza Margherita",
    price: 20,
    image_url:
      "https://pixabay.com/static/frontend/3c346409d336d5f09a7f.svg",
  },
  {
    id: 1,
    item: "Pizza Salami",
    price: 24,
    image_url:
      "https://cdn.pixabay.com/photo/2021/09/02/13/26/salami-pizza-6593465_960_720.jpg",
  },
];

app.post("/add-warenkorb", (req, res) => {
  try {
    var item = req.body;
    warenkorb.push(item);
    console.log(warenkorb);
    res.sendStatus(200);
  } catch (err) {
    console.error("Failed to add item to cart:", err);
    res.status(500).send({ error: "Failed to add item to cart" });
  }
});


app.get("/", (req, res) => {
  res.send(indexHTML);
});

app.get("/bestellen", (req, res) => {
  res.send(bestellenHTML);
});

app.listen(port, () => {
  console.log(`App listening on port ${port} (localhost:${port})`);
});
