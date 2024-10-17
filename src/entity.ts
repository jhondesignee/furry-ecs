export default class Entity {
  public readonly EID: number
  private static nextEID: number = 0
  private static recycledEID: Set<number> = new Set()

  constructor() {
    this.EID = Entity.getNextEID()
  }

  public static recycleEID(EID: number): void {
    this.recycledEID.add(EID)
  }

  public static reset(): void {
    this.EID = 0
    this.nextEID = 1
    this.recycledEID.clear()
  }

  private static getNextEID(): number {
    if (this.recycledEID.size) {
      const EID = this.recycledEID.values().next().value
      if (EID === this.nextEID) this.nextEID++
      this.recycledEID.delete(EID)
      return EID
    }
    return this.nextEID++
  }
}
