const express = require('express');
const router = express.Router();
const pacientiController = require('../controllers/pacientiController');

// Vizualizarea tuturor pacientilor
router.get('/', pacientiController.getAllPacienti);

// Vizualizarea formularului de adaugare al unui nou pacient
router.get('/add', pacientiController.addPacientView);

// Vizualizarea formularului de adaugare al unui nou pacient
router.get('/:id/edit', pacientiController.editPacient);

// Vizualizarea unui singur pacient
router.get('/:id', pacientiController.getSinglePacient);

// Adaugarea unei nou pacient
router.post('/add', pacientiController.addPacient);

// Actualizarea unui pacient
router.post('/:id/edit', pacientiController.updatePacient);

// Stergerea unui pacient
router.post('/:id/delete', pacientiController.deletePacient);

module.exports = router;