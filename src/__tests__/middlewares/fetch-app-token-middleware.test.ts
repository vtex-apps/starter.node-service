import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { Context } from 'koa'

import { fetchAppTokenMiddleware } from '../../middlewares/fetch-app-token.middleware'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Fetch App Token Middleware', () => {
  const thisAppKey = 'thisAppKey'
  const thisAppToken = 'thisAppToken'

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set headers and fetch JWT token', async () => {
    process.env.VTEX_APP_KEY = thisAppKey
    process.env.VTEX_APP_TOKEN = thisAppToken
    const authorizationToken = 'JWT-Bearer-Token'
    const accountName = 'storecomponents'

    const ctx: Partial<Context> = {
      status: undefined,
      headers: {
        authorization: authorizationToken,
        'x-vtex-account': accountName,
      },
      header: {},
    }

    const { mock } = mockedAxios.get

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: { jwt: authorizationToken },
    })

    await fetchAppTokenMiddleware(ctx as Context, jest.fn())

    const { headers } = mock.calls[0][1] as AxiosRequestConfig

    expect(mock.calls[0][0]).toBe(`auth/accounts/${accountName}/jwt`)
    expect(headers).toStrictEqual({
      'x-vtex-api-appkey': thisAppKey,
      'x-vtex-api-apptoken': thisAppToken,
    })
    expect(ctx.header?.['x-vtex-credential']).toBe(authorizationToken)
  })
})
