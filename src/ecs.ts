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

  public static addEntity(world: World, entities: Array<Entity>): void {
    for (let entity of entities) {
      world.addEntity(entity)
    }
  }

  public static addComponent(world: World, entities: Array<Entity>, components: Array<Component>): void {
    for (let entity of entities) {
      for (let component of components) {
        world.addComponent(entity, component)
      }
    }
  }

  public static addSystem(world: World, systems: Array<System>, ...args: Array<unknown>): void {
    for (let system of systems) {
      world.addSystem(system, args)
    }
  }

  public static update(world: World, delta: number, time: number): void {
    world.update(delta, time)
  }

  public static removeEntity(world: World, entities: Array<Entity>): void {
    for (let entity of entities) {
      world.removeEntity(entity)
    }
  }

  public static removeComponent(world: World, entities: Array<Entity>, components: Array<Component>): void {
    for (let entity of entities) {
      for (let component of components) {
        world.removeComponent(entity, component)
      }
    }
  }

  public static removeSystem(world: World, systems: Array<System>): void {
    for (let system of systems) {
      world.removeSystem(system)
    }
  }

  public static destroyWorld(world: World): void {
    world.destroy()
  }
}
