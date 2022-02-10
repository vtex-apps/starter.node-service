import { StatusCodes } from 'http-status-codes'
import type { Next, Context } from 'koa'
import axios from 'axios'

const authorizationMiddleware = async (ctx: Context, next: Next) => {
  // TODO migrate middleware to npm lib
  const CREDENTIALS_VALIDATION_ENDPOINT = '/auth/users/validate'

  const headers = {
    'x-vtex-api-appkey': process.env.VTEX_APP_KEY ?? '',
    'x-vtex-api-apptoken': process.env.VTEX_APP_TOKEN ?? '',
  }

  const data = createDataFromRequesterCredentials(ctx)

  if (!data) {
    ctx.throw(StatusCodes.UNAUTHORIZED)
  }

  const request = await axios.post(CREDENTIALS_VALIDATION_ENDPOINT, data, {
    headers,
    baseURL: process.env.APPS_FRAMEWORK_API_HOST,
    responseType: 'json',
  })

  if (request.status !== StatusCodes.OK) {
    ctx.throw(StatusCodes.FORBIDDEN)
  }

  await next()
}

function createDataFromRequesterCredentials(
  ctx: Context
): ValidateCredentialsPayload {
  let data: ValidateCredentialsPayload = {}

  if (ctx.headers.authorization) {
    data = {
      authToken: ctx.headers.authorization,
    }
  } else if (ctx.headers.vtexidclientautcookie) {
    data = {
      authToken: ctx.headers.vtexidclientautcookie as string,
    }
  } else if (ctx.cookies.get('VtexIdclientAutCookie')) {
    data = {
      authToken: ctx.cookies.get('VtexIdclientAutCookie') as string,
    }
  } else if (ctx.headers.vtexAppKey && ctx.headers.vtexAppToken) {
    data = {
      vtexAppKey: ctx.headers.vtexAppKey as string,
      vtexAppToken: ctx.headers.vtexAppToken as string,
    }
  }

  return data
}

export interface ValidateCredentialsPayload {
  authToken?: string
  vtexAppKey?: string
  vtexAppToken?: string
}

export default authorizationMiddleware
