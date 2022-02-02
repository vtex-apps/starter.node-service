import type {
  ClientsConfig,
  ParamsContext,
  RecorderState,
  RouteHandler,
  ServiceRoute,
} from '@vtex/api'
import { IOClients } from '@vtex/api'
import type Koa from 'koa'

import { configurePrivateRoute, configurePublicRoute } from '../middlewares'

export interface RouteConfig<
  T extends IOClients,
  U extends RecorderState,
  V extends ParamsContext
> {
  route: ServiceRoute
  handler: RouteHandler<T, U, V> | Array<RouteHandler<T, U, V>>
}

const defaultClients: ClientsConfig = {
  options: {
    messages: {
      concurrency: 10,
      retries: 2,
      timeout: 1000,
    },
    messagesGraphQL: {
      concurrency: 10,
      retries: 2,
      timeout: 1000,
    },
  },
}

const clientConfig: ClientsConfig = {
  implementation: IOClients,
  options: defaultClients.options,
}

export const configureRoutes = (
  app: Koa,
  routes: Record<string, RouteConfig<IOClients, RecorderState, ParamsContext>>
) => {
  for (const [routeId, routeConfig] of Object.entries(routes)) {
    if (routeConfig.route.public) {
      configurePublicRoute({
        app,
        clients: clientConfig,
        route: routeConfig.route,
        routeId,
        serviceHandler: routeConfig.handler,
      })
    } else {
      configurePrivateRoute({
        app,
        clients: clientConfig,
        route: routeConfig.route,
        routeId,
        serviceHandler: routeConfig.handler,
      })
    }
  }
}
