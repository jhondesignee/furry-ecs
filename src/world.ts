import Storage from "#storage"
import { DEFAULT_WORLD_SIZE, Status } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type System from "#system"
import type { WorldConfig, SerializableClass } from "#types"

export default class World implements SerializableClass<World | Storage<any>> {
  public readonly classes = [World, Storage]
  public readonly entities: Storage<Entity>
  public readonly components: Storage<Component>
  public readonly systems: Storage<System>
  public readonly size: number

  constructor(config?: WorldConfig) {
    this.entities = new Storage()
    this.components = new Storage()
    this.systems = new Storage()
    this.size = config?.size || DEFAULT_WORLD_SIZE
  }

  public addEntity(entity: Entity): boolean {
    if (this.entities.length(true) >= this.size) {
      return false
    }
    return this.entities.addData(entity)
  }

  public addComponent(entity: Entity, component: Component): boolean {
    if (this.components.length(true) >= this.size) {
      return false
    }
    if (this.entities.hasData(entity) || this.entities.hasDeferredData(entity)) {
      this.components.addData(component)
      return component.attachEntity(entity)
    }
    return false
  }

  public addSystem(system: System): boolean {
    if (this.systems.length(true) >= this.size) {
      return false
    }
    system.start?.(this)
    return this.systems.addData(system)
  }

  public removeEntity(entity: Entity): boolean {
    for (const component of this.components.keys()) {
      if (component.entities.hasData(entity) || component.entities.hasDeferredData(entity)) {
        this.removeComponent(entity, component)
      }
    }
    if (this.entities.hasData(entity) || this.entities.hasDeferredData(entity)) {
      return this.entities.removeData(entity)
    }
    return false
  }

  public removeComponent(entity: Entity, component: Component): boolean {
    if (
      (this.entities.hasData(entity) || this.entities.hasDeferredData(entity)) &&
      (this.components.hasData(component) || this.components.hasDeferredData(component))
    ) {
      return component.detachEntity(entity)
    }
    return false
  }

  public removeSystem(system: System): boolean {
    system.destroy?.(this)
    return this.systems.removeData(system)
  }

  public update(delta: number, time: number, args?: Array<unknown>): void {
    this.applyChanges()
    for (const [system, status] of this.systems) {
      if (status === Status.ACTIVE) system.update?.(this, delta, time, args)
    }
  }

  public destroy(): void {
    this.entities.destroy()
    this.components.destroy()
    this.systems.destroy()
  }

  private applyChanges(): void {
    this.entities.commitChanges()
    this.components.commitChanges()
    for (const component of this.components.keys()) {
      component.entities.commitChanges()
      if (component.entities.length() === 0) {
        this.components.removeData(component, true)
      }
    }
    this.systems.commitChanges()
  }
}
