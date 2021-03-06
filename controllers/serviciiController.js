const helpers = require('../helpers');

exports.getAllServicii = async (req, res) => {
  // query database to get all the doctors
  let query = `select serviciuMedical.id_serviciu as link_serviciu_id, serviciuMedical.denumire_serviciu, SpecialitateMedicala.denumire as specialitate_medicala, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
  from serviciuMedical
  join SpecialitateMedicala on serviciuMedical.id_specialitate = SpecialitateMedicala.id_specialitate;`;

  // create db connection
  const db = helpers.makeDb(helpers.db_config);
  let servicii;

  // execute query
  try {
    servicii = await db.query(query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    res.render('servicii_list', {
      servicii: servicii
    });
  }
};

exports.getSingleServiciu = async (req, res) => {
  let serviciuId = req.params.id;
  // query database to get the doctor
  let serviciu_query = `select serviciuMedical.id_serviciu as link_serviciu_id, serviciuMedical.denumire_serviciu, SpecialitateMedicala.denumire as specialitate_medicala, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
  from serviciuMedical
  join SpecialitateMedicala on serviciuMedical.id_specialitate = SpecialitateMedicala.id_specialitate
  where serviciuMedical.id_serviciu = ${serviciuId};`;
  let medici_serivciu_query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume,
  GradProfesional.grad_profesional,
  Medic.id_medic as link_medic_id
  from Medic
  join GradProfesional on Medic.id_grad = GradProfesional.id_grad
  join Utilizator on Utilizator.id_utilizator = Medic.id_utilizator
  join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate 
  join serviciuMedical on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  where serviciuMedical.id_serviciu = ${serviciuId};`;
  let cabinete_serviciu_query = `select Cabinet.denumire, Policlinica.denumire as policlinica, Policlinica.id_policlinica as link_policlinica_id, Zona.denumire as zona
  from Cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  join Zona on Policlinica.zona_id = Zona.id_zona
  join SpecialitateMedicala on Cabinet.id_specialitate = SpecialitateMedicala.id_specialitate 
  join serviciuMedical on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  where serviciuMedical.id_serviciu = ${serviciuId};`;
  let asigurare_serviciu_query = `select asigurareMedicala.denumire as asigurare, asigurareMedicala.id_asigurare as link_asigurare_id, discountServMed.procent_discount
  from serviciuMedical
  join discountServMed on serviciuMedical.id_serviciu = discountServMed.id_serviciu
  join asigurareMedicala on discountServMed.id_asigurare = asigurareMedicala.id_asigurare
  where serviciuMedical.id_serviciu = ${serviciuId};`;


  // execute query
  const db = helpers.makeDb(helpers.db_config);
  let serviciu, medici_serivciu, cabinete_serviciu, asigurare_serviciu;

  // execute query
  try {
    serviciu = await db.query(serviciu_query);
    medici_serivciu = await db.query(medici_serivciu_query);
    cabinete_serviciu = await db.query(cabinete_serviciu_query);
    asigurare_serviciu = await db.query(asigurare_serviciu_query);
  } catch (err) {
    console.log(err);
    req.flash('error', err.map((err) => err.msg));
    res.redirect('/');
  } finally {
    await db.close();
    if (serviciu.length == 0) {
      req.flash('error', 'Serviciul cautat nu este in baza de date.');
      res.redirect('/servicii');
    } else {
      res.render('serviciu_single', {
        serviciu: serviciu[0],
        medici_serivciu: medici_serivciu,
        cabinete_serviciu: cabinete_serviciu,
        asigurare_serviciu: asigurare_serviciu
      });
    }
  }
}