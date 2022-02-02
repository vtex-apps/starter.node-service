import type { ClientsConfig, RouteHandler, ServiceContext } from '@vtex/api'
import { IOClients } from '@vtex/api'
import type { ComposedMiddleware } from 'koa-compose'

import { configurePrivateRoute, configurePublicRoute } from '../middlewares'

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

export function publicRoute(
  routeId: string,
  path: string,
  handler: RouteHandler
): ComposedMiddleware<ServiceContext> {
  return configurePublicRoute({
    clients: clientConfig,
    route: {
      path,
    },
    routeId,
    serviceHandler: handler,
  })
}

export function privateRoute(
  routeId: string,
  path: string,
  handler: RouteHandler
): ComposedMiddleware<ServiceContext> {
  return configurePrivateRoute({
    clients: clientConfig,
    route: {
      path,
    },
    routeId,
    serviceHandler: handler,
  })
}
