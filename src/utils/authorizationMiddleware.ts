import type { BaseContext, Next } from 'koa'
import axios from 'axios'

const authorization = async (ctx: BaseContext, next: Next) => {
  // TODO migrar middleware para lib npm

  const headers = {
    'x-vtex-api-appkey': process.env.VTEXAPPKEY ?? '',
    'x-vtex-api-apptoken': process.env.VTEXAPPTOKEN ?? '',
  }

  let data = {}

  if (ctx.headers.authorization) {
    data = {
      authToken: ctx.headers.authorization,
    }
  } else if (ctx.headers.vtexAppKey && ctx.headers.vtexAppToken) {
    data = {
      vtexAppKey: ctx.headers.vtexAppKey,
      vtexAppToken: ctx.headers.vtexAppToken,
    }
  }

  const request = await axios.post('/auth/users/validate', {
    headers,
    data,
    baseURL: process.env.APPS_FRAMEWORK_API_HOST,
    responseType: 'json',
  })

  if (request.status !== 200) {
    ctx.throw(403)
  }

  await next()
}

export default authorization
