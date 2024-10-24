import { QueryModifier } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type World from "#world"
import type { QueryConfig } from "#types"

export default class Query {
  private readonly includeComponents: Set<Component>
  private readonly excludeComponents: Set<Component>
  private entities: Map<Entity, QueryModifier>
  private updated: boolean

  constructor(config: QueryConfig) {
    this.includeComponents = new Set(config.include)
    this.excludeComponents = new Set(config.exclude)
    this.entities = new Map()
    this.updated = false
  }

  public exec(world: World, modifier?: QueryModifier): Array<Entity> {
    if (world.hasChanged) {
      this.entities = this.filterEntitiesByComponent(world)
      this.updated = false
    } else if (!this.updated) {
      for (const [entity, modifier] of this.entities) {
        if (modifier === QueryModifier.ADDED) {
          this.entities.set(entity, QueryModifier.ACTIVE)
        } else if (modifier === QueryModifier.REMOVED) {
          this.entities.delete(entity)
        }
      }
      this.updated = true
    }
    if (modifier !== undefined) {
      return this.filterEntitiesByModifier(modifier)
    }
    return new Array(...this.entities.keys())
  }

  private filterEntitiesByComponent(world: World): Map<Entity, QueryModifier> {
    const filteredEntities = new Map<Entity, QueryModifier>()
    for (const includedComponent of this.includeComponents) {
      if (world.components.has(includedComponent)) {
        const data = world.components.get(includedComponent)!
        for (const [entity, modifier] of data) {
          filteredEntities.set(entity, modifier)
        }
      }
    }
    for (const excludedComponent of this.excludeComponents) {
      if (world.components.has(excludedComponent)) {
        const data = world.components.get(excludedComponent)!
        for (const entity of data.keys()) {
          filteredEntities.delete(entity)
        }
      }
    }
    return filteredEntities
  }

  private filterEntitiesByModifier(modifier: QueryModifier): Array<Entity> {
    const filteredEntities = new Array<Entity>()
    for (const [entity, entityModifier] of this.entities) {
      if (entityModifier === modifier) {
        filteredEntities.push(entity)
      }
    }
    return filteredEntities
  }
}
