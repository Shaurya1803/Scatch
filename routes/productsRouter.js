const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config")
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function(req,res){
   try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        let product = await productModel.create({
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
            image: req.file ? req.file.buffer.toString("base64") : "",
        });

        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
});

module.exports =router;