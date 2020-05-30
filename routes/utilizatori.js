const express = require('express');
const router = express.Router();
const utilizatoriController = require('../controllers/utilizatoriController');

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// Vizualizarea tuturor policlinicilor
router.get('/', utilizatoriController.getAllUtilizatori);

// Vizualizarea unei singure policlinici
router.get('/:id', utilizatoriController.getSingleUtilizator);

// Adaugarea unei nou utilizator

// Editarea unui utilizator

// Stergerea unui utilizator

module.exports = router;