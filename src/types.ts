import type Component from "#component"
import type World from "#world"

export type SystemUpdateFunction = (delta: number, time: number) => void
export type SystemFunction = (world: World, args: Array<unknown>) => SystemUpdateFunction | void

export interface QueryConfig {
  include: Array<Component>
  exclude: Array<Component>
}

export interface DeferredChanges<EntitySet, ComponentMap, SystemMap> {
  added: {
    entities: EntitySet
    components: ComponentMap
    systems: SystemMap
  }
  removed: {
    entities: EntitySet
    components: ComponentMap
    systems: SystemMap
  }
}
