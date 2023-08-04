const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

// get user details using POST "api/auth/getuser"
router.post('/all-profile', async (req, res) => {
    try {
        const user = await User.find().select('-password')
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal error occured");
    }
})

// get particular user detauls
router.post('/my-profile', fetchuser, async (req, res) => {
    try {
        let userID = req.user.id;
        const user = await User.findById(userID).select('-password')
        res.send(user)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal error occured");
    }
})

module.exports = router;