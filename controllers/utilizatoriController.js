const helpers = require('../helpers');

exports.getAllUtilizatori = async (req, res) => {
  // query database to get all the doctors
  let query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Roluri.nume as rol, Utilizator.email, Utilizator.telefon, Utilizator.nume_utilizator, 
  Utilizator.ip_ultima_autentificare, Utilizator.invitatie_creata_la, Utilizator.invitatie_trimisa_la, Utilizator.invitatie_acceptata_la, 
  Utilizator.creat_la, Utilizator.actualizat_la
  from Utilizator
  join Roluri on Utilizator.id_rol = Roluri.id_rol`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const utilizatori = await db.query(query);
    res.json(utilizatori);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
};

exports.getSingleUtilizator = async (req, res) => {
  let userId = req.params.id;
  // query database to get the user
  let single_utilizator_query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Roluri.nume as rol, Utilizator.email, Utilizator.telefon, Utilizator.nume_utilizator, 
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
  Programare.moment_programare, Programare.durata, Programare.id_programare as programare_link_id, Cabinet.denumire, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica
  from Utilizator
  join Medic on Medic.id_utilizator = Utilizator.id_utilizator
  join Programare on Programare.id_medic = Medic.id_medic
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  where Utilizator.id_utilizator = ${userId};`;
  let donator_query = `select 
  Donator.grupa_sanguina, Donator.rh, Donator.data_ultimei_donari, Donator.numar_donari
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

  // execute query
  try {
    const single_utilizator = await db.query(single_utilizator_query);
    const permisiuni_utilizator = await db.query(permisiuni_utilizator_query);
    const specialitate_medic = await db.query(specialitate_medic_query);
    const servicii_medicale = await db.query(servicii_medicale_query);
    const orar_medic = await db.query(orar_medic_query);
    const medic_programari = await db.query(medic_programari_query);
    const donator = await db.query(donator_query);
    const pacient_programari = await db.query(pacient_programari_query);

    let result = {};
    result.utilizator = single_utilizator;
    result.permisiuni = permisiuni_utilizator;
    result.specialitate_medic = specialitate_medic;
    result.servicii_medicale = servicii_medicale;
    result.orar_medic = orar_medic;
    result.medic_programari = medic_programari;
    result.donator = donator;
    result.pacient_programari = pacient_programari;
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
}