const express = require('express');
const router = express.Router();

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// Vizualizarea tuturor medicilor
router.get('/', (req, res) => {
  // query database to get all the doctors
  let query = "SELECT id_medic, nume, prenume, GradProfesional.grad_profesional, SpecialitateMedicala.specialitate, email, telefon, salariu, date_format(data_angajarii, '%Y-%m-%d') as data_angajarii FROM Medic, SpecialitateMedicala, GradProfesional where Medic.specialitate_id = SpecialitateMedicala.id_specialitate and Medic.grad_profesional_id = GradProfesional.id_grad ORDER BY id_medic ASC";

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
  let query = `SELECT id_medic, nume, prenume, GradProfesional.grad_profesional, SpecialitateMedicala.specialitate, email, telefon, salariu, date_format(data_angajarii, '%Y-%m-%d') as data_angajarii FROM Medic, SpecialitateMedicala, GradProfesional where Medic.specialitate_id = SpecialitateMedicala.id_specialitate and Medic.grad_profesional_id = GradProfesional.id_grad and id_medic = ${doctorId}`;

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
  let grad_profesional = req.body.grad_profesional;
  let grad_profesional_id, specialitate_id;
  let specialitate = req.body.specialitate;
  let email = req.body.email;
  let telefon = req.body.telefon;
  let salariu = req.body.salariu;
  let data_angajarii = req.body.data_angajarii;

  if (!nume || !prenume || !grad_profesional || !specialitate || !email || !telefon || !salariu || !data_angajarii) {
    return res.status(400).json({
      message: 'Va rugam sa introduceti toate datele necesare pentru inregistrare!'
    });
    // @todo: validare nume, prenume, grad_profesional, specialitate, email, telefon, salariu, data_angajarii inainte de a face query-uri catre db cu ele .. 
  }

  let query = `SELECT id_grad FROM GradProfesional WHERE grad_profesional = ?; SELECT id_specialitate FROM SpecialitateMedicala WHERE specialitate = ?;SELECT * FROM Medic WHERE concat(nume, ' ', prenume) = ?;`;

  db.query(query, [`${grad_profesional}`, `${specialitate}`, `${nume} ${prenume}`], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    if (!isEmptyObject(results[0])) {
      grad_profesional_id = results[0][0].id_grad;
    } else {
      return res.status(400).json({
        message: 'Va rugam sa introduceti un grad profesional valid (rezident, specialist sau primar)!'
      });
    }

    if (!isEmptyObject(results[1])) {
      specialitate_id = results[1][0].id_specialitate;
    } else {
      return res.status(400).json({
        message: 'Va rugam sa introduceti o specialitate valida!'
      });
    }

    if (!isEmptyObject(results[2])) {
      res.status(400).json({
        message: `Medicul ${nume} ${prenume} exista deja in baza de date.`
      });
    } else {
      let insert_query = `INSERT INTO Medic (nume, prenume, grad_profesional_id, specialitate_id, email, telefon, salariu, data_angajarii) VALUES ('${nume}', '${prenume}', '${grad_profesional_id}', '${specialitate_id}', '${email}', '${telefon}', '${salariu}', '${data_angajarii}')`;

      db.query(insert_query, (err, result) => {
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
  let query = `SELECT * FROM Medic WHERE id_medic = ${doctorId}`;

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
  let query = `SELECT * FROM Medic WHERE id_medic = ${doctorId}`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      let doctorId = req.params.id;
      let numeDoctor = result[0].nume;
      let prenumeDoctor = result[0].prenume;
      let deleteDoctorQuery = `DELETE FROM Medic WHERE id_medic = ${doctorId}`;

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