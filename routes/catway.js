const express = require('express');
const router = express.Router();

const catwayService = require('../services/catwayService');
const reservationService = require('../services/reservationService');
const private = require('../middleware/private');


router.get("/:id", private.checkJWT, catwayService.getAll);
router.get("/", private.checkJWT, catwayService.getById);
router.post("/add", private.checkJWT, catwayService.add);
router.patch("/:id", private.checkJWT, catwayService.update);
router.delete("/:id", private.checkJWT, catwayService.delete);

router.get(":id/reservations", private.checkJWT, reservationService.getAllByCatway);
router.get(":id/reservations/:idReservation", private.checkJWT, reservationService.getById);
router.post(":id/reservations", private.checkJWT, reservationService.add);
router.patch(":id/reservations/:idReservation", private.checkJWT, reservationService.update);
router.delete(":id/reservations/:idReservation", private.checkJWT, reservationService.delete);

module.exports = router;