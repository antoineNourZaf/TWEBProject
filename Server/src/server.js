const express = require('express');
const cors = require('cors');
const mongoClient = require('./mongo');


class Server {
  /**
     * The constructor.
     * @param {integer} port The port to listen to if no default one is specified in ENV.
     * @param {Agent} agent The agent to interrogate.
     */
  constructor(port, agent) {
    this.app = express();
    this.app.use(cors({
      credentials: true,
      origin: true,
    }));

    this.port = port;
    this.agent = agent;


      this.app.get('/api/users', (request, result) => {
          result.setHeader('Content-Type', 'application/json');

          result.write('[');

          let prevChunk = null;

          function sendData(error, data) {
              if (error == null) {
                  if (prevChunk) {
                      result.write(`${JSON.stringify(prevChunk)},`);
                  }

                  const users = data;

                  prevChunk = { users }





              }
          }

          function endOfJson() {
              if (prevChunk) {
                  result.write(JSON.stringify(prevChunk));

              }
              result.end(']');
          }

          this.agent.getTopUsersInSwitzerland(sendData, endOfJson);
      });




      this.app.get('/api/repos', (request, result) => {
          const owner  = request.params;
          var urlDb = "mongodb://localhost:27017/";
          var languages= []
          result.setHeader('Content-Type', 'application/json');

          result.write('[');

          let prevChunk = null;

          function sendData(error, data) {
              if (error == null) {
                  if (prevChunk) {
                      result.write(`${JSON.stringify(prevChunk)},`);
                  }

                  const repos2 = data;


                  var i=0;
                  for(var language in repos2)
                  {

                      if(language=='null')
                      {
                          languages.push({name:"Others"});

                      }
                      else
                      {
                          languages.push({name:language});

                      }
                  }

                  console.log(languages);
                  mongoClient.connect(urlDb, function(err, db) {
                      if (err) throw err;
                      var dbo = db.db("SwissStats");
                      dbo.collection('Language').drop();


                      dbo.collection("Language").insertMany(languages, function(err, res) {
                          if (err) throw err;
                          console.log("language inserted");
                          db.close();
                      });
                  });


                  prevChunk = { repos2 };
              }
          }

          function endOfJson() {
              if (prevChunk) {
                  result.write(JSON.stringify(prevChunk));
              }
              result.end(']');
          }

          this.agent.getUserRepository(sendData, endOfJson);
      });


      this.app.get('/api/languages', (request, result) => {

          result.setHeader('Content-Type', 'application/json');

          result.write('[');

          let prevChunk = null;

          function sendData(error, data) {
              if (error == null) {
                  if (prevChunk) {
                      result.write(`${JSON.stringify(prevChunk)},`);
                  }

                  const languagesUsedInSwitzerland = data;


                  prevChunk = { languagesUsedInSwitzerland };
              }
          }

          function endOfJson() {
              if (prevChunk) {
                  result.write(JSON.stringify(prevChunk));
              }
              result.end(']');
          }

          this.agent.getLanguages(sendData, endOfJson);
      });


      this.app.get('/api/allrepos', (request, result) => {

          result.setHeader('Content-Type', 'application/json');

          result.write('[');

          let prevChunk = null;

          function sendData(error, data) {
              if (error == null) {
                  if (prevChunk) {
                      result.write(`${JSON.stringify(prevChunk)},`);
                  }

                  const allRepos = data;


                  prevChunk = { allRepos };
              }
          }

          function endOfJson() {
              if (prevChunk) {
                  result.write(JSON.stringify(prevChunk));
              }
              result.end(']');
          }

          this.agent.getAllRepo(sendData, endOfJson);
      });


      this.app.get('*', (request, result) => {
        result.status(404).send('Error 404 - Page not found');
    });
  }



  /**
     * Start the server.
     */
  start() {
    this.app.listen(this.port, () => {});
  }
}

module.exports = Server;
