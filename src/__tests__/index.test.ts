import request from 'supertest'

import { app, server } from '../index'

describe('Index Route', () => {
  it('returns status code 200', async () => {
    const response = await request(app.callback()).get('/')

    expect(response.status).toBe(200)
  })
})

afterAll(() => {
  server.close()
})
