import { beforeAll, describe, test, expect, expectTypeOf } from "vitest"
import Component from "#component"
import Entity from "#entity"
import { ComponentType } from "#constants"
import type { ComponentProps } from "#types"

describe("Component class test", () => {
  let schema: {
    foo: ComponentType.NUMBER
    bar: ComponentType.ARRAY
    baz: 2
  }
  // @ts-expect-error incompatible property baz from schema
  let component: Component<typeof schema>

  beforeAll(() => {
    schema = {
      foo: ComponentType.NUMBER,
      bar: ComponentType.ARRAY,
      baz: 2 as const
    }
    // @ts-expect-error incompatible property baz from schema
    component = new Component(schema, 2)
  })

  test("Properties should have the correct type of schema", () => {
    // @ts-expect-error
    expectTypeOf(component.props).toEqualTypeOf<ComponentProps<typeof schema>>()
  })
  test("Properties should be set", () => {
    expect(component.setProp("foo", 0, 0)).toBeTruthy()
    expect(component.setProp("bar", 0, [0, 1, 2])).toBeTruthy()
    // @ts-expect-error
    expect(component.setProp("unknown", 0, 0)).toBeFalsy()
    expect(
      component.setProps(1, {
        foo: 1,
        bar: [1, 2, 3],
        baz: null
      })
    ).toBeTruthy()
    // @ts-expect-error baz is not a valid property
    expect(component.setProps(1, { baz: 2 })).toBeFalsy()
  })
  test("Properties should be get", () => {
    expect(component.getProp("foo", 0)).toBe(0)
    expect(component.getProp("bar", 0)).toStrictEqual([0, 1, 2])
    expect(component.getProp("baz", 0)).toBeUndefined()
    // @ts-expect-error incompatible property name
    expect(component.getProp("unknown", 0)).toBeUndefined()
    expect(component.getProps(1)).toStrictEqual({
      foo: 1,
      bar: [1, 2, 3]
    })
  })
  test("Set property out of range should return false", () => {
    expect(component.setProp("foo", 1, 0)).toBeTruthy()
    expect(component.setProp("foo", 2, 0)).toBeFalsy()
    expect(component.setProp("foo", 3, 0)).toBeFalsy()
  })
  test("Properties should be deleted", () => {
    component.deleteProp("foo", 0)
    expect(component.getProps(0)).toStrictEqual({
      bar: [0, 1, 2]
    })
    component.setProp("foo", 0, 0)
    expect(component.getProps(0)).toStrictEqual({
      foo: 0,
      bar: [0, 1, 2]
    })
    component.deleteProps(0)
    expect(component.getProps(0)).toStrictEqual({})
  })
  test("Attach entity out of range should return false", () => {
    expect(component.attachEntity(new Entity())).toBeTruthy()
    expect(component.attachEntity(new Entity())).toBeTruthy()
    expect(component.attachEntity(new Entity())).toBeFalsy()
  })
  test("Data should be destroyed", () => {
    component.destroy()
    expect(component.props.get("foo")?.size).toBe(0)
    expect(component.props.get("bar")?.size).toBe(0)
  })
})
