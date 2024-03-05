const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("../client"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// ---------------- Variables ----------------

const port = 3000;

var warenkorb = [];
const waren = [
  {
    id: 0,
    item: "Pizza Margherita",
    price: 20,
    image_url:
      "https://cdn.pixabay.com/photo/2023/11/22/08/22/pizza-8404974_1280.jpg",
  },
  {
    id: 1,
    item: "Pizza Salami",
    price: 24,
    image_url:
      "https://cdn.pixabay.com/photo/2021/09/02/13/26/salami-pizza-6593465_960_720.jpg",
  },
  {
    id: 2,
    item: "Pizza byteani",
    price: 28,
    image_url:
      "https://cdn.pixabay.com/photo/2014/07/08/12/34/pizza-386717_1280.jpg",
  },
  {
    id: 3,
    item: "Coca-Cola",
    price: 5,
    image_url:
      "https://cdn.pixabay.com/photo/2020/04/08/08/09/cocacola-5016273_1280.jpg",
  },
  {
    id: 4,
    item: "Salatteller",
    price: 12,
    image_url:
      "https://cdn.pixabay.com/photo/2016/06/06/18/32/salad-1440111_1280.jpg",
  },
];

// ------------------- API -------------------

app.post("/add-warenkorb", (req, res) => {
  try {
    console.log("[i] Received job:", req.body);
    var id = req.body.id;
    const item = waren.find((item) => item.id === id);

    warenkorb.push(item);
    console.log("[!] item added to basket: " + item.item);
    console.log(warenkorb);
    res.sendStatus(200);
  } catch (err) {
    console.error("[!] Failed to add item to cart:", err);
    res.status(500).send({ error: "Failed to add item to cart" });
  }
});

app.post("/del-warenkorb", (req, res) => {
  try {
    console.log("[i] Received job:", req.body);
    var id = req.body.id;
    const index = warenkorb.findIndex((item) => item.id === id);
    if (index !== -1) {
      const deletedItem = warenkorb.splice(index, 1)[0];
      console.log("[!] item deleted from basket: " + deletedItem.item);
      console.log(warenkorb);
      res.sendStatus(200);
    } else {
      console.error("[!] Item not found in basket");
      res.status(404).send({ error: "Item not found in basket" });
    }
  } catch (err) {
    console.error("[!] Failed to delete item from cart:", err);
    res.status(500).send({ error: "Failed to delete item from cart" });
  }
});

app.get("/", (req, res) => {
  res.send(fs.readFileSync("views/index.html", "utf8"));
});

app.get("/bestellen", (req, res) => {
  res.send(fs.readFileSync("views/bestellen.html", "utf8"));
});

app.get("/waren", (req, res) => {
  res.json(waren);
});

app.get("/warenkorb", (req, res) => {
  res.json(warenkorb);
});

app.listen(port, () => {
  console.log(`App listening on port ${port} (http://localhost:${port}/)`);
});
