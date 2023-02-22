require('dotenv').config()
require("./database/database").connect()
const User = require('./model/user')
const express = require('express')
const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken')
const cookieParser =require('cookie-parser')
const auth = require('./middleware/auth')


const app =express()
app.use(express.json())
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("<h1>server is working</h1>")
})
app.post("/register",async(req,res) =>{
    try {
        // get all data from body
        const {firstname,lastname,email,password}=req.body
        // all the data should exists
        if(!(firstname && lastname && email && password)){
            res.status(400).send('All fields are compulsory')
        }
        //check if user already exists
const  existingUser = await User.findOne({email })
if(existingUser){
    res.status(401).send('User already exists with this email')
}


        // encrypt the password
const myEncPassword = await bcrypt.hash(password, 10)

        // save the user in db
       const user= await User.create({
            firstname,
            lastname,
            email,
            password:myEncPassword
        })
        // generate token for user and send it
        const token =jwt.sign(
            {id: user._id, email},
            'shhhh' ,//process.env.jwtsecret
            {
                expiresIn:"2hr"
            }
        );
user.token = token
user.password = undefined

res.status(201).json(user)

    } catch (error)
{
    console.log(error);
} }
    )
    app.post('/login', async (req,res)=>{
        try{
            //get all data from frontend
            const {email,password}=req.body
            //validation
            if(!(email && password)){
                res.status(400).send('sent all data')
            }
            //find user in db
            const user= await User.findOne({email})
            //assignment - if user is not there, then what?
            //match the password
            if (user && (await bcrypt.compare(password, user.password))){
        const token = jwt.sign(
{id: user._id},
'shhhhh',
{
    expiresIn: "2hr"
}
            );

          user.token =token
          user.password = undefined  
          // send token user cookie  
          // cookies section

const options ={
    expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly:true 
};
res.status(200).cookie("token",token,options).json({
    success:true,
    token,
    user
})
            
        }
            //send a token
        
        } catch(error){
            console.log(error);
        }

    })

app.get("/dashboard",auth,(req,res)=>{

  


    
res.send('welcome to dashboard')
})



    module.exports = app