import type Component from "#component"
import type World from "#world"
import type { Status, ComponentType } from "#constants"

export type SystemStartFunction = (world: World) => void
export type SystemUpdateFunction = (world: World, delta: number, time: number, args?: Array<unknown>) => void
export type SystemDestroyFunction = (world: World) => void
export type ComponentSchema<T> = {
  [key: string]: {
    type: T
    length?: T extends ComponentType.NUMBER ? undefined : number
  }
}
export type DeprecatedComponentSchema = Record<string, ComponentType>
export type ComponentProps<Schema extends ComponentSchema<ComponentType>> = {
  [K in keyof Schema]: Schema[K]["type"] extends ComponentType.NUMBER
    ? Array<number>
    : Schema[K]["type"] extends ComponentType.ARRAY
    ? Array<Array<number>>
    : null
}

export interface SystemConfig {
  start?: SystemStartFunction
  update: SystemUpdateFunction
  destroy?: SystemDestroyFunction
}

export interface QueryConfig {
  include: Array<Component>
  exclude?: Array<Component>
}

export interface WorldConfig {
  size?: number
}

export interface StorageSerializedData<Data> {
  data: Map<Data, Status>
  deferredData: {
    added: Set<Data>
    removed: Set<Data>
  }
  hasChanged: boolean
}
