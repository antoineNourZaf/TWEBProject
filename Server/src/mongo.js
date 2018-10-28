/* eslint linebreak-style: ["error", "windows"] */
const mongo = require('mongodb');
const mongoClient = require('mongodb').MongoClient;

const urlDB = 'A remplir';

// Connexion
mongoClient.connect(urlDB, (error, db) => {
  if (error) throw error;
  db.close();
});
