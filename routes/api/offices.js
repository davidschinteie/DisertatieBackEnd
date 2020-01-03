const express = require('express');
const async = require('async');
// const await = require('await');
const router = express.Router();

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// Vizualizarea tuturor cabinetelor
router.get('/', (req, res) => {
  // query database to get all the polyclinics
  let query = "select Cabinet.id_cabinet, Cabinet.denumire as Cabinet, SpecialitateMedicala.specialitate, Policlinica.denumire as Policlinica from Cabinet inner join SpecialitateMedicala on Cabinet.specialitate_id = SpecialitateMedicala.id_specialitate inner join Policlinica on Cabinet.policlinica_id = Policlinica.id_policlinica;";

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// Vizualizarea unui singur cabinet
router.get('/:id', (req, res) => {
  let officeId = req.params.id;
  // query database to get the polyclinic
  let query = `select Cabinet.id_cabinet, Cabinet.denumire as Cabinet, SpecialitateMedicala.specialitate, Policlinica.denumire as Policlinica 
  from Cabinet 
  inner join SpecialitateMedicala 
    on Cabinet.specialitate_id = SpecialitateMedicala.id_specialitate 
  inner join Policlinica 
    on Cabinet.policlinica_id = Policlinica.id_policlinica 
  where id_cabinet = ${officeId};`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      res.json(result);
    } else {
      res.status(400).json({
        message: `Cabinetul cu id-ul ${officeId} nu a fost gasit in baza de date.`
      });
    }

  });
});

// Adaugarea unui nou cabinet
router.post('/', (req, res) => {

  // res.send(req.body);
  let denumire = req.body.denumire,
    specialitate = req.body.specialitate,
    specialitate_id,
    policlinica = req.body.policlinica,
    policlinica_id;

  if (!denumire || !specialitate || !policlinica) {
    return res.status(400).json({
      message: 'Va rugam sa introduceti toate datele necesare pentru inregistrare!'
    });
    // @todo: validare date inainte de a face query-uri catre db cu ele .. 
  }

  let query = `SELECT id_specialitate FROM SpecialitateMedicala WHERE specialitate = ?;SELECT id_policlinica FROM Policlinica WHERE denumire = ?;`;

  db.query(query, [`${specialitate}`, `${policlinica}`], (err, results) => {
    if (err) {
      throw err;
    }
    if (!isEmptyObject(results[0])) {
      specialitate_id = results[0][0].id_specialitate;
    } else {
      return res.status(400).json({
        message: 'Va rugam sa introduceti o specialitate valida!'
      });
    }
    if (!isEmptyObject(results[1])) {
      policlinica_id = results[1][0].id_policlinica;
    } else {
      return res.status(400).json({
        message: 'Va rugam sa introduceti o policlinica existenta!'
      });
    }

    let insert_query = `INSERT INTO Cabinet (denumire, specialitate_id, policlinica_id) VALUES ('${denumire}', '${specialitate_id}', '${policlinica_id}')`;

    db.query(insert_query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).json({
        message: `Cabinetul ${denumire} a fost adaugat in baza de date.`
      });
    });
  });


});

// Editarea unui cabinet
router.put('/:id', (req, res) => {
  let officeId = req.params.id;

  let denumire = req.body.denumire,
    specialitate = req.body.specialitate,
    policlinica = req.body.policlinica;

  // query for the database to get the office
  query = `SELECT id_cabinet, denumire, specialitate_id, policlinica_id FROM Cabinet where id_cabinet = ?;`
  query_arr = [`${officeId}`];

  if (specialitate) {
    query += `SELECT id_specialitate FROM SpecialitateMedicala WHERE specialitate = ?;`;
    query_arr.push(`${specialitate}`);
  }
  if (policlinica) {
    query += `SELECT id_policlinica FROM Policlinica WHERE denumire = ?;`;
    query_arr.push(`${policlinica}`);
  }

  console.log(query_arr);

  // execute query
  db.query(query, query_arr, (err, results) => {
    if (err) {
      throw err;
    }

    let specialitate_id,
      policlinica_id;

    if (specialitate) {
      if (!isEmptyObject(results[1])) {
        specialitate_id = results[1][0].id_specialitate;
      } else {
        return res.status(400).json({
          message: 'Va rugam sa introduceti o specialitate valida!'
        });
      }
    }

    if (policlinica) {
      let key = specialitate ? 2 : 1;

      if (!isEmptyObject(results[key])) {
        policlinica_id = results[key][0].id_policlinica;
      } else {
        return res.status(400).json({
          message: 'Va rugam sa introduceti o policlinica valida!'
        });
      }
    }

    if (!isEmptyObject(results[0])) {

      let denumire = req.body.denumire ? req.body.denumire : results[0][0].denumire,
        updateData;

      updateData = `denumire = '${denumire}'`;

      if (specialitate_id) {
        updateData += `, specialitate_id = '${specialitate_id}'`;
      }
      if (policlinica_id) {
        updateData += `, policlinica_id = '${policlinica_id}'`;
      }

      let updateQuery = `UPDATE Cabinet SET ${updateData} WHERE id_cabinet = '${officeId}'`;

      db.query(updateQuery, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send({
          message: `Cabinetul cu id-ul ${officeId} a fost editat cu succes.`
        });
      });
    } else {
      res.status(400).json({
        message: `Cabinetul cu id-ul ${clinicId} nu a fost gasita in baza de date.`
      });
    }
  });
});

// Stergerea unui cabinet
router.delete('/:id', (req, res) => {
  let officeId = req.params.id;
  // query database to get the doctor
  let query = `SELECT * FROM Cabinet WHERE id_cabinet = ${officeId}`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      let denumire = result[0].denumire,
        deleteQuery = `DELETE FROM Cabinet WHERE id_cabinet = ${officeId}`;

      db.query(deleteQuery, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send({
          message: `Cabinetul cu id-ul ${officeId} a fost sters cu succes.`
        })
      });
    } else {
      res.status(400).json({
        message: `Cabinetul cu id-ul ${officeId} nu a fost gasit in baza de date.`
      });
    }

  });
});

module.exports = router;