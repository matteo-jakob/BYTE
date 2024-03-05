const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fs = require("fs");

const indexHTML = fs.readFileSync("views/index.html", "utf8");
const bestellenHTML = fs.readFileSync("views/bestellen.html", "utf8");
const loginHTML = fs.readFileSync("views/login.html", "utf8");
const { loadavg } = require("os");
const { dirname } = require("path");
const MongoClient = require("mongodb").MongoClient;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("../client"));

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
  res.send(indexHTML);
});

var warenkorb = [];
const waren = [
  {
    id: 0,
    item: "Pizza Margherita",
    price: 20,
    image_url: "https://pixabay.com/static/frontend/3c346409d336d5f09a7f.svg",
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

app.get("/login", (req, res) => {
  res.send(loginHTML);
});


app.listen(port, () => {
  console.log(`App listening on port ${port} (localhost:${port})`);
});
