const express = require('express');
const router = express.Router();

// Vizualizarea tuturor medicilor
router.get('/', (req, res) => {
  // query database to get all the doctors
  let query = "SELECT * FROM `medic` ORDER BY id_medic ASC";

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// Vizualizarea unui singur medic
router.get('/:id', (req, res) => {
  let doctorId = req.params.id;
  // query database to get the doctor
  let query = `SELECT * FROM medic WHERE id_medic = ${doctorId}`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      res.json(result);
    } else {
      res.status(400).json({
        message: `Medicul cu id-ul ${doctorId} nu a fost gasit in baza de date.`
      });
    }

  });
});

// Adaugarea unui nou medic
router.post('/', (req, res) => {

  // res.send(req.body);
  let nume = req.body.nume;
  let prenume = req.body.prenume;

  if (!nume || !prenume) {
    return res.status(400).json({
      message: 'Va rugam sa introduceti numele si prenumele!'
    });
  }

  let medicQuery = `SELECT * FROM medic WHERE nume = '${nume}' AND prenume = '${prenume}'`;

  db.query(medicQuery, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length !== 0) {
      res.status(400).json({
        message: `Medicul ${nume} ${prenume} exista deja in baza de date.`
      });
    } else {
      let query = `INSERT INTO medic (nume, prenume) VALUES ('${nume}', '${prenume}')`;

      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).json({
          message: `Medicul ${nume} ${prenume} a fost adaugat in baza de date.`
        });
      });
    }
  });

});

// Editarea unui medic
router.put('/:id', (req, res) => {
  let doctorId = req.params.id;
  // query database to get the doctor
  let query = `SELECT * FROM medic WHERE id_medic = ${doctorId}`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      let numeDoctor = req.body.nume ? req.body.nume : result[0].nume;
      let prenumeDoctor = req.body.prenume ? req.body.prenume : result[0].prenume;
      let updateDoctorQuery = `UPDATE medic SET nume = '${numeDoctor}', prenume = '${prenumeDoctor}' WHERE medic.id_medic='${doctorId}'`;

      db.query(updateDoctorQuery, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send({
          message: `Medicul ${numeDoctor} ${prenumeDoctor} a fost editat cu succes.`
        })
      });
    } else {
      res.status(400).json({
        message: `Medicul cu id-ul ${doctorId} nu a fost gasit in baza de date.`
      });
    }
  });
});

// Stergerea unui medic
router.delete('/:id', (req, res) => {
  let doctorId = req.params.id;
  // query database to get the doctor
  let query = `SELECT * FROM medic WHERE id_medic = ${doctorId}`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      let doctorId = req.params.id;
      let numeDoctor = result[0].nume;
      let prenumeDoctor = result[0].prenume;
      let deleteDoctorQuery = `DELETE FROM medic WHERE id_medic = ${doctorId}`;

      db.query(deleteDoctorQuery, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send({
          message: `Medicul ${numeDoctor} ${prenumeDoctor} a fost sters cu succes.`
        })
      });
    } else {
      res.status(400).json({
        message: `Medicul cu id-ul ${doctorId} nu a fost gasit in baza de date.`
      });
    }

  });
});

module.exports = router;