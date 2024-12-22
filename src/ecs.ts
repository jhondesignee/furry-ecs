import Entity from "#entity"
import Component from "#component"
import System from "#system"
import Query from "#query"
import Serializer from "#serializer"
import World from "#world"
import type { ComponentSchema, SystemConfig, QueryConfig, SerializerConfig, SerializedValueType } from "#types"
import * as Constants from "#constants"

export default class ECS {
  public static readonly Constants = Constants

  public static createWorld(): World {
    return new World()
  }

  public static createEntity(): Entity {
    return new Entity()
  }

  public static defineComponent<Schema extends ComponentSchema>(schema?: Schema, size?: number): Component<Schema> {
    return new Component(schema, size)
  }

  public static defineSystem(systemConfig?: SystemConfig): System {
    return new System(systemConfig)
  }

  public static defineQuery(queryConfig?: QueryConfig): Query {
    return new Query(queryConfig)
  }

  public static defineSerializer<T, R = SerializedValueType<T>>(serializerConfig?: SerializerConfig<T, R>): Serializer<T, R> {
    return new Serializer<T, R>(serializerConfig)
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

  public static addComponent(worlds: World | Array<World>, components: Component<any> | Array<Component<any>>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const componentArray: Array<Component<any>> = Array.isArray(components) ? components : [components]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const component of componentArray) {
        changes.push(world.addComponent(component))
      }
    }
    return changes
  }

  public static addSystem(worlds: World | Array<World>, systems: System | Array<System>, args?: Array<unknown>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const systemArray: Array<System> = Array.isArray(systems) ? systems : [systems]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const system of systemArray) {
        changes.push(world.addSystem(system, args))
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

  public static removeComponent(worlds: World | Array<World>, components: Component<any> | Array<Component<any>>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const componentArray: Array<Component<any>> = Array.isArray(components) ? components : [components]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const component of componentArray) {
        changes.push(world.removeComponent(component))
      }
    }
    return changes
  }

  public static removeSystem(worlds: World | Array<World>, systems: System | Array<System>, args?: Array<unknown>): Array<boolean> {
    const worldArray: Array<World> = Array.isArray(worlds) ? worlds : [worlds]
    const systemArray: Array<System> = Array.isArray(systems) ? systems : [systems]
    const changes: Array<boolean> = new Array()
    for (const world of worldArray) {
      for (const system of systemArray) {
        changes.push(world.removeSystem(system, args))
      }
    }
    return changes
  }

  public static attachEntity(components: Component<any> | Array<Component<any>>, entities: Entity | Array<Entity>): Array<boolean> {
    const componentArray: Array<Component<any>> = Array.isArray(components) ? components : [components]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const changes: Array<boolean> = new Array()
    for (const component of componentArray) {
      for (const entity of entityArray) {
        changes.push(component.attachEntity(entity))
      }
    }
    return changes
  }

  public static detachEntity(components: Component<any> | Array<Component<any>>, entities: Entity | Array<Entity>): Array<boolean> {
    const componentArray: Array<Component<any>> = Array.isArray(components) ? components : [components]
    const entityArray: Array<Entity> = Array.isArray(entities) ? entities : [entities]
    const changes: Array<boolean> = new Array()
    for (const component of componentArray) {
      for (const entity of entityArray) {
        changes.push(component.detachEntity(entity))
      }
    }
    return changes
  }

  public static update(worlds: World | Array<World>, delta: number, time: number, args?: Array<unknown>): void {
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
