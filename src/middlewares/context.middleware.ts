import type {
  ParamsContext,
  RecorderState,
  ServiceContext,
  IOClients,
} from '@vtex/api'
import { prepareHandlerCtx } from '@vtex/api/lib/service/worker/runtime/utils/context'

import { getRouteId } from '../utils/context.utils'

export const createContextMiddleware = () => {
  return async function pvtContext<
    T extends IOClients,
    U extends RecorderState,
    V extends ParamsContext
  >(ctx: ServiceContext<T, U, V>, next: () => Promise<void>) {
    const {
      params,
      request: { header },
    } = ctx

    const routeId = getRouteId(ctx)

    ctx.vtex = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...prepareHandlerCtx(header, ctx.tracing!),
      // TODO ...(smartcache && { recorder: ctx.state.recorder }),
      route: {
        id: routeId,
        params,
        type: 'private',
      },
    }
    await next()
  }
}
