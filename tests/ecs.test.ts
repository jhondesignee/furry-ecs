import { beforeAll, describe, test, expect } from "vitest"
import ECS from "#ecs"
import Entity from "#entity"
import Component from "#component"
import System from "#system"
import Query from "#query"
import World from "#world"

describe("ECS class test", () => {
  test("createWorld should return a World class instance", () => {
    expect(ECS.createWorld()).toBeInstanceOf(World)
  })
  test("createEntity should return an Entity class instance", () => {
    expect(ECS.createEntity()).toBeInstanceOf(Entity)
  })
  test("defineComponent should return a Component class instance", () => {
    expect(ECS.defineComponent({})).toBeInstanceOf(Component)
  })
  test("defineSystem should return a System class instance", () => {
    expect(ECS.defineSystem(() => {})).toBeInstanceOf(System)
  })
  test("defineQuery should return a Query class instance", () => {
    expect(ECS.defineQuery({ include: [] })).toBeInstanceOf(Query)
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
      expect(world1.entities.size).toBe(1)
      ECS.removeEntity(world1, entity1)
      ECS.update(world1, 0, 0)
      expect(world1.entities.size).toBe(1)
      ECS.update(world1, 0, 0)
      expect(world1.entities.size).toBe(0)
    })
    test("Multiple worlds, single entity", () => {
      ECS.addEntity([world1, world2], entity1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.size).toBe(1)
      expect(world2.entities.size).toBe(1)
      ECS.removeEntity([world1, world2], entity1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.size).toBe(1)
      expect(world2.entities.size).toBe(1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.size).toBe(0)
      expect(world2.entities.size).toBe(0)
    })
    test("Multiple worlds, multiple entities", () => {
      ECS.addEntity([world1, world2], [entity1, entity2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.size).toBe(2)
      expect(world2.entities.size).toBe(2)
      ECS.removeEntity([world1, world2], [entity1, entity2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.size).toBe(2)
      expect(world2.entities.size).toBe(2)
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.size).toBe(0)
      expect(world2.entities.size).toBe(0)
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
      component1 = ECS.defineComponent({})
      component2 = ECS.defineComponent({})
    })

    test("Single world, single entity, single component", () => {
      ECS.addEntity(world1, entity1)
      ECS.addComponent(world1, entity1, component1)
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      ECS.removeComponent(world1, entity1, component1)
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBeUndefined()
    })
    test("Multiple worlds, single entity, single component", () => {
      ECS.addEntity([world1, world2], entity1)
      ECS.addComponent([world1, world2], entity1, component1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      expect(world2.components.get(component1)?.size).toBe(1)
      ECS.removeComponent([world1, world2], entity1, component1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      expect(world2.components.get(component1)?.size).toBe(1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBeUndefined()
      expect(world2.components.get(component1)?.size).toBeUndefined()
    })
    test("Single world, multiple entities, single component", () => {
      ECS.addEntity(world1, [entity1, entity2])
      ECS.addComponent(world1, [entity1, entity2], component1)
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBe(2)
      ECS.removeComponent(world1, [entity1, entity2], component1)
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBe(2)
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBeUndefined() // 1 instead of undefined
    })
    test("Single world, single entity, multiple components", () => {
      ECS.addEntity(world1, entity1)
      ECS.addComponent(world1, entity1, [component1, component2])
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      expect(world1.components.get(component2)?.size).toBe(1)
      ECS.removeComponent(world1, entity1, [component1, component2])
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      expect(world1.components.get(component2)?.size).toBe(1)
      ECS.update(world1, 0, 0)
      expect(world1.components.get(component1)?.size).toBeUndefined()
      expect(world1.components.get(component2)?.size).toBeUndefined()
    })
    test("Multiple worlds, multiple entities, single component", () => {
      ECS.addEntity([world1, world2], [entity1, entity2])
      ECS.addComponent([world1, world2], [entity1, entity2], component1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(2)
      expect(world2.components.get(component1)?.size).toBe(2)
      ECS.removeComponent([world1, world2], [entity1, entity2], component1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(2)
      expect(world2.components.get(component1)?.size).toBe(2)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBeUndefined()
      expect(world2.components.get(component1)?.size).toBeUndefined()
    })
    test("Multiple worlds, single entity, multiple components", () => {
      ECS.addEntity([world1, world2], entity1)
      ECS.addComponent([world1, world2], entity1, [component1, component2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      expect(world2.components.get(component1)?.size).toBe(1)
      expect(world1.components.get(component2)?.size).toBe(1)
      expect(world2.components.get(component2)?.size).toBe(1)
      ECS.removeComponent([world1, world2], entity1, [component1, component2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(1)
      expect(world2.components.get(component1)?.size).toBe(1)
      expect(world1.components.get(component2)?.size).toBe(1)
      expect(world2.components.get(component2)?.size).toBe(1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBeUndefined()
      expect(world2.components.get(component1)?.size).toBeUndefined()
      expect(world1.components.get(component2)?.size).toBeUndefined()
      expect(world2.components.get(component2)?.size).toBeUndefined()
    })
    test("Multiple worlds, multiple entities, multiple components", () => {
      ECS.addEntity([world1, world2], [entity1, entity2])
      ECS.addComponent([world1, world2], [entity1, entity2], [component1, component2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(2)
      expect(world2.components.get(component1)?.size).toBe(2)
      expect(world1.components.get(component2)?.size).toBe(2)
      expect(world2.components.get(component2)?.size).toBe(2)
      ECS.removeComponent([world1, world2], [entity1, entity2], [component1, component2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBe(2)
      expect(world2.components.get(component1)?.size).toBe(2)
      expect(world1.components.get(component2)?.size).toBe(2)
      expect(world2.components.get(component2)?.size).toBe(2)
      ECS.update([world1, world2], 0, 0)
      expect(world1.components.get(component1)?.size).toBeUndefined()
      expect(world2.components.get(component1)?.size).toBeUndefined()
      expect(world1.components.get(component2)?.size).toBeUndefined()
      expect(world2.components.get(component2)?.size).toBeUndefined()
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
      system1 = ECS.defineSystem(() => {})
      system2 = ECS.defineSystem(() => {})
    })

    test("Single world, single system", () => {
      ECS.addSystem(world1, system1)
      ECS.update(world1, 0, 0)
      expect(world1.systems.size).toBe(1)
      ECS.removeSystem(world1, system1)
      ECS.update(world1, 0, 0)
      expect(world1.systems.size).toBe(0)
    })
    test("Multiple worlds, single system", () => {
      ECS.addSystem([world1, world2], system1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.size).toBe(1)
      expect(world2.systems.size).toBe(1)
      ECS.removeSystem([world1, world2], system1)
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.size).toBe(0)
      expect(world2.systems.size).toBe(0)
    })
    test("Multiple worlds, multiple systems", () => {
      ECS.addSystem([world1, world2], [system1, system2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.size).toBe(2)
      expect(world2.systems.size).toBe(2)
      ECS.removeSystem([world1, world2], [system1, system2])
      ECS.update([world1, world2], 0, 0)
      expect(world1.systems.size).toBe(0)
      expect(world2.systems.size).toBe(0)
    })
  })
  describe("System execution test", () => {
    let world1: World
    let world2: World
    let world3: World
    let system1: System
    let system2: System
    let system3: System
    let updateOrder: Array<number>

    beforeAll(() => {
      world1 = ECS.createWorld()
      world2 = ECS.createWorld()
      world3 = ECS.createWorld()
      updateOrder = new Array()
      system1 = ECS.defineSystem(() => {
        const ID = 0
        return () => {
          updateOrder.push(ID)
        }
      })
      system2 = ECS.defineSystem(() => {
        const ID = 1
        return () => {
          updateOrder.push(ID)
        }
      })
      system3 = ECS.defineSystem(() => {
        const ID = 2
        return () => {
          updateOrder.push(ID)
        }
      })
      ECS.addSystem(world1, system1)
      ECS.addSystem(world2, system2)
      ECS.addSystem(world3, system3)
      ECS.update([world1, world2, world3], 0, 0)
    })

    test("Should be called in addition order", () => {
      let isSorted = true
      for (let index = 0; index < updateOrder.length - 1; index++) {
        if (updateOrder[index]! > updateOrder[index + 1]!) {
          isSorted = false
          break
        }
      }
      expect(isSorted).toBeTruthy()
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
      component1 = ECS.defineComponent({})
      component2 = ECS.defineComponent({})
      system1 = ECS.defineSystem(() => {})
      system2 = ECS.defineSystem(() => {})
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
      expect(world1.entities.size).toBe(0)
      expect(world1.components.size).toBe(0)
      expect(world1.systems.size).toBe(0)
      expect(world2.entities.size).toBe(0)
      expect(world2.components.size).toBe(0)
      expect(world2.systems.size).toBe(0)
    })
    test("Deferred changes should be destroyed", () => {
      ECS.update([world1, world2], 0, 0)
      expect(world1.entities.size).toBe(0)
      expect(world1.components.size).toBe(0)
      expect(world1.systems.size).toBe(0)
      expect(world2.entities.size).toBe(0)
      expect(world2.components.size).toBe(0)
      expect(world2.systems.size).toBe(0)
      ECS.addEntity(world1, entity1)
      ECS.destroyWorld(world1)
      ECS.update(world1, 0, 0)
      expect(world1.entities.size).toBe(0)
    })
  })
})
