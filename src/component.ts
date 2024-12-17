import Storage from "#storage"
import Entity from "#entity"
import { DEFAULT_WORLD_SIZE, ComponentType } from "#constants"
import type { ComponentSchema, ComponentPropValue, ComponentProps, ComponentPropsObject, SerializableClass } from "#types"

export default class Component<T extends ComponentSchema> implements SerializableClass<Component<any> | Storage<any>> {
  public readonly classes = [Component, Storage]
  public readonly entities: Storage<Entity>
  public readonly size: number
  private readonly properties: ComponentProps<T>

  constructor(schema?: T, size?: number) {
    if (schema !== undefined && (typeof schema !== "object" || Array.isArray(schema) || schema === null)) {
      throw new TypeError("'schema' parameter must be an object")
    }
    for (const [key, value] of Object.entries(schema || {})) {
      if (typeof key !== "string") {
        throw new TypeError("Schema property name must be a string")
      }
      if (typeof value !== "number") {
        throw new TypeError("Schema property type must be a 'ComponentType' value")
      }
    }
    if (size !== undefined && (typeof size !== "number" || size === null)) {
      throw new TypeError("'size' parameter must be a number")
    }
    this.size = size || DEFAULT_WORLD_SIZE
    schema ??= {} as T
    this.properties = this.createProperties(schema)
    this.entities = new Storage()
  }

  public get props(): ComponentProps<T> {
    return this.properties
  }

  public getProp<K extends keyof T>(prop: K, EID: number): ComponentPropValue<T[K]> | undefined {
    if (typeof prop !== "string") {
      throw new TypeError("'prop' parameter must be a string")
    }
    if (typeof EID !== "number" || EID === null) {
      throw new TypeError("'EID' parameter must be a number")
    }
    return this.properties.get(prop)?.get(EID) ?? undefined
  }

  public setProp<K extends keyof T, V extends ComponentPropValue<T[K]>>(prop: K, EID: number, value: V): boolean {
    if (typeof prop !== "string") {
      throw new TypeError("'prop' parameter must be a string")
    }
    if (typeof EID !== "number" || EID === null) {
      throw new TypeError("'EID' parameter must be a number")
    }
    if (typeof value !== "number" && !Array.isArray(value)) {
      throw new TypeError("'value' property must be a number of an array of numbers")
    }
    const property = this.properties.get(prop)
    if (!property) return false
    if (property.size >= this.size && !property.has(EID)) return false
    property.set(EID, value)
    return true
  }

  public deleteProp<K extends keyof T>(prop: K, EID: number): boolean {
    if (typeof prop !== "string") {
      throw new TypeError("'prop' parameter must be a string")
    }
    if (typeof EID !== "number" || EID === null) {
      throw new TypeError("'EID' parameter must be a number")
    }
    const property = this.properties.get(prop)
    if (!property || !property.has(EID)) return false
    property.delete(EID)
    return true
  }

  public getProps(EID: number): Partial<ComponentPropsObject<T>> {
    if (typeof EID !== "number" || EID === null) {
      throw new TypeError("'EID' parameter must be a number")
    }
    const result = {} as Partial<ComponentPropsObject<T>>
    for (const [prop, value] of this.properties) {
      const entityValue = value?.get(EID)
      if (entityValue === undefined) continue
      result[prop] = entityValue
    }
    return result
  }

  public setProps(EID: number, props: Partial<ComponentPropsObject<T>>): boolean {
    if (typeof EID !== "number" || EID === null) {
      throw new TypeError("'EID' parameter must be a number")
    }
    if (typeof props !== "object" || Array.isArray(props) || props === null) {
      throw new TypeError("'props' parameter must be an object")
    }
    let success = true
    for (const [prop, value] of Object.entries(props)) {
      if (typeof prop !== "string") {
        throw new TypeError("'props' object keys must be a string")
      }
      if (value === undefined || value === null) continue
      if (typeof value !== "number" && !Array.isArray(value)) {
        throw new TypeError("'schema' object values must be a number or an array of numbers")
      }
      const result = this.setProp(prop, EID, value)
      if (!result) success = false
    }
    return success
  }

  public deleteProps(EID: number): boolean {
    if (typeof EID !== "number" || EID === null) {
      throw new TypeError("'EID' parameter must be a number")
    }
    let success = true
    for (const prop of this.properties.keys()) {
      const result = this.deleteProp(prop, EID)
      if (!result) success = false
    }
    return success
  }

  public attachEntity(entity: Entity): boolean {
    if (!(entity instanceof Entity)) {
      throw new TypeError("'entity' parameter must be an 'Entity' instance")
    }
    if (this.entities.length(true) >= this.size) return false
    return this.entities.addData(entity)
  }

  public detachEntity(entity: Entity): boolean {
    if (!(entity instanceof Entity)) {
      throw new TypeError("'entity' parameter must be an 'Entity' instance")
    }
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
