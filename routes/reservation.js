const express = require('express');
const router = express.Router();

const service = require('../services/reservationService');

const private = require('../middleware/private');

router.get("/catways/:id/reservations", private.checkJWT, service.getAll);
router.get("/catways/:id/reservations/:idReservation", private.checkJWT, service.getById);
router.post("/catways/:id/reservations", private.checkJWT, service.add);
router.patch("/catways/:id/reservations/:idReservation", private.checkJWT, service.update);
router.delete("/catways/:id/reservations/:idReservation", private.checkJWT, service.delete);

module.exports = router;