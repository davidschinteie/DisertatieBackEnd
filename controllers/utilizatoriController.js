const helpers = require('../helpers')

exports.getAllUtilizatori = async (req, res) => {
  // query database to get all the doctors
  let query = `select Utilizator.id_utilizator, concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Roluri.nume as rol, Utilizator.email, Utilizator.telefon, Utilizator.nume_utilizator, 
  Utilizator.ip_ultima_autentificare, Utilizator.invitatie_creata_la, Utilizator.invitatie_trimisa_la, Utilizator.invitatie_acceptata_la, 
  Utilizator.creat_la, Utilizator.actualizat_la
  from Utilizator
  join Roluri on Utilizator.id_rol = Roluri.id_rol`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let utilizatori;

  // execute query
  try {
    utilizatori = await db.query(query);
  } catch (err) {
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    res.render('utilizatori_list', {
      utilizatori: utilizatori
    });
  }
}

exports.getSingleUtilizator = async (req, res) => {
  let userId = req.params.id;
  // query database to get the user
  let single_utilizator_query = `select Utilizator.id_utilizator, concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Roluri.nume as rol, Utilizator.email, Utilizator.telefon, Utilizator.nume_utilizator, Utilizator.numar_autentificari, 
  Utilizator.ip_ultima_autentificare, Utilizator.invitatie_creata_la, Utilizator.invitatie_trimisa_la, Utilizator.invitatie_acceptata_la, 
  Utilizator.creat_la, Utilizator.actualizat_la
  from Utilizator
  join Roluri on Utilizator.id_rol = Roluri.id_rol
  where Utilizator.id_utilizator = ${userId};`;
  let permisiuni_utilizator_query = `select 
  Permisiuni.nume
  from Utilizator
  join RoluriPermisiuni on Utilizator.id_rol = RoluriPermisiuni.id_rol
  join Permisiuni on RoluriPermisiuni.id_permisiune = Permisiuni.id_permisiune
  where Utilizator.id_utilizator = ${userId};`;
  let medic_query = `select Medic.id_medic from Medic 
  join Utilizator on Utilizator.id_utilizator = Medic.id_utilizator
  where Utilizator.id_utilizator = ${userId};`;
  let pacient_query = `select Pacient.id_pacient from Pacient 
  join Utilizator on Utilizator.id_utilizator = Pacient.id_utilizator
  where Utilizator.id_utilizator = ${userId};`;
  let specialitate_medic_query = `select Roluri.nume as rol, GradProfesional.grad_profesional, SpecialitateMedicala.denumire as specialitate
  from Utilizator
  join Roluri on Utilizator.id_rol = Roluri.id_rol
  join Medic on Medic.id_utilizator = Utilizator.id_utilizator
  join GradProfesional on Medic.id_grad = GradProfesional.id_grad
  join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate
  where Utilizator.id_utilizator = ${userId};`;
  let orar_medic_query = `select
  OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit,
  Cabinet.denumire as cabinet,
  Policlinica.denumire as policlinca
  from Utilizator 
  join Medic on Medic.id_utilizator = Utilizator.id_utilizator
  join OrarMedic on Medic.id_medic = OrarMedic.id_medic
  join Cabinet on OrarMedic.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
  where Utilizator.id_utilizator = ${userId}
  ORDER BY FIELD(OrarMedic.ziua_saptamanii, 'Lu','Ma','Mi','Joi','Vn', 'Sa')`;
  let servicii_medicale_query = `select 
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
  from Utilizator
  join Medic on Medic.id_utilizator = Utilizator.id_utilizator
  join serviciuMedical on Medic.id_specialitate = serviciuMedical.id_specialitate
  where Utilizator.id_utilizator = ${userId};`;
  let medic_programari_query = `select 
  Programare.moment_programare, Programare.durata, Programare.id_programare as programare_link_id, Cabinet.denumire, 
  Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu,
  SpecialitateMedicala.denumire as specialitate
  from Utilizator
  join Medic on Medic.id_utilizator = Utilizator.id_utilizator
  join Programare on Programare.id_medic = Medic.id_medic
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  where Utilizator.id_utilizator = ${userId};`;
  let donator_query = `select 
  Donator.grupa_sanguina, Donator.data_ultimei_donari, Donator.numar_donari
  from Utilizator
  join Pacient on Pacient.id_utilizator = Utilizator.id_utilizator
  join Donator on Pacient.id_pacient = Donator.id_pacient
  where Utilizator.id_utilizator = ${userId};`;
  let pacient_programari_query = `select 
  Programare.moment_programare, Programare.durata, Programare.id_programare as programare_link_id, Cabinet.denumire, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu,
  discountServMed.procent_discount as discount,
  SpecialitateMedicala.denumire as specialitate
  from Utilizator
  join Pacient on Pacient.id_utilizator = Utilizator.id_utilizator
  join Programare on Programare.id_pacient = Pacient.id_pacient
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare and Programare.id_serviciu = discountServMed.id_serviciu
  join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  where Utilizator.id_utilizator = ${userId};`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let single_utilizator, permisiuni_utilizator, programari, profil_id;

  // execute query
  try {
    single_utilizator = await db.query(single_utilizator_query);
    permisiuni_utilizator = await db.query(permisiuni_utilizator_query);
    const medic = await db.query(medic_query);
    const pacient = await db.query(pacient_query);
    if (medic.length !== 0) {
      profil_id = medic[0].id_medic;
      programari = await db.query(medic_programari_query);
    } else if (pacient.length !== 0) {
      profil_id = pacient[0].id_pacient;
      programari = await db.query(pacient_programari_query);;
    }
  } catch (err) {
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    if (single_utilizator.length == 0) {
      req.flash('error', 'Utilizatorul cautat nu este in baza de date.');
      res.redirect('/utilizatori');
    } else {
      res.render('utilizator_single', {
        utilizator: single_utilizator,
        permisiuni: permisiuni_utilizator,
        programari: programari,
        profil_id: profil_id
      });
    }
  }
}

