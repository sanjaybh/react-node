const router = require("express").Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res)=> {
    //Lets Validate the data before we make a user
    const { error } = registerValidation(req.body)    
    if(error) return res.status(400).send(error.details[0].message)
    
    //Checking if the user (email) is already in DB
    const emailExists = await User.findOne({
        email: req.body.email
    })
    if(emailExists) return res.status(400).send('Email alreay exists')

    //Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try { 
        const savedUser = await user.save()
        res.send({ user: user._id }) //savedUser - send full user if required
    } catch(err) {
        res.status(400).send(err)
    }
})

//Login
router.post('/login', async (req, res) => {    
    //Lets Validate the data before we make a user
    const { error } = loginValidation(req.body)    
    if(error) return res.status(400).send(error.details[0].message)
    
    //Checking if the email exists in DB
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email or password not found.')
    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid password')

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

    res.send('Logged in')
})

module.exports = router