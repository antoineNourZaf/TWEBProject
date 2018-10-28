/* eslint linebreak-style: ["error", "windows"] */
const request = require('superagent');
const fetch = require('node-fetch');

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

  nbSwissRepos() {
    // Recueillir les utilisateurs suisses
    const users = this.swissUsers();
    // Compter leur repos et retourner la somme
    const array = JSON.parse(users);
  }

  /**
     * Get all the opened issues.
     * @param {function} dataAreAvailable The function to call when data are available.
     * @param {function} noMoreData The function to call when there are no more data.
     */
  getLanguagesUserInSwitzerland(dataAreAvailable, noMoreData) {
    const url = 'https://api.github.com/repos/dotnet/corefx/languages';

      const languages = new Map();

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

              for (var language in result.body)
              {
                  languages.set(language, 1);
              }




            dataAreAvailable(null,  languages );

            if (result.links.next) {
              fetchAndProcessData(result.links.next, credentials);
            } else {
              noMoreData();
            }
          } else {
            noMoreData();
          }
        });
    }

    fetchAndProcessData(url, this.credentials);
  }
}

module.exports = Github;
