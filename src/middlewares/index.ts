// eslint-disable-next-line import/no-duplicates
import type { Context, Next } from 'koa'
// eslint-disable-next-line import/no-duplicates
import type Koa from 'koa'
import type {
  ClientsConfig,
  IOClients,
  ParamsContext,
  RecorderState,
  RouteHandler,
  ServiceRoute,
} from '@vtex/api'
import { ACCOUNT_HEADER, CREDENTIAL_HEADER } from '@vtex/api'
import { TracerSingleton } from '@vtex/api/lib/service/tracing/TracerSingleton'
import { createTokenBucket } from '@vtex/api/lib/service/worker/runtime/utils/tokenBucket'
import {
  createPublicHttpRoute,
  createPrivateHttpRoute,
} from '@vtex/api/lib/service/worker/runtime/http/index'
import { addTracingMiddleware } from '@vtex/api/lib/service/tracing/tracingMiddlewares'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import json from 'koa-json'
import logger from 'koa-logger'

import configuration from '../utils/configuration.utils'
import authorization from './authorization-middleware'

const globalLimiter = createTokenBucket()

const fetchAppToken = async (ctx: Context, next: Next) => {
  const { header } = ctx.request

  header[ACCOUNT_HEADER] = 'storecomponents'
  header[CREDENTIAL_HEADER] =
    'eyJhbGciOiJFUzI1NiIsImtpZCI6IjRBNTE2OTBCRkFEODlDQUQ0NDg3MjJDMTExNzdERDEyMTJBMDU3MjQiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJyYWZhZWwuc2FuZ2FsbGlAdnRleC5jb20uYnIiLCJhY2NvdW50Ijoic3RvcmVjb21wb25lbnRzIiwiYXVkaWVuY2UiOiJhZG1pbiIsImlkbGV0aW1lb3V0Ijo4NjQwMCwic2VzcyI6ImJmMzAyNDViLWJhMjUtNGQ2Mi1hNmQ0LWY1NWMxNjU4YTE5ZCIsImV4cCI6MTY0MzgyNjgzMCwidXNlcklkIjoiZjY0NzllZWYtOTQxNi00MGU0LWIzMzctODIwZDNlOTcxNjY3IiwiaWF0IjoxNjQzNzQwNDMwLCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiYjk0NDBlOTQtMjFkMS00NThkLThhZjktM2JmZjcwM2Q3MGE1In0.oALWnmcEwrfhfNfGTkzhpOr-trvdQwwm_mNFaYCEFoiAvVhQsU7iZ5gyfYD4ss_lBM-lF3YQN4jMuhToGF09bQ'

  await next()
}

export const configureDefaultMiddlewares = (app: Koa) => {
  app.use(
    helmet({
      // CSP is disabled in development to allow access to GraphiQL UI
      contentSecurityPolicy: configuration.isProd(),
    })
  )
  app.use(cors())
  app.use(json())
  app.use(bodyParser())
  if (!configuration.isProd()) {
    app.use(logger())
  }

  app.use(fetchAppToken)

  const tracer = TracerSingleton.getTracer()

  app.use(addTracingMiddleware(tracer))
  // TODO add other middlewares from startWorks function
}

export const configurePublicRoute = <
  T extends IOClients,
  U extends RecorderState,
  V extends ParamsContext
>(
  routeConfig: RouteConfiguration<T, U, V>
) => {
  const { app, clients, route, routeId, serviceHandler } = routeConfig

  app.use(
    createPublicHttpRoute(
      clients,
      serviceHandler,
      route,
      routeId,
      globalLimiter
    )
  )
}

export const configurePrivateRoute = <
  T extends IOClients,
  U extends RecorderState,
  V extends ParamsContext
>(
  routeConfig: RouteConfiguration<T, U, V>
) => {
  const { app, clients, route, routeId, serviceHandler } = routeConfig

  app.use(authorization)

  app.use(
    createPrivateHttpRoute(
      clients,
      serviceHandler,
      route,
      routeId,
      globalLimiter
    )
  )
}

export interface RouteConfiguration<
  T extends IOClients,
  U extends RecorderState,
  V extends ParamsContext
> {
  app: Koa
  clients: ClientsConfig<T>
  serviceHandler: RouteHandler<T, U, V> | Array<RouteHandler<T, U, V>>
  route: ServiceRoute
  routeId: string
}
