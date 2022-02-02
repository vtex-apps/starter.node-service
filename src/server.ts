import Koa from 'koa'
import Router from 'koa-router'
// import graphqlHTTP from 'koa-graphql'

// import { GraphqlSchema } from './graphql/graphql.schema'
// import { graphQlResolvers } from './graphql/resolvers/graphql.resolvers'
import { ROUTES } from './routes'
// import configuration from './utils/configuration.utils'
import { configureRoutes } from './utils/route.utils'
import { configureDefaultMiddlewares } from './middlewares'

const app = new Koa()
const port = process.env.PORT ?? 8080

configureDefaultMiddlewares(app)
configureRoutes(app, ROUTES)

const router = new Router()

app.use(router.routes())

// router.all(
//   '/graphql',
//   graphqlHTTP({
//     schema: GraphqlSchema,
//     rootValue: graphQlResolvers,
//     graphiql: !configuration.isProd(),
//   })
// )

// app.use(router.routes()).use(router.allowedMethods())

const server = app.listen(port, () => {
  console.log(`App listening on the port ${port}`)
})

export { app, server }
