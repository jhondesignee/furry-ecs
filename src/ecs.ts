import Entity from "#entity"
import Component from "#component"
import System from "#system"
import Query from "#query"
import World from "#world"
import { ComponentType, QueryModifier } from "#constants"
import type { SystemFunction, QueryConfig } from "#types"

export default class ECS {
  public static readonly ComponentType = ComponentType
  public static readonly QueryModifier = QueryModifier

  public static createWorld(): World {
    return new World()
  }

  public static createEntity(): Entity {
    return new Entity()
  }

  public static defineComponent<Schema extends Record<string, ComponentType>>(schema: Schema): Component<Schema> {
    return new Component(schema)
  }

  public static defineSystem(systemFunction: SystemFunction): System {
    return new System(systemFunction)
  }

  public static defineQuery(config: QueryConfig): Query {
    return new Query(config)
  }

  public static addEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    for (const world of worldArray) {
      for (const entity of entityArray) {
        world.addEntity(entity)
      }
    }
  }

  public static addComponent(worlds: World | Array<World>, entities: Entity | Array<Entity>, components: Component | Array<Component>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const componentArray: Array<Component> = Array.isArray(components) ? components : [components]
    for (const world of worldArray) {
      for (const entity of entityArray) {
        for (const component of componentArray) {
          world.addComponent(entity, component)
        }
      }
    }
  }

  public static addSystem(worlds: World | Array<World>, systems: System | Array<System>, ...args: Array<unknown>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const systemArray: Array<System> = Array.isArray(systems) ? systems : [systems]
    for (const world of worldArray) {
      for (const system of systemArray) {
        world.addSystem(system, args)
      }
    }
  }


  public static removeEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    for (const world of worldArray) {
      for (const entity of entityArray) {
        world.removeEntity(entity)
      }
    }
  }

  public static removeComponent(worlds: World | Array<World>, entities: Entity | Array<Entity>, components: Component | Array<Component>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const componentArray: Array<Component> = Array.isArray(components) ? components : [components]
    for (const world of worldArray) {
      for (const entity of entityArray) {
        for (const component of componentArray) {
          world.removeComponent(entity, component)
        }
      }
    }
  }

  public static removeSystem(worlds: World | Array<World>, systems: System | Array<System>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const systemArray: Array<System> = Array.isArray(systems) ? systems : [systems]
    for (const world of worldArray) {
      for (const system of systemArray) {
        world.removeSystem(system)
      }
    }
  }
  
  public static update(worlds: World | Array<World>, delta: number, time: number): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    for (const world of worldArray) {
      world.update(delta, time)
    }
  }

  public static destroyWorld(worlds: World | Array<World>): void {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    for (const world of worldArray) {
      world.destroy()
    }
  }
}
