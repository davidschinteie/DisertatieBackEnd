const express = require('express');
const router = express.Router();
const pacientiController = require('../controllers/pacientiController');

// verificarea autentificarii
function loginRequired(req, res, next) {
  if (req.session.utilizatorId == null) {
    req.flash('error', `Trebuie să fii autentificat!`);
    return res.redirect('/login')
  }
  next()
}

function loginRequiredMedic(req, res, next) {
  if (req.session.utilizator.id_rol == 4 || req.session.utilizator.id_rol == 1) {
    next();
    return;
  }
  req.flash('error', `Drepturi insuficiente!`);
  return res.redirect(`/utilizatori/${req.session.utilizatorId}`)
}

function loginRequiredPacient(req, res, next) {
  if ((req.session.pacient && req.session.pacient.id_pacient == req.params.id) || req.session.utilizator.id_rol == 1 || req.session.utilizator.id_rol == 4) {
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

// Vizualizarea tuturor pacientilor
// doar medicii sau admin-ul
router.get('/', loginRequired, loginRequiredMedic, pacientiController.getAllPacienti);

// Vizualizarea formularului de adaugare al unui nou pacient
// numai de catre medic sau admin
router.get('/add', loginRequired, loginRequiredMedic, pacientiController.addPacientView);

router.get('/inregistrare', pacientiController.newPacientView);

// Vizualizarea formularului de editare al unui pacient
// doar pacientul, medicii sau admin-ul
router.get('/:id/edit', loginRequired, loginRequiredPacient, pacientiController.editPacient);

// Vizualizarea unui singur pacient
// doar pacientul, medicii sau admin-ul
router.get('/:id', loginRequired, loginRequiredPacient, pacientiController.getSinglePacient);

// Adaugarea unui nou pacient
router.post('/add', pacientiController.addPacient);
// Inregistrarea unui nou pacient
router.post('/inregistrare', pacientiController.inregistrarePacient);

// Crearea unui nou cont de pacient
// router.post('/add', pacientiController.addPacient);

// Actualizarea unui pacient
router.post('/:id/edit', loginRequired, loginRequiredMedic, pacientiController.updatePacient);

// Stergerea unui pacient
router.post('/:id/delete', loginRequired, loginRequiredAdmin, pacientiController.deletePacient);

module.exports = router;