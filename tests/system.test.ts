import { describe, test, expectTypeOf } from "vitest"
import System from "#system"

describe("System class test", () => {
  test("System should store the function", () => {
    const system = new System(() => {})
    expectTypeOf(system.onStart).toBeFunction()
  })
})
