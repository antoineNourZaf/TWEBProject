// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const Github = require('./src/github');
const mongo = require('./src/mongo');

const client = new Github({ token: process.env.OAUTH_TOKEN });
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the client app
app.use(cors());

app.get('/users', (req, res) => {
  client.swissUsers()
    .then(user => {
      const users = user.items;
      const logins = [];
      for (let i = 0; i < users.length; i += 1) {
        logins.push(users[i].id);
      }
      res.send(users);
    })
    .catch(next);
    
  //client.getTopUsersInSwitzerland();
});

app.get('/userCount', (req, res, next) => {
  client.swissUsers()
    .then(user => res.send(user))
    .catch(next);
});
app.get('/langages', (req, res) => {
  res.send(client.langagesSwiss());
});

// Forward 404 to error handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});
