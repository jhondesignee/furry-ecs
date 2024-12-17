import type { SystemConfig, SystemStartFunction, SystemUpdateFunction, SystemDestroyFunction } from "#types"

export default class System {
  public readonly start: SystemStartFunction | undefined
  public readonly update: SystemUpdateFunction | undefined
  public readonly destroy: SystemDestroyFunction | undefined

  constructor(config?: SystemConfig) {
    if (config !== undefined && (typeof config !== "object" || Array.isArray(config) || config === null)) {
      throw new TypeError("'config' parameter must be an object")
    }
    for (const value of Object.values(config || {})) {
      if (!(value instanceof Function)) {
        throw new TypeError("System callback must be a function")
      }
    }
    this.start = config?.start
    this.update = config?.update
    this.destroy = config?.destroy
  }
}
