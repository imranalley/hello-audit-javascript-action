const core = require('@actions/core');
const github = require('@actions/github');
import { ExportToCsv } from 'export-to-csv';

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // TODO add a parser script that converts to csv
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  const csvExport = new ExportToCsv(options);
  csvExport.generateCsv(payload);
} catch (error) {
  core.setFailed(error.message);
}