import axios from 'axios'

import authorization from '../utils/authorizationMiddleware'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Authorization Middleware', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('throw 403', async () => {
    const ctx = {
      status: null,
      headers: { authorization: null },
      throw: jest.fn(),
    }

    mockedAxios.post.mockResolvedValue({ status: 400 })

    await authorization(ctx as never, jest.fn())
    expect(ctx.throw).toBeCalledWith(403)
  })

  it('forward jwt token from auth header to post body', async () => {
    process.env.VTEXAPPKEY = 'thisAppKey'
    process.env.VTEXAPPTOKEN = 'thisAppToken'
    const ctx = {
      status: null,
      headers: { authorization: 'token' },
    }

    const { mock } = mockedAxios.post

    mockedAxios.post.mockResolvedValue({ status: 200 })

    await authorization(ctx as never, jest.fn())

    const { data, headers } = mock.calls[0][1] as never

    expect(data).toStrictEqual({ authToken: 'token' })
    expect(headers).toStrictEqual({
      'x-vtex-api-appkey': 'thisAppKey',
      'x-vtex-api-apptoken': 'thisAppToken',
    })
  })

  it('forwards appkey/apptoken from headers to post body', async () => {
    process.env.VTEXAPPKEY = 'thisAppKey'
    process.env.VTEXAPPTOKEN = 'thisAppToken'

    const ctx = {
      status: null,
      headers: {
        vtexAppKey: 'thirdPartyAppKey',
        vtexAppToken: 'thirdPartyAppToken',
      },
    }

    const { mock } = mockedAxios.post

    mockedAxios.post.mockResolvedValue({ status: 200 })

    await authorization(ctx as never, jest.fn())

    const { data, headers } = mock.calls[0][1] as never

    expect(data).toStrictEqual({
      vtexAppKey: 'thirdPartyAppKey',
      vtexAppToken: 'thirdPartyAppToken',
    })
    expect(headers).toStrictEqual({
      'x-vtex-api-appkey': 'thisAppKey',
      'x-vtex-api-apptoken': 'thisAppToken',
    })
  })
})
