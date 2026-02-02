const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY

router.post('/login', async (req, res) => {
    try {
        const { email, password }  = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'email ou mot de passe invalide'
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'email ou mot de passe invalide'
            });
        }

        const expiresIn = 24 * 60 * 60; 
        const token = jwt.sign(
            {
                user: user._id,
                email: user.email,
                username: user.username
            },

            SECRET_KEY,
            { expiresIn: expiresIn }
        );

        res.json({
            success: true,
            message: 'Authentification réussie',
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token: token,
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion',
            error: error.message
        });
    }
});

router.get('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

module.exports = router;
