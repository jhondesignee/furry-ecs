import { describe, test, expectTypeOf } from "vitest"
import System from "#system"

describe("System class test", () => {
  test("System should store the functions", () => {
    const system1 = new System({
      start: () => {},
      update: () => {},
      destroy: () => {}
    })
    const system2 = new System({
      update: () => {}
    })
    expectTypeOf(system1.start).toBeFunction
    expectTypeOf(system1.update).toBeFunction
    expectTypeOf(system1.destroy).toBeFunction
    expectTypeOf(system2.start).toBeUndefined
    expectTypeOf(system2.update).toBeFunction
    expectTypeOf(system2.destroy).toBeUndefined
  })
})
