import { describe, test, expect } from "vitest"
import Component from "#component"
import { DEFAULT_WORLD_SIZE, DEFAULT_ARRAY_SIZE, ComponentType } from "#constants"

describe.concurrent("Component class test", () => {
  test("Properties should have the correct type of schema", () => {
    const component1 = new Component({
      foo: { type: ComponentType.NUMBER },
      bar: { type: ComponentType.ARRAY, length: 10 }
    })
    const component2 = new Component({
      baz: { type: ComponentType.ARRAY },
      // @ts-expect-error
      auauauauaua: { type: 2 as const }
    })
    const component3 = new Component({})
    expect(component1.props).toStrictEqual({
      foo: new Array(DEFAULT_WORLD_SIZE).fill(0),
      bar: Array.from({ length: DEFAULT_WORLD_SIZE }, () => new Array(10).fill(0))
    })
    expect(component2.props).toStrictEqual({
      baz: Array.from({ length: DEFAULT_WORLD_SIZE }, () => new Array(DEFAULT_ARRAY_SIZE).fill(0)),
      auauauauaua: null
    })
    expect(component3.props).toStrictEqual({})
  })
  test("Deprecated scheme should be resolved", () => {
    const component = new Component({
      // @ts-expect-error
      foo: ComponentType.NUMBER,
      // @ts-expect-error
      bar: ComponentType.ARRAY,
      // @ts-expect-error
      baz: 2 as const
    })
    expect(component.props).toStrictEqual({
      foo: new Array(DEFAULT_WORLD_SIZE).fill(0),
      bar: Array.from({ length: DEFAULT_WORLD_SIZE }, () => new Array(DEFAULT_ARRAY_SIZE).fill(0)),
      baz: null
    })
  })
})
