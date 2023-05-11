const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    email: {
        require:true,
        type:String,
        unique:true
    },
    per_mail: {
        require:true,
        type:String,
        unique:true
    },
    password:{
        require:true,
        type:String
    },
    name:{
        require:true,
        type:String
    },
    prn:{
        require:true,
        type:String,
        unique:true
    },
    phone:{
        require:true,
        type:String,
        unique:true
    },
    sem:{
        require:true,
        type:String
    },
    branch:{
        require:true,
        type:String
    },
    spec: {
        require:true,
        type:String
    },
    gender: {
        require:true,
        type:Boolean
    }
});


module.exports = mongoose.model('Student', studentSchema);
