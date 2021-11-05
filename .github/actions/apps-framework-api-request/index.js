const core = require('@actions/core')
const yaml = require('js-yaml')
const axios = require('axios')

const serviceBaseUrl = 'https://apps-framework-api-beta.vtex.io'

try {
  const requestName = core.getInput('request-name')
  await executeRequest(requestName)
} catch (error) {
  core.setFailed(error.message)
}

async function executeRequest(requestName) {
  switch (requestName) {
    case 'create-app-release':
      await executeCreateAppRelease();
      return;
    default:
      throw new Error(`Unknown request name: ${requestName}`)
  }
}

async function executeCreateAppRelease() {
  const appSpecification = parseAppSpecification()
  const appId = appSpecification.appId
  const payload = buildPayloadForCreateAppRelease(appSpecification)
  const apiUrl = `${serviceBaseUrl}/apps/${appId}/releases`
  console.log(`Calling ${apiUrl}!`)
  console.log(`Payload: ${JSON.stringify(payload)}`)
  const response = await axios.post(apiUrl, payload)
  if (response.status === 200) {
    core.setOutput(response.status.toString(), 'status-code')
    console.log('App release published successfully')
  } else {
    core.setOutput(response.status.toString(), 'status-code')
    core.setFailed(`Failing publishing app. Status code: ${response.status}; Response body: ${response.data}`)
  }
}

function buildPayloadForCreateAppRelease(appSpecification) {
  return {
    context: 'staging',
    appSpecification,
  }
}

function parseAppSpecification() {
  const rawAppSpecification = core.getInput('app-specification')
  const appSpecification = yaml.load(rawAppSpecification)
  return appSpecification
}
