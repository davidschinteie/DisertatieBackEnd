const express = require('express');
const router = express.Router();
const utilizatoriController = require('../controllers/utilizatoriController');

// verificarea autentificarii
function loginRequired(req, res, next) {
  if (req.session.utilizatorId == null) {
    req.flash('error', `Trebuie să fii autentificat!`);
    return res.redirect('/login')
  }
  next()
}

function loginRequiredUser(req, res, next) {
  if (req.session.utilizatorId != req.params.id && req.session.utilizator.id_rol != 1) {
    req.flash('error', `Drepturi insuficiente!`);
    // return res.redirect(`/utilizatori/${req.session.utilizatorId}`);
    return res.redirect(`/`)
  }
  next()
}

function loginRequiredAdmin(req, res, next) {
  if (req.session.utilizator.id_rol != 1) {
    req.flash('error', `Drepturi insuficiente!`);
    return res.redirect(`/utilizatori/${req.session.utilizatorId}`)
  }
  next()
}

// Criptarea tuturor parolelor
// router.get('/encrypt-passwords', utilizatoriController.encryptPasswords);

// Vizualizarea tuturor utilizatorilor
router.get('/', loginRequired, loginRequiredAdmin, utilizatoriController.getAllUtilizatori);

// Vizualizarea unui singur utilizator
router.get('/:id', loginRequired, loginRequiredUser, utilizatoriController.getSingleUtilizator);

// Vizualizarea formularului de editare al unui utilizator
router.get('/:id/edit', loginRequired, loginRequiredUser, utilizatoriController.editUtilizator);

// Adaugarea unui nou utilizator
// @todo: de adaugat utilizator nou cu selectia rolului sau (pacient, medic sau admin) si selectia campurilor corespunzatoare acestei selectii

// Actualizarea unui utilizator
router.post('/:id/edit', loginRequired, loginRequiredUser, utilizatoriController.updateUtilizator);

// Stergerea unui utilizator
router.post('/:id/delete', loginRequired, loginRequiredAdmin, utilizatoriController.deleteUtilizator);

module.exports = router;