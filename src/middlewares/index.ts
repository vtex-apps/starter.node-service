import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { TracerSingleton } from '@vtex/api/lib/service/tracing/TracerSingleton'
import { addTracingMiddleware } from '@vtex/api/lib/service/tracing/tracingMiddlewares'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import json from 'koa-json'
import logger from 'koa-logger'

import configuration from '../utils/configuration.utils'
import { defaultClients } from './default-configuration.constants'
import { createAppRoutesMiddleware } from './app-routes.middleware'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  addExecuteMiddlewaresForRouteType,
  MiddlewaresByRouteType,
} from './route-type.middleware'

export const defaultMiddlewares = (clients: ClientsConfig = defaultClients) => {
  const tracer = TracerSingleton.getTracer()

  const middlewaresForRouteType: MiddlewaresByRouteType<ServiceContext> = {
    app: [createAppRoutesMiddleware(clients)],
    system: [],
  }

  const middlewares = [
    helmet({
      // CSP is disabled in development to allow access to GraphiQL UI
      contentSecurityPolicy: configuration.isProd(),
    }),
    cors(),
    json(),
    bodyParser(),
    addTracingMiddleware(tracer),
    addExecuteMiddlewaresForRouteType(middlewaresForRouteType),
  ]

  if (!configuration.isProd()) {
    middlewares.push(logger())
  }

  return middlewares
}
