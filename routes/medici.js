const express = require('express');
const router = express.Router();
const mediciController = require('../controllers/mediciController');

// Vizualizarea tuturor medicilor
router.get('/', mediciController.getAllMedici);

// Vizualizarea formularului de adaugare al unui nou medic
router.get('/add', mediciController.addMedicView);

// Vizualizarea formularului de editare al unui medic
router.get('/:id/edit', mediciController.editMedic);

// Vizualizarea formularului de programare al unui nou medic
router.get('/:id/programare', mediciController.programareMedicView);

// Vizualizarea unui singur medic
router.get('/:id', mediciController.getSingleMedic);

// Adaugarea unui nou medic
router.post('/add', mediciController.addMedic);

// Actualizarea unui medic
router.post('/:id/edit', mediciController.updateMedic);

// Adaugarea unei noi programari pentru medic
router.post('/:id/programare', mediciController.programareMedic);

// Stergerea unui medic
router.post('/:id/delete', mediciController.deleteMedic);

module.exports = router;