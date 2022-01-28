import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import axios from 'axios'

import { app, server } from '../index'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Index Route', () => {
  it('returns status code 200', async () => {
    const response = await request(app.callback()).get('/')

    expect(response.status).toBe(StatusCodes.OK)
  })
})

describe('GraphQL queries', () => {
  it('returns Hello World data', async () => {
    const response = await request(app.callback())
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ query: '{ hello }' })

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body.data.hello).toBe('Hello world!')
  })
})

describe('HealthCheck Route', () => {
  it('returns status code 200', async () => {
    const response = await request(app.callback()).get('/healthcheck')

    expect(response.status).toBe(StatusCodes.OK)
  })
})

describe('Private Route', () => {
  it('returns status code 200 when external validation of credential passes', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 })

    const response = await request(app.callback()).get('/private')

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.text).toBe('This is a private route')
  })

  it('returns status code 403 when external validation of credential fails', async () => {
    mockedAxios.post.mockResolvedValue({ status: 400 })

    const response = await request(app.callback()).get('/private')

    expect(response.status).toBe(StatusCodes.FORBIDDEN)
  })
})

afterAll(() => {
  server.close()
})
