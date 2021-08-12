import request from 'supertest'
import { StatusCodes } from 'http-status-codes'

import { app, server } from '../index'

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

afterAll(() => {
  server.close()
})
