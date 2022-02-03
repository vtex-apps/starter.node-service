import koaCompose from 'koa-compose'
import type { Context, Middleware, Next } from 'koa'

export type RouteType = 'system' | 'app'

const SYSTEM_ROUTES = ['/healthcheck']

const getRouteType = (ctx: Context): RouteType => {
  if (SYSTEM_ROUTES.includes(ctx.request.path)) {
    return 'system'
  }

  return 'app'
}

export type MiddlewaresByRouteType<T extends Context> = Record<
  RouteType,
  Array<Middleware<unknown, T, unknown>>
>

export const addExecuteMiddlewaresForRouteType = <T extends Context>(
  middlewaresByRouteType: MiddlewaresByRouteType<T>
) => {
  return async function executeMiddlwaresForRouteType(ctx: T, next: Next) {
    const routeType = getRouteType(ctx)
    const middlewares = middlewaresByRouteType[routeType]
    const middleware = koaCompose(middlewares)

    await middleware(ctx, next)
  }
}
