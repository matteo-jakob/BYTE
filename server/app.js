const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fs = require("fs");

const loginHTML = fs.readFileSync("views/login.html", "utf8");
const { loadavg } = require("os");
const { dirname } = require("path");
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("../client"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// ---------------- Variables ----------------

const port = 3000;

// ------------------- Connection Database -------------------

mongoose.connect(
  "mongodb+srv://admin-elvis:kali@cluster0.sbjotar.mongodb.net/BYTE",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Import necessary modules and setup

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // Hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user with hashed password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    // Respond with success message
    alert("User Created Sucessfully. Log In now");
    res.redirect("/login");
  } catch (err) {
    // Handle errors
    res.status(500).send(err.message);
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      // If user not found, respond with error
      return res.status(400).send("Cannot find user");
    }
    // Check password validity
    if (await bcrypt.compare(password, user.password)) {
      // If password matches, create login message and respond
      const loginMessage = `Hello ${username}`;
      res.render("home", {
        title: "Login",
        loginMessage: loginMessage,
      });
    } else {
      // If password doesn't match, respond with error
      res.status(401).send("Wrong username or password");
    }
  } catch (err) {
    // Handle errors
    res.status(500).send(err.message);
  }
});

// ------------------- API -------------------

app.get("/", (req, res) => {
  res.send(fs.readFileSync("views/index.html", "utf8"));
});

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

app.get("/login", (req, res) => {
  res.send(loginHTML);
});

app.listen(port, () => {
  console.log(`App listening on port ${port} (http://localhost:${port}/)`);
});
