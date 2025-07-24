const express = require('express');
const app = express();

const dotenv=  require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser')
const indexroute = require('./routes/index.routes');
const route = require('./routes/user.routes');

const connectToDB =  require('./config/db');
connectToDB();


app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/user', route);
app.use('/', indexroute);

app.use((req, res, next) => {
    res.locals.user = req.user || { name: "Guest", email: "guest@example.com" };
    next();
});

app.listen('3000', ()=>{
  console.log(`server is listening at port ${ 3000 }`)
})
