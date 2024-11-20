import Storage from "#storage"
import { DEFAULT_WORLD_SIZE } from "#constants"
import type Entity from "#entity"
import type { ComponentSchema, ComponentPropValue, ComponentProps, SerializableClass } from "#types"

export default class Component<T extends ComponentSchema> implements SerializableClass<Component<any> | Storage<any>> {
  public readonly classes = [Component, Storage]
  public readonly entities: Storage<Entity>
  public readonly size: number
  private readonly properties: ComponentProps<T>

  constructor(schema?: T, size?: number) {
    this.size = size || DEFAULT_WORLD_SIZE
    schema ??= {} as T
    this.properties = this.createProperties(schema)
    this.entities = new Storage()
  }

  public get props(): ComponentProps<T> {
    return this.properties
  }

  public getProp<K extends keyof T>(prop: K, EID: number): ComponentPropValue<T[K]> | undefined {
    return this.properties.get(prop)?.get(EID)
  }

  public setProp<K extends keyof T, V extends ComponentPropValue<T[K]>>(prop: K, EID: number, value: V): boolean {
    if (EID >= this.size) return false
    return this.properties.get(prop)?.set(EID, value) ? true : false
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

  private createProperties(schema: T): ComponentProps<T> {
    return Object.keys(schema).reduce((properties, key) => {
      properties.set(key, new Map())
      return properties
    }, new Map())
  }
}
