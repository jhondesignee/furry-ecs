import Entity from "#entity"
import Component from "#component"
import System from "#system"
import Query from "#query"
import World from "#world"
import { ComponentType, Status } from "#constants"
import type { ComponentSchema, SystemConfig, QueryConfig } from "#types"

export default class ECS {
  public static readonly ComponentType = ComponentType
  public static readonly Status = Status

  public static createWorld(): World {
    return new World()
  }

  public static createEntity(): Entity {
    return new Entity()
  }

  public static defineComponent<Schema extends ComponentSchema<ComponentType>>(schema?: Schema, size?: number): Component<Schema> {
    return new Component(schema, size)
  }

  public static defineSystem(systemConfig?: SystemConfig): System {
    return new System(systemConfig)
  }

  public static defineQuery(queryConfig?: QueryConfig): Query {
    return new Query(queryConfig)
  }

  public static addEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const entity of entityArray) {
        changes.push(world.addEntity(entity))
      }
    }
    return changes
  }

  public static addComponent(
    worlds: World | Array<World>,
    entities: Entity | Array<Entity>,
    components: Component | Array<Component>
  ): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const componentArray: Array<Component> = Array.isArray(components) ? components : [components]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const entity of entityArray) {
        for (const component of componentArray) {
          changes.push(world.addComponent(entity, component))
        }
      }
    }
    return changes
  }

  public static addSystem(worlds: World | Array<World>, systems: System | Array<System>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const systemArray: Array<System> = Array.isArray(systems) ? systems : [systems]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const system of systemArray) {
        changes.push(world.addSystem(system))
      }
    }
    return changes
  }

  public static removeEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const entity of entityArray) {
        changes.push(world.removeEntity(entity))
      }
    }
    return changes
  }

  public static removeComponent(
    worlds: World | Array<World>,
    entities: Entity | Array<Entity>,
    components: Component | Array<Component>
  ): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const componentArray: Array<Component> = Array.isArray(components) ? components : [components]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const entity of entityArray) {
        for (const component of componentArray) {
          changes.push(world.removeComponent(entity, component))
        }
      }
    }
    return changes
  }

  public static removeSystem(worlds: World | Array<World>, systems: System | Array<System>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const systemArray: Array<System> = Array.isArray(systems) ? systems : [systems]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const system of systemArray) {
        changes.push(world.removeSystem(system))
      }
    }
    return changes
  }

  public static update(worlds: World | Array<World>, delta: number, time: number, ...args: Array<unknown>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    for (const world of worldArray) {
      world.update(delta, time, args)
    }
  }

  public static destroyWorld(worlds: World | Array<World>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    for (const world of worldArray) {
      world.destroy()
    }
  }
}
