import type { Context, Next } from 'koa'
import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { ACCOUNT_HEADER, CREDENTIAL_HEADER } from '@vtex/api'
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
import type { MiddlewaresByRouteType } from './route-type.middleware'
import { addExecuteMiddlewaresForRouteType } from './route-type.middleware'

const fetchAppToken = async (ctx: Context, next: Next) => {
  const { header } = ctx.request

  const config = ctx.config || {}

  ctx.config = config

  config.forceMaxAge = 5000

  header[ACCOUNT_HEADER] = 'storecomponents'
  header[CREDENTIAL_HEADER] =
    'eyJhbGciOiJFUzI1NiIsImtpZCI6IjA0RUJFMUQ5NUFDQTg2NTJEOUFGMzQwRUUwRTNGRjkzNkZFNkU2MDUiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJyYWZhZWwuc2FuZ2FsbGlAdnRleC5jb20uYnIiLCJhY2NvdW50Ijoic3RvcmVjb21wb25lbnRzIiwiYXVkaWVuY2UiOiJhZG1pbiIsImlkbGV0aW1lb3V0Ijo4NjQwMCwic2VzcyI6ImEyNWJlMjEyLTE4OWYtNDIyNi05OGIzLTY2YTIyZDNjODIxNyIsImV4cCI6MTY0Mzk5NDY4MSwidXNlcklkIjoiZjY0NzllZWYtOTQxNi00MGU0LWIzMzctODIwZDNlOTcxNjY3IiwiaWF0IjoxNjQzOTA4MjgxLCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiOGRlN2QxNDAtZWJiZS00NzAzLWJmNjgtM2I0YTBkMmIyNWY4In0.-euLPoNVkL35OW3IcZhH_iDaNYjD19-NmWkEF7AJYQ1FKAYUAeU3h6lLlq3SgRhQDpnN817uUzSlLpV8x5jQ0g'

  await next()
}

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
    fetchAppToken,
    addTracingMiddleware(tracer),
    addExecuteMiddlewaresForRouteType(middlewaresForRouteType),
  ]

  if (!configuration.isProd()) {
    middlewares.push(logger())
  }

  return middlewares
}
