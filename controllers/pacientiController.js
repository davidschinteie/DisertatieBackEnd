const helpers = require('../helpers');
const bcrypt = require("bcrypt")

exports.getAllPacienti = async (req, res) => {
  // query database to get all the doctors
  let query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Utilizator.email, Utilizator.telefon,
  Zona.denumire as zona,
  asigurareMedicala.denumire as asigurare,
  Pacient.id_pacient
  from Pacient 
  join Utilizator on Pacient.id_utilizator = Utilizator.id_utilizator
  join Zona on Pacient.id_zona = Zona.id_zona
  join asigurareMedicala on Pacient.id_asigurare = asigurareMedicala.id_asigurare;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let pacienti;

  // execute query
  try {
    pacienti = await db.query(query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    res.render('pacienti_list', {
      pacienti: pacienti
    });
  }
};

exports.getSinglePacient = async (req, res) => {
  let pacientId = req.params.id;
  // query database to get the doctor
  let single_pacient_query = `select Pacient.id_pacient, Utilizator.id_utilizator, concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Utilizator.email, Utilizator.telefon,
  Zona.denumire as zona,
  asigurareMedicala.denumire as asigurare
  from Pacient 
  join Utilizator on Pacient.id_utilizator = Utilizator.id_utilizator
  join Zona on Pacient.id_zona = Zona.id_zona
  join asigurareMedicala on Pacient.id_asigurare = asigurareMedicala.id_asigurare
  where Pacient.id_pacient = ${pacientId};`;
  let servicii_asigurare_query = `select 
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, SpecialitateMedicala.denumire as specialitate, 
  discountServMed.procent_discount as discount
  from Pacient 
  join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare
  join serviciuMedical on discountServMed.id_serviciu = serviciuMedical.id_serviciu
  join SpecialitateMedicala on serviciuMedical.id_specialitate = SpecialitateMedicala.id_specialitate
  where Pacient.id_pacient = ${pacientId};`;
  let donator_query = `select 
  Donator.grupa_sanguina, Donator.data_ultimei_donari, Donator.numar_donari
  from Pacient 
  join Donator on Pacient.id_pacient = Donator.id_pacient
  where Pacient.id_pacient = ${pacientId};`;
  let programari_query = `select 
  Programare.moment_programare, Programare.durata, Programare.status_programare, Programare.id_medic, Programare.id_programare, concat(Utilizator.nume, ' ', Utilizator.prenume) as medic, Cabinet.denumire as cabinet, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu,
  discountServMed.procent_discount as discount,
  SpecialitateMedicala.denumire as specialitate
  from Pacient
  join Programare on Programare.id_pacient = Pacient.id_pacient
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare and Programare.id_serviciu = discountServMed.id_serviciu
  join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  join Medic on Programare.id_medic = Medic.id_medic
  join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator
  where Pacient.id_pacient = ${pacientId};`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let single_pacient, donator, servicii_asigurare, programari;

  // execute query
  try {
    single_pacient = await db.query(single_pacient_query);
    donator = await db.query(donator_query);
    servicii_asigurare = await db.query(servicii_asigurare_query);
    programari = await db.query(programari_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    if (single_pacient.length == 0) {
      req.flash('error', 'Pacientul cautat nu este in baza de date.');
      res.redirect('/pacienti');
    } else {
      res.render('pacient_single', {
        pacient: single_pacient,
        donator: donator[0],
        programari: programari,
        servicii_asigurare: servicii_asigurare
      });
    }
  }
};

exports.addPacientView = async (req, res) => {
  let asigurari_query = `select id_asigurare, denumire from asigurareMedicala;`,
    zona_query = `select id_zona, denumire from Zona;`,
    grupe_query = `select distinct grupa_sanguina from Donator ORDER BY FIELD(grupa_sanguina, '0_I pozitiv','0_I negativ','A_II pozitiv','A_II negativ','B_III pozitiv', 'B_III negativ', 'AB_IV pozitiv', 'AB_IV negativ');`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let asigurari, zone, grupe;

  try {
    asigurari = await db.query(asigurari_query);
    zone = await db.query(zona_query);
    grupe = await db.query(grupe_query);
  } catch (err) {
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/pacienti');
  } finally {
    await db.close();
    res.render('pacient_add', {
      title: `Adaugarea unui nou pacient`,
      asigurari: asigurari,
      zone: zone,
      grupe: grupe
    });
  }
};

exports.newPacientView = async (req, res) => {
  let asigurari_query = `select id_asigurare, denumire from asigurareMedicala;`,
    zona_query = `select id_zona, denumire from Zona;`,
    grupe_query = `select distinct grupa_sanguina from Donator ORDER BY FIELD(grupa_sanguina, '0_I pozitiv','0_I negativ','A_II pozitiv','A_II negativ','B_III pozitiv', 'B_III negativ', 'AB_IV pozitiv', 'AB_IV negativ');`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let asigurari, zone, grupe;

  try {
    asigurari = await db.query(asigurari_query);
    zone = await db.query(zona_query);
    grupe = await db.query(grupe_query);
  } catch (err) {
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/pacienti');
  } finally {
    await db.close();
    res.render('pacient_add', {
      title: `Crearea unui cont nou`,
      subtitle: 'Pentru a crea un cont nou, introdu datele tale in formularul de mai jos',
      asigurari: asigurari,
      zone: zone,
      grupe: grupe
    });
  }
};

exports.addPacient = async (req, res) => {
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
    asigurare = req.body.asigurare,
    zona = req.body.zona,
    data_nasterii = req.body.data_nasterii,
    grupa_sanguina = req.body.grupa_sanguina,
    data_ultimei_donari = req.body.data_ultimei_donari;

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
    req.flash('errors', errors.map((err) => err.msg));
    return res.redirect('/pacienti/add');
  }

  bcrypt.hash(parola, 10, async (err, hash) => {
    let check_duplicate_query = `select * from Utilizator where nume_utilizator = '${nume_utilizator}';`,
      insert_utilizator_query = `insert into Utilizator(nume, prenume, email, telefon, nume_utilizator, parola_criptata, id_rol) values ('${nume}', '${prenume}', '${email}', '${telefon}', '${nume_utilizator}', '${hash}', 3);`,
      insert_pacient_query = `insert into Pacient(data_nasterii, id_zona, id_asigurare, id_utilizator) values ('${data_nasterii}', '${zona}', '${asigurare}', (select id_utilizator from Utilizator where nume_utilizator = '${nume_utilizator}'))`,
      insert_donator_query = `insert into Donator (grupa_sanguina, data_ultimei_donari, id_pacient) values ('${grupa_sanguina}', '${data_ultimei_donari}', (select id_pacient from Pacient order by id_pacient desc limit 1));`,
      pacient_id_query = `select id_pacient from Pacient order by id_pacient desc limit 1;`;

    // execute query
    const db = helpers.makeDb(helpers.db_config);
    let pacient_id;

    // execute query
    try {
      const check_duplicate = await db.query(check_duplicate_query);
      if (check_duplicate.length !== 0) {
        await db.close();
        req.flash('error', `Utilizatorul ${nume_utilizator} exista deja in baza de date!`);
        res.redirect('/pacienti/add');
        throw new Error(`Utilizatorul ${nume_utilizator} exista deja in baza de date!`);
      }
      const insert_utilizator = await db.query(insert_utilizator_query);
      const insert_pacient = await db.query(insert_pacient_query);
      pacient_id = await db.query(pacient_id_query);
      // console.log(pacient_id);

      if (grupa_sanguina && data_ultimei_donari) {
        insert_donator = await db.query(insert_donator_query);
      }
    } catch (err) {
      console.log(err);
      req.flash('error', err.map((err) => err.msg));
      res.redirect('/pacienti/add');
    } finally {
      await db.close();
      req.flash('success', `Pacientul ${nume} ${prenume} a fost adaugat cu succes in baza de date.`);
      res.redirect(`/pacienti/${pacient_id[0].id_pacient}`);
    }
  })

};

exports.inregistrarePacient = async (req, res) => {
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
    asigurare = req.body.asigurare,
    zona = req.body.zona,
    data_nasterii = req.body.data_nasterii,
    grupa_sanguina = req.body.grupa_sanguina,
    data_ultimei_donari = req.body.data_ultimei_donari;

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
    req.flash('errors', errors.map((err) => err.msg));
    return res.redirect('/pacienti/inregistrare');
  }

  bcrypt.hash(parola, 10, async (err, hash) => {
    let check_duplicate_query = `select * from Utilizator where nume_utilizator = '${nume_utilizator}';`,
      insert_utilizator_query = `insert into Utilizator(nume, prenume, email, telefon, nume_utilizator, parola_criptata, id_rol) values ('${nume}', '${prenume}', '${email}', '${telefon}', '${nume_utilizator}', '${hash}', 3);`,
      insert_pacient_query = `insert into Pacient(data_nasterii, id_zona, id_asigurare, id_utilizator) values ('${data_nasterii}', '${zona}', '${asigurare}', (select id_utilizator from Utilizator where nume_utilizator = '${nume_utilizator}'))`,
      insert_donator_query = `insert into Donator (grupa_sanguina, data_ultimei_donari, id_pacient) values ('${grupa_sanguina}', '${data_ultimei_donari}', (select id_pacient from Pacient order by id_pacient desc limit 1));`,
      pacient_query = `select id_pacient from Pacient order by id_pacient desc limit 1;`;
    let utilizator_query = `select * from Utilizator where nume_utilizator = '${nume_utilizator}';`;

    // execute query
    const db = helpers.makeDb(helpers.db_config);
    let pacient_id, utilizator_response;

    // execute query
    try {
      const check_duplicate = await db.query(check_duplicate_query);
      if (check_duplicate.length !== 0) {
        await db.close();
        req.flash('error', `Utilizatorul ${nume_utilizator} exista deja in baza de date!`);
        res.redirect('/pacienti/inregistrare');
        throw new Error(`Utilizatorul ${nume_utilizator} exista deja in baza de date!`);
      }
      const insert_utilizator = await db.query(insert_utilizator_query);
      const insert_pacient = await db.query(insert_pacient_query);
      pacient = await db.query(pacient_query);
      // console.log(pacient_id);
      utilizator_response = await db.query(utilizator_query);

      if (grupa_sanguina && data_ultimei_donari) {
        insert_donator = await db.query(insert_donator_query);
      }
    } catch (err) {
      console.log(err);
      req.flash('error', err.map((err) => err.msg));
      res.redirect('/pacienti/inregistrare');
    } finally {
      await db.close();
      req.session.utilizatorId = utilizator_response[0].id_utilizator;
      req.session.utilizator = utilizator_response[0];
      req.session.pacient = pacient[0];
      // req.session.programari = programari_pacient;
      req.flash('success', `Buna ${nume} ${prenume}, ai fost adaugat cu succes in baza de date.`);
      res.redirect(`/pacienti/${pacient[0].id_pacient}`);
    }
  })

};

