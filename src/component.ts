import { ComponentType } from "#constants"

export default class Component<Schema extends Record<string, ComponentType> = {}> {
  public readonly props: { [K in keyof Schema]: Schema[K] extends ComponentType.NUMBER ? Array<number> : Array<Array<number>> }

  constructor(schema: Schema) {
    this.props = Component.createProperties(schema)
  }

  private static createProperties<Schema extends Record<string, ComponentType>>(schema: Schema) {
    return Object.fromEntries(
      Object.entries(schema).map(([key, type]) => {
        switch (type) {
          case ComponentType.NUMBER:
            return [key, new Array<number>()]
          case ComponentType.ARRAY:
            return [key, new Array<Array<number>>()]
        }
      })
    ) as { [K in keyof Schema]: Schema[K] extends ComponentType.NUMBER ? Array<number> : Array<Array<number>> }
  }
}
