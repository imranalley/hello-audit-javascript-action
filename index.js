const core = require('@actions/core');
const github = require('@actions/github');
const artifact = require('@actions/artifact');
const { JSONtoCSV } = require("./utils")
const fs = require("fs");
const writeFileAsync = promisify(fs.writeFile);

function createandUploadArtifacts() {
  if (!process.env.GITHUB_RUN_NUMBER) {
    return core.debug("not running in actions, skipping artifact upload");
  }

  const artifactClient = artifact.create();
  const artifactName = `user-report-${new Date().getTime()}`;
  const files = [
    `./data/${ARTIFACT_FILE_NAME}.json`,
    `./data/${ARTIFACT_FILE_NAME}.csv`
  ];
  const rootDirectory = "./";
  const options = { continueOnError: true };

  const uploadResult = await artifactClient.uploadArtifact(
    artifactName,
    files,
    rootDirectory,
    options
  );
  return uploadResult;
}

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
 
  const csv = JSONtoCSV(payload)
  await writeFileAsync(
    `${DATA_FOLDER}/${ARTIFACT_FILE_NAME}.json`,
    JSON.stringify(json)
  );

  console.log('testing writefile');
  await writeFileAsync(`${DATA_FOLDER}/${ARTIFACT_FILE_NAME}.csv`, csv);

  console.log('create and upload artifacts');
  await createandUploadArtifacts();
  
} catch (error) {
  core.setFailed(error.message);
}