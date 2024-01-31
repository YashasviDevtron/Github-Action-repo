const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    email:{
        type:String,
        require: true,
        unique:true
    },password:String,
    name:String,
    emp_id:String

});

module.exports = mongoose.model("faculty", facultySchema);