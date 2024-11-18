import type { SystemConfig, SystemStartFunction, SystemUpdateFunction, SystemDestroyFunction } from "#types"

export default class System {
  public readonly start: SystemStartFunction | undefined
  public readonly update: SystemUpdateFunction | undefined
  public readonly destroy: SystemDestroyFunction | undefined

  constructor(config?: SystemConfig) {
    this.start = config?.start
    this.update = config?.update
    this.destroy = config?.destroy
  }
}
