const express =require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken')
const File = require('../models/file.models')
const user = require('../models/user.model')
const fs = require('fs');
const path = require('path')


const storage =  multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'uploads/')
  } ,
  filename:function(req,file,cb){
cb(null, Date.now()+'-'+ file.originalname)
  } ,
})

const upload = multer({storage: storage})




router.post('/upload',verifyToken, upload.single('file'),async (req,res)=>{
  try{
  if(!req.file){
    return res.status(400).send("no file uploaded")
}
// const userId  =req.user._id;
 
const fileRecord = new File({
userId: req.user._id,
filename: req.file.filename,
path: req.file.path
})
await fileRecord.save();

res.status(200).send("File uploaded and saved in database!");
  }catch(err){
console.log(err);
 res.status(500).send("Error saving file");
  }



})

router.get('/home',verifyToken, (req,res)=>{
res.render('index', { user: req.user || { name: "Guest", email: "guest@example.com" }  })
})


router.get('/myuploads', verifyToken, async(req,res)=>{
   try {const files = await File.find({ userId: req.user._id }).sort({ uploadedAt: -1 });

res.json(files);}
catch
   (err) {
        res.status(500).json({ message: "Error fetching files" });
}
});



router.get('/dashboard',verifyToken, (req, res) => {
    res.render('index' ,{ user: req.user  } ); 
});


router.get('/history',verifyToken, async (req, res) => {
  try {
    const file = await File.find({userId: req.user._id}).sort({uploadedAt:-1});

    res.render('history',{user:req.user ,files:file})
    
  }catch (err) {
        console.log(err);
        res.status(500).send("Error fetching files");
    }
  

    
});

router.get('/profile',verifyToken,(req,res)=>{

  res.render('index', { user: req.user   })
})

router.get('/edit-profile',verifyToken, (req,res)=>{
res.render('editProfile', {user:req.user})
})

router.post('/update-profile',verifyToken, upload.single('profilePicture'), async(req,res)=>{
  try{const{name, email}= req.body;
  const profilePicture = req.file? req.file.filename: req.user.profilePicture;

  await user.findByIdAndUpdate(req.user._id,{name,email,profilePicture})
  res.redirect('/dashboard')

}catch (err) {
    console.error(err);
    res.status(500).send('Error updating profile');
  }


}




)


router.get('/delete/:id',verifyToken, async (req,res)=>{


  try {
     const file = await File.findById(req.params.id);

     if(!file){
        return res.status(404).send("file not found ")
     }
    const filePath = path.join(__dirname, '..',file.path);
    fs.unlink(filePath,(err)=>{
      if(err){
           console.error("Error deleting file from folder:", err); 
      }

    })



     await File.findByIdAndDelete(req.params.id);
    res.redirect('/history')
  } catch (error) {
       console.log(error);
       res.status(400).send("Error in  deleting file ")
    
  }
})

module.exports = router;