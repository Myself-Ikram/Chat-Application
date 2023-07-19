const express = require("express");
const app = express();

//Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/chatDB",{useNewUrlParser:true})
const userSchema = new mongoose.Schema({
    _id:String,
    name:String,
    password:String,
})
const msgSchema = new mongoose.Schema({
    msg:String,
    sender:String,
    receiver:String,
})

const User = new mongoose.model("user",userSchema);
const Msg = new mongoose.model("message",msgSchema);

//Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//Public folder for css & js files
app.use(express.static("public"));

//View folder for ejs files
app.set('view engine', 'ejs');

// //Lodash
// const _ = require("lodash");
app.get("/",function(req,res){
    res.render("login",{msg:""});
})

app.post("/chat",function(req,res){
    const email = req.body.email;
    const pwd = req.body.pwd;
    const arrow = req.body.arrow;
    if(arrow === "no"){
        User.findOne({_id:email,password:pwd},function(err,user){
            if(user){
                User.find({_id:{$ne:user._id}},function(err,friends){
                res.render("chat",{username:user.name,friends:friends});
                })
            }else{
                res.render("login",{msg:"Wrong Id or password"})
            }
        })
    }else{
        User.findOne({name:arrow},function(err,user){
            if(user){
                User.find({name:{$ne:user.name}},function(err,friends){
                    res.render("chat",{username:user.name,friends:friends});
                })
            }else{
                console.log(err);
            }
        })
    }
})

app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    const email = req.body.email;
    User.findOne({_id:email},function(err,user){
        if(user){
            res.render("login",{msg:"Already have an account! plz login"});
        }
        else{
            const newUser = new User({
                _id:req.body.email,
                name:req.body.uname,
                password:req.body.pwd,
            })
            newUser.save(function(err){
                if(!err){
                    res.render("login",{msg:"Successfully Registered!!"});
                }
            });
           
        }
    })
    
})
app.post("/com",function(req,res){
    const friendName = req.body.btn;
    const sender = req.body.sender;
    User.findOne({_id:friendName},function(err,user){
        if(user){
            Msg.find(function(err,msgs){
                if(!err){
                    res.render("com",{rec:user.name,sender:sender,msgs:msgs});
                }
            })
        }
    })
})

app.post("/message",function(req,res){
    const msg = req.body.message;
    const sender = req.body.sender;
    const rec =req.body.rec;
    const newMsg = new Msg({
        msg:msg,
        sender:sender,
        receiver:rec,
    })
    newMsg.save(function(err){
        if(!err){
            Msg.find(function(err,msgs){
                if(!err){
                    res.render("com",{rec:rec,sender:sender,msgs : msgs});
                }
            })
        }
    })

})

// app.get("/add",function(req,res){
//     res.render("add");
// })
// app.post("/add",function(req,res){
//     const addEmail = req.body.addEmail;
//     User.findOne({_id:addEmail},function(err,user){
//         if(user){
//             res.render("chat");
//         }
//         else{
//             console.log("not found");
//         }
//     })
// })
app.listen(5000,function(req,res){
    console.log("server running at 3000!");
})