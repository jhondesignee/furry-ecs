import { describe, test, expect } from "vitest"
import Entity from "#entity"

describe("Entity class test", () => {
  test("EID values should be incremental", () => {
    const entity1 = new Entity()
    const entity2 = new Entity()
    const entity3 = new Entity()
    expect(entity1.EID).toBe(0)
    expect(entity2.EID).toBe(1)
    expect(entity3.EID).toBe(2)
  })

  test("Discarded EIDs should be recycled", () => {
    Entity.reset()
    const entity1 = new Entity()
    const entity2 = new Entity()
    const entity3 = new Entity()
    Entity.recycleEID(entity2.EID)
    const entity4 = new Entity()
    const entity5 = new Entity()
    Entity.recycleEID(4)
    const entity6 = new Entity()
    const entity7 = new Entity()
    expect(entity1.EID).toBe(0)
    expect(entity2.EID).toBe(1)
    expect(entity3.EID).toBe(2)
    expect(entity4.EID).toBe(1)
    expect(entity5.EID).toBe(3)
    expect(entity6.EID).toBe(4)
    expect(entity7.EID).toBe(5)
  })
})
