const helpers = require('../helpers');

exports.getAllPoliclinici = async (req, res) => {
  // query database to get all the polyclinics
  let query = `select Policlinica.id_policlinica, Policlinica.denumire, Policlinica.email, Policlinica.telefon, Policlinica.adresa, Policlinica.link_google_map, Zona.denumire as zona
  from Policlinica 
  join Zona on Policlinica.zona_id = Zona.id_zona;
  `;

  const db = helpers.makeDb(helpers.db_config);
  let policlinici;

  // execute query
  try {
    policlinici = await db.query(query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    res.render('policlinici_list', {
      policlinici: policlinici
    });
  }
};

exports.getSinglePoliclinica = async (req, res) => {
  let clinicId = req.params.id;
  // query database to get the polyclinic
  let policlinica_query = `select * from Policlinica where Policlinica.id_policlinica = ${clinicId}`;
  let cabinete_query = `select
  Cabinet.denumire as Cabinet,
  SpecialitateMedicala.denumire as specialitate
  from Policlinica 
  join Zona on Policlinica.zona_id = Zona.id_zona
  join Cabinet on Policlinica.id_policlinica = Cabinet.id_policlinica
  join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = Cabinet.id_specialitate
  where Policlinica.id_policlinica = ${clinicId}`;
  let orar_query = `select 
  ProgramPoliclinica.ziua_saptamanii, ProgramPoliclinica.ora_inceput, ProgramPoliclinica.ora_sfarsit
  from Policlinica 
  join Zona on Policlinica.zona_id = Zona.id_zona
  join ProgramPoliclinica on Policlinica.id_policlinica = ProgramPoliclinica.id_policlinica
  where Policlinica.id_policlinica = 1
  ORDER BY FIELD(ProgramPoliclinica.ziua_saptamanii, 'Lu','Ma','Mi','Joi','Vn','Sa')`

  const db = helpers.makeDb(helpers.db_config);
  let policlinica, cabinete, orar;

  // execute query
  try {
    policlinica = await db.query(policlinica_query);
    cabinete = await db.query(cabinete_query);
    orar = await db.query(orar_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    if (policlinica.length == 0) {
      req.flash('error', 'Policlinica cautata nu este in baza de date.');
      res.redirect('/policlinici');
    } else {
      res.render('policlinica_single', {
        policlinica: policlinica[0],
        cabinete: cabinete,
        orar: orar
      });
    }
  }
};