import type Component from "#component"
import type World from "#world"
import type Serializer from "#serializer"
import type { ComponentType, Serializable } from "#constants"

export type SystemStartFunction = (world: World) => void
export type SystemUpdateFunction = (world: World, delta: number, time: number, args?: Array<unknown>) => void
export type SystemDestroyFunction = (world: World) => void
export type ComponentPropValue<T extends ComponentSchema[keyof ComponentSchema]> = T extends ComponentType.NUMBER
  ? number
  : T extends ComponentType.ARRAY
  ? Array<number>
  : null
export type ComponentSchema = Record<string, ComponentType>
export type ComponentProps<T extends ComponentSchema> = Map<keyof T, Map<number, ComponentPropValue<T[keyof T]>>>

export interface SystemConfig {
  start?: SystemStartFunction
  update: SystemUpdateFunction
  destroy?: SystemDestroyFunction
}

export interface QueryConfig {
  include: Array<Component<any>>
  exclude?: Array<Component<any>>
}

export interface WorldConfig {
  size?: number
}

export type Constructor<T> = new (...args: any) => T
export type CustomSerializeHandler<T, R> = (obj: T, self: Serializer<T, R>) => SerializedData<R> | undefined
export type CustomDeserializeHandler<T, R> = (obj: SerializedData<R>, self: Serializer<T, R>) => T | R | undefined
export type SerializedArray<T> = Array<SerializedData<T>>
export type SerializedMap<T> = Array<[SerializedData<keyof T>, SerializedData<T[keyof T]>]>
export type SerializedSet<T> = Array<SerializedData<T>>
export type SerializedObject<T> = Array<[keyof T & string, SerializedData<T[keyof T]>]>
export type SerializedPrimitive = number | string | boolean
export type SerializedValueType<T> = T extends Array<infer U>
  ? SerializedArray<U>
  : T extends Map<unknown, unknown>
  ? SerializedMap<T>
  : T extends Set<infer U>
  ? SerializedSet<U>
  : T extends object
  ? SerializedObject<T>
  : T extends SerializedPrimitive
  ? T
  : never
export type SerializedData<T> = {
  type: Serializable
  name: string
  value: SerializedValueType<T>
}

export interface SerializerConfig<T, R> {
  serializeHandler?: CustomSerializeHandler<T, R>
  deserializeHandler?: CustomDeserializeHandler<T, R>
}

export interface SerializableClass<T> {
  classes: Array<Constructor<T>>
}
