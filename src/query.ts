import { Status, QueryOperation } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type World from "#world"
import type { QueryConfig } from "#types"

export default class Query {
  private readonly includeComponents: Set<Component<any>>
  private readonly excludeComponents: Set<Component<any>>
  private readonly includeOperation: QueryOperation
  private readonly excludeOperation: QueryOperation
  private readonly operationTable: {
    [QueryOperation.ALL]: Query["hasAllComponents"]
    [QueryOperation.ANY]: Query["hasAnyComponents"]
    [QueryOperation.EXACT]: Query["hasExactComponents"]
  }
  private entities: Set<Entity>
  private world!: World

  constructor(config?: QueryConfig) {
    this.includeComponents = new Set(config?.include || [])
    this.excludeComponents = new Set(config?.exclude || [])
    this.entities = new Set()
    this.includeOperation = config?.includeOperation ?? QueryOperation.ALL
    this.excludeOperation = config?.excludeOperation ?? QueryOperation.ANY
    this.operationTable = {
      [QueryOperation.ANY]: this.hasAnyComponents.bind(this),
      [QueryOperation.ALL]: this.hasAllComponents.bind(this),
      [QueryOperation.EXACT]: this.hasExactComponents.bind(this)
    }
  }

  public exec(world: World, status?: Status, component?: Component<any>): Array<Entity> {
    this.world = world
    /* if (!this.entities.size || this.hasChanged()) {
    } */
    // call this method every time this is inefficient
    this.entities = this.filterEntitiesByComponent()
    if (status !== undefined) {
      return this.filterEntitiesByStatus(status, component)
    }
    return new Array(...this.entities.keys())
  }

  // TODO: add a better data synchronization
  /* private hasChanged(): boolean {
    for (const component of [...this.includeComponents.keys(), ...this.excludeComponents.keys()]) {
      if (component.entities.hasChanged) return true
    }
    if (this.world.entities.hasChanged) return true
    if (this.world.components.hasChanged) return true
    return false
  } */

  private filterEntitiesByComponent(): Set<Entity> {
    const filteredEntities = new Set<Entity>()
    if (![...this.includeComponents.keys(), ...this.excludeComponents.keys()].some(item => this.world.components.hasData(item)))
      return filteredEntities
    for (const entity of this.world.entities.keys()) {
      if (this.operationTable[this.includeOperation](entity, this.includeComponents)) {
        filteredEntities.add(entity)
      }
      if (this.operationTable[this.excludeOperation](entity, this.excludeComponents)) {
        filteredEntities.delete(entity)
      }
    }
    return filteredEntities
  }

  private filterEntitiesByStatus(status: Status, component?: Component<any>): Array<Entity> {
    const filteredEntities = new Array<Entity>()
    for (const entity of this.entities) {
      if (component?.entities.getDataStatus(entity) === status || this.world?.entities.getDataStatus(entity) === status) {
        filteredEntities.push(entity)
      }
    }
    return filteredEntities
  }

  private hasAllComponents(entity: Entity, components: Set<Component<any>>): boolean {
    if (!components.size) return false
    for (const component of components) {
      if (!component.entities.hasData(entity)) return false
    }
    return true
  }

  private hasAnyComponents(entity: Entity, components: Set<Component<any>>): boolean {
    if (!components.size) return false
    for (const component of components) {
      if (component.entities.hasData(entity)) return true
    }
    return false
  }

  private hasExactComponents(entity: Entity, components: Set<Component<any>>): boolean {
    if (!components.size) return false
    for (const component of components) {
      if (!component.entities.hasData(entity)) {
        return false
      }
    }
    for (const component of this.world.components.keys()) {
      if (!components.has(component) && component.entities.hasData(entity)) {
        return false
      }
    }
    return true
  }
}
