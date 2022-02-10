import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import axios from 'axios'
import type { Catalog, Category } from '@vtex/clients'

import { app, server } from '../index'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('@vtex/clients', () => {
  const originalModule = jest.requireActual('@vtex/clients')

  return {
    __esModule: true,
    ...originalModule,
    Catalog: jest.fn(
      (): Partial<Catalog> => ({
        getCategoryById: jest.fn((categoryId: string) => {
          return Promise.resolve({
            Id: categoryId,
          } as Category)
        }),
      })
    ),
  }
})

describe('Index Route', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: { jwt: 'token' } })
  })
  it('returns status code 200', async () => {
    const response = await request(app.callback())
      .get('/')
      .set('x-vtex-account', 'account')

    expect(response.status).toBe(StatusCodes.OK)
  })
})

describe('Call VTEX API Route', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: { jwt: 'token' } })
  })
  it('returns status code 200', async () => {
    const response = await request(app.callback())
      .get('/category/1')
      .set('x-vtex-account', 'account')

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body.Id).toBe('1')
  })
})

// TODO - Add tests once graphql is implemented
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('GraphQL queries', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: { jwt: 'token' } })
  })
  it('returns Hello World data', async () => {
    const response = await request(app.callback())
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('x-vtex-account', 'account')
      .send({ query: '{ hello }' })

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body.data.hello).toBe('Hello world!')
  })
})

describe('HealthCheck Route', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: { jwt: 'token' } })
  })
  it('returns status code 200', async () => {
    const response = await request(app.callback())
      .get('/healthcheck')
      .set('x-vtex-account', 'account')

    expect(response.status).toBe(StatusCodes.OK)
  })
})

describe('Private Route', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: { jwt: 'token' } })
  })

  it('returns status code 200 when external validation of credential passes', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 })
    const response = await request(app.callback())
      .get('/private')
      .set('x-vtex-account', 'account')

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.text).toBe(
      'This is a private route. It requires valid credentials in order to access it'
    )
  })

  it('returns status code 403 when external validation of credential fails', async () => {
    mockedAxios.post.mockResolvedValue({ status: 400 })

    const response = await request(app.callback())
      .get('/private')
      .set('x-vtex-account', 'account')

    expect(response.status).toBe(StatusCodes.FORBIDDEN)
  })
})

afterAll(() => {
  server.close()
})
