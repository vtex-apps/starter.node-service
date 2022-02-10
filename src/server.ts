import type { ClientsConfig } from '@vtex/api'
import { TracerSingleton } from '@vtex/api/lib/service/tracing/TracerSingleton'
import Koa from 'koa'

// import graphqlHTTP from 'koa-graphql'

// import { GraphqlSchema } from './graphql/graphql.schema'
// import { graphQlResolvers } from './graphql/resolvers/graphql.resolvers'
import { Clients } from './clients'
import { defaultMiddlewares } from './middlewares'
import { defaultClientOptions } from './middlewares/default-configuration.constants'
import router from './routes'

const app = new Koa()
const port = process.env.PORT ?? 8080

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    ...defaultClientOptions,

    // You can add specific options for each client here
    catalog: {
      timeout: 1000,
    },
  },
}

const middlewares = defaultMiddlewares(clients)

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

declare module 'opentracing' {
  interface Tracer {
    close(): void
  }
}

server.on('close', () => {
  const tracer = TracerSingleton.getTracer()

  tracer.close()
})

export { app, server }
