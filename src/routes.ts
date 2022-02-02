import type { ParamsContext, RecorderState, IOClients } from '@vtex/api'
import { method } from '@vtex/api'

import HealthCheckController from './controllers/healthcheck.controller'
import IndexController from './controllers/index.controller'
import PrivateController from './controllers/private.controller'
import type { RouteConfig } from './utils/route.utils'

export const ROUTES: Record<
  string,
  RouteConfig<IOClients, RecorderState, ParamsContext>
> = {
  base: {
    route: { path: '/', public: true },
    handler: method({
      GET: IndexController.getIndex,
    }),
  },
  healthcheck: {
    route: { path: '/healthcheck', public: true },
    handler: method({
      GET: HealthCheckController.getHealthCheck,
    }),
  },
  private: {
    route: { path: '/private', public: false },
    handler: method({
      GET: PrivateController.getPrivate,
    }),
  },
}
