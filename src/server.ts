import Router from 'koa-router'

import IndexController from './controllers/index.controller'
import HealthCheckController from './controllers/healthcheck.controller'

const router = new Router()

const ROUTES = {
  base: '/',
  healthcheck: '/healthcheck',
}

router.get(ROUTES.base, IndexController.getIndex)
router.get(ROUTES.healthcheck, HealthCheckController.getHealthCheck)

export default router
