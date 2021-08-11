import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import json from 'koa-json'
import graphqlHTTP from 'koa-graphql'
import logger from 'koa-logger'

import { GraphqlSchema } from './graphql/graphql.schema'
import { graphQlResolvers } from './graphql/resolvers/graphql.resolvers'
import router from './server'
import configuration from './utils/configuration.utils'

const app = new Koa()
const port = process.env.PORT ?? 8080

app.use(
  helmet({
    // CSP is disabled in development to allow access to GraphiQL UI
    contentSecurityPolicy: configuration.isProd(),
  })
)
app.use(cors())
app.use(json())
app.use(bodyParser())
if (!configuration.isProd()) {
  app.use(logger())
}

router.all(
  '/graphql',
  graphqlHTTP({
    schema: GraphqlSchema,
    rootValue: graphQlResolvers,
    graphiql: !configuration.isProd(),
  })
)

app.use(router.routes()).use(router.allowedMethods())

const server = app.listen(port, () => {
  console.log(`App listening on the port ${port}`)
})

export { app, server }
