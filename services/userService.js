const User = require('../models/User');

//lister des utilisateurs admin
exports.getAll = async (req, res) => {
    try {
        const user = await User.find();       
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

exports.getUserByEmail = async (req, res) => {
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

//ajouter un utilisateur
exports.add = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        console.log("données recues", req.body);

        if (!username || !username.trim()) {
            return res.status(400).json({
                success: false,
                message: "Le nom d'utilisateur est requis"
            });
        }

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email et mot de passe requis"
            });
        }

        username = username.trim();
        email = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Cet email est déjà utilisé"
            });
        }

        const user = await User.create({ username, email, password });

        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            data: user
        });
    } catch (error) {
        console.error("Erreur création user:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création"
        });
    }
};

//modifier un utilisateur
exports.update = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || !username.trim()) {
            return res.status(400).json({
                success: false,
                message: "Le nom d'utilisateur est requis"
            });
        }

        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            { username: username.trim() },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Utilisateur modifié avec succès",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la modification"
        });
    }
};

//supprimer un utilisaeur
exports.delete = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Utilisateur supprimé avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression"
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