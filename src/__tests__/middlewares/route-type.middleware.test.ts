import type { ServiceContext } from '@vtex/api'
import type { Context, Next } from 'koa'
import compose from 'koa-compose'

import type { MiddlewaresByRouteType } from '../../middlewares/route-type.middleware'
import { addExecuteMiddlewaresForRouteType } from '../../middlewares/route-type.middleware'

jest.mock('koa-compose')
const mockedCompose = compose as jest.MockedFunction<typeof compose>

describe('Route type resolver middlewarew', () => {
  const runTest = async (
    routePath: string,
    middlewaresByRouteType: MiddlewaresByRouteType<Context>
  ) => {
    mockedCompose.mockReturnValue((_ctx: unknown, _next?: Next) =>
      Promise.resolve()
    )

    const middleware = addExecuteMiddlewaresForRouteType(middlewaresByRouteType)

    expect(middleware).toBeDefined()

    const ctx = {
      request: {
        method: 'GET',
        path: routePath,
      },
    } as ServiceContext

    const next = jest.fn()

    await middleware(ctx, next)
  }

  it('should add middlewares for an app route type', async () => {
    const middlewaresByRouteType: MiddlewaresByRouteType<Context> = {
      app: [(_ctx: Context, _next: Next) => Promise.resolve()],
      system: [],
    }

    await runTest('/', middlewaresByRouteType)

    expect(mockedCompose).toBeCalledWith(middlewaresByRouteType.app)
  })

  it('should add middlewares for an system route type', async () => {
    const middlewaresByRouteType: MiddlewaresByRouteType<Context> = {
      app: [],
      system: [(_ctx: Context, _next: Next) => Promise.resolve()],
    }

    await runTest('/healthcheck', middlewaresByRouteType)

    expect(mockedCompose).toBeCalledWith(middlewaresByRouteType.system)
  })
})
