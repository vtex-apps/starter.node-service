import type { ClientsConfig, RouteHandler } from '@vtex/api'
import { IOClients } from '@vtex/api'
import { createTokenBucket } from '@vtex/api/lib/service/worker/runtime/utils/tokenBucket'
import {
  createPublicHttpRoute,
  createPrivateHttpRoute,
} from '@vtex/api/lib/service/worker/runtime/http/index'

import authorization from '../middlewares/authorization-middleware'

const globalLimiter = createTokenBucket()

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
) {
  const route = { path }

  return createPublicHttpRoute(
    clientConfig,
    handler,
    route,
    routeId,
    globalLimiter
  )
}

export function privateRoute(
  routeId: string,
  path: string,
  handler: RouteHandler
) {
  const route = { path }

  const middlewares = [authorization, handler]

  return createPrivateHttpRoute(
    clientConfig,
    middlewares,
    route,
    routeId,
    globalLimiter
  )
}
