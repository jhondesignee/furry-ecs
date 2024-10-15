# Furry ECS

Furry ECS is a TypeScript Entity-component-system library

## Install

- npm

  ```bash
  npm install https://github.com/jhondesignee/furry-ecs
  ```

- yarn

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
  foo: ECS.ComponentType.NUMBER,
  bar: ECS.ComponentType.NUMBER
})
const component2 = ECS.defineComponent({
  baz: ECS.ComponentType.ARRAY
})

const system1 = ECS.defineSystem(world => {
  const query = ECS.defineQuery({
    include: [component1],
    exclude: [component2]
  })

  return (delta, time) => {
    const entities = query.exec(world)
    const addedEntities = query.exec(world, ECS.QueryModifier.ADDED)
    const removedEntities = query.exec(world, ECS.QueryModifier.REMOVED)
  }
})
const system2 = ECS.defineSystem((world, args) => {
  let data: number | undefined = args[0]

  if (data) {
    data++
  }
})

ECS.addEntity(world, [entity1, entity2])
ECS.addComponent(world, [entity1, entity2], [component1, component2])
ECS.addSystem(world, [system1, system2])

// loop
const delta = 0
const time = performance.now()
const args = [0]
ECS.update(world, delta, time, ...args)
```
