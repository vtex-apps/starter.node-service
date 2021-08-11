import { buildSchema } from 'graphql'

export const GraphqlSchema = buildSchema(`
  type Query {
    hello: String
  }
`)
