const express = require('express');
const router = express.Router();
const pacientiController = require('../controllers/pacientiController');

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// Vizualizarea tuturor policlinicilor
router.get('/', pacientiController.getAllPacienti);

// Vizualizarea unei singure policlinici
router.get('/:id', pacientiController.getSinglePacient);

// Adaugarea unei nou pacient

// Editarea unui pacient

// Stergerea unui pacient

module.exports = router;