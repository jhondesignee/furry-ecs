import { beforeAll, describe, test, expect } from "vitest"
import Query from "#query"
import Entity from "#entity"
import Component from "#component"
import World from "#world"
import { Status, QueryOperation } from "#constants"

describe("Query class test", () => {
  describe("Operation filtering test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity
    let entity3: Entity
    let entity4: Entity
    let component1: Component<any>
    let component2: Component<any>
    let component3: Component<any>

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
      entity3 = new Entity()
      entity4 = new Entity()
      component1 = new Component()
      component2 = new Component()
      component3 = new Component()
      world.addEntity(entity1)
      world.addEntity(entity2)
      world.addEntity(entity3)
      world.addEntity(entity4)
      world.addComponent(component1)
      world.addComponent(component2)
      world.addComponent(component3)
      component1.attachEntity(entity1)
      component2.attachEntity(entity1)
      component3.attachEntity(entity1)
      component1.attachEntity(entity2)
      component3.attachEntity(entity2)
      component1.attachEntity(entity3)
      component2.attachEntity(entity3)
      component3.attachEntity(entity4)
      world.update(0, 0)
    })

    test("Should include entities that have all the components", () => {
      const query = new Query({
        include: [component1, component2],
        includeOperation: QueryOperation.ALL,
        excludeOperation: QueryOperation.ALL
      })
      expect(query.exec(world).length).toBe(2)
    })
    test("Should include entities that have any the components", () => {
      const query = new Query({
        include: [component1, component2],
        includeOperation: QueryOperation.ANY,
        excludeOperation: QueryOperation.ANY
      })
      expect(query.exec(world).length).toBe(3)
    })
    test("Should include entities that have exactly the components", () => {
      const query = new Query({
        include: [component1, component2],
        includeOperation: QueryOperation.EXACT,
        excludeOperation: QueryOperation.EXACT
      })
      expect(query.exec(world).length).toBe(1)
    })
    test("Should exclude entities that have all the components", () => {
      const query = new Query({
        include: [component1],
        exclude: [component2, component3],
        excludeOperation: QueryOperation.ALL
      })
      expect(query.exec(world).length).toBe(2)
    })
    test("Should exclude entities that have any the components", () => {
      const query = new Query({
        include: [component1],
        exclude: [component2, component3],
        excludeOperation: QueryOperation.ANY
      })
      expect(query.exec(world).length).toBe(0)
    })
    test("Should exclude entities that have exactly the components", () => {
      const query = new Query({
        include: [component1],
        exclude: [component2, component3],
        excludeOperation: QueryOperation.EXACT
      })
      expect(query.exec(world).length).toBe(3)
    })
  })
  describe("Status filtering test", () => {
    let world: World
    let entity1: Entity
    let entity2: Entity
    let entity3: Entity
    let component: Component<any>
    let query: Query

    beforeAll(() => {
      world = new World()
      entity1 = new Entity()
      entity2 = new Entity()
      entity3 = new Entity()
      component = new Component()
      query = new Query({
        include: [component]
      })
      world.addComponent(component)
      world.addEntity(entity1)
      component.attachEntity(entity1)
      world.addEntity(entity2)
      component.attachEntity(entity2)
      world.update(0, 0)
      world.addEntity(entity3)
      component.attachEntity(entity3)
      world.removeEntity(entity1)
      component.detachEntity(entity1)
      world.update(0, 0)
    })

    test("Should filter all the added entities from the world", () => {
      expect(query.exec(world, Status.ADDED).length).toBe(1)
    })
    test("Should filter all the active entities from the world", () => {
      expect(query.exec(world, Status.ACTIVE).length).toBe(1)
    })
    test("Should filter all the removed entities from the world", () => {
      expect(query.exec(world, Status.REMOVED).length).toBe(1)
    })
    test("Should filter all the added entities from the component", () => {
      expect(query.exec(world, Status.ADDED, component).length).toBe(1)
    })
    test("Should filter all the active entities from the component", () => {
      expect(query.exec(world, Status.ACTIVE, component).length).toBe(1)
    })
    test("Should filter all the removed entities from the component", () => {
      expect(query.exec(world, Status.REMOVED, component).length).toBe(1)
    })
  })
  test("Query entities should be synchronized with the world and component states", () => {
    const world = new World()
    const entity = new Entity()
    const component = new Component()
    const query = new Query({
      include: [component]
    })
    world.addEntity(entity)
    world.addComponent(component)
    component.attachEntity(entity)
    expect(query.exec(world).length).toBe(0)
    world.update(0, 0)
    world.update(0, 0)
    expect(query.exec(world).length).toBe(1)
    component.detachEntity(entity)
    expect(query.exec(world).length).toBe(1)
    world.update(0, 0)
    world.update(0, 0)
    expect(query.exec(world).length).toBe(0)
    component.attachEntity(entity)
    world.update(0, 0)
    world.update(0, 0)
    world.removeComponent(component)
    expect(query.exec(world).length).toBe(1)
    world.update(0, 0)
    world.update(0, 0)
    expect(query.exec(world).length).toBe(0)
    world.addComponent(component)
    world.update(0, 0)
    world.update(0, 0)
    expect(query.exec(world).length).toBe(1)
    world.removeEntity(entity)
    world.update(0, 0)
    world.update(0, 0)
    expect(query.exec(world).length).toBe(0)
  })
})
