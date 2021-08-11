import type { BaseContext } from 'koa'
import { StatusCodes } from 'http-status-codes'

export default class IndexController {
  public static async getIndex(ctx: BaseContext) {
    ctx.status = StatusCodes.OK
  }
}
