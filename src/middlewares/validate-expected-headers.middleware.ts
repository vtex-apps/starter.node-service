import type { Context, Next } from 'koa'
import { ACCOUNT_HEADER } from '@vtex/api'

export const validateExpectedHeaders = async (ctx: Context, next: Next) => {
  if (!ctx.header[ACCOUNT_HEADER]) {
    ctx.throw(400, `Missing ${ACCOUNT_HEADER} header`)
  }

  await next()
}
