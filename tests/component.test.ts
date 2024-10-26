import { describe, test, expectTypeOf } from "vitest"
import Component from "#component"
import { ComponentType } from "#constants"

describe("Component class test", () => {
  test("Properties should have the correct type of schema", () => {
    const component1 = new Component({ foo: ComponentType.NUMBER, bar: ComponentType.ARRAY })
    const component2 = new Component({ baz: ComponentType.ARRAY })
    const component3 = new Component({})
    // @ts-expect-error
    expectTypeOf(component1.props.foo).toEqualTypeOf<{ foo: Array<number>; bar: Array<Array<number>> }>()
    // @ts-expect-error
    expectTypeOf(component2.props).toEqualTypeOf<{ baz: Array<Array<number>> }>()
    expectTypeOf(component3.props).toEqualTypeOf<{}>()
  })
})
