// @ts-nocheck inconsistent type check behavior for components with unrecognized type
import { describe, test, expect } from "vitest"
import Component from "#component"
import Entity from "#entity"
import { DEFAULT_WORLD_SIZE, DEFAULT_ARRAY_SIZE, ComponentType } from "#constants"

describe.concurrent("Component class test", () => {
  test("Properties should have the correct type of schema", () => {
    const component1 = new Component({
      foo: { type: ComponentType.NUMBER },
      bar: { type: ComponentType.ARRAY, length: 10 }
    })
    const component2 = new Component({
      baz: { type: ComponentType.ARRAY },
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
  test("Attach entity out of range should return false", () => {
    const component = new Component({}, 2)
    expect(component.attachEntity(new Entity())).toBeTruthy()
    expect(component.attachEntity(new Entity())).toBeTruthy()
    expect(component.attachEntity(new Entity())).toBeFalsy()
  })
})
