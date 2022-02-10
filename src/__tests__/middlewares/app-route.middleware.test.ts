import { IOClients } from '@vtex/api'

import { createAppRoutesMiddleware } from '../../middlewares/app-routes.middleware'
import { defaultClientOptions } from '../../middlewares/default-configuration.constants'

describe('App Route specific middlewares', () => {
  it('should return a composed middlware for app route', () => {
    expect(
      createAppRoutesMiddleware({
        implementation: IOClients,
        options: defaultClientOptions,
      })
    ).toBeDefined()
  })
})
