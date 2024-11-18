import Storage from "#storage"
import { DEFAULT_WORLD_SIZE, DEFAULT_ARRAY_SIZE, ComponentType } from "#constants"
import type Entity from "#entity"
import type { ComponentSchema, ComponentProps, SerializableClass } from "#types"

export default class Component<Schema extends ComponentSchema<ComponentType> = {}> implements SerializableClass<Component<any> | Storage<any>> {
  public readonly classes = [Component, Storage]
  public readonly props: ComponentProps<Schema>
  public readonly entities: Storage<Entity>
  public readonly size: number

  constructor(schema?: Schema, size?: number) {
    this.size = size || DEFAULT_WORLD_SIZE
    schema ??= {} as Schema
    this.props = this.createProperties(schema)
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
}
