const express = require('express');
const router = express.Router();

const service = require('../services/userService');

const private = require('../middleware/private');

router.get("/", private.checkJWT, service.getAll);
router.get("/:email", private.checkJWT, service.getUserByEmail);
router.post("/", private.checkJWT, service.add);
router.put("/:email", private.checkJWT, service.update);
router.delete("/:email", private.checkJWT, service.delete);

router.post("/authenticate", service.authenticate);

module.exports = router;

