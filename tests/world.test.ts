import { beforeAll, describe, test, expect } from "vitest"
import World from "#world"
import Entity from "#entity"
import Component from "#component"
import System from "#system"
import { Status } from "#constants"

describe("World class test", () => {
  describe("Entity addition test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity
    let entity3: Entity

    beforeAll(() => {
      world = new World({ size: 2 })
      entity1 = new Entity()
      entity2 = new Entity()
      entity3 = new Entity()
    })

    test("Added entities should be deferred", () => {
      world.addEntity(entity1)
      expect(world.entities.length()).toBe(0)
      world.update(0, 0)
      expect(world.entities.length()).toBe(1)
    })
    test("Added entities should have the ADDED status for one frame", () => {
      expect(world.entities.getDataStatus(entity1)).toBe(Status.ADDED)
      world.update(0, 0)
      expect(world.entities.getDataStatus(entity1)).toBe(Status.ACTIVE)
    })
    test("Entities should be unique", () => {
      world.addEntity(entity1)
      expect(world.entities.length()).toBe(1)
      world.update(0, 0)
      expect(world.entities.length()).toBe(1)
    })
    test("Should not exist conflict between current and new entities", () => {
      world.addEntity(entity2)
      expect(world.entities.length()).toBe(1)
      world.update(0, 0)
      expect(world.entities.length()).toBe(2)
    })
    test("Add entity out of range should return false", () => {
      expect(world.addEntity(entity3)).toBeFalsy()
    })
  })
  describe("Component addition test", () => {
    let world: World
    let component1: Component<any>
    let component2: Component<any>
    let component3: Component<any>

    beforeAll(() => {
      world = new World({ size: 2 })
      component1 = new Component()
      component2 = new Component()
      component3 = new Component()
    })

    test("Added components should be deferred", () => {
      world.addComponent(component1)
      expect(world.components.length()).toBe(0)
      world.update(0, 0)
      expect(world.components.length()).toBe(1)
    })
    test("Added components should have the ADDED status for one frame", () => {
      expect(world.components.getDataStatus(component1)).toBe(Status.ADDED)
      world.update(0, 0)
      expect(world.components.getDataStatus(component1)).toBe(Status.ACTIVE)
    })
    test("Components should be unique", () => {
      world.addComponent(component1)
      expect(world.components.length()).toBe(1)
      world.update(0, 0)
      expect(world.components.length()).toBe(1)
    })
    test("Should not exist conflict between current and new component", () => {
      world.addComponent(component2)
      expect(world.components.length()).toBe(1)
      world.update(0, 0)
      expect(world.components.length()).toBe(2)
    })
    test("Add component out of range should return false", () => {
      expect(world.addComponent(component3)).toBeFalsy()
    })
  })
  describe("System addition test", () => {
    let world: World
    let system1: System
    let system2: System
    let system3: System

    beforeAll(() => {
      world = new World({ size: 2 })
      system1 = new System()
      system2 = new System()
      system3 = new System()
    })

    test("Added system should be deferred", () => {
      world.addSystem(system1)
      expect(world.systems.length()).toBe(0)
      world.update(0, 0)
      expect(world.systems.length()).toBe(1)
    })
    test("Systems should be unique", () => {
      world.addSystem(system1)
      expect(world.systems.length()).toBe(1)
      world.update(0, 0)
      expect(world.systems.length()).toBe(1)
    })
    test("Should not exist conflict between current and new systems", () => {
      world.addSystem(system2)
      expect(world.systems.length()).toBe(1)
      world.update(0, 0)
      expect(world.systems.length()).toBe(2)
    })
    test("Add system out of range should return false", () => {
      expect(world.addSystem(system3)).toBeFalsy()
    })
  })
  describe("Entity removal test", () => {
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
      expect(world.entities.length()).toBe(2)
      world.update(0, 0)
      expect(world.entities.length()).toBe(2)
    })
    test("Removed entities should have the REMOVED status for one frame", () => {
      expect(world.entities.getDataStatus(entity1)).toBe(Status.REMOVED)
      world.update(0, 0)
      expect(world.entities.getDataStatus(entity1)).toBeUndefined()
    })
    test("Skip if the entity does not exist in the world", () => {
      world.removeEntity(entity1)
      expect(world.entities.length()).toBe(1)
      world.update(0, 0)
      expect(world.entities.length()).toBe(1)
      world.removeEntity(entity2)
      expect(world.entities.length()).toBe(1)
      world.update(0, 0)
      world.update(0, 0)
      expect(world.entities.length()).toBe(0)
    })
    test("Removed entities should be removed from its components", () => {
      const component = new Component()
      component.attachEntity(entity1)
      component.attachEntity(entity2)
      world.addEntity(entity1)
      world.addEntity(entity2)
      world.addComponent(component)
      world.update(0, 0)
      world.update(0, 0)
      expect(world.entities.length()).toBe(2)
      expect(component.entities.length()).toBe(2)
      world.removeEntity(entity1)
      world.update(0, 0)
      world.update(0, 0)
      expect(world.entities.length()).toBe(1)
      expect(component.entities.length()).toBe(1)
    })
  })

  describe("Component removal test", () => {
    let world: World
    let component1: Component<any>
    let component2: Component<any>

    beforeAll(() => {
      world = new World()
      component1 = new Component()
      component2 = new Component()
      world.addComponent(component1)
      world.addComponent(component2)
      world.update(0, 0)
    })

    test("Removed components should be deferred", () => {
      world.removeComponent(component1)
      expect(world.components.length()).toBe(2)
      world.update(0, 0)
      expect(world.components.length()).toBe(2)
    })
    test("Removed components should have the REMOVED status for one frame", () => {
      expect(world.components.getDataStatus(component1)).toBe(Status.REMOVED)
      world.update(0, 0)
      expect(world.components.getDataStatus(component1)).toBeUndefined()
    })
    test("Skip if the component does not exist in the world", () => {
      world.removeComponent(component1)
      expect(world.components.length()).toBe(1)
      world.update(0, 0)
      expect(world.components.length()).toBe(1)
      world.removeComponent(component2)
      expect(world.components.length()).toBe(1)
      world.update(0, 0)
      world.update(0, 0)
      expect(world.components.length()).toBe(0)
    })
  })
  describe("System removal test", () => {
    let world: World
    let system1: System
    let system2: System

    beforeAll(() => {
      world = new World()
      system1 = new System()
      system2 = new System()
      world.addSystem(system1)
      world.addSystem(system2)
      world.update(0, 0)
    })

    test("Removed systems should be deferred", () => {
      world.removeSystem(system1)
      expect(world.systems.length()).toBe(2)
      world.update(0, 0)
      expect(world.systems.length()).toBe(2)
    })
    test("Removed systems should have the REMOVED status for one frame", () => {
      expect(world.systems.getDataStatus(system1)).toBe(Status.REMOVED)
      world.update(0, 0)
      expect(world.systems.getDataStatus(system1)).toBeUndefined()
    })
    test("Skip if the system does not exist in the world", () => {
      world.removeSystem(system1)
      expect(world.systems.length()).toBe(1)
      world.update(0, 0)
      expect(world.systems.length()).toBe(1)
      world.removeSystem(system2)
      expect(world.systems.length()).toBe(1)
      world.update(0, 0)
      world.update(0, 0)
      expect(world.systems.length()).toBe(0)
    })
  })
  describe("World data destruction test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity
    let component1: Component<any>
    let component2: Component<any>
    let system1: System
    let system2: System

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
      component1 = new Component({})
      component2 = new Component({})
      system1 = new System()
      system2 = new System()
      world.addEntity(entity1)
      world.addComponent(component1)
      world.addSystem(system1)
      world.update(0, 0)
      world.addEntity(entity2)
      world.addComponent(component2)
      world.addSystem(system2)
      world.destroy()
    })

    test("Current data should be destroyed", () => {
      expect(world.entities.length()).toBe(0)
      expect(world.components.length()).toBe(0)
      expect(world.systems.length()).toBe(0)
    })
    test("Deferred changes should be destroyed", () => {
      world.update(0, 0)
      expect(world.entities.length()).toBe(0)
      expect(world.components.length()).toBe(0)
      expect(world.systems.length()).toBe(0)
    })
  })
  describe("System execution test", () => {
    let world: World
    let system1: System
    let system2: System
    let system3: System
    let startRun: boolean
    let destroyRun: boolean
    let updateOrder: Array<number>

    beforeAll(() => {
      world = new World()
      system1 = new System({
        start() {
          startRun = true
        },
        update() {
          updateOrder.push(0)
        }
      })
      system2 = new System({
        update() {
          updateOrder.push(1)
        }
      })
      system3 = new System({
        update() {
          updateOrder.push(2)
        },
        destroy() {
          destroyRun = true
        }
      })
      startRun = false
      destroyRun = false
      updateOrder = new Array()
      world.addSystem(system1)
      world.addSystem(system2)
      world.addSystem(system3)
      world.update(0, 0)
    })

    test("Start function should run once after being added to the world", () => {
      expect(startRun).toBeTruthy()
    })
    test("Update functions should be run in addition order", () => {
      let sorted = true
      for (let index = 0; index < updateOrder.length - 1; index++) {
        if (updateOrder[index]! >= updateOrder[index + 1]!) sorted = false
      }
      expect(sorted).toBeTruthy()
    })
    test("Destroy function should run once after being removed from the world", () => {
      world.removeSystem(system3)
      expect(destroyRun).toBeTruthy()
    })
  })
  describe("Same frame changes test", () => {
    let world: World
    let entity: Entity
    let component: Component<any>
    let system: System

    beforeAll(() => {
      world = new World()
      entity = new Entity()
      component = new Component({})
      system = new System()
    })

    test("Entity changes should be done immediately", () => {
      world.addEntity(entity)
      world.removeEntity(entity)
      expect(world.entities.length(true)).toBe(0)
      world.update(0, 0)
      expect(world.entities.length(true)).toBe(0)
    })
    test("Component changes should be done immediately", () => {
      world.addComponent(component)
      world.removeComponent(component)
      expect(world.components.length(true)).toBe(0)
      world.update(0, 0)
      expect(world.components.length(true)).toBe(0)
    })
    test("System changes should be done immediately", () => {
      world.addSystem(system)
      world.removeSystem(system)
      expect(world.systems.length(true)).toBe(0)
      world.update(0, 0)
      expect(world.systems.length(true)).toBe(0)
    })
  })
})
