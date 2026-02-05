const express = require('express');
const router = express.Router();

const service = require('../services/reservationService');

const private = require('../middleware/private');


module.exports = router;