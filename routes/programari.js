const express = require('express');
const router = express.Router();
const programariController = require('../controllers/programariController');

// Vizualizarea tuturor programarilor
router.get('/', programariController.getAllProgramari);

// Vizualizarea formularului de adaugare al unei noi programari
// router.get('/add', programariController.addProgramariView);

// Vizualizarea formularului de editare al unei programari
router.get('/:id/edit', programariController.editProgramare);

// Vizualizarea unei singure programari
router.get('/:id', programariController.getSingleProgramare);

// Actualizarea unei programari
router.post('/:id/edit', programariController.updateProgramare);

// Stergerea unei programari

module.exports = router;