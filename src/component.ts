import Storage from "#storage"
import { DEFAULT_WORLD_SIZE, ComponentType } from "#constants"
import type Entity from "#entity"
import type { ComponentSchema, ComponentPropValue, ComponentProps, ComponentPropsObject, SerializableClass } from "#types"

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
    return this.properties.get(prop)?.get(EID) ?? undefined
  }

  public setProp<K extends keyof T, V extends ComponentPropValue<T[K]>>(prop: K, EID: number, value: V): boolean {
    const property = this.properties.get(prop)
    if (!property) return false
    if (property.size >= this.size && !property.has(EID)) return false
    property.set(EID, value)
    return true
  }

  public deleteProp<K extends keyof T>(prop: K, EID: number): boolean {
    const property = this.properties.get(prop)
    if (!property || !property.has(EID)) return false
    property.delete(EID)
    return true
  }

  public getProps(EID: number): Partial<ComponentPropsObject<T>> {
    const result = {} as Partial<ComponentPropsObject<T>>
    for (const [prop, value] of this.properties) {
      const entityValue = value?.get(EID)
      if (entityValue === undefined) continue
      result[prop] = entityValue
    }
    return result
  }

  public setProps(EID: number, props: Partial<ComponentPropsObject<T>>): boolean {
    let success = true
    for (const [prop, value] of Object.entries(props)) {
      if (value === undefined || value === null) continue
      const result = this.setProp(prop, EID, value)
      if (!result) success = false
    }
    return success
  }

  public deleteProps(EID: number): boolean {
    let success = true
    for (const prop of this.properties.keys()) {
      const result = this.deleteProp(prop, EID)
      if (!result) success = false
    }
    return success
  }

  public attachEntity(entity: Entity): boolean {
    if (this.entities.length(true) >= this.size) return false
    return this.entities.addData(entity)
  }

  public detachEntity(entity: Entity): boolean {
    return this.entities.removeData(entity)
  }

  public destroy(): void {
    this.entities.destroy()
    this.properties.forEach(property => property?.clear())
  }

  private createProperties(schema: T): ComponentProps<T> {
    return Object.entries(schema).reduce((properties, [prop, type]) => {
      switch (type) {
        case ComponentType.ARRAY:
        case ComponentType.NUMBER:
          properties.set(prop, new Map())
          break
        default:
          properties.set(prop, null)
      }
      return properties
    }, new Map())
  }
}
