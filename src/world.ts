import { QueryModifier } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type System from "#system"
import type { DeferredChanges } from "#types"
import type { SystemUpdateFunction } from "#types"

export default class World {
  public readonly entities: Map<Entity, QueryModifier>
  public readonly components: Map<Component, Map<Entity, QueryModifier>>
  public readonly systems: Map<System, SystemUpdateFunction | void>
  public hasChanged: boolean
  private readonly deferredChanges: DeferredChanges<World["entities"], World["components"], World["systems"]>

  constructor() {
    this.entities = new Map()
    this.components = new Map()
    this.systems = new Map()
    this.hasChanged = false
    this.deferredChanges = {
      added: { entities: new Map(), components: new Map(), systems: new Map() },
      removed: { entities: new Map(), components: new Map(), systems: new Map() }
    }
  }

  public addEntity(entity: Entity): void {
    this.deferredChanges.added.entities.set(entity, QueryModifier.ADDED)
  }

  public addComponent(entity: Entity, component: Component): void {
    if (this.entities.has(entity) || this.deferredChanges.added.entities.has(entity)) {
      const data: Map<Entity, QueryModifier> = new Map([
        ...(this.components.get(component) || []),
        ...(this.deferredChanges.added.components.get(component) || [])
      ])
      data.set(entity, QueryModifier.ADDED)
      this.deferredChanges.added.components.set(component, data)
    }
  }

  public addSystem(system: System, args?: Array<unknown>): void {
    this.deferredChanges.added.systems.set(system, system.onStart(this, args))
  }

  public removeEntity(entity: Entity): void {
    for (let [component, data] of this.components) {
      if (data.has(entity)) {
        this.removeComponent(entity, component)
      }
    }
    for (let data of this.deferredChanges.added.components.values()) {
      if (data.has(entity)) {
        data.delete(entity)
      }
    }
    if (this.deferredChanges.added.entities.has(entity)) {
      this.deferredChanges.added.entities.delete(entity)
    } else if (this.entities.has(entity)) {
      this.deferredChanges.removed.entities.set(entity, QueryModifier.REMOVED)
    }
  }

  public removeComponent(entity: Entity, component: Component): void {
    if (
      (this.entities.has(entity) || this.deferredChanges.added.entities.has(entity)) &&
      (this.components.has(component) || this.deferredChanges.added.components.has(component))
    ) {
      const data: Map<Entity, QueryModifier> = new Map([
        ...(this.components.get(component) || []),
        ...(this.deferredChanges.added.components.get(component) || [])
      ])
      if (this.deferredChanges.added.components.get(component)?.has(entity)) {
        data.delete(entity)
        this.deferredChanges.added.components.set(component, data)
      }
      if (data.has(entity)) {
        data.set(entity, QueryModifier.REMOVED)
      }
      this.deferredChanges.removed.components.set(component, data)
    }
  }

  public removeSystem(system: System): void {
    if (this.deferredChanges.added.systems.has(system)) {
      this.deferredChanges.added.systems.delete(system)
    } else if (this.systems.has(system)) {
      const systemUpdateFunction = this.systems.get(system)
      this.deferredChanges.removed.systems.set(system, systemUpdateFunction)
    }
  }

  public update(delta: number, time: number): void {
    if (this.hasChanged) {
      this.cleanChanges()
    }
    for (let system of this.systems.values()) {
      system?.(delta, time)
    }
    this.hasChanged = false
    this.applyDeferredChanges()
    this.deleteDeferredChanges()
  }

  public destroy(): void {
    this.entities.clear()
    this.components.clear()
    this.systems.clear()
    this.deleteDeferredChanges()
  }

  private applyDeferredChanges(): void {
    const { entities: addedEntities, components: addedComponents, systems: addedSystems } = this.deferredChanges.added
    const { entities: removedEntities, components: removedComponents, systems: removedSystems } = this.deferredChanges.removed
    for (const [entity, modifier] of addedEntities) {
      this.entities.set(entity, modifier)
      this.hasChanged = true
    }
    for (const [component, data] of addedComponents) {
      const currentData = this.components.get(component)
      if (currentData) {
        for (const [entity, modifier] of currentData) {
          data.set(entity, data.get(entity) || modifier)
        }
      }
      if (data.size) {
        this.components.set(component, data)
      }
      this.hasChanged = true
    }
    for (const [system, systemFunction] of addedSystems) {
      this.systems.set(system, systemFunction)
      this.hasChanged = true
    }
    for (const [entity, modifier] of removedEntities) {
      this.entities.set(entity, modifier)
      this.hasChanged = true
    }
    for (const [component, data] of removedComponents) {
      const currentData = this.components.get(component)
      if (currentData) {
        for (const [entity, modifier] of currentData) {
          data.set(entity, data.get(entity) || modifier)
        }
      }
      if (data.size) {
        this.components.set(component, data)
      }
      this.hasChanged = true
    }
    for (const system of removedSystems.keys()) {
      this.systems.delete(system)
      this.hasChanged = true
    }
  }

  private cleanChanges(): void {
    for (const [entity, modifier] of this.entities) {
      if (modifier === QueryModifier.ADDED) {
        this.entities.set(entity, QueryModifier.ACTIVE)
      } else if (modifier === QueryModifier.REMOVED) {
        this.entities.delete(entity)
      }
    }
    for (const [component, data] of this.components) {
      for (const [entity, modifier] of data) {
        if (modifier === QueryModifier.ADDED) {
          data.set(entity, QueryModifier.ACTIVE)
        } else if (modifier === QueryModifier.REMOVED) {
          data.delete(entity)
        }
      }
      if (data.size === 0) {
        this.components.delete(component)
      }
    }
  }

  private deleteDeferredChanges(): void {
    for (const operation of Object.values(this.deferredChanges)) {
      operation.entities.clear()
      operation.components.clear()
      operation.systems.clear()
    }
  }
}
