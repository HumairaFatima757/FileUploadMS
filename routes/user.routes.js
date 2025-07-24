const express =require('express');

const router = express.Router();
const { body,validationResult} = require('express-validator');

const userModel =  require('../models/user.model')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




router.get('/register',(req,res)=>{
  res.render("signup")
});


router.post('/register',
  body('useremail').trim().isEmail(),
   body('userpassword').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
  
  async(req,res)=>{

   const errors =  validationResult(req);

   if(!errors.isEmpty()){
   return res.status(400).json({
    errors: errors.array(),
    message: "Invalid data "
  })
   }

   const{username, useremail, userpassword}= req.body;

const hashPassword =   await  bcrypt.hash(userpassword,10)

 const newUser =   await userModel.create({
  name:username,
  email:useremail,
  password: hashPassword,
  
 })

 res.json(newUser);
});

router.get('/login', (req,res)=>{
res.render('login')
});

router.post('/login',
  body('useremail').trim().isEmail(),
  body('userpassword').trim().isLength({min:5}),
  async (req,res)=>{

    const error = validationResult(req);

    if(!error.isEmpty()){
      res.status(400).json({error: error.array(), message: "invalid data"})
    }

    const {useremail,userpassword}=req.body;

    const user = await userModel.findOne({
      email:useremail
    })

    if(!user){
      return res.status(400).json({
        message: " invalid useremail and password "
      })
    }

   const  isMatch =  await bcrypt.compare(userpassword,user.password);

   if(!isMatch){
    return res.status(400).json({
      message: " invalid useremail and password "
    })

   }

   const token =jwt.sign({
    userId: user._id,
    useremail: user.email,
    userpassword: user.password,
   },
  process.env.JWT_SECRET,

)  

res.cookie('token',token);
res.redirect('/dashboard');
})





module.exports= router;