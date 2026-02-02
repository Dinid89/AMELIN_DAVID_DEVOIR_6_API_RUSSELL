const User = require('../models/User');

exports.getAll = async (req, res) => {
    try {
        const user = await User.find;       
        res.json({ 
            success: true, 
            count: user.length,
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

exports.getUserByMail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Utilisateur non trouvé' 
            });
        }
        res.json({ 
            success: true, 
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

exports.add = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
  
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cet email est déjà utilisé' 
            });
        }
        
        const user = await User.create({ username, email, password });
        
        res.status(201).json({ 
            success: true, 
            message: 'Utilisateur créé avec succès',
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la création', 
            error: error.message 
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        const user = await User.findByIdAndDelete(
            req.params.id,
            { username, email },
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Utilisateur non trouvé' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Utilisateur modifié avec succès',
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la modification', 
            error: error.message 
        });
    }
};


exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Utilisateur non trouvé' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Utilisateur supprimé avec succès' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la suppression', 
            error: error.message 
        });
    }
};

exports.authenticate = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou mot de passe invalide' 
            });
        }
        
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou mot de passe invalide' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Authentification réussie',
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};