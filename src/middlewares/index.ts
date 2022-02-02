/* eslint-disable max-params */
import type { Context, Next } from 'koa'
import type {
  ClientsConfig,
  ParamsContext,
  RecorderState,
  ServiceContext,
} from '@vtex/api'
import { IOClients, ACCOUNT_HEADER, CREDENTIAL_HEADER } from '@vtex/api'
import { prepareHandlerCtx } from '@vtex/api/lib/service/worker/runtime/utils/context'
import { TracerSingleton } from '@vtex/api/lib/service/tracing/TracerSingleton'
import { authTokens } from '@vtex/api/lib/service/worker/runtime/http/middlewares/authTokens'
import { cancellationToken } from '@vtex/api/lib/service/worker/runtime/http/middlewares/cancellationToken'
import { clients } from '@vtex/api/lib/service/worker/runtime/http/middlewares/clients'
import { perMinuteRateLimiter } from '@vtex/api/lib/service/worker/runtime/http/middlewares/rateLimit'
import { trackIncomingRequestStats } from '@vtex/api/lib/service/worker/runtime/http/middlewares/requestStats'
import { removeSetCookie } from '@vtex/api/lib/service/worker/runtime/http/middlewares/setCookie'
import { createTokenBucket } from '@vtex/api/lib/service/worker/runtime/utils/tokenBucket'
// import { timings } from '@vtex/api/lib/service/worker/runtime/http/middlewares/timings'
import { vary } from '@vtex/api/lib/service/worker/runtime/http/middlewares/vary'
import {
  addTracingMiddleware,
  traceUserLandRemainingPipelineMiddleware,
} from '@vtex/api/lib/service/tracing/tracingMiddlewares'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import json from 'koa-json'
import logger from 'koa-logger'

import configuration from '../utils/configuration.utils'

const fetchAppToken = async (ctx: Context, next: Next) => {
  const { header } = ctx.request

  header[ACCOUNT_HEADER] = 'storecomponents'
  header[CREDENTIAL_HEADER] =
    'eyJhbGciOiJFUzI1NiIsImtpZCI6IjRBNTE2OTBCRkFEODlDQUQ0NDg3MjJDMTExNzdERDEyMTJBMDU3MjQiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJyYWZhZWwuc2FuZ2FsbGlAdnRleC5jb20uYnIiLCJhY2NvdW50Ijoic3RvcmVjb21wb25lbnRzIiwiYXVkaWVuY2UiOiJhZG1pbiIsImlkbGV0aW1lb3V0Ijo4NjQwMCwic2VzcyI6ImJmMzAyNDViLWJhMjUtNGQ2Mi1hNmQ0LWY1NWMxNjU4YTE5ZCIsImV4cCI6MTY0MzgyNjgzMCwidXNlcklkIjoiZjY0NzllZWYtOTQxNi00MGU0LWIzMzctODIwZDNlOTcxNjY3IiwiaWF0IjoxNjQzNzQwNDMwLCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiYjk0NDBlOTQtMjFkMS00NThkLThhZjktM2JmZjcwM2Q3MGE1In0.oALWnmcEwrfhfNfGTkzhpOr-trvdQwwm_mNFaYCEFoiAvVhQsU7iZ5gyfYD4ss_lBM-lF3YQN4jMuhToGF09bQ'

  await next()
}

const globalLimiter = createTokenBucket()

const defaultClients: ClientsConfig = {
  implementation: IOClients,
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

const createContextMiddleware = () => {
  return async function pvtContext<
    T extends IOClients,
    U extends RecorderState,
    V extends ParamsContext
  >(ctx: ServiceContext<T, U, V>, next: () => Promise<void>) {
    const {
      params,
      request: { header },
    } = ctx

    // TODO get routeId from request
    const routeId = ''

    ctx.vtex = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...prepareHandlerCtx(header, ctx.tracing!),
      // ...(smartcache && { recorder: ctx.state.recorder }),
      route: {
        id: routeId,
        params,
        type: 'private',
      },
    }
    await next()
  }
}

const nameSpanOperationMiddleware = () => {
  return function nameSpanOperation(
    ctx: ServiceContext,
    next: () => Promise<void>
  ) {
    const operationType = 'app-route-handler'

    // TODO get routeId from request
    const operationName = ''

    ctx.tracing?.currentSpan.setOperationName(
      `${operationType}:${operationName}`
    )

    return next()
  }
}

const routeMiddlewares = <T extends IOClients>(
  clientsConfig: ClientsConfig<T>
) => {
  const { implementation, options } = clientsConfig

  // TODO implement a single middleware that checks special routes (/healthcheck) and skip middlewares

  return [
    nameSpanOperationMiddleware(),
    createContextMiddleware(),
    cancellationToken,
    trackIncomingRequestStats,
    vary,
    authTokens,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    clients(implementation!, options),
    // TODO understand what is service settings
    // ...(serviceRoute.settingsType === 'workspace' ||
    // serviceRoute.settingsType === 'userAndWorkspace'
    //   ? [getServiceSettings()]
    //   : []),
    removeSetCookie,
    // TODO timings requires the compose function to set timings in the context
    // timings,
    // TODO if param is undefined, concurrentRateLimiter is noops
    // concurrentRateLimiter(serviceRoute?.rateLimitPerReplica?.concurrent),
    perMinuteRateLimiter(undefined, globalLimiter),
    traceUserLandRemainingPipelineMiddleware(),
  ]
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
    ...routeMiddlewares(defaultClients),
  ]

  if (!configuration.isProd()) {
    middlewares.push(logger())
  }

  return middlewares
}
