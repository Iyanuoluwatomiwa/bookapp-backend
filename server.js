const config = require("config");
const express = require("express");
const app = express();
const port = 7000;
const cors = require("cors");
const path = require("path");

//middleware
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));

console.log(config.get("jwtSecret"));

//body parser
app.use(express.json());

//import files
const error = require("./middleware/error");
const category = require("./routes/category");
const user = require("./routes/user");
const profile = require("./routes/profile");
const book = require("./routes/book");
const auth = require("./routes/auth");

//define main routes
app.use("/categories", category);
app.use("/users", user);
app.use("/profiles", profile);
app.use("/books", book);
app.use("/auth", auth);

//error middleware
app.use(error);

app.listen(port, () => console.log(`book app listening on port ${port}!`));
