import type { Context } from 'koa'
import { StatusCodes } from 'http-status-codes'
import type { Catalog } from '@vtex/clients'

export default class CallVtexApiExampleController {
  public static async getProductCategory(ctx: Context) {
    const { catalog }: { catalog: Catalog } = ctx.clients

    const category = await catalog.getCategoryById('1')

    ctx.status = StatusCodes.OK
    ctx.body = category
  }
}
