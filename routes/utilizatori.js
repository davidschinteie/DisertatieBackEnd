const express = require('express');
const router = express.Router();
const utilizatoriController = require('../controllers/utilizatoriController');

// Vizualizarea tuturor policlinicilor
router.get('/', utilizatoriController.getAllUtilizatori);

// Vizualizarea unei singure policlinici
router.get('/:id', utilizatoriController.getSingleUtilizator);

// Vizualizarea formularului de adaugare al unui nou medic
router.get('/:id/edit', utilizatoriController.editUtilizator);

// Adaugarea unei nou utilizator
// @todo: de adaugat utilizator nou cu selectia rolului sau (pacient, medic sau admin) si selectia campurilor corespunzatoare acestei selectii

// Actualizarea unui utilizator
router.post('/:id/edit', utilizatoriController.updateUtilizator);

// Stergerea unui utilizator
router.post('/:id/delete', utilizatoriController.deleteUtilizator);

module.exports = router;