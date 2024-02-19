const express = require ('express')
const router = express.Router();
const User = require ('../models/user.js')

router.get('/signup',(req,res)=>{
    return res.render('signup')
})

router.post('/signup',async(req,res)=>{
    const {fullname,email,password}= req.body
    await User.create({
        fullname,
        email,
        password
    });
    return res.redirect('/');

})

router.get('/signin',(req,res)=>{
    return res.render('signin')
})

router.post('/signin',async (req,res)=>{
    try{
        const {email,password}= req.body
        const token= await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie('token',token).redirect('/')
    }
    catch (error) {
       return res.render('signin',{error:'incorrect information'})
      }
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})

module.exports = router;