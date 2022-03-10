import type { Context, Next } from 'koa'
import axios from 'axios'
import { ACCOUNT_HEADER, CREDENTIAL_HEADER } from '@vtex/api'

export const fetchAppTokenMiddleware = async (ctx: Context, next: Next) => {
  const headers = {
    'x-vtex-api-appkey': process.env.VTEX_APP_KEY ?? '',
    'x-vtex-api-apptoken': process.env.VTEX_APP_TOKEN ?? '',
  }

  const accountName = ctx.headers[ACCOUNT_HEADER] as string

  try {
    const request = await axios.get(`auth/accounts/${accountName}/jwt`, {
      headers,
      baseURL: process.env.APPS_FRAMEWORK_API_HOST,
      responseType: 'json',
    })

    // set request header for future middlewares
    ctx.header[CREDENTIAL_HEADER] = request.data.jwt
  } catch (e) {
    console.error(e)
  }

  await next()
}
