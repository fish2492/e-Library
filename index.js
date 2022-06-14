const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const customer = require("./routes/customers");
const genre = require("./routes/genres");
const book = require("./routes/books");
const rental = require("./routes/rentals");
const user = require("./routes/users");
const auth = require("./routes/auth");
const ret = require("./routes/returns");
//const bodyParser = require("body-parser");

if( !config.get("jwtPrivateKey") ) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.")
    process.exit(1);
}

mongoose.connect("mongodb://localhost/Lib_Mgt")
    .then(() => console.log("Connecting to MongoDB..."))
    .catch((err) => console.error("Unable to connect", err));

const app = express();

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/customers", customer);
app.use("/api/genres", genre);
app.use("/api/books", book);
app.use("/api/rentals", rental);
app.use("/api/users", user);
app.use("/api/auth", auth);
app.use("/api/returns", ret);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Connecting to port ${port}`));