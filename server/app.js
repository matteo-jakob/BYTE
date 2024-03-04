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
    item: "Potatoes",
    price: 10,
    image_url:
      "https://cdn.pixabay.com/photo/2016/08/11/08/43/potatoes-1585060_1280.jpg",
  },
  {
    id: 1,
    item: "Rice",
    price: 8,
    image_url:
      "https://cdn.pixabay.com/photo/2019/02/15/03/28/rice-3997767_1280.jpg",
  },
  {
    id: 2,
    item: "Flour",
    price: 10,
    image_url:
      "https://cdn.pixabay.com/photo/2020/05/12/17/54/rolling-pin-5164240_960_720.jpg",
  },
  {
    id: 3,
    item: "Water",
    price: 3,
    image_url:
      "https://cdn.pixabay.com/photo/2018/07/09/15/20/desire-3526366_960_720.jpg",
  },
  {
    id: 4,
    item: "Cola",
    price: 4.5,
    image_url:
      "https://cdn.pixabay.com/photo/2016/11/29/13/49/bottle-1869990_960_720.jpg",
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
