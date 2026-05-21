const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/stach")
.then(function(){
   dbgr("connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection;