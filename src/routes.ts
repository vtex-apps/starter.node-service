/* eslint-disable @typescript-eslint/no-explicit-any */
import Router from 'koa-router'

import HealthCheckController from './controllers/healthcheck.controller'
import IndexController from './controllers/index.controller'
import PrivateController from './controllers/private.controller'
import { privateRoute, publicRoute } from './utils/route.utils'

const router = new Router()

router.get('/', publicRoute('base', '/', IndexController.getIndex) as any)

router.get(
  '/private',
  privateRoute('private', '/', PrivateController.getPrivate) as any
)

router.get('/healthcheck', HealthCheckController.getHealthCheck)

export default router
