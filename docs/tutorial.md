# Furry ECS Tutorial

Here is the overview of the features of Furry ECS

## Table of contents

- [Entity](#entity)
- [Component](#component)
- [System](#system)
- [World](#world)
- [Query](#query)
- [Serialization](#serialization)
- [Storage](#storage)

---

- ## **`Entity`** <a name="entity"></a>

  An entity can represent any object within the world

  Each entity is assigned a unique identifier (EID), which is mainly used in components

  You can create entities using either the `Entity` class or the `ECS.createEntity` method

  ```typescript
  import ECS, { Entity } from "furry-ecs"

  const entity1 = new Entity()
  const entity2 = ECS.createEntity()

  entity1.EID // 0
  entity2.EID // 1
  ```

- ## **`Component`** <a name="component"></a>

  A component is a global data structure used to store data related to entities

  Entities can also be attached to components so they can be filtered by queries

  You can create components using either the `Component` class or the `ECS.defineComponent` method

  ```typescript
  import ECS, { Component } from "furry-ecs"

  const component1 = new Component()
  const component2 = ECS.defineComponent()
  ```

  A schema can be used to define the property structure of the component

  The component maximum size can also be set

  Blank components can be used as a tag

  ```typescript
  import Constants from "furry-ecs"

  const componentSize = 100
  const component3 = new Component(
    {
      foo: Constants.ComponentType.NUMBER,
      bar: Constants.ComponentType.ARRAY
    },
    componentSize
  )
  const component4 = new Component()
  ```

  Properties can be accessed using the `getProp`, `getProps`, `setProp`, and `setProps` methods

  The entity properties can be deleted using the `deleteProp`, and `deleteProps` methods

  ```typescript
  let value = 2

  component3.setProp("foo", entity1.EID, value)
  component3.setProp("bar", entity1.EID, value * 2)

  component3.getProp("foo", entity1.EID) // 2
  // property 'foo' for entity2 was not previously set
  component3.getProp("foo", entity2.EID) // undefined
  component3.getProps(entity1.EID) // { foo: 2, bar: 4 }

  component3.setProps(entity2.EID, {
    foo: 4,
    bar: 5
  }) // set all properties at once

  component3.props // all properties as a Map

  component3.deleteProp("foo", entity1.EID) // resets the property value of the entity
  component3.deleteProps(entity1.EID) // resets all the property values of the entity
  ```

  Entities can be associated with the component using the `attachEntity` and `detachEntity` methods

  ```typescript
  component4.attachEntity(entity1)
  component4.attachEntity(entity2)

  component4.detachEntity(entity1)

  component4.entities // all entities attached. see Storage usage
  ```

  Changes will be applied automatically by the world if the component was added to it, so you do not need to call `commitChanges`. See `World` usage

  To delete all the data you can use the `destroy` method, it also detaches all the entities

  ```typescript
  component.destroy() // clear any data immediately
  ```

- ## **`System`** <a name="system"></a>

  A system represent actions within the world

  You can create systems using either the `System` class or the `ECS.defineSystem` method

  ```typescript
  import ECS, { System }

  const system1 = new System()
  const system2 = ECS.defineSystem()
  ```

  Three callbacks can be provided: `start`, `update`, and `destroy`

  ```typescript
  new System({
    start(world) {},
    update(world, delta, time, args) {},
    destroy(world) {}
  })
  ```

  The callbacks will receive the world instance which they have been added

  Additional arguments can be passed through the world `update` method

  ```typescript
  const delta = 0
  const time = performance.now()
  const args = [0, 1]

  world.addSystem(system) // start callback was called

  world.update(delta, time, args) // update callback was called

  world.removeSystem(system) // destroy callback was called
  ```

- ## **`World`** <a name="world"></a>

  A world represent the main hub of entities, components, and systems

  You can create worlds using either the `World` class or the `ECS.createWorld` method

  ```typescript
  import ECS, { World } from "furry-ecs"

  const world1 = new World()
  const world2 = ECS.createWorld()
  ```

  The world class has some method to manage entities, components, and systems

  ECS class can be used to manage multiple members

  ```typescript
  world1.addEntity(entity1)
  world1.addEntity(entity2)
  world2.addEntity(entity1)
  world2.addEntity(entity2)
  // or
  ECS.addEntity([world1, world2], [entity1, entity2])

  world1.addComponent(component1)
  world1.addComponent(component2)
  // or
  ECS.addComponent(world1, [component1, component2])

  world1.addSystem(system1)
  world2.addSystem(system1)
  // or
  ECS.addSystem([world1, world2], component1)
  ```

  The `update` method will apply any deferred change

  ```typescript
  world.addEntity(entity) // not changed yet
  world.entities // empty

  const delta = 0
  const time = performance.now()
  world.update(delta, time) // apply any change

  world.entities // has one entity
  ```

  To delete the world you can use the `destroy` method, it does not delete the data from components

  ```typescript
  world.destroy() // clear any data immediately
  ```

- ## **`Query`** <a name="query"></a>

  A query is used to filter entities based on components

  You can create queries using either the `Query` class or the `ECS.defineQuery` method

  ```typescript
  import ECS, { Query } from "furry-ecs"

  const query1 = new Query()
  const query2 = ECS.defineQuery()
  ```

  Only entities that match the included and excluded components will be filtered

  An operator for inclusion and exclusion logic can be given. By default it will be ALL for inclusion and ANY for exclusion

  ```typescript
  new Query({
    include: [component1, component2],
    exclude: [component3],
    includeOperation: QueryOperation.ALL, // default. entity should have ALL the included components
    excludeOperation: QueryOperation.ANY // default. entity should not have ANY of the excluded components
  })
  ```

  The `exec` method will look for these entities inside the world and store them

  ```typescript
  component1.attachEntity(entity1)
  component1.attachEntity(entity2)
  component1.attachEntity(entity3) // entity3 was not added to the world
  component1.attachEntity(entity4)
  // or
  ECS.attachEntity(component1, [entity1, entity2, entity3, entity4])

  component2.attachEntity(entity4)
  component2.attachEntity(entity5)

  const query = new Query({
    include: [component1],
    exclude: [component2]
  })

  query.exec(world) // [entity1, entity2]
  ```

  Entities can also be filtered by their status inside the world

  ```typescript
  import { Constants } from "furry-ecs"

  world.addEntity(entity1)
  world.update(0, 0) // entity1 has the status ADDED inside the world
  world.addEntity(entity2)
  world.update(0, 0) // entity1 has the status ACTIVE and entity2 has the status ADDED

  query.exec(world, Constants.Status.ADDED) // [entity2]

  world.removeEntity(entity2)
  world.update(0, 0) // entity2 has the status REMOVED

  query.exec(world, Constants.Status.ADDED) // []
  query.exec(world, Constants.Status.REMOVED) // [entity2]
  ```

  A component can be provided so the filtering will be based on their status inside the component

  ```typescript
  component.attachEntity(entity1)
  world.update(0, 0) // entity1 has the status ADDED inside the component
  component.attachEntity(entity2)
  world.update(0, 0) // entity1 has the status ACTIVE and entity2 has the status ADDED

  query.exec(world, Constants.Status.ADDED, component) // [entity2]

  component.detachEntity(entity2)
  world.update(0, 0) // entity2 has the status REMOVED

  query.exec(world, Constants.Status.ADDED, component) // []
  query.exec(world, Constants.Status.ACTIVE, component) // [entity1]
  query.exec(world, Constants.Status.REMOVED, component) // [entity2]
  ```

- ## **`Serialization`** <a name="serialization"></a>

  A serializer can transform any data into a JSON-like object

  You can create serializers using either the `Serializer` class or the `ECS.defineSerializer` method

  ```typescript
  import ECS, { Serializer } from "furry-ecs"

  const serializer1 = new Serializer()
  const serializer2 = ECS.defineSerializer()
  ```

  The `serialize` method will recursivelly serialize any object property until its primitives

  ```typescript
  const data = {
    foo: 0,
    bar: {
      value1: 0,
      value2: 1
    }
  }
  const serializer = new Serializer<typeof data>()

  const serialized = serializer.serialize(data) // output can be used in JSON.stringify

  if (serialized) {
    const deserialized = serializer.deserialize(serialized) // new object with same structure as the original
  }
  ```

  Classes are treated as a regular object. To restore the instance you need to implement the class with `SerializableClass`

  ```typescript
  import type { SerializableClass } from "furry-ecs"

  class Foo {
    public readonly value = 0

    public method(): void {}
  }

  class Bar implements SerializableClass<Bar> {
    public readonly classes = [Bar] // class definition used to restore the instance
    public readonly value = 1

    public method(): void {}
  }

  const serializer = new Serializer<Foo | Bar>()

  const serializedFoo = serializer.serialize(new Foo())
  const serializedBar = serializer.serialize(new Bar())

  if (serializedFoo && serializedBar) {
    serializer.deserialize(serializedFoo) // Object { value: 0 }
    serializer.deserialize(serializedBar) // Bar { value: 1, method: function() }
  }
  ```

- ## **`Storage`** <a name="storage"></a>

  A storage is used for managing data and their current status

  This class is mainly used internally, but you can still use it to store your own data

  You can create a storage using the `Storage` class

  ```typescript
  import { Storage } from "furry-ecs"

  const storage1 = new Storage()
  ```

  The data can be managed using either the `addData` and `removeData` methods

  Storage acts like a set, so there is no duplicated data

  ```typescript
  const storage = new Storage<number>()

  storage.addData(0) // data addition was deferred
  storage.commitChanges() // data has the status ADDED

  storage.removeData(0) // data removal was deferred
  storage.commitChanges() // data has the status REMOVED
  ```

  Changes can be done immediately if needed

  ```typescript
  storage.addData(0, true) // data is immediately added with status ACTIVE

  storage.removeData(0, true) // data is immediately removed

  storage.addData(0)
  storage.commitChanges(true) // apply any deferred change like described above
  ```
