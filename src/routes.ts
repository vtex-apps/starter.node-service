/* eslint-disable @typescript-eslint/no-explicit-any */
import Router from 'koa-router'

import HealthCheckController from './controllers/healthcheck.controller'
import IndexController from './controllers/index.controller'
import PrivateController from './controllers/private.controller'
import authorization from './middlewares/authorization.middleware'

const router = new Router()

router.get('/', IndexController.getIndex)

router.get('/private', authorization, PrivateController.getPrivate)

router.get('/healthcheck', HealthCheckController.getHealthCheck)

export default router
