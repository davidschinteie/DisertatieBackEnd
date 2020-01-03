const express = require('express');
const router = express.Router();

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// Vizualizarea tuturor policlinicilor
router.get('/', (req, res) => {
  // query database to get all the polyclinics
  let query = "select id_policlinica, Policlinica.denumire, email, telefon, adresa, link_google_map, Zona.denumire as zona, date_format(data_deschiderii, '%Y-%m-%d') as data_deschiderii, chirie_lunara from Policlinica, Zona where Policlinica.zona_id = Zona.id_zona ORDER BY id_policlinica ASC";

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// Vizualizarea unei singure policlinic
router.get('/:id', (req, res) => {
  let clinicId = req.params.id;
  // query database to get the polyclinic
  let query = `select id_policlinica, Policlinica.denumire, email, telefon, adresa, link_google_map, Zona.denumire as zona, date_format(data_deschiderii, '%Y-%m-%d') as data_deschiderii, chirie_lunara from Policlinica, Zona where Policlinica.zona_id = Zona.id_zona and id_policlinica = ${clinicId}`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      res.json(result);
    } else {
      res.status(400).json({
        message: `Policlinica cu id-ul ${clinicId} nu a fost gasita in baza de date.`
      });
    }

  });
});

// Adaugarea unei noi policlinic
router.post('/', (req, res) => {

  // res.send(req.body);
  let denumire = req.body.denumire,
    email = req.body.email,
    telefon = req.body.telefon,
    adresa = req.body.adresa,
    link_google_map = req.body.link_google_map,
    zona = req.body.zona,
    zona_id,
    data_deschiderii = req.body.data_deschiderii,
    chirie_lunara = req.body.chirie_lunara;

  if (!denumire || !email || !telefon || !adresa || !link_google_map || !zona || !data_deschiderii || !chirie_lunara) {
    return res.status(400).json({
      message: 'Va rugam sa introduceti toate datele necesare pentru inregistrare!'
    });
    // @todo: validare date inainte de a face query-uri catre db cu ele .. 
  }

  let query = `SELECT id_zona FROM Zona WHERE denumire = ?;SELECT * FROM Policlinica WHERE denumire = ?;`;

  db.query(query, [`${zona}`, `${denumire}`], (err, results) => {
    if (err) {
      throw err;
    }
    if (!isEmptyObject(results[0])) {
      zona_id = results[0][0].id_zona;
    } else {
      return res.status(400).json({
        message: 'Va rugam sa introduceti o zona valida!'
      });
    }

    if (!isEmptyObject(results[1])) {
      res.status(400).json({
        message: `Policlinica ${denumire} exista deja in baza de date.`
      });
    } else {
      let insert_query = `INSERT INTO Policlinica (denumire, email, telefon, adresa, link_google_map, zona_id, data_deschiderii, chirie_lunara) VALUES ('${denumire}', '${email}', '${telefon}', '${adresa}', '${link_google_map}', '${zona_id}', '${data_deschiderii}', '${chirie_lunara}')`;

      db.query(insert_query, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).json({
          message: `Policlinica ${denumire} a fost adaugat in baza de date.`
        });
      });
    }
  });

});

// Editarea unei policlinici
router.put('/:id', (req, res) => {
  let clinicId = req.params.id;

  let zona = req.body.zona,
    query,
    query_arr;

  // query for the database to get the polyclinic
  query = `select id_policlinica, denumire, email, telefon, adresa, link_google_map, zona_id, date_format(data_deschiderii, '%Y-%m-%d') as data_deschiderii, chirie_lunara from Policlinica where id_policlinica = ?;`
  query_arr = [`${clinicId}`];

  if (zona) {
    query += `SELECT id_zona FROM Zona WHERE denumire = ?;`;
    query_arr.push(`${zona}`);
  }

  // execute query
  db.query(query, query_arr, (err, results) => {
    if (err) {
      throw err;
    }

    let zona_id;

    if (zona) {
      if (!isEmptyObject(results[1])) {
        zona_id = results[1][0].id_zona;
      } else {
        return res.status(400).json({
          message: 'Va rugam sa introduceti o zona valida!'
        });
      }
    }

    if (!isEmptyObject(results[0])) {

      let denumire = req.body.denumire ? req.body.denumire : results[0][0].denumire,
        email = req.body.email ? req.body.email : results[0][0].email,
        telefon = req.body.telefon ? req.body.telefon : results[0][0].telefon,
        adresa = req.body.adresa ? req.body.adresa : results[0][0].adresa,
        link_google_map = req.body.link_google_map ? req.body.link_google_map : results[0][0].link_google_map,
        data_deschiderii = req.body.data_deschiderii ? req.body.data_deschiderii : results[0][0].data_deschiderii,
        chirie_lunara = req.body.chirie_lunara ? req.body.chirie_lunara : results[0][0].chirie_lunara,
        updateData;

      updateData = `denumire = '${denumire}', email = '${email}', telefon = '${telefon}', adresa = '${adresa}', link_google_map = '${link_google_map}', data_deschiderii = '${data_deschiderii}', chirie_lunara = '${chirie_lunara}'`;

      if (zona_id) {
        updateData += `, zona_id = '${zona_id}'`;
      }

      let updateDoctorQuery = `UPDATE Policlinica SET ${updateData} WHERE Policlinica.id_policlinica='${clinicId}'`;

      db.query(updateDoctorQuery, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send({
          message: `Policlinica ${denumire} a fost editata cu succes.`
        });
      });
    } else {
      res.status(400).json({
        message: `Policlinica cu id-ul ${clinicId} nu a fost gasita in baza de date.`
      });
    }
  });
});

// Stergerea unei policlinici
router.delete('/:id', (req, res) => {
  let clinicId = req.params.id;
  // query database to get the doctor
  let query = `SELECT * FROM Policlinica WHERE id_policlinica = ${clinicId}`;

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length) {
      let denumire = result[0].denumire,
        deleteQuery = `DELETE FROM Policlinica WHERE id_policlinica = ${clinicId}`;

      db.query(deleteQuery, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send({
          message: `Policlinica ${denumire} a fost stearsa cu succes.`
        })
      });
    } else {
      res.status(400).json({
        message: `Policlinica cu id-ul ${clinicId} nu a fost gasita in baza de date.`
      });
    }

  });
});

module.exports = router;