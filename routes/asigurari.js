const express = require('express');
const router = express.Router();
const asigurariController = require('../controllers/asigurariController');

// Vizualizarea tuturor asigurarilor
router.get('/', asigurariController.getAllAsigurari);

// Vizualizarea unei singure asigurari
router.get('/:id', asigurariController.getSingleAsigurare);

// Adaugarea unei noi asigurari

// Editarea unei asigurari

// Stergerea unei asigurari

module.exports = router;