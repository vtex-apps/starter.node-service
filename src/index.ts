import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import json from 'koa-json'
import logger from 'koa-logger'

import router from './server'
import configuration from './utils/configuration.utils'

const app = new Koa()
const port = process.env.PORT ?? 8080

app.use(helmet())
app.use(cors())
app.use(json())
app.use(bodyParser())
if (configuration.isProd()) {
  app.use(logger())
}

app.use(router.routes()).use(router.allowedMethods())

const server = app.listen(port, () => {
  console.log(`App listening on the port ${port}`)
})

export { app, server }
