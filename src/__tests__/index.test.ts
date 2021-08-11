import request from 'supertest'

import { app, server } from '../index'

describe('Index Route', () => {
  it('returns status code 200', async () => {
    const response = await request(app.callback()).get('/')

    expect(response.status).toBe(200)
  })
})

describe('GraphQL queries', () => {
  it('returns Hello World data', async () => {
    const response = await request(app.callback())
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ query: '{ hello }' })

    expect(response.status).toBe(200)
    expect(response.body.data.hello).toBe('Hello world!')
  })
})

afterAll(() => {
  server.close()
})
