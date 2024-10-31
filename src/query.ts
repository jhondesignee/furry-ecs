import { Status } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type World from "#world"
import type { QueryConfig } from "#types"

export default class Query {
  private readonly includeComponents: Set<Component>
  private readonly excludeComponents: Set<Component>
  private entities: Map<Entity, Status>
  private updated: boolean

  constructor(config?: QueryConfig) {
    this.includeComponents = new Set(config?.include || [])
    this.excludeComponents = new Set(config?.exclude || [])
    this.entities = new Map()
    this.updated = false
  }

  public exec(world: World, status?: Status): Array<Entity> {
    this.updated = this.entities.size === 0 ? false : !this.hasChanges()
    if (!this.updated) {
      this.entities = this.filterEntitiesByComponent(world)
    } else {
      this.cleanChanges()
    }
    if (status !== undefined) {
      return this.filterEntitiesByStatus(status)
    }
    return new Array(...this.entities.keys())
  }

  private hasChanges(): boolean {
    for (const component of [...this.includeComponents.keys(), ...this.excludeComponents.keys()]) {
      if (component.entities.hasChanged) return true
    }
    return false
  }

  private cleanChanges(): void {
    for (const [entity, status] of this.entities) {
      if (status === Status.ADDED) {
        this.entities.set(entity, Status.ACTIVE)
      } else if (status === Status.REMOVED) {
        this.entities.delete(entity)
      }
    }
  }

  private filterEntitiesByComponent(world: World): Map<Entity, Status> {
    const filteredEntities = new Map<Entity, Status>()
    for (const includedComponent of this.includeComponents) {
      if (world.components.hasData(includedComponent)) {
        for (const [entity, status] of includedComponent.entities) {
          filteredEntities.set(entity, status)
        }
      }
    }
    for (const excludedComponent of this.excludeComponents) {
      if (world.components.hasData(excludedComponent)) {
        for (const entity of excludedComponent.entities.keys()) {
          filteredEntities.delete(entity)
        }
      }
    }
    return filteredEntities
  }

  private filterEntitiesByStatus(status: Status): Array<Entity> {
    const filteredEntities = new Array<Entity>()
    for (const [entity, entityStatus] of this.entities) {
      if (entityStatus === status) {
        filteredEntities.push(entity)
      }
    }
    return filteredEntities
  }
}
