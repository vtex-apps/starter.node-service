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
import axios from 'axios'

import configuration from '../utils/configuration.utils'
import { defaultClients } from './default-configuration.constants'
import { createAppRoutesMiddleware } from './app-routes.middleware'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  addExecuteMiddlewaresForRouteType,
  MiddlewaresByRouteType,
} from './route-type.middleware'

const fetchAppToken = async (ctx: Context, next: Next) => {
  const headers = {
    'x-vtex-api-appkey': process.env.VTEX_APP_KEY ?? '',
    'x-vtex-api-apptoken': process.env.VTEX_APP_TOKEN ?? '',
  }

  const accountName = 'storecomponents'

  try {
    const request = await axios.get(`auth/accounts/${accountName}/jwt`, {
      headers,
      baseURL: process.env.APPS_FRAMEWORK_API_HOST,
      responseType: 'json',
    })

    // set request header for future middlewares
    ctx.header[ACCOUNT_HEADER] = 'storecomponents'
    ctx.header[CREDENTIAL_HEADER] = request.data.jwt
  } catch (e) {
    console.error(e)
  }

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
