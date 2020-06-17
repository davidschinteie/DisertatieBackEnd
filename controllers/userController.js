const helpers = require('../helpers')
const passport = require("passport")
const bcrypt = require("bcrypt")

exports.loginForm = (req, res) => {
  res.render('login', {

  });
}

exports.authenticate = async (req, res) => {
  let utilizator = req.body.utilizator,
    parola = req.body.parola;

  let utilizator_query = `select * from Utilizator where nume_utilizator = '${utilizator}';`;
  let medic_query = `select * from Medic where id_utilizator = (select id_utilizator from Utilizator where nume_utilizator = '${utilizator}');`;
  let pacient_query = `select * from Pacient where id_utilizator = (select id_utilizator from Utilizator where nume_utilizator = '${utilizator}');`;
  let programari_pacient_query = `select id_programare from Programare where id_pacient = (select id_pacient from Pacient where id_utilizator = (select id_utilizator from Utilizator where nume_utilizator = '${utilizator}'));`;
  let programari_medic_query = `select id_programare from Programare where id_medic = (select id_medic from Medic where id_utilizator = (select id_utilizator from Utilizator where nume_utilizator = '${utilizator}'));`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let utilizator_response, medic, pacient;

  // execute query
  try {
    utilizator_response = await db.query(utilizator_query)
    medic = await db.query(medic_query)
    pacient = await db.query(pacient_query)
    programari_pacient = await db.query(programari_pacient_query)
    programari_medic = await db.query(programari_medic_query)
  } catch (err) {
    console.log(err);
    req.flash('error', err.map(err => err.msg));
    return res.redirect(`/login`);
  } finally {
    await db.close();
    if (utilizator_response.length != 0) {
      bcrypt.compare(parola, utilizator_response[0].parola_criptata, function (err, result) {
        // result == true
        if (result) {
          req.session.utilizatorId = utilizator_response[0].id_utilizator;
          req.session.utilizator = utilizator_response[0];
          if (utilizator_response[0].id_rol == 3) {
            req.session.pacient = pacient[0];
            req.session.programari = programari_pacient;
          } else if (utilizator_response[0].id_rol == 4) {
            req.session.medic = medic[0];
            req.session.programari = programari_medic;
          }
          req.flash('success', `Bine ai revenit ${utilizator_response[0].nume} ${utilizator_response[0].prenume}.`);
          res.redirect(`/utilizatori/${utilizator_response[0].id_utilizator}`);
        } else {
          req.flash('error', `Datele introduse sunt incorecte.`);
          res.redirect(`/login`);
        }
      });
    } else {
      req.flash('error', `Datele introduse sunt incorecte.`);
      res.redirect(`/login`);
    }
  }
}

exports.logout = (req, res, next) => {
  req.authenticate = false;
  req.session.destroy((err) => {
    res.redirect("/login")
  })
}