const express = require('express');
const router = express.Router();

const catwayService = require('../services/catwayService');
const reservationService = require('../services/reservationService');
const private = require('../middleware/private');


/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d’un catway
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get("/:id/reservations", private.checkJWT, reservationService.getAllByCatway);

/**
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *       404:
 *         description: Réservation non trouvée
 */
router.get("/:id/reservations/:idReservation", private.checkJWT, reservationService.getById);

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   post:
 *     summary: Ajouter une réservation à un catway
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *                 example: John Doe
 *               boatName:
 *                 type: string
 *                 example: Mistral
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-09
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-26
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Données invalides
 */
router.post("/:id/reservations", private.checkJWT, reservationService.add);

/**
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Mettre à jour une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 example : John Doe
 *               boatName:
 *                 type: string
 *                 example: Le carousselle
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Réservation non trouvée
 */
router.put("/:id/reservations/:idReservation", private.checkJWT, reservationService.update);

/**
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation non trouvée
 */
router.delete("/:id/reservations/:idReservation", private.checkJWT, reservationService.delete);





/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Récupérer tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways
 */
router.get("/", private.checkJWT, catwayService.getAll);

/**
 * @swagger
 * /api/catways/{id}:
 *   get:
 *     summary: Récupérer un catway par son ID
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Catway trouvé
 *       404:
 *         description: Catway non trouvé
 */
router.get("/:id", private.checkJWT, catwayService.getById);

/**
 * @swagger
 * /api/catways:
 *   post:
 *     summary: Ajouter un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - catwayType
 *               - catwayState
 *             properties:
 *               name:
 *                 type: string
 *                 example: Catway 1
 *               catwayType:
 *                 type: string
 *                 example: short
 *               catwayState:
 *                 type: string
 *                 example: bon état
 *     responses:
 *       201:
 *         description: Catway créé
 *       400:
 *         description: Données invalides
 */
router.post("/", private.checkJWT, catwayService.add);


/**
 * @swagger
 * /api/catways/{id}:
 *   put:
 *     summary: Mettre à jour un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwaystate
 *         required: true
 *         schema:
 *           type: integer
 *         description: état du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState:
 *                  type: string
 *                  example: travaux en cours
 *     responses:
 *       200:
 *         description: Catway mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Catway non trouvé
 */
router.put("/:id", private.checkJWT, catwayService.update);

/**
 * @swagger
 * /api/catways/{id}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 */
router.delete("/:id", private.checkJWT, catwayService.delete);


module.exports = router;