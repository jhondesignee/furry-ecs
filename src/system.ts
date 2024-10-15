import type { SystemFunction } from "#types"

export default class System {
  public readonly onStart: SystemFunction

  constructor(systemFunction: SystemFunction) {
    this.onStart = systemFunction
  }
}
