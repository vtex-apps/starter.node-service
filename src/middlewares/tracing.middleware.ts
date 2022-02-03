import type { ServiceContext } from '@vtex/api'

import { getRouteId } from '../utils/context.utils'

export const nameSpanOperationMiddleware = () => {
  return function nameSpanOperation(
    ctx: ServiceContext,
    next: () => Promise<void>
  ) {
    const operationType = 'app-route-handler'

    const operationName = getRouteId(ctx)

    ctx.tracing?.currentSpan.setOperationName(
      `${operationType}:${operationName}`
    )

    return next()
  }
}
