import { createTokenBucket } from '@vtex/api/lib/service/worker/runtime/utils/tokenBucket'
import type { ClientsConfig } from '@vtex/api'
import { IOClients } from '@vtex/api'

export const globalLimiter = createTokenBucket()

export const defaultClients: ClientsConfig = {
  implementation: IOClients,
  options: {
    messages: {
      concurrency: 10,
      retries: 2,
      timeout: 1000,
    },
    messagesGraphQL: {
      concurrency: 10,
      retries: 2,
      timeout: 1000,
    },
  },
}
