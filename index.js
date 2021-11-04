const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const { parse } = require('json2csv');
const fs = require('fs')

const AUDIT_ORG = `
{
  organization(login: "your-org") {
    repositories(first: 100) {
      nodes {
        nameWithOwner
        collaborators(first: 100) {
          totalCount
            edges {
              permission
              node {
                login
                name
              }
            }
            pageInfo {
              endCursor
              hasNextPage
          }
        }
      }
    }
  }
}
`;
// const bearer_token = process.env.BEARER_TOKEN;
const GET_USER = `
{
  user(login: "imranalley") {
    bio
    url
  }
}
`;



try {
  // `who-to-greet` input defined in action metadata file
  const creds = core.getInput('creds');
  const url = core.getInput('url');
  // run api call
  const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
    'Authorization': `token ${creds}`
    }
  });
  // const config = {
  //   method: 'get',
  //   url: `${url}/user`,
  //   headers: {
  //     'Authorization': `token ${creds}`
  //   }
  // };
  // axios(config)
  // axios(config)
axiosGitHubGraphQL
.post('', { query: GET_USER })
.then(function (response){
  // .then(function (response) {
    console.log(response);
    const res = response.data;
    const fields = ['bio', 'url'];
    const opts = { fields };
    const csv = parse(res, opts);
    console.log(csv);
    fs.writeFile('response_nodejs.csv', csv, { flag: 'a+' }, err => {})
    console.log(csv);
  })

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // TODO add a parser script that converts to csv
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  
} catch (error) {
  core.setFailed(error.message);
}