import { beforeAll, describe, test, expect } from "vitest"
import World from "#world"
import Entity from "#entity"
import Component from "#component"
import System from "#system"

describe("World class test", () => {
  describe("Entity addition test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
    })

    test("Added entity should be deferred", () => {
      world.addEntity(entity1)
      expect(world.entities.size).toBe(0)
      world.update(0, 0)
      expect(world.entities.size).toBe(1)
    })
    test("Entities should be unique", () => {
      world.addEntity(entity1)
      expect(world.entities.size).toBe(1)
      world.update(0, 0)
      expect(world.entities.size).toBe(1)
    })
    test("Should not exist conflict between current and new entities", () => {
      world.addEntity(entity2)
      expect(world.entities.size).toBe(1)
      world.update(0, 0)
      expect(world.entities.size).toBe(2)
    })
  })
  describe("Component addition test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity
    let component1: Component
    let component2: Component

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
      component1 = new Component({})
      component2 = new Component({})
    })

    test("Added component to entities should be deferred only if the entity exists in the world", () => {
      world.addComponent(entity1, component1)
      expect(world.components.size).toBe(0)
      world.update(0, 0)
      expect(world.components.size).toBe(0)
      world.addEntity(entity1)
      world.addComponent(entity1, component1)
      expect(world.components.size).toBe(0)
      world.update(0, 0)
      expect(world.components.size).toBe(1)
      expect(world.components.get(component1)?.size).toBe(1)
    })
    test("Added component data should be created if they do not exist", () => {
      world.addComponent(entity1, component2)
      expect(world.components.size).toBe(1)
      world.update(0, 0)
      expect(world.components.size).toBe(2)
    })
    test("Should not exist conflict between current and new component entities", () => {
      world.addEntity(entity2)
      world.addComponent(entity2, component1)
      expect(world.components.size).toBe(2)
      expect(world.components.get(component1)?.size).toBe(1)
      world.update(0, 0)
      expect(world.components.size).toBe(2)
      expect(world.components.get(component1)?.size).toBe(2)
    })
  })
  describe("Systems should be added after the update method call", () => {
    let world: World
    let system1: System
    let system2: System

    beforeAll(() => {
      world = new World()
      system1 = new System(() => {})
      system2 = new System(() => {})
    })

    test("Added system should be deferred", () => {
      world.addSystem(system1)
      expect(world.systems.size).toBe(0)
      world.update(0, 0)
      expect(world.systems.size).toBe(1)
    })
    test("Systems should be unique", () => {
      world.addSystem(system1)
      expect(world.systems.size).toBe(1)
      world.update(0, 0)
      expect(world.systems.size).toBe(1)
    })
    test("Should not exist conflict between current and new systems", () => {
      world.addSystem(system2)
      expect(world.systems.size).toBe(1)
      world.update(0, 0)
      expect(world.systems.size).toBe(2)
    })
  })
  describe("Entity subtraction test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
      world.addEntity(entity1)
      world.addEntity(entity2)
      world.update(0, 0)
    })

    test("Removed entities should be deferred", () => {
      world.removeEntity(entity1)
      expect(world.entities.size).toBe(2)
      world.update(0, 0)
      expect(world.entities.size).toBe(1)
    })
    test("Skip if the entity does not exist", () => {
      world.removeEntity(entity1)
      expect(world.entities.size).toBe(1)
      world.update(0, 0)
      expect(world.entities.size).toBe(1)
      world.removeEntity(entity2)
      expect(world.entities.size).toBe(1)
      world.update(0, 0)
      expect(world.entities.size).toBe(0)
    })
  })

  describe("Component subtraction test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity
    let component1: Component
    let component2: Component
    let component3: Component

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
      component1 = new Component({})
      component2 = new Component({})
      component3 = new Component({})
      world.addEntity(entity1)
      world.addEntity(entity2)
      world.addComponent(entity1, component1)
      world.addComponent(entity1, component2)
      world.addComponent(entity2, component1)
      world.update(0, 0)
    })

    test("Removed entities from component should be deferred", () => {
      world.removeComponent(entity1, component1)
      expect(world.components.size).toBe(2)
      expect(world.components.get(component1)?.size).toBe(2)
      expect(world.components.get(component2)?.size).toBe(1)
      world.update(0, 0)
      expect(world.components.size).toBe(2)
      expect(world.components.get(component1)?.size).toBe(1)
      expect(world.components.get(component2)?.size).toBe(1)
    })
    test("Skip if entity or component does not exist on the world", () => {
      world.removeComponent(entity2, component2)
      world.update(0, 0)
      expect(world.components.size).toBe(2)
      expect(world.components.get(component1)?.size).toBe(1)
      expect(world.components.get(component2)?.size).toBe(1)
      world.removeComponent(entity1, component3)
      world.update(0, 0)
      expect(world.components.size).toBe(2)
      expect(world.components.get(component1)?.size).toBe(1)
      expect(world.components.get(component2)?.size).toBe(1)
    })
    test("Empty components should be deleted", () => {
      world.removeComponent(entity1, component2)
      world.update(0, 0)
      expect(world.components.size).toBe(1)
      expect(world.components.get(component1)?.size).toBe(1)
      expect(world.components.get(component2)?.size).toBeUndefined()
      world.removeComponent(entity2, component1)
      world.update(0, 0)
      expect(world.components.size).toBe(0)
      expect(world.components.get(component1)?.size).toBeUndefined()
      expect(world.components.get(component2)?.size).toBeUndefined()
    })
  })
  describe("System subtraction test", () => {
    let world: World
    let system1: System
    let system2: System

    beforeAll(() => {
      world = new World()
      system1 = new System(() => {})
      system2 = new System(() => {})
      world.addSystem(system1)
      world.addSystem(system2)
      world.update(0, 0)
    })

    test("Removed systems should be deferred", () => {
      world.removeSystem(system1)
      expect(world.systems.size).toBe(2)
      world.update(0, 0)
      expect(world.systems.size).toBe(1)
    })
    test("Skip if the system does not exist", () => {
      world.removeSystem(system1)
      expect(world.systems.size).toBe(1)
      world.update(0, 0)
      expect(world.systems.size).toBe(1)
      world.removeSystem(system2)
      expect(world.systems.size).toBe(1)
      world.update(0, 0)
      expect(world.systems.size).toBe(0)
    })
  })
  describe("World data should be destroyed", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity
    let component1: Component
    let component2: Component
    let system1: System
    let system2: System

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
      component1 = new Component({})
      component2 = new Component({})
      system1 = new System(() => {})
      system2 = new System(() => {})
      world.addEntity(entity1)
      world.addComponent(entity1, component1)
      world.addSystem(system1)
      world.update(0, 0)
      world.addEntity(entity2)
      world.addComponent(entity2, component2)
      world.addSystem(system2)
      world.destroy()
    })

    test("Current data should be destroyed", () => {
      expect(world.entities.size).toBe(0)
      expect(world.components.size).toBe(0)
      expect(world.systems.size).toBe(0)
    })
    test("Deferred changes should be destroyed", () => {
      world.update(0, 0)
      expect(world.entities.size).toBe(0)
      expect(world.components.size).toBe(0)
      expect(world.systems.size).toBe(0)
    })
  })
  describe("System execution test", () => {
    let world: World
    let system1: System
    let system2: System
    let system3: System
    let firstRun: Array<boolean>
    let receivesWorldInstance: Array<boolean>
    let receivesArgs: Array<boolean>
    let receivesTimers: Array<boolean>
    let updateOrder: Array<number>

    beforeAll(() => {
      world = new World()
      firstRun = new Array()
      receivesWorldInstance = new Array()
      receivesArgs = new Array()
      receivesTimers = new Array()
      updateOrder = new Array()
      system1 = new System((world, args) => {
        const ID = 0
        firstRun[ID] = true
        if (args?.[0] === "test") receivesArgs[ID] = true
        if (world instanceof World) receivesWorldInstance[ID] = true
        return (delta, time) => {
          if (delta === 1 && time === 2) receivesTimers[ID] = true
          updateOrder.push(ID)
        }
      })
      system2 = new System((world, args) => {
        const ID = 1
        firstRun[ID] = true
        if (args?.[0] === "test") receivesArgs[ID] = true
        if (world instanceof World) receivesWorldInstance[ID] = true
        return (delta, time) => {
          if (delta === 1 && time === 2) receivesTimers[ID] = true
          updateOrder.push(ID)
        }
      })
      system3 = new System((world, args) => {
        const ID = 2
        firstRun[ID] = true
        if (args?.[0] === "test") receivesArgs[ID] = true
        if (world instanceof World) receivesWorldInstance[ID] = true
        return (delta, time) => {
          if (delta === 1 && time === 2) receivesTimers[ID] = true
          updateOrder.push(ID)
        }
      })
      world.addSystem(system1, ["test"])
      world.addSystem(system2, ["test"])
      world.addSystem(system3, ["test"])
      world.update(1, 2)
    })

    test("Should run once after added to the world", () => {
      expect(firstRun.every(Boolean)).toBeTruthy()
    })
    test("Should receive the world instance", () => {
      expect(receivesWorldInstance.every(Boolean)).toBeTruthy()
    })
    test("Should receive the optional arguments", () => {
      expect(receivesArgs.every(Boolean)).toBeTruthy()
    })
    test("Should receive the correct timers", () => {
      expect(receivesTimers.every(Boolean)).toBeTruthy()
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
})
