const Github = require('./github.js');
const Server = require('./server.js');


const credentials = require('../credentials.json');

const port = 9090;
const { username, token } = credentials;


/*
// ONLINE DEPLOYMENT

const port = process.env.PORT;

const username = process.env.USERNAME;
const token = process.env.TOKEN;


*/

console.log(username);
const github = new Github({ username, token });
const server = new Server(port, github);


server.start();
