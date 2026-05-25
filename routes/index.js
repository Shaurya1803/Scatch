const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedin");
const productModel = require("../models/product-model");

router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", { error });
});

router.get("/shop", isLoggedIn, async function(req, res) {
    try {
        let products = await productModel.find();
        let success = req.flash("success");
        res.render("shop", { products, success, user: req.user });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/");
    }
});

module.exports = router;
