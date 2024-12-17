import { Status, QueryOperation } from "#constants"
import World from "#world"
import Component from "#component"
import type Entity from "#entity"
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
    if (config !== undefined && (typeof config !== "object" || Array.isArray(config) || config === null)) {
      throw new TypeError("'config' parameter must be an object")
    }
    if (config?.include !== undefined && !Array.isArray(config?.include)) {
      throw new TypeError("'include' option must be an array of components")
    }
    for (const value of config?.include || []) {
      if (!(value instanceof Component)) {
        throw new TypeError("'include' option must be an array of components")
      }
    }
    if (config?.exclude !== undefined && !Array.isArray(config?.exclude)) {
      throw new TypeError("'exclude' option must be an array of components")
    }
    for (const value of config?.exclude || []) {
      if (!(value instanceof Component)) {
        throw new TypeError("'exclude' option must be an array of components")
      }
    }
    if (config?.includeOperation !== undefined && typeof config?.includeOperation !== "number") {
      throw new TypeError("Include operation option must be a 'QueryOperation' value")
    }
    if (config?.excludeOperation !== undefined && typeof config?.excludeOperation !== "number") {
      throw new TypeError("Exclude operation option must be a 'QueryOperation' value")
    }
    this.includeComponents = new Set(config?.include || [])
    this.excludeComponents = new Set(config?.exclude || [])
    this.includeOperation = config?.includeOperation ?? QueryOperation.ALL
    this.excludeOperation = config?.excludeOperation ?? QueryOperation.ANY
    this.entities = new Set()
    this.operationTable = {
      [QueryOperation.ANY]: this.hasAnyComponents.bind(this),
      [QueryOperation.ALL]: this.hasAllComponents.bind(this),
      [QueryOperation.EXACT]: this.hasExactComponents.bind(this)
    }
  }

  public exec(world: World, status?: Status, component?: Component<any>): Array<Entity> {
    if (!(world instanceof World)) {
      throw new TypeError("'world' parameter must be a 'World' instance")
    }
    if (status !== undefined && !Object.values(Status).includes(status)) {
      throw new TypeError("'status' parameter must be a 'Status' value")
    }
    if (component !== undefined && !(component instanceof Component)) {
      throw new TypeError("'component' parameter must be a 'Component' instance")
    }
    this.world = world
    // call this method every time is inefficient
    this.entities = this.filterEntitiesByComponent()
    if (status !== undefined) {
      return this.filterEntitiesByStatus(status, component)
    }
    return new Array(...this.entities.keys())
  }

  private filterEntitiesByComponent(): Set<Entity> {
    const filteredEntities = new Set<Entity>()
    if (![...this.includeComponents, ...this.excludeComponents].some(item => this.world.components.hasData(item))) {
      return filteredEntities
    }
    for (const entity of this.world.entities.keys()) {
      const includes = this.operationTable[this.includeOperation](entity, this.includeComponents)
      const excludes = this.operationTable[this.excludeOperation](entity, this.excludeComponents)
      if (includes && !excludes) {
        filteredEntities.add(entity)
      }
    }
    return filteredEntities
  }

  private filterEntitiesByStatus(status: Status, component?: Component<any>): Array<Entity> {
    const filteredEntities = new Array<Entity>()
    for (const entity of this.entities) {
      if (component?.entities.getDataStatus(entity) === status || this.world.entities.getDataStatus(entity) === status) {
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
