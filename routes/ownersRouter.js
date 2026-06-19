const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owners-model");
const productModel = require("../models/product-model");

// Create owner — only if none exists
router.get("/create", async function (req, res) {
    try {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(503).send("Owner already exists. Contact admin to reset.");
        }
        res.render("owner-login", { isAdmin: false });
    } catch(err) {
        res.send(err.message);
    }
});

router.post("/create", async function (req, res) {
    try {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(503).send("Owner already exists.");
        }
        let { email, password, fullname } = req.body;
        let createdOwner = await ownerModel.create({ fullname: fullname || email, email, password });
        req.session.isAdmin = true;
        req.flash("success", "Owner created successfully");
        res.redirect("/owners/admin");
    } catch(err) {
        res.send(err.message);
    }
});

// Owner login
router.post("/login", async function (req, res) {
    try {
        let { email, password } = req.body;
        let owner = await ownerModel.findOne({ email });
        if (!owner || owner.password !== password) {
            req.flash("error", "Invalid owner credentials");
            return res.redirect("/");
        }
        // simple session-based admin flag
        req.session.isAdmin = true;
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/");
    }
});

// Admin panel — show all products + create form
router.get("/admin", async function (req, res) {
    try {
        if (!req.session.isAdmin) {
            req.flash("error", "Admin access only");
            return res.redirect("/");
        }
        let success = req.flash("success");
        let error = req.flash("error");
        let products = await productModel.find();
        res.render("createproducts", { success, error, products, isAdmin: true });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/");
    }
});

// Delete product
router.get("/deleteproduct/:id", async function (req, res) {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        req.flash("success", "Product deleted");
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
});

module.exports = router;
