"use strict"
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const sessions = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Student = require("./models/student");
const faculty = require("./models/faculty");
const app = express();
const bcrypt = require("bcrypt");
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
const saltRounds = 10;
var session;
var db = mongoose.connection;
mongoose.connect(process.env.MONGODB_URL,(error)=>{
    if(error)throw error;
});


app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/studentlogin',(req,res) => {
    session=req.session;
    if(session.email){res.redirect("/studentdashboard");}
    else{res.render("studentlogin");}
});


app.get("/facultylogin",(req,res)=>{
    res.render("facultylogin");
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
        }
        else{res.redirect("/studentlogin");}
        
    }
    catch(err){
        console.log(err);
    }
});

// app.get("/facultydashboard",(req,res)=>{
//     res.render("facultydashboard");
// });


app.get("/studentregistration",(req,res)=>{
    res.render("studentregistration");
});

app.get('/logout',(req,res) => {
    req.session = null;
    console.log("You have been logged out!");
    res.redirect('/');
});

app.post("/studentlogin", async function(req, res){
    try {
         const student = await Student.findOne({ email: req.body.email });
        if (student){
            bcrypt.compare(req.body.password, student.password, function(err, result) {
                if(err)console.log(err);
                if (result){
                    session=req.session;
                    session.email=req.body.email;
                    console.log(req.session)
                    res.redirect("/studentdashboard");
                }
                else{res.status(401).send("Invalid credentials!")}
            });
        } 
        else{res.status(401).send("Invalid credentials!")}
    }
    catch(error){res.status(400).send("Something went wrong!")}
});

app.post("/studentregistration", async function(req,res){
    try{
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            if(err)console.log(err);

            const password  = hash;
            var data = new Student({
                name: req.body.name,
                email: req.body.email,
                per_mail: req.body.per_mail,
                password: password,
                prn: req.body.prn,
                phone: req.body.phone,
                sem: req.body.sem,
                branch: req.body.branch,
                spec: req.body.spec
                // gender: req.body.gender
            });

            
            data.save((err,data)=>{
                if(err)console.log(err);
                else{
                    res.redirect("/studentlogin")
                }
    
            });
            
        });    
    }
    catch(error){res.status(400).send("Something went wrong!")}
});
    
app.listen(process.env.PORT || 3000,()=>{console.log("Server has started on port", process.env.PORT || 3000);});