import { Span } from '@vtex/api'
import type { ServiceContext } from '@vtex/api'

import { nameSpanOperationMiddleware } from '../../middlewares/tracing.middleware'

describe('Tracing middleware', () => {
  it('should set tracing context operation name', async () => {
    const middleware = nameSpanOperationMiddleware()

    const span = new Span()

    const ctx = {
      method: 'GET',
      path: '/the-path',
      tracing: {
        currentSpan: span,
      },
    } as ServiceContext

    const next = jest.fn()

    const spanSpyInstance = jest.spyOn(span, 'setOperationName')

    await middleware(ctx, next)

    expect(spanSpyInstance).toHaveBeenCalledTimes(1)
    expect(spanSpyInstance).toHaveBeenLastCalledWith(
      'app-route-handler:GET-/the-path'
    )

    spanSpyInstance.mockRestore()
  })
})
