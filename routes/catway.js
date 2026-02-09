const express = require('express');
const router = express.Router();

const catwayService = require('../services/catwayService');
const reservationService = require('../services/reservationService');
const private = require('../middleware/private');


router.get("/:id/reservations", private.checkJWT, reservationService.getAllByCatway);
router.get("/:id/reservations/:idReservation", private.checkJWT, reservationService.getById);
router.post("/:id/reservations", private.checkJWT, reservationService.add);
router.put("/:id/reservations/:idReservation", private.checkJWT, reservationService.update);
router.delete("/:id/reservations/:idReservation", private.checkJWT, reservationService.delete);


router.get("/", private.checkJWT, catwayService.getAll);
router.get("/:id", private.checkJWT, catwayService.getById);
router.post("/", private.checkJWT, catwayService.add);
router.put("/:id", private.checkJWT, catwayService.update);
router.delete("/:id", private.checkJWT, catwayService.delete);


module.exports = router;