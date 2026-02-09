const Catway = require('../models/Catway');

//recuperation des catways
exports.getAll = async (req, res) => {
    try {
        const catways = await Catway.find().sort({ catwayNumber: 1});
        res.json({ 
            success: true, 
            count: catways.length,
            data: catways 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        
        if (!catway) {
            return res.status(404).json({ 
                success: false, 
                message: 'Catway non trouvé' 
            });
        }
        
        res.json({ 
            success: true, 
            data: catway 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

//ajouter un catway
exports.add = async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;
        
        // Vérifier si le numéro existe déjà
        const existing = await Catway.findOne({ catwayNumber });
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ce numéro de catway existe déjà' 
            });
        }
        
        const catway = await Catway.create({ catwayNumber, catwayType, catwayState });
        
        res.status(201).json({ 
            success: true, 
            message: 'Catway créé avec succès',
            data: catway 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la création', 
            error: error.message 
        });
    }
};

//modifier un catway
exports.update = async (req, res) => {
    try {
        const { catwayState } = req.body;
        
       
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState },
            { new: true, runValidators: true }
        );
        
        if (!catway) {
            return res.status(404).json({ 
                success: false, 
                message: 'Catway non trouvé' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Catway modifié avec succès',
            data: catway 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la modification', 
            error: error.message 
        });
    }
};

//supprimer un catway
exports.delete = async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        
        if (!catway) {
            return res.status(404).json({ 
                success: false, 
                message: 'Catway non trouvé' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Catway supprimé avec succès' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la suppression', 
            error: error.message 
        });
    }
};