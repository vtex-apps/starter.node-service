import type { Context } from 'koa'
import { StatusCodes } from 'http-status-codes'

import type { Clients } from '../clients'

export default class CallVtexApiExampleController {
  public static async getProductCategory(ctx: Context) {
    const { catalog } = <Clients>ctx.clients

    const category = await catalog.getCategoryById('1')

    ctx.status = StatusCodes.OK
    ctx.body = category
  }
}
