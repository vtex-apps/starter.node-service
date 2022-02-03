import Router from 'koa-router'

import CallVtexApiExampleController from './controllers/call-vtex-api-example.controller'
import HealthCheckController from './controllers/healthcheck.controller'
import IndexController from './controllers/index.controller'
import PrivateController from './controllers/private.controller'
import authorization from './middlewares/authorization.middleware'

const router = new Router()

router.get('/', IndexController.getIndex)

router.get('/private', authorization, PrivateController.getPrivate)

router.get('/category/1', CallVtexApiExampleController.getProductCategory)

router.get('/healthcheck', HealthCheckController.getHealthCheck)

export default router
