const helpers = require('../helpers');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(authenticate))

function authenticate(email, password, done) {
  let query = `select nume, prenume, id_utilizator from Utilizator where nume_utilizator = ${email} and parola_criptata = ${password}`;

  // create db connection
  const db = helpers.makeDb(helpers.db_config);

  // execute query
  try {
    const utilizator = await db.query(query);
    res.json(utilizator);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  } finally {
    await db.close();
  }

  db("users")
    .where("email", email)
    .first()
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: "invalid user and password combination"
        })
      }

      done(null, user)
    }, done)
}