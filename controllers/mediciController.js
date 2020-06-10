const helpers = require('../helpers')

exports.getAllMedici = async (req, res) => {
  // @todo: de adaugat optiunea de filtrare a userilor dupa nume sau specialitate
  // @todo: de adaugat optiunea de filtrare a userilor dupa nume sau specialitate

  // query database to get all the doctors
  let medici_query = "select Medic.id_medic, concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, GradProfesional.grad_profesional, SpecialitateMedicala.denumire as specialitate, Utilizator.email, Utilizator.telefon from Medic join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator join GradProfesional on Medic.id_grad = GradProfesional.id_grad join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate";

  let specialitati_query = `select id_specialitate, denumire from SpecialitateMedicala;`;

  let grade_profesionale_query = `select id_grad, grad_profesional as denumire from GradProfesional;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let medici, specialitati;

  // execute query
  try {
    medici = await db.query(medici_query);
    specialitati = await db.query(specialitati_query);
    grade_profesionale = await db.query(grade_profesionale_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    res.render('medici_list', {
      medici: medici,
      specialitati: specialitati,
      grade_profesionale: grade_profesionale
    });
  }
}

exports.addMedicView = async (req, res) => {
  let specialitati_query = `select id_specialitate, denumire from SpecialitateMedicala;`;

  let grade_profesionale_query = `select id_grad, grad_profesional as denumire from GradProfesional;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let specialitati, grade_profesionale;

  try {
    specialitati = await db.query(specialitati_query);
    grade_profesionale = await db.query(grade_profesionale_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect('/medici');
  } finally {
    await db.close();
    res.render('medici_add', {
      title: `Adaugarea unui nou medic`,
      specialitati: specialitati,
      grade_profesionale: grade_profesionale
    });
  }
}

exports.editMedic = async (req, res) => {
  let doctorId = req.params.id;
  // query database to get the doctor
  let single_medic_query = `select Utilizator.id_utilizator, Utilizator.nume, Utilizator.prenume, Utilizator.nume_utilizator, GradProfesional.grad_profesional, 
  SpecialitateMedicala.denumire as specialitate, Utilizator.email, Utilizator.telefon
  from Medic 
  join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator
  join GradProfesional on Medic.id_grad = GradProfesional.id_grad
  join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate
  where Medic.id_medic = ${doctorId};`;

  let specialitati_query = `select id_specialitate, denumire from SpecialitateMedicala;`;

  let grade_profesionale_query = `select id_grad, grad_profesional as denumire from GradProfesional;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let medic;

  // execute query
  try {
    medic = await db.query(single_medic_query);
    specialitati = await db.query(specialitati_query);
    grade_profesionale = await db.query(grade_profesionale_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect(`/medici/${doctorId}`);
  } finally {
    await db.close();
    res.render('medici_edit', {
      title: `Editarea medicului ${medic[0].nume} ${medic[0].prenume}`,
      medic: medic[0],
      specialitati: specialitati,
      grade_profesionale: grade_profesionale
    });
  }
}

exports.programareMedicView = async (req, res) => {
  let doctorId = req.params.id,
    single_medic_query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume,
  GradProfesional.grad_profesional, 
  SpecialitateMedicala.denumire as specialitate, 
  Utilizator.email, Utilizator.telefon
  from Medic 
  join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator
  join GradProfesional on Medic.id_grad = GradProfesional.id_grad
  join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate
  where Medic.id_medic = ${doctorId};`,
    locatii_query = `select distinct 
    Cabinet.id_cabinet, Cabinet.denumire as cabinet, Policlinica.id_policlinica as link_policlinica_id, Policlinica.denumire as policlinica
    from OrarMedic 
    join Cabinet on Cabinet.id_cabinet = OrarMedic.id_cabinet
    join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
    where id_medic = ${doctorId};`,
    orar_query = `select OrarMedic.id_orar, OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit, 
  Cabinet.denumire as cabinet, Policlinica.id_policlinica as link_policlinica_id, Policlinica.denumire as policlinica
  from OrarMedic 
  join Cabinet on Cabinet.id_cabinet = OrarMedic.id_cabinet
  join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
  where id_medic = ${doctorId};`,
    servicii_medic_query = `select 
    serviciuMedical.id_serviciu, serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
  from Medic
  join serviciuMedical on Medic.id_specialitate = serviciuMedical.id_specialitate
  where Medic.id_medic = ${doctorId};`;


  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let medic, locatii, orar, servicii_medicale;

  // execute query
  try {
    medic = await db.query(single_medic_query);
    locatii = await db.query(locatii_query);
    orar = await db.query(orar_query);
    servicii_medicale = await db.query(servicii_medic_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect(`/medici/${doctorId}`);
  } finally {
    await db.close();
    res.render('medic_programare', {
      medic: medic[0],
      locatii,
      orar,
      servicii_medicale
    });
  }
}

exports.getSingleMedic = async (req, res) => {
  let doctorId = req.params.id;
  // query database to get the doctor
  let single_medic_query = `select Medic.id_medic, Utilizator.id_utilizator, concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, GradProfesional.grad_profesional, 
  SpecialitateMedicala.denumire as specialitate, Utilizator.email, Utilizator.telefon
  from Medic 
  join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator
  join GradProfesional on Medic.id_grad = GradProfesional.id_grad
  join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate
  where Medic.id_medic = ${doctorId};`
  let orar_medic_query = `select
  OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit,
  Cabinet.denumire as cabinet,
  Policlinica.denumire as policlinica
  from Medic 
  join OrarMedic on Medic.id_medic = OrarMedic.id_medic
  join Cabinet on OrarMedic.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
  where Medic.id_medic = ${doctorId}
  ORDER BY FIELD(OrarMedic.ziua_saptamanii, 'Luni','Marti','Miercuri','Joi','Vineri', 'Sambata');`;
  let servicii_medic_query = `select 
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
  from Medic
  join serviciuMedical on Medic.id_specialitate = serviciuMedical.id_specialitate
  where Medic.id_medic = ${doctorId};`;
  let medic_programari_query = `select 
  Programare.moment_programare, Programare.durata, Programare.id_programare as programare_link_id, Programare.status_programare, Cabinet.denumire as cabinet, 
  Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu,
  SpecialitateMedicala.denumire as specialitate
  from Medic 
  join Programare on Programare.id_medic = Medic.id_medic
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  where Medic.id_medic = ${doctorId} order by Programare.moment_programare DESC;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let medic, orar, servicii_medicale, programari_medic;

  // execute query
  try {
    medic = await db.query(single_medic_query);
    orar = await db.query(orar_medic_query);
    servicii_medicale = await db.query(servicii_medic_query);
    programari_medic = await db.query(medic_programari_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    if (medic.length == 0) {
      req.flash('error', 'Medicul cautat nu este in baza de date.');
      res.redirect('/medici');
    } else {
      res.render('medic_single', {
        medic,
        orar,
        servicii_medicale,
        programari_medic
      });
    }

  }

}

exports.addMedic = async (req, res) => {
  // @todo: validare nume, prenume, grad_profesional, specialitate, email, telefon, salariu, data_angajarii din frontend inainte de a ajunge in backend ..
  // @todo: adaugarea programului medicului din acest view - cabinetele de specialitatea sa care au ferestre de program deschise
  // @todo: verificare daca nume_utilizator este deja folosit

  // res.json(req.body);
  let nume = req.body.nume,
    prenume = req.body.prenume,
    nume_utilizator = req.body.nume_utilizator,
    parola = req.body.parola,
    email = req.body.email,
    telefon = req.body.telefon,
    grad_profesional = req.body.grad_profesional,
    specialitate = req.body.specialitate;
  // salariu = req.body.salariu,
  // data_angajarii = req.body.data_angajarii;

  // validate information
  req.checkBody('nume', 'Campul de nume este obligatoriu').notEmpty();
  req.checkBody('prenume', 'Campul de prenume este obligatoriu.').notEmpty();
  req.checkBody('nume_utilizator', 'Campul de nume utilizator este obligatoriu.').notEmpty();
  req.checkBody('parola', 'Parola trebuie sa fie de minim 8 caractere.').isLength({
    min: 8
  });
  req.checkBody('email', 'Introduceti o adresa de email valid.').isEmail();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('/medici/add');
  }

  let check_duplicate_query = ``;
  let insert_utilizator_query = `insert into Utilizator(nume, prenume, email, telefon, nume_utilizator, parola_criptata, id_rol) values ('${nume}', '${prenume}', '${email}', '${telefon}', '${nume_utilizator}', '${parola}', 4);`;
  let insert_medic_query = `insert into Medic(id_grad, id_specialitate, id_utilizator) values ('${grad_profesional}', '${specialitate}', (select id_utilizator from Utilizator where nume_utilizator = '${nume_utilizator}'))`;
  let medic_id_query = `select id_medic from Medic order by id_medic desc limit 1`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let medic_id;

  // execute query
  try {
    const insert_utilizator = await db.query(insert_utilizator_query);
    const insert_medic = await db.query(insert_medic_query);
    medic_id = await db.query(medic_id_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect('/medici/add');
  } finally {
    await db.close();
    req.flash('success', `Medicul ${nume} ${prenume} a fost adaugat cu succes in baza de date.`);
    res.redirect(`/medici/${medic_id[0].id_medic}`);
  }

}

exports.updateMedic = async (req, res) => {
  let doctorId = req.params.id,
    utilizatorId = req.body.id_utilizator,
    nume = req.body.nume,
    prenume = req.body.prenume,
    nume_utilizator = req.body.nume_utilizator,
    parola = req.body.parola,
    grad_profesional = req.body.grad_profesional,
    specialitate = req.body.specialitate,
    email = req.body.email,
    telefon = req.body.telefon;
  // salariu = req.body.salariu,
  // data_angajarii = req.body.data_angajarii;

  // validate information
  req.checkBody('nume', 'Campul de nume este obligatoriu').notEmpty();
  req.checkBody('prenume', 'Campul de prenume este obligatoriu.').notEmpty();
  req.checkBody('nume_utilizator', 'Campul de nume utilizator este obligatoriu.').notEmpty();
  // req.checkBody('parola', 'Parola trebuie sa fie de minim 8 caractere.').isLength({
  //   min: 8
  // });
  req.checkBody('email', 'Introduceti o adresa de email valid.').isEmail();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect(`/medici/${doctorId}/edit`);
  }

  let update_utilizator_query = `update Utilizator set nume = '${nume}', prenume = '${prenume}', email = '${email}', telefon = '${telefon}', nume_utilizator = '${nume_utilizator}' where id_utilizator = ${utilizatorId}`,
    update_utilizator_pass = `update Utilizator set parola_criptata = ${parola} where id_utilizator = ${utilizatorId}`,
    update_medic_query = `update Medic set id_grad = ${grad_profesional}, id_specialitate = ${specialitate} where id_medic = ${doctorId}`;


  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let medic;

  // execute query
  try {
    const update_utilizator = await db.query(update_utilizator_query);
    const update_medic = await db.query(update_medic_query);
    // @todo: update_utilizator_pass;
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect(`/medici/${doctorId}/edit`);
  } finally {
    await db.close();
    req.flash('success', `Medicul ${nume} ${prenume} a fost actualizat cu succes in baza de date.`);
    res.redirect(`/medici/${doctorId}`);
  }

}

exports.programareMedic = async (req, res) => {
  // res.json(req.body);
  //  @todo: dupa duplicat programarea inainte de a face insert in db
  //  @todo: de validate data si ora de programare (daca sunt in programul medicului si daca medicul nu are alte programari)

  let doctorId = req.params.id,
    pacientId = req.body.id_pacient,
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
    return res.redirect(`/medici/${doctorId}/programare`);
  }

  let check_duplicate_query = ``;
  let insert_programare_query = `insert into Programare (id_pacient, id_medic, id_cabinet, id_serviciu, moment_programare, durata, status_programare) values('${pacientId}', '${doctorId}', (select id_cabinet from OrarMedic where id_orar = ${orar_medic_id}), '${serviciu_medical_id}', '${data_programare} ${ora_programare}', (select durata_maxima from serviciuMedical where id_serviciu = ${serviciu_medical_id}), 'activa');`;
  let programare_id_query = `select id_programare from Programare order by id_programare desc limit 1`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let programare_id;

  // execute query
  try {
    const insert_programare = await db.query(insert_programare_query);
    programare_id = await db.query(programare_id_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map(err => err.msg));
    return res.redirect(`/medici/${doctorId}/programare`);
  } finally {
    await db.close();
    req.flash('success', `Programarea a fost adaugata cu succes in baza de date.`);
    res.redirect(`/programari/${programare_id[0].id_programare}`);
  }
}

exports.deleteMedic = async (req, res) => {
  // @todo: POST DELETE trigger from DB not from backend
  let doctorId = req.params.id,
    nume_medic = req.body.nume_medic,
    utilizatorId = req.body.id_utilizator,
    delete_orar_query = `DELETE FROM OrarMedic WHERE id_medic = ${doctorId}`,
    delete_programari_query = `DELETE FROM Programare WHERE id_medic = ${doctorId}`,
    delete_medic_query = `DELETE FROM Medic WHERE id_medic = ${doctorId}`,
    delete_utilizator_query = `DELETE FROM Utilizator WHERE id_utilizator = ${utilizatorId}`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  try {
    const delete_orar = await db.query(delete_orar_query);
    const delete_programari = await db.query(delete_programari_query);
    const delete_medic = await db.query(delete_medic_query);
    const delete_utilizator = await db.query(delete_utilizator_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect('/medici/');
  } finally {
    await db.close();
    req.flash('success', `Medicul ${nume_medic} a fost sters cu succes din baza de date.`);
    res.redirect('/medici/');
  }

}