/* eslint linebreak-style: ["error", "windows"] */
const request = require('superagent');
const fetch = require('node-fetch');
const mongoClient = require('./mongo');

class Github {
  constructor(credentials) {
    console.log(credentials);
    this.credentials = credentials;
  }

  user(username) {
    return this.request(`users/${username}`);
  }

  repos(username) {
    return this.request(`users/${username}/repos`);
  }

  reposLanguages(name) {
    return this.request(`/repos/${name}/languages`);
  }

  /*

    userLanguages(username) {
        return this.repos(username)
            .then((repos) = > {
            const getLanguages = repo = > this.reposLanguages(repo.full_name);
        return Promise.all(repos.map(getLanguages));
    })
        ;
    }

    */

  swissUsers() {
    return this.request('search/users?q=+location:Switzerland');
  }

  /**
   * Get top 50 users in switzerland .
   * @param {function} dataAreAvailable The function to call when data are available.
   * @param {function} noMoreData The function to call when there are no more data.
   */
  getTopUsersInSwitzerland(dataAreAvailable, noMoreData) {
    const url = 'https://api.github.com/search/users?q=location:Switzerland&sort=followers&order=desc&per_page=50';
    const users = new Map();
    const i = 0;
    /**
     * Function called until all the data are fetched.
     * @param {string} tragetUrl The GitHub's API URL.
     * @param {JSON object with username and token} credentials  The credentials to use
     * to query GitHub.
     */
    function fetchAndProcessData(tragetUrl, credentials) {
      request
        .get(tragetUrl)
        .auth(credentials.username, credentials.token)
        .end((errors, result) => {
          if (errors == null) {
            for (const user in result.body.items) {
              const idUser = result.body.items[user].id;
              const usernameUser = result.body.items[user].login;
              // Ajouter données a la base de données
              mongoClient.connect(url)
                .then((client) => {
                  const db = client.db();
                  const collection = db.collection('User');

                  collection.insertOne({ idUser: usernameUser });
                  db.close();
                });
            }
            dataAreAvailable(null, users);
            noMoreData();
          } else {
            noMoreData();
          }
        });
    }

    fetchAndProcessData(url, this.credentials);
  }


  /**
   * Get all user's repositories
   * @param {string} owner The repositories owner
   * @param {function} dataAreAvailable The function to call when data are available.
   * @param {function} noMoreData The function to call when there are no more data.
   */
  getUserRepository(owner, dataAreAvailable, noMoreData) {
    const url = `https://api.github.com/search/repositories?q=@${owner.owner}`;

    const repos = new Map();
    const languages = new Map();
    const i = 0;

    /**
     * Function called until all the data are fetched.
     * @param {string} tragetUrl The GitHub's API URL.
     * @param {JSON object with username and token} credentials  The credentials to use
     * to query GitHub.
     */
    function fetchAndProcessData(tragetUrl, credentials) {
      request
        .get(tragetUrl)
        .auth(credentials.username, credentials.token)
        .end((errors, result) => {
          if (errors == null) {
            for (const repo in result.body.items) {
              if (repos[result.body.items[repo].language] == null) {
                repos[result.body.items[repo].language] = {
                  openIssue: result.body.items[repo].open_issues_count,
                  forks: result.body.items[repo].forks,
                  watchers: result.body.items[repo].watchers,
                  nbProject: 1,
                };
              } else {
                repos[result.body.items[repo].language] = {
                  openIssue: repos[result.body.items[repo].language].openIssue + result.body.items[repo].open_issues_count,
                  forks: repos[result.body.items[repo].language].forks + result.body.items[repo].forks,
                  watchers: repos[result.body.items[repo].language].watchers + result.body.items[repo].watchers,
                  nbProject: repos[result.body.items[repo].language].nbProject + 1,
                };
              }
            }


            dataAreAvailable(null, repos);


            if (result.links.next) {
              fetchAndProcessData(result.links.next, credentials);
            } else {
              console.log(repos);
              noMoreData();
            }
          } else {
            noMoreData();
          }
        });
    }

    fetchAndProcessData(url, this.credentials);
  }

  /**
   * Get all the programming languages used by the top 50 users
   * @param {function} dataAreAvailable The function to call when data are available.
   * @param {function} noMoreData The function to call when there are no more data.
   */
  getLanguages(dataAreAvailable, noMoreData) {

    var languages = [];

    /**
     * Function called until all the data are fetched.
     */

    function callDBLanguages() {
      
      mongoClient.connect(url)
        .then((client) => {
          const db = client.db().collection('SwissStats');

          languages = db.language.find().toArray();
          db.close();
        })
    }



    callDBLanguages();
  }
}

module.exports = Github;
