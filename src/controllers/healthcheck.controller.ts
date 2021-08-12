import type { BaseContext } from 'koa'
import { StatusCodes } from 'http-status-codes'

export default class HealthCheckController {
  public static async getHealthCheck(ctx: BaseContext) {
    ctx.status = StatusCodes.OK
  }
}
