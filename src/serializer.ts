import { Serializable } from "#constants"
import type {
  Constructor,
  SerializerConfig,
  CustomSerializeHandler,
  CustomDeserializeHandler,
  SerializedData,
  SerializedValueType,
  SerializedArray,
  SerializedMap,
  SerializedSet,
  SerializedObject,
  SerializableClass
} from "#types"

export default class Serializer<T, R = SerializedValueType<T>> {
  private readonly serializeHandler: CustomSerializeHandler<T, R> | undefined
  private readonly deserializeHandler: CustomDeserializeHandler<T, R> | undefined
  private readonly classes: Array<Constructor<T>>

  constructor(config?: SerializerConfig<T, R>) {
    this.serializeHandler = config?.serializeHandler
    this.deserializeHandler = config?.deserializeHandler
    this.classes = []
  }

  public serialize(obj: T): SerializedData<R> | undefined {
    if (obj instanceof Serializer) return undefined
    const customSerialized = this.serializeHandler?.(obj, this)
    if (customSerialized !== undefined) {
      return customSerialized
    }
    if (Array.isArray(obj)) {
      return this.serializeArray(obj)
    }
    if (obj instanceof Map) {
      return this.serializeMap(obj)
    }
    if (obj instanceof Set) {
      return this.serializeSet(obj)
    }
    if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
      return this.serializeObject(obj)
    }
    switch (typeof obj) {
      case "number":
        return {
          type: Serializable.NUMBER,
          name: obj.constructor.name,
          value: obj as SerializedValueType<R>
        }
      case "string":
        return {
          type: Serializable.STRING,
          name: obj.constructor.name,
          value: obj as SerializedValueType<R>
        }
      case "boolean":
        return {
          type: Serializable.BOOLEAN,
          name: obj.constructor.name,
          value: obj as SerializedValueType<R>
        }
      default:
        return undefined
    }
  }

  public deserialize(obj: SerializedData<R>): T | R | undefined {
    const customDeserialized = this.deserializeHandler?.(obj, this)
    if (customDeserialized !== undefined) {
      return customDeserialized
    }
    switch (obj.type) {
      case Serializable.ARRAY:
        return this.deserializeArray(obj)
      case Serializable.MAP:
        return this.deserializeMap(obj)
      case Serializable.SET:
        return this.deserializeSet(obj)
      case Serializable.OBJECT:
        return this.deserializeObject(obj)
      case Serializable.NUMBER:
      case Serializable.STRING:
      case Serializable.BOOLEAN:
        return obj.value as T
      default:
        return undefined
    }
  }

  private serializeArray(arr: Array<unknown>): SerializedData<R> {
    const values: SerializedArray<R> = new Array()
    for (const value of arr) {
      const serializedValue = this.serialize(value as T)
      if (serializedValue) {
        values.push(serializedValue)
      }
    }
    return {
      type: Serializable.ARRAY,
      name: arr.constructor.name,
      value: values as SerializedValueType<R>
    }
  }

  private serializeMap(map: Map<unknown, unknown>): SerializedData<R> {
    const entries: SerializedMap<R> = new Array()
    for (const [key, value] of map) {
      const serializedKey = this.serialize(key as T) as SerializedData<keyof R> | undefined
      const serializedValue = this.serialize(value as T) as SerializedData<R[keyof R]> | undefined
      if (serializedKey && serializedValue) {
        entries.push([serializedKey, serializedValue])
      }
    }
    return {
      type: Serializable.MAP,
      name: map.constructor.name,
      value: entries as SerializedValueType<R>
    }
  }

  private serializeSet(set: Set<unknown>): SerializedData<R> {
    const values: SerializedSet<R> = new Array()
    for (const value of set) {
      const serializedValue = this.serialize(value as T)
      if (serializedValue) {
        values.push(serializedValue)
      }
    }
    return {
      type: Serializable.SET,
      name: set.constructor.name,
      value: values as SerializedValueType<R>
    }
  }

  private serializeObject(obj: object): SerializedData<R> {
    const entries: SerializedObject<R> = new Array()
    if ((obj as SerializableClass<T>).classes) {
      for (const clazz of (obj as SerializableClass<T>).classes) {
        this.classes.push(clazz)
      }
    }
    for (const [key, value] of Object.entries(obj)) {
      if (key === "classes") continue
      const serializedValue = this.serialize(value)
      if (serializedValue) {
        entries.push([key, serializedValue] as [keyof R & string, SerializedData<R[keyof R]>])
      }
    }
    return {
      type: Serializable.OBJECT,
      name: obj.constructor.name,
      value: entries as SerializedValueType<R>
    }
  }

  private deserializeArray(obj: SerializedData<R>): T | R {
    const result = new Array()
    for (const value of obj.value as SerializedArray<R>) {
      const deserializedValue = this.deserialize(value)
      if (deserializedValue !== undefined) {
        result.push(deserializedValue)
      }
    }
    return result as T
  }

  private deserializeMap(obj: SerializedData<R>): T | R {
    const result = new Map()
    for (const [key, value] of obj.value as SerializedMap<R>) {
      const deserializedKey = this.deserialize(key as unknown as SerializedData<R>)
      const deserializedValue = this.deserialize(value as SerializedData<R>)
      if (deserializedKey !== undefined && deserializedValue !== undefined) {
        result.set(deserializedKey, deserializedValue)
      }
    }
    return result as T
  }

  private deserializeSet(obj: SerializedData<R>): T | R {
    const result = new Set()
    for (const value of obj.value as SerializedSet<R>) {
      const deserializedValue = this.deserialize(value)
      if (deserializedValue !== undefined) {
        result.add(deserializedValue)
      }
    }
    return result as T
  }

  private deserializeObject(obj: SerializedData<R>): T | R {
    const result = {} as { [K in keyof R]: R[K] }
    for (const [key, value] of obj.value as SerializedObject<R>) {
      const deserializedValue = this.deserialize(value as SerializedData<R>)
      if (deserializedValue !== undefined) {
        result[key as keyof R] = deserializedValue as R[keyof R]
      }
    }
    for (const clazz of this.classes) {
      if (clazz.name === obj.name) {
        return Object.assign(Object.create(clazz.prototype), result) as T
      }
    }
    return result as R
  }
}
