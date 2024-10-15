import { QueryModifier } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type World from "#world"
import type { QueryConfig } from "#types"

export default class Query {
  private readonly includeComponents: Set<Component>
  private readonly excludeComponents: Set<Component>
  private entities: Map<Entity, QueryModifier>

  constructor(config: QueryConfig) {
    this.includeComponents = new Set(config.include)
    this.excludeComponents = new Set(config.exclude)
    this.entities = new Map()
  }

  public exec(world: World, modifier?: QueryModifier): Array<Entity> {
    if (world.hasChanged) {
      this.entities = this.filterEntitiesByComponent(world)
    }
    if (modifier !== undefined) {
      return this.filterEntitiesByModifier(modifier)
    }
    return new Array(...this.entities.keys())
  }

  private filterEntitiesByComponent(world: World): Map<Entity, QueryModifier> {
    const filteredEntities = new Map<Entity, QueryModifier>()
    for (let includedComponent of this.includeComponents) {
      if (!world.components.has(includedComponent)) continue
      const data = world.components.get(includedComponent)!
      for (let [entity, modifier] of data.entries()) {
        filteredEntities.set(entity, modifier)
      }
    }
    for (let excludedComponent of this.excludeComponents) {
      if (!world.components.has(excludedComponent)) continue
      const data = world.components.get(excludedComponent)!
      for (let entity of data.keys()) {
        filteredEntities.delete(entity)
      }
    }
    return filteredEntities
  }

  private filterEntitiesByModifier(modifier: QueryModifier): Array<Entity> {
    const filteredEntities = new Array<Entity>()
    for (let [entity, entityModifier] of this.entities) {
      if (entityModifier === modifier) {
        filteredEntities.push(entity)
      }
    }
    return filteredEntities
  }
}
