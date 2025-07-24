const jwt= require('jsonwebtoken');
const userModel = require('../models/user.model')


//middleware for verify Token
async function verifyToken(req,res,next){
const token = req.cookies.token;
if(!token){
  return res.status(401).send("Access denied - no token Provided")
}
try {

 const decoded = jwt.verify(token, process.env.JWT_SECRET);

const user= await userModel.findById(decoded.userId);
if(!user){
return res.status(400).send("user not found")
}



req.user = user ;
next();
  
} catch (error) {
  res.status(400).send("Invalid toke")
}
 
}


module.exports = verifyToken;