import Storage from "#storage"
import { Status } from "#constants"
import type Entity from "#entity"
import type Component from "#component"
import type System from "#system"

export default class World {
  public readonly entities: Storage<Entity>
  public readonly components: Storage<Component>
  public readonly systems: Storage<System>

  constructor() {
    this.entities = new Storage()
    this.components = new Storage()
    this.systems = new Storage()
  }

  /* istanbul ignore next */
  get hasChanged(): boolean {
    console.warn("Deprecation warning: 'this.hasChanged' is deprecated. Use 'this.entities.hasChanged' instead")
    return false
  }

  public addEntity(entity: Entity): void {
    this.entities.addData(entity)
  }

  public addComponent(entity: Entity, component: Component): void {
    if (this.entities.hasData(entity) || this.entities.hasDeferredData(entity)) {
      component.entities.addData(entity)
      this.components.addData(component)
    }
  }

  public addSystem(system: System): void {
    system.start?.(this)
    this.systems.addData(system)
  }

  public removeEntity(entity: Entity): void {
    for (const component of this.components.keys()) {
      if (component.entities.hasData(entity) || component.entities.hasDeferredData(entity)) {
        this.removeComponent(entity, component)
      }
    }
    if (this.entities.hasData(entity) || this.entities.hasDeferredData(entity)) {
      this.entities.removeData(entity)
    }
  }

  public removeComponent(entity: Entity, component: Component): void {
    if (
      (this.entities.hasData(entity) || this.entities.hasDeferredData(entity)) &&
      (this.components.hasData(component) || this.components.hasDeferredData(component))
    ) {
      component.entities.removeData(entity)
    }
  }

  public removeSystem(system: System): void {
    system.destroy?.(this)
    this.systems.removeData(system)
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
      } else {
        this.components.addData(component, true)
      }
    }
    this.systems.commitChanges()
  }
}
