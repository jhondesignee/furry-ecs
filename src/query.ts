import { Status, QueryOperation } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type World from "#world"
import type { QueryConfig } from "#types"

export default class Query {
  private readonly includeComponents: Set<Component<any>>
  private readonly excludeComponents: Set<Component<any>>
  private entities: Set<Entity>
  private updated: boolean
  private readonly includeOperation: QueryOperation
  private readonly excludeOperation: QueryOperation
  private readonly operationTable: {
    [QueryOperation.ALL]: Query["hasAllComponents"]
    [QueryOperation.ANY]: Query["hasAnyComponents"]
  }

  constructor(config?: QueryConfig) {
    this.includeComponents = new Set(config?.include || [])
    this.excludeComponents = new Set(config?.exclude || [])
    this.entities = new Set()
    this.updated = false
    this.includeOperation = config?.includeOperation || QueryOperation.ALL
    this.excludeOperation = config?.excludeOperation || QueryOperation.ANY
    this.operationTable = {
      [QueryOperation.ANY]: this.hasAnyComponents,
      [QueryOperation.ALL]: this.hasAllComponents
    }
  }

  public exec(world: World, status?: Status, component?: Component<any>): Array<Entity> {
    this.updated = !this.hasChanged(world)
    if (!this.updated) {
      this.entities = this.filterEntitiesByComponent(world)
    }
    if (status !== undefined) {
      return this.filterEntitiesByStatus(world, status, component)
    }
    return new Array(...this.entities.keys())
  }

  private hasChanged(world: World): boolean {
    if (world.entities.hasChanged) return true
    for (const component of [...this.includeComponents.keys(), ...this.excludeComponents.keys()]) {
      if (component.entities.hasChanged) return true
    }
    return false
  }

  private filterEntitiesByComponent(world: World): Set<Entity> {
    const filteredEntities = new Set<Entity>()
    for (const entity of world.entities.keys()) {
      if (this.operationTable[this.includeOperation](entity, this.includeComponents)) {
        filteredEntities.add(entity)
      }
      if (this.operationTable[this.excludeOperation](entity, this.excludeComponents)) {
        filteredEntities.delete(entity)
      }
    }
    return filteredEntities
  }

  private filterEntitiesByStatus(world: World, status: Status, component?: Component<any>): Array<Entity> {
    const filteredEntities = new Array<Entity>()
    for (const entity of this.entities) {
      if (component?.entities.getDataStatus(entity) === status || world.entities.getDataStatus(entity) === status) {
        filteredEntities.push(entity)
      }
    }
    return filteredEntities
  }

  private hasAllComponents(entity: Entity, components: Set<Component<any>>): boolean {
    for (const component of components) {
      if (!component.entities.hasData(entity)) return false
    }
    return true
  }

  private hasAnyComponents(entity: Entity, components: Set<Component<any>>): boolean {
    for (const component of components) {
      if (component.entities.hasData(entity)) return true
    }
    return false
  }
}
