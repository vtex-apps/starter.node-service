// eslint-disable-next-line import/no-duplicates
import type { Context, Next } from 'koa'
// eslint-disable-next-line import/no-duplicates
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

export const defaultMiddlewares = () => {
  const tracer = TracerSingleton.getTracer()
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
  ]

  if (!configuration.isProd()) {
    middlewares.push(logger())
  }

  return middlewares
}

export const configurePublicRoute = <
  T extends IOClients,
  U extends RecorderState,
  V extends ParamsContext
>(
  routeConfig: RouteConfiguration<T, U, V>
) => {
  const { clients, route, routeId, serviceHandler } = routeConfig

  return createPublicHttpRoute(
    clients,
    serviceHandler,
    route,
    routeId,
    globalLimiter
  )
}

export const configurePrivateRoute = <
  T extends IOClients,
  U extends RecorderState,
  V extends ParamsContext
>(
  routeConfig: RouteConfiguration<T, U, V>
) => {
  const { clients, route, routeId, serviceHandler } = routeConfig

  const middlewares = [authorization, serviceHandler as RouteHandler<T, U, V>]

  return createPrivateHttpRoute(
    clients,
    middlewares,
    route,
    routeId,
    globalLimiter
  )
}

export interface RouteConfiguration<
  T extends IOClients,
  U extends RecorderState,
  V extends ParamsContext
> {
  clients: ClientsConfig<T>
  serviceHandler: RouteHandler<T, U, V> | Array<RouteHandler<T, U, V>>
  route: ServiceRoute
  routeId: string
}
