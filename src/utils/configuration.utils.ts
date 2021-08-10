export default class ConfigurationUtils {
  public static isProd(): boolean {
    return !(
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    )
  }
}
