const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    email: {
        type:String,
        unique:true
    },
    password:String,
    name:String,
    prn:String,
    phone:String,
    sem:String,
    branch:String
});


module.exports = mongoose.model('Student', studentSchema);
