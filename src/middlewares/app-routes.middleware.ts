/* eslint-disable max-params */
import type { ClientsConfig, IOClients } from '@vtex/api'
import { authTokens } from '@vtex/api/lib/service/worker/runtime/http/middlewares/authTokens'
import { cancellationToken } from '@vtex/api/lib/service/worker/runtime/http/middlewares/cancellationToken'
import { clients } from '@vtex/api/lib/service/worker/runtime/http/middlewares/clients'
import { perMinuteRateLimiter } from '@vtex/api/lib/service/worker/runtime/http/middlewares/rateLimit'
import { trackIncomingRequestStats } from '@vtex/api/lib/service/worker/runtime/http/middlewares/requestStats'
import { removeSetCookie } from '@vtex/api/lib/service/worker/runtime/http/middlewares/setCookie'
// import { timings } from '@vtex/api/lib/service/worker/runtime/http/middlewares/timings'
import { vary } from '@vtex/api/lib/service/worker/runtime/http/middlewares/vary'
import { traceUserLandRemainingPipelineMiddleware } from '@vtex/api/lib/service/tracing/tracingMiddlewares'
import koaCompose from 'koa-compose'

import { nameSpanOperationMiddleware } from './tracing.middleware'
import { createContextMiddleware } from './context.middleware'
import { globalLimiter } from './default-configuration.constants'
import { fetchAppTokenMiddleware } from './fetch-app-token.middleware'
import { validateExpectedHeaders } from './validate-expected-headers.middleware'

export const createAppRoutesMiddleware = <T extends IOClients>(
  clientsConfig: ClientsConfig<T>
) => {
  const { implementation, options } = clientsConfig

  const middlewares = [
    validateExpectedHeaders,
    fetchAppTokenMiddleware,
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
    // TODO if param is undefined, concurrentRateLimiter is noop
    // concurrentRateLimiter(serviceRoute?.rateLimitPerReplica?.concurrent),
    perMinuteRateLimiter(undefined, globalLimiter),
    traceUserLandRemainingPipelineMiddleware(),
  ]

  return koaCompose(middlewares)
}
