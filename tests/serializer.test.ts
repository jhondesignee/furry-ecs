import { beforeAll, describe, test, expect } from "vitest"
import Serializer from "#serializer"
import { Serializable } from "#constants"
import type { SerializableClass } from "#types"

class Foo implements SerializableClass<Foo> {
  public readonly classes = [Foo]
  public readonly value: number

  constructor(value: number) {
    this.value = value
  }
}

class Bar implements SerializableClass<Bar> {
  public readonly classes = [Bar]
  private readonly value: number

  constructor(data: number) {
    this.value = 20 * data
    this.value
  }
}

describe("Serializer class test", () => {
  let data: {
    a: number
    b: string
    c: boolean
    d?: undefined
    e: Map<number, number>
    f: Set<number>
    g: {
      a: number
      b: {
        c: [number, number]
      }
      c: number
    }
    h: Foo
    i: Bar
  }
  let serializer: Serializer<typeof data | Foo | Bar | number>

  beforeAll(() => {
    data = {
      a: 0,
      b: "foo",
      c: false,
      d: undefined,
      e: new Map([
        [0, 1],
        [2, 3]
      ]),
      f: new Set([0, 1, 2]),
      g: {
        a: 0,
        b: {
          c: [0, 1]
        },
        c: 1
      },
      h: new Foo(0),
      i: new Bar(2)
    }
    serializer = new Serializer({
      serializeHandler(obj, self) {
        if (obj instanceof Foo) {
          const serialized = self.serialize(obj.value)
          if (serialized !== undefined) {
            serialized.name = Foo.name
            return serialized
          }
        }
        return
      },
      deserializeHandler(obj, self) {
        if (obj.name === Foo.name) {
          obj.name = "Number"
          const result = self.deserialize(obj)
          if (result !== undefined) {
            return new Foo(result as number)
          }
        }
        return
      }
    })
  })

  test("Data should be converted to JSON", () => {
    expect(serializer.serialize(data)).toStrictEqual({
      type: Serializable.OBJECT,
      name: "Object",
      value: [
        ["a", { type: Serializable.NUMBER, name: "Number", value: 0 }],
        ["b", { type: Serializable.STRING, name: "String", value: "foo" }],
        ["c", { type: Serializable.BOOLEAN, name: "Boolean", value: false }],
        [
          "e",
          {
            type: Serializable.MAP,
            name: "Map",
            value: [
              [
                { type: Serializable.NUMBER, name: "Number", value: 0 },
                { type: Serializable.NUMBER, name: "Number", value: 1 }
              ],
              [
                { type: Serializable.NUMBER, name: "Number", value: 2 },
                { type: Serializable.NUMBER, name: "Number", value: 3 }
              ]
            ]
          }
        ],
        [
          "f",
          {
            type: Serializable.SET,
            name: "Set",
            value: [
              { type: Serializable.NUMBER, name: "Number", value: 0 },
              { type: Serializable.NUMBER, name: "Number", value: 1 },
              { type: Serializable.NUMBER, name: "Number", value: 2 }
            ]
          }
        ],
        [
          "g",
          {
            type: Serializable.OBJECT,
            name: "Object",
            value: [
              ["a", { type: Serializable.NUMBER, name: "Number", value: 0 }],
              [
                "b",
                {
                  type: Serializable.OBJECT,
                  name: "Object",
                  value: [
                    [
                      "c",
                      {
                        type: Serializable.ARRAY,
                        name: "Array",
                        value: [
                          { type: Serializable.NUMBER, name: "Number", value: 0 },
                          { type: Serializable.NUMBER, name: "Number", value: 1 }
                        ]
                      }
                    ]
                  ]
                }
              ],
              ["c", { type: Serializable.NUMBER, name: "Number", value: 1 }]
            ]
          }
        ],
        ["h", { type: Serializable.NUMBER, name: "Foo", value: 0 }],
        [
          "i",
          {
            type: Serializable.OBJECT,
            name: "Bar",
            value: [
              [
                "value",
                {
                  type: Serializable.NUMBER,
                  name: "Number",
                  value: 40
                }
              ]
            ]
          }
        ]
      ]
    })
  })
  test("Serialized data should be restored", () => {
    const serialized = serializer.serialize(data)
    const deserialized = serializer.deserialize(serialized as NonNullable<typeof serialized>)
    delete data["d"]
    // @ts-expect-error
    delete data["i"]["classes"]
    expect(deserialized).toStrictEqual(data)
  })
  test("Unsupported values should be ignored", () => {
    const data = {
      a: 0,
      b: [0, undefined],
      c: new Map([
        [0, 1],
        [2, undefined]
      ]),
      d: new Set([0, undefined]),
      e: undefined,
      f: undefined,
      g: new Serializer<number>(),
      h: new Foo(0)
    }
    const serializer = new Serializer<typeof data>()
    const serialized = serializer.serialize(data)
    expect(serialized).toStrictEqual({
      type: Serializable.OBJECT,
      name: "Object",
      value: [
        ["a", { type: Serializable.NUMBER, name: "Number", value: 0 }],
        ["b", { type: Serializable.ARRAY, name: "Array", value: [{ type: Serializable.NUMBER, name: "Number", value: 0 }] }],
        [
          "c",
          {
            type: Serializable.MAP,
            name: "Map",
            value: [
              [
                { type: Serializable.NUMBER, name: "Number", value: 0 },
                { type: Serializable.NUMBER, name: "Number", value: 1 }
              ]
            ]
          }
        ],
        ["d", { type: Serializable.SET, name: "Set", value: [{ type: Serializable.NUMBER, name: "Number", value: 0 }] }],
        [
          "h",
          {
            type: Serializable.OBJECT,
            name: "Foo",
            value: [
              [
                "value",
                {
                  type: Serializable.NUMBER,
                  name: "Number",
                  value: 0
                }
              ]
            ]
          }
        ]
      ]
    })
    // @ts-expect-error
    serialized["value"].push(["g", { type: 10, value: undefined }])
    // @ts-expect-error
    serialized["value"][1][1]["value"].push({ type: Serializable.NUMBER, value: undefined })
    // @ts-expect-error
    serialized["value"][2][1]["value"].push([
      { type: Serializable.NUMBER, value: undefined },
      { type: Serializable.NUMBER, value: 0 }
    ])
    // @ts-expect-error
    serialized["value"][3][1]["value"].push({ type: Serializable.NUMBER, value: undefined })
    const deserialized = serializer.deserialize(serialized as NonNullable<typeof serialized>)
    const result = {
      a: 0,
      b: [0],
      c: new Map([[0, 1]]),
      d: new Set([0]),
      h: new Foo(0)
    }
    // @ts-expect-error
    delete result["h"]["classes"]
    expect(deserialized).toStrictEqual(result)
  })
})
