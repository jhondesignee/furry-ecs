import { QueryModifier } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type System from "#system"
import type { DeferredChanges } from "#types"
import type { SystemUpdateFunction } from "#types"

export default class World {
  public readonly entities: Set<Entity>
  public readonly components: Map<Component, Map<Entity, QueryModifier>>
  public readonly systems: Map<System, SystemUpdateFunction | void>
  public hasChanged: boolean
  private readonly deferredChanges: DeferredChanges<World["entities"], World["components"], World["systems"]>

  constructor() {
    this.entities = new Set()
    this.components = new Map()
    this.systems = new Map()
    this.hasChanged = false
    this.deferredChanges = {
      added: { entities: new Set(), components: new Map(), systems: new Map() },
      removed: { entities: new Set(), components: new Map(), systems: new Map() }
    }
  }

  public addEntity(entity: Entity): void {
    this.deferredChanges.added.entities.add(entity)
  }

  public addComponent(entity: Entity, component: Component): void {
    if (!this.entities.has(entity)) return
    const data = this.components.get(component) || new Map<Entity, QueryModifier>()
    data.set(entity, QueryModifier.ADDED)
    this.deferredChanges.added.components.set(component, data)
  }

  public addSystem(system: System, args: Array<unknown>): void {
    this.deferredChanges.added.systems.set(system, system.onStart(this, args))
  }

  public update(delta: number, time: number): void {
    for (let system of this.systems.values()) {
      system?.(delta, time)
    }
    this.applyDeferredChanges()
    this.clearDeferredChanges()
  }

  public removeEntity(entity: Entity): void {
    if (!this.entities.has(entity)) return
    this.deferredChanges.removed.entities.add(entity)
  }

  public removeComponent(entity: Entity, component: Component): void {
    if (!this.entities.has(entity) || !this.components.has(component)) return
    const data = this.components.get(component)!
    data.set(entity, QueryModifier.REMOVED)
    this.deferredChanges.removed.components.set(component, data)
  }

  public removeSystem(system: System): void {
    if (!this.systems.has(system)) return
    const systemUpdateFunction = this.systems.get(system)!
    this.deferredChanges.removed.systems.set(system, systemUpdateFunction)
  }

  public destroy(): void {
    this.entities.clear()
    this.components.clear()
    this.systems.clear()
    for (let operation of Object.keys(this.deferredChanges) as Array<keyof World["deferredChanges"]>) {
      const { entities, components, systems } = this.deferredChanges[operation]
      entities.clear()
      components.clear()
      systems.clear()
    }
  }

  private applyDeferredChanges(): void {
    const { entities: addedEntities, components: addedComponents, systems: addedSystems } = this.deferredChanges.added
    const { entities: removedEntities, components: removedComponents, systems: removedSystems } = this.deferredChanges.removed
    for (let entity of addedEntities) {
      this.entities.add(entity)
      this.hasChanged = true
    }
    for (let entity of removedEntities) {
      this.entities.delete(entity)
      this.hasChanged = true
    }
    for (let [component, data] of addedComponents.entries()) {
      for (let entity of data.keys()) {
        if (!this.components.has(component)) continue
        const currentData = this.components.get(component)!
        if (currentData.get(entity) === QueryModifier.ADDED) {
          data.set(entity, QueryModifier.ACTIVE)
        }
      }
      this.components.set(component, data)
      this.hasChanged = true
    }
    for (let [component, data] of removedComponents.entries()) {
      for (let entity of data.keys()) {
        if (!this.components.has(component)) continue
        const currentData = this.components.get(component)!
        if (currentData.get(entity) === QueryModifier.REMOVED) {
          data.delete(entity)
        }
      }
      this.components.set(component, data)
      this.hasChanged = true
    }
    for (let [system, systemFunction] of addedSystems.entries()) {
      this.systems.set(system, systemFunction)
      this.hasChanged = true
    }
    for (let system of removedSystems.keys()) {
      this.systems.delete(system)
      this.hasChanged = true
    }
  }

  private clearDeferredChanges(): void {
    for (let operation of Object.keys(this.deferredChanges) as Array<keyof World["deferredChanges"]>) {
      const { entities, components, systems } = this.deferredChanges[operation]
      entities.clear()
      components.clear()
      systems.clear()
    }
  }
}
