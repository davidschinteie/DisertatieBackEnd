const express = require('express');
const router = express.Router();
const programariController = require('../controllers/programariController');

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// Vizualizarea tuturor programarilor
router.get('/', programariController.getAllProgramari);

// Vizualizarea unei singure programari
router.get('/:id', programariController.getSingleProgramare);

// Adaugarea unei noi programari

// Editarea unei programari

// Stergerea unei programari

module.exports = router;