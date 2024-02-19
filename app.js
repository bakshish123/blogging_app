require('dotenv').config();

const path = require ('path');
const express = require ('express');
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie} = require('./middleware/authentication')
const Blog= require('./models/blog')

const app = express();
const PORT = process.env.PORT || 8000

app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')))

mongoose
  .connect(process.env.MONGO_URL)
  // .connect('mongodb://127.0.0.1:27017/blogging_app')
    .then((e)=>console.log('mongodb connected'))

app.get('/', async(req, res) => {
    const allBlogs= await Blog.find({});
        res.render('home', 
        { user: req.user ,
          blogs:allBlogs,
        });
    
});

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(PORT,console.log(`port started at ${PORT}`));