const helpers = require('../helpers');

exports.getAllProgramari = async (req, res) => {
  // query database to get all the doctors
  let query = `select Programare.id_programare as link_programare_id, 
  serviciuMedical.denumire_serviciu as serviciu_medical,
  SpecialitateMedicala.denumire as specialitate_medicala,
  moment_programare, durata, status_programare,
  Cabinet.denumire as Cabinet, Cabinet.id_cabinet as link_cabinet_id, 
  Policlinica.denumire as Policlinica, Policlinica.id_policlinica as link_policlinica_id from Programare
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join SpecialitateMedicala on Cabinet.id_specialitate = SpecialitateMedicala.id_specialitate
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let programari;

  // execute query
  try {
    programari = await db.query(query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    res.render('programari_list', {
      programari: programari
    });
  }
};

exports.editProgramare = async (req, res) => {
  let programareId = req.params.id,
    single_programare_query = `select id_serviciu, moment_programare, id_medic, id_pacient from Programare where Programare.id_programare = ${programareId};`,
    locatii_query = `select distinct 
    Cabinet.id_cabinet, Cabinet.denumire as cabinet, Policlinica.id_policlinica as link_policlinica_id, Policlinica.denumire as policlinica
    from OrarMedic 
    join Cabinet on Cabinet.id_cabinet = OrarMedic.id_cabinet
    join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
    join Programare on Programare.id_medic = OrarMedic.id_medic
    where Programare.id_programare = ${programareId};`,
    orar_query = `select OrarMedic.id_orar, OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit, 
  Cabinet.denumire as cabinet, Policlinica.id_policlinica as link_policlinica_id, Policlinica.denumire as policlinica
  from OrarMedic 
  join Cabinet on Cabinet.id_cabinet = OrarMedic.id_cabinet
  join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
  join Programare on Programare.id_medic = OrarMedic.id_medic
  where Programare.id_programare = ${programareId};`,
    servicii_medic_query = `select 
    serviciuMedical.id_serviciu, serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
  from serviciuMedical
  join Programare on Programare.id_serviciu = serviciuMedical.id_serviciu
  where Programare.id_programare = ${programareId};`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let programare, locatii, orar, servicii_medicale;

  // execute query
  try {
    programare = await db.query(single_programare_query);
    locatii = await db.query(locatii_query);
    orar = await db.query(orar_query);
    servicii_medicale = await db.query(servicii_medic_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map(err => err.msg));
    res.redirect(`/programari/${programareId}`);
  } finally {
    await db.close();
    res.render('programare_edit', {
      programare: programare[0],
      locatii,
      orar,
      servicii_medicale
    });
  }
}

exports.getSingleProgramare = async (req, res) => {
  let programareId = req.params.id;
  // query database to get the doctor
  let programare_query = `select serviciuMedical.denumire_serviciu as serviciu_medical,
  SpecialitateMedicala.denumire as specialitate_medicala,
  moment_programare, durata, status_programare,
  Programare.id_programare,
  Cabinet.denumire as Cabinet, Cabinet.id_cabinet as link_cabinet_id, 
  Policlinica.denumire as Policlinica, Policlinica.id_policlinica as link_policlinica_id from Programare
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join SpecialitateMedicala on Cabinet.id_specialitate = SpecialitateMedicala.id_specialitate
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  where Programare.id_programare = ${programareId};`;
  let pacient_query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as pacient_programare,
  Programare.id_pacient as link_pacient_id from Programare 
  join Pacient on Programare.id_pacient = Pacient.id_pacient
  join Utilizator on Utilizator.id_utilizator = Pacient.id_utilizator
  where Programare.id_programare = ${programareId};`;
  let medic_query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as medic_programare,
  Programare.id_medic as link_medic_id from Programare 
  join Medic on Programare.id_medic = Medic.id_medic
  join Utilizator on Utilizator.id_utilizator = Medic.id_utilizator
  where Programare.id_programare = ${programareId};`;


  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let programare, pacient, medic;

  // execute query
  try {
    programare = await db.query(programare_query);
    pacient = await db.query(pacient_query);
    medic = await db.query(medic_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    if (programare.length == 0) {
      req.flash('error', 'Programarea cautata nu este in baza de date.');
      res.redirect('/programari');
    } else {
      res.render('programare_single', {
        programare: programare[0],
        pacient: pacient[0],
        medic: medic[0]
      });
    }
  }
}

exports.updateProgramare = async (req, res) => {
  // res.json(req.body);
  //  @todo: dupa duplicat programarea inainte de a face insert in db
  //  @todo: de validate data si ora de programare (daca sunt in programul medicului si daca medicul nu are alte programari)

  let programareId = req.params.id,
    pacientId = req.body.id_pacient,
    doctorId = req.body.id_medic,
    serviciu_medical_id = req.body.serviciu_medical_id,
    data_programare = req.body.data_programare,
    ora_programare = req.body.ora_programare,
    orar_medic_id = req.body.orar_medic_id;

  // let creat_la = h.moment().format('YYYY-MM-Do hh:mm:ss');

  // validate information
  req.checkBody('ora_programare', 'Campul cu ora programarii este obligatoriu.').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect(`/programari/${programareId}/edit`);
  }

  let check_duplicate_query = ``;
  let update_programare_query = `update Programare set id_pacient = '${pacientId}', id_medic = '${doctorId}', id_cabinet = (select id_cabinet from OrarMedic where id_orar = ${orar_medic_id}), id_serviciu = '${serviciu_medical_id}', moment_programare = '${data_programare} ${ora_programare}', durata = (select durata_maxima from serviciuMedical where id_serviciu = ${serviciu_medical_id}), status_programare = 'reprogramata' where id_programare = ${programareId};`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const update_programare = await db.query(update_programare_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map(err => err.msg));
    return res.redirect(`/programari/${programareId}/edit`);
  } finally {
    await db.close();
    req.flash('success', `Programarea a fost actualizata cu succes in baza de date.`);
    res.redirect(`/programari/${programareId}`);
  }
}

exports.addProgramariView = async (req, res) => {}

exports.deleteProgramare = async (req, res) => {
  // @todo: POST DELETE trigger from DB not from backend
  let programareId = req.params.id,
    delete_programare_query = `DELETE FROM Programare WHERE id_programare = ${programareId}`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  try {
    const delete_programare = await db.query(delete_programare_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map(err => err.msg));
    res.redirect('/medici/');
  } finally {
    await db.close();
    req.flash('success', `Programarea a fost stearsa cu succes din baza de date.`);
    res.redirect('/medici/');
  }
}