exports.editPacient = async (req, res) => {
  let pacientId = req.params.id,
    single_pacient_query = `select Utilizator.id_utilizator, Utilizator.nume, Utilizator.prenume, Utilizator.nume_utilizator, Utilizator.email, Utilizator.telefon,
    Pacient.data_nasterii,
    Zona.denumire as zona,
    Zona.id_zona,
    asigurareMedicala.denumire as asigurare,
    Donator.grupa_sanguina,
    Donator.data_ultimei_donari
    from Pacient 
    join Utilizator on Pacient.id_utilizator = Utilizator.id_utilizator
    join Zona on Pacient.id_zona = Zona.id_zona
    join asigurareMedicala on Pacient.id_asigurare = asigurareMedicala.id_asigurare
    left join Donator on Pacient.id_pacient = Donator.id_pacient
    where Pacient.id_pacient = ${pacientId};`,
    asigurari_query = `select id_asigurare, denumire from asigurareMedicala;`,
    zona_query = `select id_zona, denumire from Zona;`,
    grupe_query = `select distinct grupa_sanguina from Donator ORDER BY FIELD(grupa_sanguina, '0_I pozitiv','0_I negativ','A_II pozitiv','A_II negativ','B_III pozitiv', 'B_III negativ', 'AB_IV pozitiv', 'AB_IV negativ');`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  let pacient, asigurari, zone, grupe;

  // execute query
  try {
    pacient = await db.query(single_pacient_query);
    asigurari = await db.query(asigurari_query);
    zone = await db.query(zona_query);
    grupe = await db.query(grupe_query);
  } catch (err) {
    req.flash('error', err.map((err) => err.msg));
    res.redirect(`/pacienti/${pacientId}`);
  } finally {
    await db.close();
    res.render('pacient_edit', {
      title: `Editarea pacientului ${pacient[0].nume} ${pacient[0].prenume}`,
      pacient: pacient[0],
      asigurari: asigurari,
      zone: zone,
      grupe: grupe
    });
  }
};

