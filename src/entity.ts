import type { SerializableClass } from "#types"

export default class Entity implements SerializableClass<Entity> {
  public readonly classes = [Entity]
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
    this.nextEID = 0
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
