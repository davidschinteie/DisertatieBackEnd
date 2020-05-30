const helpers = require('../helpers');

exports.getAllPoliclinici = async (req, res) => {
  // query database to get all the polyclinics
  let query = `select Policlinica.denumire, Policlinica.email, Policlinica.telefon, Policlinica.adresa, Policlinica.link_google_map, Zona.denumire as zona
  from Policlinica 
  join Zona on Policlinica.zona_id = Zona.id_zona;
  `;

  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const policlinici = await db.query(query);
    res.json(policlinici);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
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

  // execute query
  try {
    const policlinica = await db.query(policlinica_query);
    const policlinica_cabinete = await db.query(cabinete_query);
    const policlinica_orar = await db.query(orar_query);
    let result = {};
    result.policlinica = policlinica;
    result.cabinete = policlinica_cabinete;
    result.orar = policlinica_orar;
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: `Policlinica cu id-ul ${clinicId} nu a fost gasita in baza de date.`
    });
  } finally {
    await db.close();
  }
};