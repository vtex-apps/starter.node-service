import type { Context } from 'koa'

import { getRouteId } from '../../utils/context.utils'

describe('Context utils', () => {
  it('should get route id with method and path', () => {
    expect(
      getRouteId({
        method: 'GET',
        path: '/route',
      } as Context)
    ).toBe('GET-/route')
  })
})
