/* eslint linebreak-style: ["error", "windows"] */
const mongo = require('mongodb');
const mongoClient = require('mongodb').MongoClient;

const urlDB = 'mongodb://localhost:27017/SwissStats';
// Connexion
mongoClient.connect(urlDB, function(err, db) {
  if (err) throw err;
  console.log('Database created!');
  db.close();
});

console.log("Quelque chose arrive");
module.exports = mongo;
