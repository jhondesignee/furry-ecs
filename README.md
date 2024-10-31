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

## Example

```typescript
import ECS from "furry-ecs"

const world = ECS.createWorld()

const entity1 = ECS.createEntity()
const entity2 = ECS.createEntity()

const component1 = ECS.defineComponent({
  foo: {
    type: ECS.ComponentType.NUMBER
  },
  bar: {
    type: ECS.ComponentType.NUMBER
  }
})
const component2 = ECS.defineComponent({
  baz: {
    type: ECS.ComponentType.ARRAY,
    length: 2
  }
})

component1.props.foo[entity1.EID] = 0
component2.props.baz[entity2.EID] = [0, 1]

const query = ECS.defineQuery({
  include: [component1],
  exclude: [component2]
})

const system1 = ECS.defineSystem({
  update(world, delta, time) {
    const entities = query.exec(world)
    const addedEntities = query.exec(world, ECS.Status.ADDED)
    const removedEntities = query.exec(world, ECS.Status.REMOVED)
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
ECS.addComponent(world, [entity1, entity2], [component1, component2])
ECS.addSystem(world, [system1, system2])

// loop
const args = [0]
const delta = 0
const time = performance.now()
ECS.update(world, delta, time, ...args)
```

## Documentation

Check out the [Documentation](DOCS.md) for more details of each member

## Improvements

- [ ] Add error handling and world size limit (WIP)
- [ ] Add serialization system
- [ ] Add a better type-safe solution for component properties
