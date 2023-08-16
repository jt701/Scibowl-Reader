const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User')
const saltRounds = 11;
const router = express.Router()

const secretKey = process.env.SECRET_KEY;

router.get('/', (req, res) => {
    res.json({ message: 'Debug route for auth router' });
  });

router.post('/signup', async (req, res) => {
    console.log('signup')
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(500).json({ error: 'Improper request body'});
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const hashedPass = await bcrypt.hash(password, saltRounds);
        const user = new User({
            username,
            password: hashedPass,
            email,
          });
        try {
            await user.save();
            return res.status(200).json({message:"success"});
        }
        catch (error) {
            return res.status(500).json({error: "error with save"});
        }
    }

    catch(error) {
        res.status(500).json({ error: 'An error occurred' });
    }

});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username) {
            return res.status(500).json({ error: 'incorrect req body' });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'username does not exist' });
        }

        const correct = await bcrypt.compare(password, user.password);
        if (correct) {
            jwt.sign({ uid: user.id }, secretKey, (error, token) => {
                if (error) {
                    res.status(500).json({ error: 'Error generating token' });
                } else {
                    res.status(200).json({ message: 'success', token });
                }
            });
        } 
        else {
            return res.status(401).json({ error: 'incorrect password' });
        }


    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router

    
                     