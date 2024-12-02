import { beforeAll, describe, test, expect } from "vitest"
import Query from "#query"
import Entity from "#entity"
import Component from "#component"
import World from "#world"
import { Status } from "#constants"

describe("Query class test", () => {
  let world: World
  let entity1: Entity
  let entity2: Entity
  let entity3: Entity
  let entity4: Entity
  let entity5: Entity
  let component1: Component<any>
  let component2: Component<any>
  let component3: Component<any>
  let query: Query

  beforeAll(() => {
    world = new World()
    entity1 = new Entity()
    entity2 = new Entity()
    entity3 = new Entity()
    entity4 = new Entity()
    entity5 = new Entity()
    component1 = new Component({})
    component2 = new Component({})
    component3 = new Component({})
    query = new Query({
      include: [component1],
      exclude: [component2]
    })
    world.addEntity(entity1)
    world.addEntity(entity2)
    world.addEntity(entity3)
    world.addEntity(entity4)
    world.addComponent(component1)
    world.addComponent(component2)
    world.addComponent(component3)
    component1.attachEntity(entity1)
    component1.attachEntity(entity2)
    component2.attachEntity(entity2)
    world.update(0, 0)
    component3.attachEntity(entity3)
    component1.attachEntity(entity4)
    world.update(0, 0)
  })

  test("Should filter the entities that satisfies the included and excluded components", () => {
    expect(query.exec(world).length).toBe(2)
  })
  test("Should filter the recently added entities", () => {
    world.addEntity(entity5)
    component1.attachEntity(entity5)
    expect(query.exec(world, Status.ADDED).length).toBe(0)
    world.update(0, 0)
    expect(query.exec(world, Status.ADDED).length).toBe(1)
    world.update(0, 0)
    expect(query.exec(world, Status.ADDED).length).toBe(0)
  })
  test("Should filter the recently removed entities", () => {
    world.removeEntity(entity1)
    component1.detachEntity(entity1)
    expect(query.exec(world, Status.REMOVED).length).toBe(0)
    world.update(0, 0)
    expect(query.exec(world, Status.REMOVED).length).toBe(1)
    world.update(0, 0)
    expect(query.exec(world, Status.REMOVED).length).toBe(0)
  })
})
