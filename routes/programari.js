const express = require('express');
const router = express.Router();
const programariController = require('../controllers/programariController');

// verificarea autentificarii
function loginRequired(req, res, next) {
  if (req.session.utilizatorId == null) {
    req.flash('error', `Trebuie să fii autentificat!`);
    return res.redirect('/login')
  }
  next()
}

function loginRequiredPacientMedicAdmin(req, res, next) {
  let flag = false;

  if (req.session.utilizator.id_rol == 1) {
    flag = true
  }

  req.session.programari.forEach(programare => {
    if (programare.id_programare == req.params.id) {
      flag = true
    }
  });

  if (!flag) {
    req.flash('error', `Drepturi insuficiente!`);
    return res.redirect(`/utilizatori/${req.session.utilizatorId}`);
  }
  next();
}

function loginRequiredAdmin(req, res, next) {
  if (req.session.utilizator.id_rol != 1) {
    req.flash('error', `Drepturi insuficiente!`)
    return res.redirect(`/utilizatori/${req.session.utilizatorId}`)
  }
  next()
}

// Vizualizarea tuturor programarilor
// doar adminul
router.get('/', loginRequired, loginRequiredAdmin, programariController.getAllProgramari);

// Vizualizarea formularului de adaugare al unei noi programari
// router.get('/add', programariController.addProgramariView);

// Vizualizarea formularului de editare al unei programari
// doar adminul, medicul sau pacientul din programare
router.get('/:id/edit', loginRequired, programariController.editProgramare);

// Vizualizarea unei singure programari
// doar adminul, medicul sau pacientul din programare
router.get('/:id', loginRequired, programariController.getSingleProgramare);

// Actualizarea unei programari
// doar adminul, medicul sau pacientul din programare
router.post('/:id/edit', loginRequired, programariController.updateProgramare);

// Stergerea unei programari
// doar adminul, medicul sau pacientul din programare
router.post('/:id/delete', loginRequired, programariController.deleteProgramare);

module.exports = router;