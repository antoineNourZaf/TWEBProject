/* eslint linebreak-style: ["error", "windows"] */
const mongo = require('mongodb');
const mongoClient = require('mongodb').MongoClient;

const urlDB = 'A remplir';

// Connexion
mongoClient.connect(url)
  .then((client) => {
    const db = client.db();
    const collection = db.collection('SwissStats');
    console.log('db crée !')
    db.close();
  });
});

module.exports = mongo;
