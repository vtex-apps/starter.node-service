import type { ServiceContext } from '@vtex/api'

export const nameSpanOperationMiddleware = () => {
  return function nameSpanOperation(
    ctx: ServiceContext,
    next: () => Promise<void>
  ) {
    const operationType = 'app-route-handler'

    // TODO get routeId from request
    const operationName = ''

    ctx.tracing?.currentSpan.setOperationName(
      `${operationType}:${operationName}`
    )

    return next()
  }
}
