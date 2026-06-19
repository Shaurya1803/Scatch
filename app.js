require("dotenv").config();
const express = require("express");
const app = express();


const cookiesParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection");
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");
const expressSession = require("express-session");
const flash = require("connect-flash");


app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use("/", indexRouter);
app.use ("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.get("/", (req, res) => {
    res.render("index", { error: "", isAdmin: req.session?.isAdmin || false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));