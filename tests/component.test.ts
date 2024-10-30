import { describe, test, expectTypeOf } from "vitest"
import Component from "#component"
import { ComponentType } from "#constants"

describe("Component class test", () => {
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
    expectTypeOf(component1.props).toEqualTypeOf<{ foo: Array<number>; bar: Array<Array<number>> }>()
    // @ts-expect-error
    expectTypeOf(component2.props).toEqualTypeOf<{ baz: Array<Array<number>>; auauauauaua: null }>() // type 'number[][]' is not assignable to type 'never'
    expectTypeOf(component3.props).toEqualTypeOf<{}>()
  })
})
