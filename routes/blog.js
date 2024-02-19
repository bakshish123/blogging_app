const express = require ('express')
const router = express.Router();
const multer = require('multer')
const path = require('path')
const Comment = require('../models/comment')

const Blog= require('../models/blog');
const { create } = require('../models/user');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null,fileName)
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/addNew',(req,res)=>{
    return res.render('addBlog',{
        user:req.user
    })
})
router.post('/addNew',upload.single('coverImage'),async(req,res)=>{
    const {body,title}= req.body;
    const blog = await Blog.create({
        body,title,
        coverImageUrl:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  });

  router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );
  
    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  });
module.exports = router;