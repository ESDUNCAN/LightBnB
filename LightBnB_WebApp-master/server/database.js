const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect()
  .then(() =>
    console.log("Im connected to the database"))
  .catch((error) =>
    console.log("database error", error))


pool.query(`SELECT title FROM properties LIMIT 10;`)
  .then(response => { })
  .catch((err) =>
    console.log("error", err))


// pool.query(`SELECT * FROM users;`)
//   .then((res) =>
//     console.log(res.rows[0]))
//   .catch((err) =>
//     console.log("error", err))

/// Users


const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0]
      } else {
        return null
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;



const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id])
    .then((result) => {
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */


const addUser = function (user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message);
    });
}


exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties




const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;