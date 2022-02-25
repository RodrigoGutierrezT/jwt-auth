const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req,res) => {

    // validate data before making a User
    const { error } = registerValidation(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if user is already in the db
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) {
        return res.status(400).send('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

// router.post('/login', (req,res) => {

// });

module.exports = router;