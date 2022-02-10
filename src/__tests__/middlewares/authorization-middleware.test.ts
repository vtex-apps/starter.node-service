import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { Context } from 'koa'

import type { ValidateCredentialsPayload } from '../../middlewares/authorization.middleware'
import authorization from '../../middlewares/authorization.middleware'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Authorization Middleware', () => {
  const thisAppKey = 'thisAppKey'
  const thisAppToken = 'thisAppToken'

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('throw 403', async () => {
    const ctx: Partial<Context> = {
      status: undefined,
      headers: { authorization: undefined },
      throw: jest.fn() as any,
      cookies: { get: jest.fn() } as any,
    }

    mockedAxios.post.mockResolvedValue({ status: 400 })

    await authorization(ctx as Context, jest.fn())
    expect(ctx.throw).toBeCalledWith(403)
  })

  it('forward jwt token from auth header to post body', async () => {
    process.env.VTEX_APP_KEY = thisAppKey
    process.env.VTEX_APP_TOKEN = thisAppToken
    const authorizationToken = 'token'

    const ctx: Partial<Context> = {
      status: undefined,
      headers: { authorization: authorizationToken },
    }

    const { mock } = mockedAxios.post

    mockedAxios.post.mockResolvedValue({ status: 200 })

    await authorization(ctx as Context, jest.fn())

    const data = mock.calls[0][1] as ValidateCredentialsPayload
    const { headers } = mock.calls[0][2] as AxiosRequestConfig

    expect(data).toStrictEqual({ authToken: authorizationToken })
    expect(headers).toStrictEqual({
      'x-vtex-api-appkey': thisAppKey,
      'x-vtex-api-apptoken': thisAppToken,
    })
  })

  it('forwards appkey/apptoken from headers to post body', async () => {
    process.env.VTEX_APP_KEY = thisAppKey
    process.env.VTEX_APP_TOKEN = thisAppToken
    const thirdPartyAppKey = 'thirdPartyAppKey'
    const thirdPartyAppToken = 'thirdPartyAppToken'

    const ctx: Partial<Context> = {
      status: undefined,
      headers: {
        vtexAppKey: thirdPartyAppKey,
        vtexAppToken: thirdPartyAppToken,
      },
      cookies: { get: jest.fn() } as any,
    }

    const { mock } = mockedAxios.post

    mockedAxios.post.mockResolvedValue({ status: 200 })

    await authorization(ctx as Context, jest.fn())

    const data = mock.calls[0][1] as ValidateCredentialsPayload
    const { headers } = mock.calls[0][2] as AxiosRequestConfig

    expect(data).toStrictEqual({
      vtexAppKey: thirdPartyAppKey,
      vtexAppToken: thirdPartyAppToken,
    })
    expect(headers).toStrictEqual({
      'x-vtex-api-appkey': thisAppKey,
      'x-vtex-api-apptoken': thisAppToken,
    })
  })
})
