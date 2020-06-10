const helpers = require('../helpers');

exports.getAllAsigurari = async (req, res) => {
  // query database to get all the doctors
  let query = `select * from asigurareMedicala;`;

  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const asigurari = await db.query(query);
    res.json(asigurari);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
};

exports.getSingleAsigurare = async (req, res) => {
  let asigurareId = req.params.id;
  // query database to get the doctor
  let asigurare_query = `select * from asigurareMedicala
  where id_asigurare = ${asigurareId};`;
  let serivicii_query = `select discountServMed.id_serviciu as link_serviciu_id, 
  serviciuMedical.denumire_serviciu as serviciu_medical, SpecialitateMedicala.denumire as specialitate_medicala, serviciuMedical.cost_serviciu,
  discountServMed.procent_discount 
  from discountServMed 
  join serviciuMedical on serviciuMedical.id_serviciu = discountServMed.id_serviciu
  join SpecialitateMedicala on serviciuMedical.id_specialitate = SpecialitateMedicala.id_specialitate 
  join asigurareMedicala on asigurareMedicala.id_asigurare = discountServMed.id_asigurare
  where asigurareMedicala.id_asigurare = ${asigurareId};`;


  // execute query
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const asigurare = await db.query(asigurare_query);
    const serivicii = await db.query(serivicii_query);
    let result = {};
    result.asigurare = asigurare;
    result.serivicii = serivicii;
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }
}