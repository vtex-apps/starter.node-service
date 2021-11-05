import { getInput, setFailed, setOutput } from '@actions/core'
import { yaml } from 'js-yaml'
import * as axios from 'axios'

const serviceBaseUrl = 'https://apps-framework-api-beta.vtex.io'

try {
  const requestName = getInput('request-name')
  await this.executeRequest(requestName)
} catch (error) {
  setFailed(error.message)
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
    setOutput(response.status.toString(), 'status-code')
    console.log('App release published successfully')
  } else {
    setOutput(response.status.toString(), 'status-code')
    setFailed(`Failing publishing app. Status code: ${response.status}; Response body: ${response.data}`)
  }
}

function buildPayloadForCreateAppRelease(appSpecification) {
  return {
    context: 'staging',
    appSpecification,
  }
}

function parseAppSpecification() {
  const rawAppSpecification = getInput('app-specification')
  const appSpecification = yaml.load(rawAppSpecification)
  return appSpecification
}
