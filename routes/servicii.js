const express = require('express');
const router = express.Router();
const serviciiController = require('../controllers/serviciiController');

// Vizualizarea tuturor serviciilor
router.get('/', serviciiController.getAllServicii);

// Vizualizarea unui singur serviciu
router.get('/:id', serviciiController.getSingleServiciu);

// Adaugarea unui serviciu

// Editarea unui serviciu

// Stergerea unui serviciu

module.exports = router;