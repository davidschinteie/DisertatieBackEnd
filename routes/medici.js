const express = require('express');
const router = express.Router();
const mediciController = require('../controllers/mediciController');

// verificarea autentificarii
function loginRequired(req, res, next) {
  if (req.session.utilizatorId == null) {
    req.flash('error', `Trebuie să fii autentificat!`);
    return res.redirect('/login')
  }
  next()
}

function loginRequiredPacient(req, res, next) {
  if (req.session.utilizator.id_rol != 3) {
    req.flash('error', `Drepturi insuficiente TEST!`);
    return res.redirect(`/utilizatori/${req.session.utilizatorId}`)
  }
  next()
}

function loginRequiredMedic(req, res, next) {
  if ((req.session.medic && req.session.medic.id_medic == req.params.id) || req.session.utilizator.id_rol == 1) {
    next();
    return;
  }
  req.flash('error', `Drepturi insuficiente!`);
  return res.redirect(`/utilizatori/${req.session.utilizatorId}`)
}

function loginRequiredAdmin(req, res, next) {
  if (req.session.utilizator.id_rol != 1) {
    req.flash('error', `Drepturi insuficiente!`)
    return res.redirect(`/utilizatori/${req.session.utilizatorId}`)
  }
  next()
}


// Vizualizarea tuturor medicilor
// toti utilizatorii
router.get('/', mediciController.getAllMedici);

// Vizualizarea formularului de adaugare al unui nou medic
// doar admin-ul
router.get('/add', loginRequired, mediciController.addMedicView);

// Vizualizarea formularului de editare al unui medic
// doar medicul sau adminul
router.get('/:id/edit', loginRequired, mediciController.editMedic);

// Vizualizarea formularului de programare al unui nou medic
// doar pacientul
router.get('/:id/programare', loginRequired, loginRequiredPacient, mediciController.programareMedicView);

// Vizualizarea unui singur medic
// toti utilizatorii
router.get('/:id', mediciController.getSingleMedic);

// Adaugarea unui nou medic
// doar admin-ul
router.post('/add', loginRequired, mediciController.addMedic);

// Actualizarea unui medic
// doar medicul sau admin-ul
router.post('/:id/edit', loginRequired, mediciController.updateMedic);

// Adaugarea unei noi programari pentru medic
// doar pacientul
router.post('/:id/programare', mediciController.programareMedic);

// Stergerea unui medic
// doar admin-ul
router.post('/:id/delete', loginRequired, mediciController.deleteMedic);

module.exports = router;