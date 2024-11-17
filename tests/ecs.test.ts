import { beforeAll, describe, test, expect } from "vitest"
import ECS from "#ecs"
import Entity from "#entity"
import Component from "#component"
import System from "#system"
import Query from "#query"
import Serializer from "#serializer"
import World from "#world"

describe("ECS class test", () => {
  test("createWorld should return a World class instance", () => {
    expect(ECS.createWorld()).toBeInstanceOf(World)
  })
  test("createEntity should return an Entity class instance", () => {
    expect(ECS.createEntity()).toBeInstanceOf(Entity)
  })
  test("defineComponent should return a Component class instance", () => {
    expect(ECS.defineComponent()).toBeInstanceOf(Component)
  })
  test("defineSystem should return a System class instance", () => {
    expect(ECS.defineSystem()).toBeInstanceOf(System)
  })
  test("defineQuery should return a Query class instance", () => {
    expect(ECS.defineQuery()).toBeInstanceOf(Query)
  })
  test("defineQuery should return a Serializer class instance", () => {
    expect(ECS.defineSerializer()).toBeInstanceOf(Serializer)
  })
  describe("Entity management methods test", () => {
    let world1: World
    let world2: World
    let entity1: Entity
    let entity2: Entity

    beforeAll(() => {
      world1 = ECS.createWorld()
      world2 = ECS.createWorld()
      entity1 = ECS.createEntity()
      entity2 = ECS.createEntity()
    })

    test("Single world, single entity", () => {
      ECS.addEntity(world1, entity1)
      ECS.update(world1, 0, 0)
      expect(world1.entities.length()).toBe(1)
      ECS.removeEntity(world1, entity1)
      ECS.update(world1, 0, 0)
      expect(world1.entities.length()).toBe(1)
      ECS.update(world1, 0, 0)
      expect(world1.entities.length()).toBe(0)
    })
    test("Multiple worlds, single entity", () => {
      ECS.addEntity([world1, world2], entity1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.length()).toBe(1)
      expect(world2.entities.length()).toBe(1)
      ECS.removeEntity([world1, world2], entity1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.length()).toBe(1)
      expect(world2.entities.length()).toBe(1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.length()).toBe(0)
      expect(world2.entities.length()).toBe(0)
    })
    test("Multiple worlds, multiple entities", () => {
      ECS.addEntity([world1, world2], [entity1, entity2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.length()).toBe(2)
      expect(world2.entities.length()).toBe(2)
      ECS.removeEntity([world1, world2], [entity1, entity2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.length()).toBe(2)
      expect(world2.entities.length()).toBe(2)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.length()).toBe(0)
      expect(world2.entities.length()).toBe(0)
    })
  })
  describe("Component management methods test", () => {
    let world1: World
    let world2: World
    let entity1: Entity
    let entity2: Entity
    let component1: Component
    let component2: Component

    beforeAll(() => {
      world1 = ECS.createWorld()
      world2 = ECS.createWorld()
      entity1 = ECS.createEntity()
      entity2 = ECS.createEntity()
      component1 = ECS.defineComponent()
      component2 = ECS.defineComponent()
    })

    test("Single world, single entity, single component", () => {
      ECS.addEntity(world1, entity1)
      ECS.addComponent(world1, entity1, component1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(1)
      ECS.removeComponent(world1, entity1, component1)
      ECS.removeEntity(world1, entity1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(0)
    })
    test("Multiple worlds, single entity, single component", () => {
      ECS.addEntity([world1, world2], entity1)
      ECS.addComponent([world1, world2], entity1, component1)
      ECS.update([world1, world2], 0, 0)
      expect(component1.entities.length()).toBe(1)
      ECS.removeComponent([world1, world2], entity1, component1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(1)
      ECS.update(world2, 0, 0)
      expect(component1.entities.length()).toBe(0)
    })
    test("Single world, multiple entities, single component", () => {
      ECS.addEntity(world1, [entity1, entity2])
      ECS.addComponent(world1, [entity1, entity2], component1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(2)
      ECS.removeComponent(world1, [entity1, entity2], component1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(2)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(0)
    })
    test("Single world, single entity, multiple components", () => {
      ECS.addEntity(world1, entity1)
      ECS.addComponent(world1, entity1, [component1, component2])
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(1)
      expect(component2.entities.length()).toBe(1)
      ECS.removeComponent(world1, entity1, [component1, component2])
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(1)
      expect(component2.entities.length()).toBe(1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(0)
      expect(component2.entities.length()).toBe(0)
    })
    test("Multiple worlds, multiple entities, single component", () => {
      ECS.addEntity([world1, world2], [entity1, entity2])
      ECS.addComponent([world1, world2], [entity1, entity2], component1)
      ECS.update([world1, world2], 0, 0)
      expect(component1.entities.length()).toBe(2)
      ECS.removeComponent([world1, world2], [entity1, entity2], component1)
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(2)
      ECS.update(world2, 0, 0)
      expect(component1.entities.length()).toBe(0)
    })
    test("Multiple worlds, single entity, multiple components", () => {
      ECS.addEntity([world1, world2], entity1)
      ECS.addComponent([world1, world2], entity1, [component1, component2])
      ECS.update([world1, world2], 0, 0)
      expect(component1.entities.length()).toBe(1)
      expect(component1.entities.length()).toBe(1)
      expect(component2.entities.length()).toBe(1)
      expect(component2.entities.length()).toBe(1)
      ECS.removeComponent([world1, world2], entity1, [component1, component2])
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(1)
      expect(component1.entities.length()).toBe(1)
      expect(component2.entities.length()).toBe(1)
      expect(component2.entities.length()).toBe(1)
      ECS.update(world2, 0, 0)
      expect(component1.entities.length()).toBe(0)
      expect(component1.entities.length()).toBe(0)
      expect(component2.entities.length()).toBe(0)
      expect(component2.entities.length()).toBe(0)
    })
    test("Multiple worlds, multiple entities, multiple components", () => {
      ECS.addEntity([world1, world2], [entity1, entity2])
      ECS.addComponent([world1, world2], [entity1, entity2], [component1, component2])
      ECS.update([world1, world2], 0, 0)
      expect(component1.entities.length()).toBe(2)
      expect(component1.entities.length()).toBe(2)
      expect(component2.entities.length()).toBe(2)
      expect(component2.entities.length()).toBe(2)
      ECS.removeComponent([world1, world2], [entity1, entity2], [component1, component2])
      ECS.update(world1, 0, 0)
      expect(component1.entities.length()).toBe(2)
      expect(component1.entities.length()).toBe(2)
      expect(component2.entities.length()).toBe(2)
      expect(component2.entities.length()).toBe(2)
      ECS.update(world2, 0, 0)
      expect(component1.entities.length()).toBe(0)
      expect(component1.entities.length()).toBe(0)
      expect(component2.entities.length()).toBe(0)
      expect(component2.entities.length()).toBe(0)
    })
  })
  describe("System management methods test", () => {
    let world1: World
    let world2: World
    let system1: System
    let system2: System

    beforeAll(() => {
      world1 = ECS.createWorld()
      world2 = ECS.createWorld()
      system1 = ECS.defineSystem()
      system2 = ECS.defineSystem()
    })

    test("Single world, single system", () => {
      ECS.addSystem(world1, system1)
      ECS.update(world1, 0, 0)
      expect(world1.systems.length()).toBe(1)
      ECS.removeSystem(world1, system1)
      ECS.update(world1, 0, 0)
      expect(world1.systems.length()).toBe(1)
      ECS.update(world1, 0, 0)
      expect(world1.systems.length()).toBe(0)
    })
    test("Multiple worlds, single system", () => {
      ECS.addSystem([world1, world2], system1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.length()).toBe(1)
      expect(world2.systems.length()).toBe(1)
      ECS.removeSystem([world1, world2], system1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.length()).toBe(1)
      expect(world2.systems.length()).toBe(1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.length()).toBe(0)
      expect(world2.systems.length()).toBe(0)
    })
    test("Multiple worlds, multiple systems", () => {
      ECS.addSystem([world1, world2], [system1, system2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.length()).toBe(2)
      expect(world2.systems.length()).toBe(2)
      ECS.removeSystem([world1, world2], [system1, system2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.length()).toBe(2)
      expect(world2.systems.length()).toBe(2)
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.length()).toBe(0)
      expect(world2.systems.length()).toBe(0)
    })
  })
  describe("World data destruction test", () => {
    let world1: World
    let world2: World
    let entity1: Entity
    let entity2: Entity
    let component1: Component
    let component2: Component
    let system1: System
    let system2: System

    beforeAll(() => {
      world1 = ECS.createWorld()
      world2 = ECS.createWorld()
      entity1 = ECS.createEntity()
      entity2 = ECS.createEntity()
      component1 = ECS.defineComponent()
      component2 = ECS.defineComponent()
      system1 = ECS.defineSystem()
      system2 = ECS.defineSystem()
      ECS.addEntity([world1, world2], entity1)
      ECS.addComponent([world1, world2], entity1, component1)
      ECS.addSystem([world1, world2], system1)
      ECS.update([world1, world2], 0, 0)
      ECS.addEntity([world1, world2], entity2)
      ECS.addComponent([world1, world2], entity2, component2)
      ECS.addSystem([world1, world2], system2)
      ECS.destroyWorld([world1, world2])
    })

    test("Current data should be destroyed", () => {
      expect(world1.entities.length()).toBe(0)
      expect(world1.components.length()).toBe(0)
      expect(world1.systems.length()).toBe(0)
      expect(world2.entities.length()).toBe(0)
      expect(world2.components.length()).toBe(0)
      expect(world2.systems.length()).toBe(0)
    })
    test("Deferred changes should be destroyed", () => {
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.length()).toBe(0)
      expect(world1.components.length()).toBe(0)
      expect(world1.systems.length()).toBe(0)
      expect(world2.entities.length()).toBe(0)
      expect(world2.components.length()).toBe(0)
      expect(world2.systems.length()).toBe(0)
      ECS.addEntity(world1, entity1)
      ECS.destroyWorld(world1)
      ECS.update(world1, 0, 0)
      expect(world1.entities.length()).toBe(0)
    })
  })
})
