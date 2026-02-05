const User = require('../models/User');

// GET /users - Liste tous les utilisateurs
exports.getAll = async (req, res) => {
    console.log("💡 getAll users appelé");
    try {
        const users = await User.find(); // pluralisé
        res.json({ 
            success: true, 
            count: users.length,
            data: users // bien renvoyer le tableau ici
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

// GET /users/:email - Récupérer un utilisateur par email
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
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

// POST /users - Créer un utilisateur
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

        const user = await User.create({ username, email: email.toLowerCase(), password });

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

// PUT /users/:email - Modifier un utilisateur
exports.update = async (req, res) => {
    try {
        const { username, password } = req.body;

        const updateData = { username };
        if (password) updateData.password = password;

        const user = await User.findOneAndUpdate(
            { email: req.params.email.toLowerCase() }, // chercher par email
            updateData,
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
        const user = await User.findOneAndDelete({ email: req.params.email.toLowerCase() });

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
