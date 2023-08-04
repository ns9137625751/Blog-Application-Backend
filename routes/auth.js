const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'hellonishant';


//create a user using : POST /api/auth/createuserblog
router.post('/createuserblog', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('phonenumber', 'Enter a valid number').isLength({ max: 10 }),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {

    // Check that error present in validatio or not
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    
    // check whether the user exits already
    try {
    
        let user = await User.findOne({ email: req.body.email, phonenumber: req.body.phonenumber });
        if (user) {
            return res.status(400).json({ error: "sorry a user with this email and phone number already exits" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken })
    } catch (error) {
        console.error(error.message);
        res.send("internal error occured");
        
    }
})


//authentication a user using POST "api/auth/loginblog" No login required
router.post('/loginblog', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Cannot be blank').exists(),

], async (req, res) => {

    // Check that error present in validatio or not
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Sorry user does not exits" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Password Doesn't matched" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal error occured");
    }

})


// get user details using POST "api/auth/getuser"
router.post('/getalluser', async (req, res) => {
    try {
        const user = await User.find().select('-password')
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal error occured");
    }
})

// get particular user detauls
router.post('/getuser', fetchuser, async (req, res) => {
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