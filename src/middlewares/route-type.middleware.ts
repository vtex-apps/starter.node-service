import type { ComposedMiddleware } from 'koa-compose'
import koaCompose from 'koa-compose'
import type { ServiceContext } from '@vtex/api'

export type RouteType = 'system' | 'app'

const SYSTEM_ROUTES = ['/healthcheck']

const getRouteType = (ctx: ServiceContext): RouteType => {
  if (SYSTEM_ROUTES.includes(ctx.request.path)) {
    return 'system'
  }

  return 'app'
}

export type MiddlewaresByRouteType = Record<
  RouteType,
  Array<ComposedMiddleware<ServiceContext>> // TODO change to a more generic type>
>

export const createExecuteMiddlewaresForRouteType = (
  middlewaresByRouteType: MiddlewaresByRouteType
) => {
  return async function executeMiddlwaresForRouteType(
    ctx: ServiceContext,
    next: () => Promise<void>
  ) {
    const routeType = getRouteType(ctx)
    const middlewares = middlewaresByRouteType[routeType]
    const middleware = koaCompose(middlewares)

    await middleware(ctx, next)
  }
}
