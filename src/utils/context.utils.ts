import type { Context } from 'koa'

export const getRouteId = (ctx: Context): string => {
  return `${ctx.method}-${ctx.path}`
}
