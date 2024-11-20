import Storage from "#storage"
import { DEFAULT_WORLD_SIZE, Status } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type System from "#system"
import type { WorldConfig, SerializableClass } from "#types"

export default class World implements SerializableClass<World | Storage<any>> {
  public readonly classes = [World, Storage]
  public readonly entities: Storage<Entity>
  public readonly components: Storage<Component<any>>
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

  public addComponent(component: Component<any>): boolean {
    if (this.components.length(true) >= this.size) {
      return false
    }
    return this.components.addData(component)
  }

  public addSystem(system: System): boolean {
    if (this.systems.length(true) >= this.size) {
      return false
    }
    system.start?.(this)
    return this.systems.addData(system)
  }

  public removeEntity(entity: Entity): boolean {
    const removed = this.entities.removeData(entity)
    if (removed) {
      for (const component of this.components.keys()) {
        component.entities.removeData(entity)
      }
    }
    return removed
  }

  public removeComponent(component: Component<any>): boolean {
    return this.components.removeData(component)
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
    }
    this.systems.commitChanges()
  }
}
