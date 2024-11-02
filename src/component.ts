import Storage from "#storage"
import { DEFAULT_WORLD_SIZE, DEFAULT_ARRAY_SIZE, ComponentType } from "#constants"
import type Entity from "#entity"
import type { ComponentSchema, ComponentProps, DeprecatedComponentSchema } from "#types"

export default class Component<Schema extends ComponentSchema<ComponentType> = {}> {
  public readonly props: ComponentProps<Schema>
  public readonly entities: Storage<Entity>
  public readonly size: number

  constructor(schema?: Schema | DeprecatedComponentSchema, size?: number) {
    this.size = size || DEFAULT_WORLD_SIZE
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

  public attachEntity(entity: Entity): boolean {
    if (this.entities.length(true) >= this.size) {
      return false
    }
    return this.entities.addData(entity)
  }

  public detachEntity(entity: Entity): boolean {
    return this.entities.removeData(entity)
  }

  private createProperties<Schema extends ComponentSchema<ComponentType>>(schema: Schema): ComponentProps<Schema> {
    return Object.fromEntries(
      Object.entries(schema).map(([key, { type, length }]) => {
        switch (type) {
          case ComponentType.NUMBER:
            // TODO: replace hardcoded size by the component size
            return [key, new Array(this.size).fill(0)]
          case ComponentType.ARRAY:
            length ??= DEFAULT_ARRAY_SIZE
            return [key, Array.from({ length: this.size }, () => new Array(length).fill(0))]
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
