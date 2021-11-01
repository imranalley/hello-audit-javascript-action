const core = require('@actions/core');
const github = require('@actions/github');
// const artifact = require('@actions/artifact');
const axios = require('axios');
const { parse } = require('json2csv');
const fs = require('fs')

try {
  // `who-to-greet` input defined in action metadata file
  const creds = core.getInput('creds');
  // run api call

  const config = {
    method: 'get',
    url: `${url}`,
    headers: {
      'Authorization': `token ${creds}`
    }
  };
  axios(config)

  .then(function (response) {
    console.log(response);
    const res = response.data;
    const fields = ['name', 'id', 'company', 'public_repos'];
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