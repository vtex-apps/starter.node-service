import Router from 'koa-router'

import IndexController from './controllers/index.controller'

const router = new Router()

router.get('/', IndexController.getIndex)

export default router
