# Furry ECS

![GitHub package.json version](https://img.shields.io/github/package-json/v/jhondesignee/furry-ecs)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/furry-ecs)
![Codecov](https://img.shields.io/codecov/c/github/jhondesignee/furry-ecs)
![GitHub License](https://img.shields.io/github/license/jhondesignee/furry-ecs)

Furry ECS is a TypeScript Entity-component-system library

## Install

- npm

  ```bash
  npm install furry-ecs
  ```

  or

  ```bash
  npm install https://github.com/jhondesignee/furry-ecs
  ```

- yarn

  ```bash
  yarn add furry-ecs
  ```

  or

  ```bash
  yarn add https://github.com/jhondesignee/furry-ecs
  ```

## Usage

- ES Module

  ```typescript
  import ECS, { Constants } from "furry-ecs"
  ```

- CommonJS

  ```javascript
  const { ECS, Constants } = require("furry-ecs")
  ```

- Browser

  ```html
  <script src="https://cdn.jsdelivr.net/npm/furry-ecs@1.3.3/dist/index.min.js"></script>
  <script>
    const { ECS, Constants } = FurryECS
  </script>
  ```

## Example

```typescript
const world = ECS.createWorld()

const entity1 = ECS.createEntity()
const entity2 = ECS.createEntity()

const component1 = ECS.defineComponent({
  foo: Constants.ComponentType.NUMBER,
  bar: Constants.ComponentType.ARRAY
})
const component2 = ECS.defineComponent({
  baz: Constants.ComponentType.ARRAY
})

component1.setProp("foo", entity1.EID, 0)
component2.setProp("baz", entity2.EID, [0, 1])
const prop = component1.getProp("foo", entity1.EID)

const serializer = ECS.defineSerializer<typeof world>()
const serialized = serializer.serialize(world)
if (serialized) {
  const deserialized = serializer.deserialize(serialized)
}

const query = ECS.defineQuery({
  include: [component1],
  exclude: [component2]
})

const system1 = ECS.defineSystem({
  update(world, delta, time) {
    const entities = query.exec(world)
    const addedEntities = query.exec(world, Constants.Status.ADDED)
    const removedEntities = query.exec(world, Constants.Status.REMOVED)
  }
})
const system2 = ECS.defineSystem({
  update(world, delta, time, args) {
    let data: unknown = args?.[0]

    if (typeof data === "number") {
      data++
    }
  }
})

ECS.addEntity(world, [entity1, entity2])
ECS.addComponent(world, [component1, component2])
ECS.attachEntity([component1, component2], [entity1, entity2])
ECS.addSystem(world, [system1, system2])

// loop
const args = [0]
const delta = 0
const time = performance.now()
ECS.update(world, delta, time, args)
```

## Documentation

- Check out the [API reference](docs/api.md) for more details of each member

- See also a detailed [tutorial](docs/tutorial.md) for each feature
