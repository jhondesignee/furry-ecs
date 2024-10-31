import Storage from "#storage"
import { DEFAULT_ARRAY_SIZE, DEFAULT_WORLD_SIZE, ComponentType } from "#constants"
import type Entity from "#entity"
import type { ComponentSchema, ComponentProps, DeprecatedComponentSchema } from "#types"

export default class Component<Schema extends ComponentSchema<ComponentType> = {}> {
  public readonly props: ComponentProps<Schema>
  public readonly entities: Storage<Entity>

  constructor(schema?: Schema | DeprecatedComponentSchema) {
    schema ??= {}
    let resolvedSchema: Schema | undefined
    for (const value of Object.values(schema)) {
      if (typeof value !== "object") {
        resolvedSchema = this.resolveDeprecatedSchema(schema as DeprecatedComponentSchema)
        break
      }
    }
    this.props = this.createProperties((resolvedSchema as Schema) || schema)
    this.entities = new Storage()
  }

  private createProperties<Schema extends ComponentSchema<ComponentType>>(schema: Schema): ComponentProps<Schema> {
    return Object.fromEntries(
      Object.entries(schema).map(([key, { type, length }]) => {
        switch (type) {
          case ComponentType.NUMBER:
            // DEFAULT_WORLD_SIZE will be replaced by the world size soon
            return [key, new Array(DEFAULT_WORLD_SIZE).fill(0)]
          case ComponentType.ARRAY:
            length ??= DEFAULT_ARRAY_SIZE
            return [key, Array.from({ length: DEFAULT_WORLD_SIZE }, () => new Array(length).fill(0))]
          default:
            return [key, null]
        }
      })
    ) as ComponentProps<Schema>
  }

  private resolveDeprecatedSchema(deprecatedSchema: DeprecatedComponentSchema): Schema {
    let schema: ComponentSchema<ComponentType> = {}
    for (const [key, value] of Object.entries(deprecatedSchema)) {
      if (value === ComponentType.NUMBER) {
        schema[key] = { type: value }
      } else if (value === ComponentType.ARRAY) {
        schema[key] = { type: value, length: DEFAULT_ARRAY_SIZE }
      } else {
        schema[key] = { type: value }
      }
    }
    return schema as Schema
  }
}
