import type { SystemConfig, SystemStartFunction, SystemUpdateFunction, SystemDestroyFunction } from "#types"

export default class System {
  public readonly start: SystemStartFunction | undefined
  public readonly update: SystemUpdateFunction | undefined
  public readonly destroy: SystemDestroyFunction | undefined

  constructor(config?: SystemConfig) {
    /* istanbul ignore if -- @preserve */
    if (typeof config === "function") {
      console.warn("Deprecation warning: config cannot be used as a function")
    } else {
      this.start = config?.start
      this.update = config?.update
      this.destroy = config?.destroy
    }
  }
}
