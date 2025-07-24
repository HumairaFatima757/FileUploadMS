  const mongoose = require('mongoose');


 function mongooseDB(){
 mongoose.connect(process.env.MONGODB_URI).then(()=>{
  console.log("connected to db ");
 })
  }


  module.exports = mongooseDB;