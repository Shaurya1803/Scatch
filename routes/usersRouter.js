const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require("../controllers/authController");
const isLoggedIn = require("../middleware/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

// Add to cart
router.get("/addtocart/:productid", isLoggedIn, async function(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        user.cart.push(req.params.productid);
        await user.save();
        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/shop");
    }
});

// View cart
router.get("/cart", isLoggedIn, async function(req, res) {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart");

        let bill = user.cart.reduce((total, product) => {
            return total + product.price - product.discount;
        }, 0) + 20; // platform fee

        res.render("cart", { user, bill });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/shop");
    }
});

// Remove from cart
router.get("/removefromcart/:productid", isLoggedIn, async function(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let index = user.cart.indexOf(req.params.productid);
        if (index > -1) user.cart.splice(index, 1);
        await user.save();
        res.redirect("/users/cart");
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/users/cart");
    }
});

module.exports = router;
