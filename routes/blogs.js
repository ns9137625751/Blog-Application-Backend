const express = require('express');
const router = express.Router();
const Blog = require("../models/Blog");
var fetchuser = require('../middleware/fetchuser.js');
const { body, validationResult } = require('express-validator');

// add a new blog using POST 
router.post('/add-blog', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const blogs = new Blog({
            title, description, user: req.user.id
        })
        const savedBlog = await blogs.save()
        res.json([savedBlog])
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal error occured");
    }
})


// get all particular blogs GET  
router.get('/my-blog', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        res.json(blogs)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal error occured");
    }
})


// get all particular blogs GET  
router.get('/all-blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal error occured");
    }
})


module.exports = router;