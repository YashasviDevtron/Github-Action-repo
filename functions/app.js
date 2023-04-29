"use strict"
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Student = require("../models/student");
const faculty = require("../models/faculty");
const app = express();
mongoose.set('strictQuery', true);
app.set("view engine","ejs");
app.use("/assets",express.static("assets"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessions({
    secret: process.env.SECRET,
    saveUninitialized:true,
    cookie: { maxAge: (24 * 60 * 60 * 1000) },
    resave: false 
}));
var session;

mongoose.connect(process.env.MONGODB_URL,(error)=>{
    if(error)throw error;
    else{
        console.log("Connected to mongo");
    }
});


app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/dist/index.html");
});

app.get('/studentlogin',(req,res) => {
    session=req.session;
    if(session.email){
        res.redirect("/studentdashboard");
    }else
    res.render("studentlogin");
});

app.get("/studentdashboard", async (req,res)=>{
    try{
        session=req.session;
        if(session.email){
            const student = await Student.findOne({email: session.email})
            res.render("studentdashboard",{
                name: student.name,
                prn: student.prn,
                email: student.email,
                phone: student.phone,
                branch: student.branch,
                sem: student.sem
            });
        }else
        res.redirect("/studentlogin");
    }
    catch(err){
        console.log(err);
    }
});

app.get("/studentregistration",(req,res)=>{
    res.render("studentregistration");
});

app.get("/facultylogin",(req,res)=>{
    res.render("facultylogin");
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    console.log("You have been logged out!");
    res.redirect('/');
});


app.post("/studentlogin", async function(req, res){
    try {
         const student = await Student.findOne({ email: req.body.email });
        if (student){
            const result = req.body.password === student.password;
            if (result){
                session=req.session;
                session.email=req.body.email;
                console.log(req.session)
                res.redirect("/studentdashboard");
            }
            else{
                console.log("Password does not match!");
            }
        } 
        else{
            console.log("User does not exists");
        }
    }
    catch(error){
        res.status(400).send("Something went wrong!")
    }
});
    
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server has started on port", process.env.PORT || 3000);
});