exports.updatePacient = async (req, res) => {
  // res.json(req.body);
  let pacientId = req.params.id,
    utilizatorId = req.body.id_utilizator,
    nume = req.body.nume,
    prenume = req.body.prenume,
    nume_utilizator = req.body.nume_utilizator,
    parola = req.body.parola,
    email = req.body.email,
    telefon = req.body.telefon,
    asigurare = req.body.asigurare,
    zona = req.body.zona,
    data_nasterii = req.body.data_nasterii,
    grupa_sanguina = req.body.grupa_sanguina,
    data_ultimei_donari = req.body.data_ultimei_donari;

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
    res.redirect(`/pacienti/${pacientId}/edit`);
  }

  bcrypt.hash(parola, 10, async (err, hash) => {
    let check_duplicate_query = ``,
      update_utilizator_query = `update Utilizator set nume = '${nume}', prenume = '${prenume}', email = '${email}', telefon = '${telefon}', nume_utilizator = '${nume_utilizator}' where id_utilizator = ${utilizatorId}`,
      update_utilizator_pass_query = `update Utilizator set parola_criptata = '${hash}' where id_utilizator = ${utilizatorId}`,
      update_pacient_query = `update Pacient set data_nasterii = '${data_nasterii}', id_zona = '${zona}', id_asigurare = '${asigurare}' where id_pacient = ${pacientId}`,
      update_donator_query = `update Donator set grupa_sanguina = '${grupa_sanguina}', data_ultimei_donari = '${data_ultimei_donari}' where id_pacient = ${pacientId}`;

    // execute query
    const db = helpers.makeDb(helpers.db_config);
    let pacient;

    // execute query
    try {
      const update_utilizator = await db.query(update_utilizator_query);
      const update_pacient = await db.query(update_pacient_query);

      if (grupa_sanguina && data_ultimei_donari) {
        const update_donator = await db.query(update_donator_query);
      }

      if (parola.length) {
        const update_utilizator_pass = await db.query(update_utilizator_pass_query);
      }
    } catch (err) {
      console.log(err);
      req.flash('error', err.map((err) => err.msg));
      res.redirect(`/pacienti/${pacientId}/edit`);
    } finally {
      await db.close();
      req.flash('success', `Pacientul ${nume} ${prenume} a fost actualizat cu succes in baza de date.`);
      res.redirect(`/pacienti/${pacientId}`);
    }
  })

}

exports.deletePacient = async (req, res) => {
  // @todo: POST DELETE trigger from DB not from backend
  let pacientId = req.params.id,
    nume_pacient = req.body.nume_pacient,
    utilizatorId = req.body.id_utilizator,
    delete_programari_query = `DELETE FROM Programare WHERE id_pacient = ${pacientId};`,
    delete_donator_query = `DELETE FROM Donator WHERE id_pacient = ${pacientId};`,
    delete_pacient_query = `DELETE FROM Pacient WHERE id_pacient = ${pacientId};`,
    delete_utilizator_query = `DELETE FROM Utilizator WHERE id_utilizator = ${utilizatorId};`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);
  try {
    const delete_programari = await db.query(delete_programari_query);
    const delete_donator = await db.query(delete_donator_query);
    const delete_pacient = await db.query(delete_pacient_query);
    const delete_utilizator = await db.query(delete_utilizator_query);
  } catch (err) {
    req.flash('error', err.map(err => err.msg));
    res.redirect('/pacienti/');
  } finally {
    await db.close();
    req.flash('success', `Pacientul ${nume_pacient} a fost sters cu succes din baza de date.`);
    res.redirect('/pacienti/');
  }

}