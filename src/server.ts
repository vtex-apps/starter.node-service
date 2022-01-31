import Router from 'koa-router'
import dotenv from 'dotenv'

import IndexController from './controllers/index.controller'
import HealthCheckController from './controllers/healthcheck.controller'
import PrivateController from './controllers/private.controller'
import authorization from './utils/authorizationMiddleware'

dotenv.config({ path: './src/.env' })
const router = new Router()

const ROUTES = {
  base: '/',
  healthcheck: '/healthcheck',
  private: '/private',
}

router.use([ROUTES.private], authorization)

router.get(ROUTES.base, IndexController.getIndex)
router.get(ROUTES.healthcheck, HealthCheckController.getHealthCheck)
router.get(ROUTES.private, PrivateController.getPrivate)

export default router
