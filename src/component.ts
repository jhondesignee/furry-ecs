import Storage from "#storage"
import { DEFAULT_ARRAY_SIZE, DEFAULT_WORLD_SIZE, ComponentType } from "#constants"
import type Entity from "#entity"
import type { ComponentSchema, ComponentProps } from "#types"

export default class Component<Schema extends ComponentSchema<ComponentType> = {}> {
  public readonly props: ComponentProps<Schema>
  public readonly entities: Storage<Entity>

  constructor(schema?: Schema) {
    this.props = Component.createProperties(schema || ({} as Schema))
    this.entities = new Storage()
  }

  private static createProperties<Schema extends ComponentSchema<ComponentType>>(schema: Schema): ComponentProps<Schema> {
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
}
