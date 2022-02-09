import type { ServiceContext } from '@vtex/api'
import type { Request } from 'koa'

import { createContextMiddleware } from '../../middlewares/context.middleware'

declare module 'http' {
  interface IncomingHttpHeaders {
    'x-vtex-account'?: string
    'x-vtex-credential'?: string
  }
}

jest.mock('@vtex/api/lib/tracing/UserLandTracer')

describe('Context middleware', () => {
  // eslint-disable-next-line jest/no-focused-tests
  it('should create a valid context middleware', async () => {
    const contextMiddleware = createContextMiddleware()
    const ctx = {
      tracing: {},
      request: {
        header: {
          'x-vtex-account': 'account',
          'x-vtex-credential': 'credential',
        },
      } as Request,
    } as ServiceContext

    const next = jest.fn()

    await contextMiddleware(ctx, next)

    expect(next).toBeCalled()

    const vtexContext = ctx.vtex

    expect(vtexContext).toBeDefined()
    expect(vtexContext.account).toBe('account')
    expect(vtexContext.authToken).toBe('credential')
  })
})
