// services/reservationService.js
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// GET /catways/:id/reservations - Liste toutes les réservations d'un catway
exports.getAllByCatway = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        
        // Vérifier que le catway existe
        const catway = await Catway.findOne({ catwayNumber });
        if (!catway) {
            return res.status(404).json({
                success: false,
                message: 'Catway non trouvé'
            });
        }
        
        const reservations = await Reservation.find({ catwayNumber });
        res.json({
            success: true,
            catwayNumber,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// GET /catways/:id/reservations/:idReservation - Récupérer une réservation spécifique
exports.getById = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        const reservationId = req.params.idReservation;
        
        const reservation = await Reservation.findOne({ 
            _id: reservationId,
            catwayNumber 
        });
        
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: reservation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// POST /catways/:id/reservations - Créer une réservation
exports.add = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        const { clientName, boatName, startDate, endDate } = req.body;

        console.log('Données reçues pour réservation:', { catwayNumber, clientName, boatName, startDate, endDate });
        
        // Vérifier que le catway existe
        const catway = await Catway.findOne({ catwayNumber });
        if (!catway) {
            return res.status(404).json({
                success: false,
                message: 'Catway non trouvé'
            });
        }
        
        // Vérifier les conflits de dates
        const conflict = await Reservation.findOne({
            catwayNumber,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });
        
        if (conflict) {
            return res.status(400).json({
                success: false,
                message: 'Ce catway est déjà réservé pour cette période'
            });
        }
        
        const reservation = await Reservation.create({ 
            catwayNumber, 
            clientName, 
            boatName, 
            startDate, 
            endDate 
        });

        console.log('Réservation créée:', reservation);
        
        res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            data: reservation
        });
    } catch (error) {
        console.error('Erreur création réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error.message
        });
    }
};

// PUT /catways/:id/reservations/:idReservation - Modifier une réservation
exports.update = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        const reservationId = req.params.idReservation;
        const { clientName, boatName, startDate, endDate } = req.body;
        
        const reservation = await Reservation.findOneAndUpdate(
            { _id: reservationId, catwayNumber },
            { clientName, boatName, startDate, endDate },
            { new: true, runValidators: true }
        );
        
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Réservation modifiée avec succès',
            data: reservation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification',
            error: error.message
        });
    }
};

// DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation
exports.delete = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        const reservationId = req.params.idReservation;
        
        const reservation = await Reservation.findOneAndDelete({ 
            _id: reservationId,
            catwayNumber 
        });
        
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Réservation supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message
        });
    }
};