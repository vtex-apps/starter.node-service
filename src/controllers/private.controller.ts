import type { BaseContext } from 'koa'
import { StatusCodes } from 'http-status-codes'

export default class PrivateController {
  public static async getPrivate(ctx: BaseContext) {
    ctx.status = StatusCodes.OK
    ctx.body =
      'This is a private route. It requires valid credentials in order to access it'
  }
}
