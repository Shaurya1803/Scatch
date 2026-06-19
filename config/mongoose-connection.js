const mongoose = require('mongoose');
const config = require("config");
const dbgr = require("debug")("development:mongoose");


const mongoURI = process.env.MONGODB_URI || config.get("MONGODB_URI");

mongoose.connect(mongoURI)
.then(function(){
   dbgr("connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection;