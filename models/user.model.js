const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
     name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minlength: [3, "user must have atleast 3 length of name "]

     },
     email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
     

     },
     password: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "user must have atleast 5 length of password "]

     },

      profilePicture:{type: String} 
});


const user = mongoose.model('user',userSchema);


module.exports = user;