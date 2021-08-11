import { ENVIRONMENT } from './configuration.constants'

export default class ConfigurationUtils {
  public static isProd(): boolean {
    return !(
      process.env.NODE_ENV === ENVIRONMENT.development ||
      process.env.NODE_ENV === ENVIRONMENT.test
    )
  }
}
