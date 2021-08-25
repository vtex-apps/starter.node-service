import type { Context } from 'koa'
import { StatusCodes } from 'http-status-codes'

export default class IndexController {
  public static async getIndex(ctx: Context) {
    ctx.status = StatusCodes.OK
  }
}
