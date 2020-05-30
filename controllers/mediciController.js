const helpers = require('../helpers');

exports.getAllMedici = async (req, res) => {
  // query database to get all the doctors
  let query = "select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, GradProfesional.grad_profesional, SpecialitateMedicala.denumire as specialitate, Utilizator.email, Utilizator.telefon from Medic join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator join GradProfesional on Medic.id_grad = GradProfesional.id_grad join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate";

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const medici = await db.query(query);
    res.json(medici);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
};

exports.getSingleMedic = async (req, res) => {
  let doctorId = req.params.id;
  // query database to get the doctor
  let single_medic_query = `select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, GradProfesional.grad_profesional, 
  SpecialitateMedicala.denumire as specialitate, Utilizator.email, Utilizator.telefon
  from Medic 
  join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator
  join GradProfesional on Medic.id_grad = GradProfesional.id_grad
  join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate
  where Medic.id_medic = ${doctorId};`
  let orar_medic_query = `select
  OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit,
  Cabinet.denumire as cabinet,
  Policlinica.denumire as policlinca
  from Medic 
  join OrarMedic on Medic.id_medic = OrarMedic.id_medic
  join Cabinet on OrarMedic.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
  where Medic.id_medic = ${doctorId}
  ORDER BY FIELD(OrarMedic.ziua_saptamanii, 'Lu','Ma','Mi','Joi','Vn', 'Sa');`;
  let servicii_medic_query = `select 
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
  from Medic
  join serviciuMedical on Medic.id_specialitate = serviciuMedical.id_specialitate
  where Medic.id_medic = ${doctorId};`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const single_medic = await db.query(single_medic_query);
    const orar_medic = await db.query(orar_medic_query);
    const servicii_medic = await db.query(servicii_medic_query);
    let result = {};
    result.medic = single_medic;
    result.orar = orar_medic;
    result.servicii_medicale = servicii_medic;
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
}