exports.editUtilizator = async (req, res) => {
  let utilizatorId = req.params.id;
  // query database to get the doctor
  let single_utilizator_query = `select * from Utilizator where id_utilizator = ${utilizatorId};`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let utilizator;

  // execute query
  try {
    utilizator = await db.query(single_utilizator_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect(`/utilizatori/${utilizatorId}`);
  } finally {
    await db.close();
    res.render('utilizator_edit', {
      title: `Editarea utilizatorului ${utilizator[0].nume_utilizator}`,
      utilizator: utilizator[0]
    });
  }
}

exports.updateUtilizator = async (req, res) => {
  // res.json(req.body);
  let utilizatorId = req.params.id,
    nume = req.body.nume,
    prenume = req.body.prenume,
    nume_utilizator = req.body.nume_utilizator,
    parola = req.body.parola,
    email = req.body.email,
    telefon = req.body.telefon;

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
    req.flash('errors', errors.map((err) => err.msg));
    res.redirect(`/utilizatori/${utilizatorId}/edit`);
  }

  let check_duplicate_query = ``,
    update_utilizator_query = `update Utilizator set nume = '${nume}', prenume = '${prenume}', email = '${email}', telefon = '${telefon}', nume_utilizator = '${nume_utilizator}' where id_utilizator = ${utilizatorId}`,
    update_utilizator_pass = `update Utilizator set parola_criptata = ${parola} where id_utilizator = ${utilizatorId}`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const update_utilizator = await db.query(update_utilizator_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect(`/utilizatori/${utilizatorId}/edit`);
  } finally {
    await db.close();
    req.flash('success', `Utilizatorul ${nume_utilizator} a fost actualizat cu succes in baza de date.`);
    res.redirect(`/utilizatori/${utilizatorId}`);
  }

}

exports.deleteUtilizator = async (req, res) => {
  // @todo: POST DELETE trigger from DB not from backend
  let utilizatorId = req.params.id,
    nume_utilizator = req.body.nume_utilizator,
    rol_utilizator = req.body.rol_utilizator,
    delete_programari_pacient_query = `DELETE FROM Programare WHERE id_pacient = (select id_pacient from Pacient where id_utilizator = ${utilizatorId});`,
    delete_donator_query = `DELETE FROM Donator WHERE id_pacient = (select id_pacient from Pacient where id_utilizator = ${utilizatorId});`,
    delete_pacient_query = `DELETE FROM Pacient WHERE id_utilizator = ${utilizatorId};`,
    delete_orar_query = `DELETE FROM OrarMedic WHERE id_medic = (select id_medic from Medic where id_utilizator = ${utilizatorId})`,
    delete_programari_medic_query = `DELETE FROM Programare WHERE id_medic = (select id_medic from Medic where id_utilizator = ${utilizatorId})`,
    delete_medic_query = `DELETE FROM Medic WHERE id_utilizator = ${utilizatorId}`,
    delete_utilizator_query = `DELETE FROM Utilizator WHERE id_utilizator = ${utilizatorId}`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  try {

    if (rol_utilizator == 'pacient') {
      const delete_programari_pacient = await db.query(delete_programari_pacient_query);
      const delete_donator = await db.query(delete_donator_query);
      const delete_pacient = await db.query(delete_pacient_query);
    } else if (rol_utilizator == 'medic') {
      const delete_orar = await db.query(delete_orar_query);
      const delete_programari_medic = await db.query(delete_programari_medic_query);
      const delete_medic = await db.query(delete_medic_query);
    }
    const delete_utilizator = await db.query(delete_utilizator_query);

  } catch (err) {
    console.log(err);
    req.flash('error', err.map(err => err.msg));
    res.redirect('/utilizatori/');
  } finally {
    await db.close();
    req.flash('success', `Utilizatorul ${nume_utilizator} a fost sters cu succes din baza de date.`);
    res.redirect('/utilizatori/');
  }

}