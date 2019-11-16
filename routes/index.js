const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  let query = "SELECT * FROM `medic` ORDER BY id_medic ASC"; // query database to get all the players

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      // res.redirect('/');
      throw err;
    }
    // res.json(result);
    res.render('index.ejs', {
      title: 'Welcome to Socka | View Players',
      doctors: result
    });
  });
});

router.get('/add', (req, res) => {
  res.render('add_doctor.ejs', {
    title: 'Welcome to Socka | Add a new doctor',
    message: ''
  });
});

router.post('/add', (req, res) => {

  let nume = req.body.nume;
  let prenume = req.body.prenume;

  console.log(req.body.nume,req.body.prenume);

  let medicQuery = `SELECT * FROM medic WHERE nume = '${nume}' AND prenume = '${prenume}'`;
  // res.send(`${nume} ${prenume}`);
  db.query(medicQuery, (err, result) => {
    if(err){
      throw err;
    }

    if(result.length > 0){
      message = 'Medicul exista deja in baza de date.';
      res.render('add_doctor.ejs', {
        message,
        title: 'Welcome to Socka | Add a new doctor' 
      });
    } else {
      let query = `INSERT INTO medic (nume, prenume) VALUES ('${nume}', '${prenume}')`;

      db.query(query, (err, result) => {
        if(err){
          return res.status(500).send(err);
        }
        res.redirect('/');
      });
    }
  });

});

module.exports = router;