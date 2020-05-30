const helpers = require('../helpers');

exports.getAllPacienti = async (req, res) => {
  // query database to get all the doctors
  let query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Utilizator.email, Utilizator.telefon,
  Zona.denumire as zona,
  asigurareMedicala.denumire as asigurare
  from Pacient 
  join Utilizator on Pacient.id_utilizator = Utilizator.id_utilizator
  join Zona on Pacient.id_zona = Zona.id_zona
  join asigurareMedicala on Pacient.id_asigurare = asigurareMedicala.id_asigurare;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const pacienti = await db.query(query);
    res.json(pacienti);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
};

exports.getSinglePacient = async (req, res) => {
  let pacientId = req.params.id;
  // query database to get the doctor
  let single_pacient_query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Utilizator.email, Utilizator.telefon,
  Zona.denumire as zona,
  asigurareMedicala.denumire as asigurare
  from Pacient 
  join Utilizator on Pacient.id_utilizator = Utilizator.id_utilizator
  join Zona on Pacient.id_zona = Zona.id_zona
  join asigurareMedicala on Pacient.id_asigurare = asigurareMedicala.id_asigurare
  where Pacient.id_pacient = ${pacientId};`;
  let servicii_asigurare_query = `select 
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, 
  discountServMed.procent_discount as discount
  from Pacient 
  join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare
  join serviciuMedical on discountServMed.id_serviciu = serviciuMedical.id_serviciu
  where Pacient.id_pacient = ${pacientId};`;
  let donator_query = `select 
  Donator.grupa_sanguina, Donator.rh, Donator.data_ultimei_donari, Donator.numar_donari
  from Pacient 
  join Donator on Pacient.id_pacient = Donator.id_pacient
  where Pacient.id_pacient = ${pacientId};`;
  let programari_query = `select 
  Programare.data_programarii, Programare.durata, concat(Utilizator.nume, ' ', Utilizator.prenume) as medic, Cabinet.denumire, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
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

  // execute query
  try {
    const single_pacient = await db.query(single_pacient_query);
    const donator = await db.query(donator_query);
    const servicii_asigurare = await db.query(servicii_asigurare_query);
    const programari = await db.query(programari_query);
    let result = {};
    result.pacient = single_pacient;
    result.donator = donator;
    result.servicii_asigurare = servicii_asigurare;
    result.programari = programari;
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
}