// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const Github = require('./src/Github');

const client = new Github({token: process.env.OAUTH_TOKEN });
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the client app
app.use(cors());

app.get('/', (req, res, next) => {
  client.user(req.params.username)
  .then(user => res.send(user))
  .catch(next);
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

// Function to use for the pages
function getSwissUsers() {
  fetch('https://api.github.com/search/users?q=+location:Switzerland', {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })
    .then(result => result.json()
      .then((data) => {
        if (result.ok) {
          res.send(data);
        } else {
          throw new Error('Ooops Error !');
        }
      })).catch(Error);
}
