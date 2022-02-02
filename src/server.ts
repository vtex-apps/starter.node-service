import Koa from 'koa'
// import graphqlHTTP from 'koa-graphql'

// import { GraphqlSchema } from './graphql/graphql.schema'
// import { graphQlResolvers } from './graphql/resolvers/graphql.resolvers'
import { defaultMiddlewares } from './middlewares'
import router from './routes'

const app = new Koa()
const port = process.env.PORT ?? 8080

const middlewares = defaultMiddlewares()

middlewares.forEach((middleware) => app.use(middleware))

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
