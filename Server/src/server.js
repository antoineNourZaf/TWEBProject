const express = require('express');
const cors = require('cors');

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

    this.app.get('/api/languages', (request, result) => {
      result.setHeader('Content-Type', 'application/json');

      result.write('[');

      let prevChunk = null;

      function sendData(error, data) {
        if (error == null) {
          if (prevChunk) {
            result.write(`${JSON.stringify(prevChunk)},`);
          }

          const languages = Array.from(data);

          prevChunk = { languages };
        }
      }

      function endOfJson() {
        if (prevChunk) {
          result.write(JSON.stringify(prevChunk));
        }
        result.end(']');
      }

      this.agent.getLanguagesUserInSwitzerland(sendData, endOfJson);
    });



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

                  prevChunk = { users };
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


      this.app.get('/api/repos/:owner', (request, result) => {
          const owner  = request.params;
          console.log(owner);

          result.setHeader('Content-Type', 'application/json');

          result.write('[');

          let prevChunk = null;

          function sendData(error, data) {
              if (error == null) {
                  if (prevChunk) {
                      result.write(`${JSON.stringify(prevChunk)},`);
                  }

                  console.log(data);
                  const repos = data;


                  prevChunk = { repos };
              }
          }

          function endOfJson() {
              if (prevChunk) {
                  result.write(JSON.stringify(prevChunk));
              }
              result.end(']');
          }

          this.agent.getUserRepository(owner, sendData, endOfJson);
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
