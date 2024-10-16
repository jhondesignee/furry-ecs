# Furry ECS documentation

here are the type definition and description for all the members of Furry ECS library

## Table of contents

- [SystemUpdateFunction](#system-update-function)
- [SystemFunction](#system-function)
- [QueryConfig](#query-config)
- [DeferredChanges](#deferred-changes)
- [ComponentType](#component-type)
- [QueryModifier](#query-modifier)
- [Constants](#constants)
- [ECS](#ecs)
- [Entity](#entity)
- [Component](#component)
- [System](#system)
- [Query](#query)
- [World](#world)

---

- ## **`SystemUpdateFunction: type`** <a name="system-update-function"></a>

  Represents the function that will run at the system update

  ### arguments

  - **delta: number**

    The difference between the current and previous time

  - **time: number**

    The current time

  ### return

  - **void**

- ## **`SystemFunction: type`** <a name="system-function"></a>

  Represents the system function that will run once it's added to the world

  ### arguments

  - **world: World**

    The world this system was added

  - **args: Array\<unknown\>**

    Some optional parameters passed to the world update method

  ### return

  - **SystemUpdateFunction | void**

- ## **`QueryConfig: interface`** <a name="query-config"></a>

  Represents the query configuration object structure

  ### properties

  - **include: Array\<Component\>**

    Defines all the components to be included in the entity query result

  - **exclude: Array\<Component\>**

    Defines all the components to be excluded from the entity query result

- ## **`DeferredChanges: interface`** <a name="deferred-changes"></a>

  Represents the deferred changes object structure of the world

  ### generics

  - **EntitySet**
  - **ComponentMap**
  - **SystemMap**

  ### properties

  - **added: { entities: EntitySet; components: ComponentMap; systems: SystemMap }**

    Stores all the recently added entities, components and systems to the world

  - **removed: { entities: EntitySet; components: ComponentMap; systems: SystemMap }**

    Stores all the recently removed entities, components and systems from the world

- ## **`ComponentType: enum`** <a name="component-type"></a>

  Enum of all possible types of component properties

  ### properties

  - **NUMBER: 0**

    Represents a component property of type number

  - **ARRAY: 1**

    Represents a component property of type array of number

- ## **`QueryModifier: enum`** <a name="query-modifier"></a>

  Enum of additional filters for queries

  ### properties

  - **ADDED: 0**

    Represents a recently added entity

  - **ACTIVE: 1**

    Represents an active entity

  - **REMOVED: 2**

    Represents a recently removed entity

- ## **`Constants: const`** <a name="constants"></a>

  Set of constant values

  ### properties

  - **ComponentType: _typeof_ ComponentType**

    Enum of all possible types of component properties

  - **QueryModifier: _typeof_ QueryModifier**

    Enum of additional filters for queries

- ## **`ECS: class`** <a name="ecs"></a>

  Utility class to centralize access to resources

  ### properties

  - **_public static readonly_ ComponentType: _typeof_ ComponentType**

    Enum of all possible types of component properties

  - **_public static readonly_ QueryModifier: _typeof_ QueryModifier**

    Enum of additional filters for queries

  ### methods

  - **_public static_ createWorld(): World**

    Creates a world instance

  - **_public static_ createEntity(): Entity**

    Creates a entity instance

  - **_public static_ defineComponent<Schema _extends_ Record\<string, ComponentType\>\>(schema: Schema): Component\<Schema\>**

    Creates a component instance

  - **_public static_ defineSystem(systemFunction: SystemFunction): System**

    Creates a system instance

  - **_public static_ defineQuery(config: QueryConfig): Query**

    Creates a query instance

  - **_public static_ addEntity(world: World, entities: Array\<Entity\>): void**

    Adds entities to the world

  - **_public static_ addComponent(world: World, entities: Array\<Entity\>, components: Array\<Component\>): void**

    Adds components to entities in the world

  - **_public static_ addSystem(world: World, systems: Array\<System\>, ...args: Array\<unknown\>): void**

    Adds systems to the world

  - **_public static_ update(world: World, delta: number, time: number): void**

    Updates the world

  - **_public static_ removeEntity(world: World, entities: Array\<Entity\>): void**

    Removes entities from the world

  - **_public static_ removeComponent(world: World, entities: Array\<Entity\>, components: Array\<Component\>): void**

    Removes components from entities in the world

  - **_public static_ removeSystem(world: World, systems: Array\<System\>): void**

    Removes systems from the world

  - **_public static_ destroyWorld(world: World): void**

    Erases all the data from the world

- ## **`Entity: class`** <a name="entity"></a>

  Represents an entity in the world

  ### properties

  - **_public readonly_ EID: number**

    Stores the unique ID of the entity instance

  - **_private static_ nextEID: number**

    Stores the next EID to be used

  - **_private static_ recycledEID: Set\<number\>**

    Set of released IDs

  ### methods

  - **_public static_ recycleEID(EID: number): void**

    Releases an EID to be reused

  - **_private static_ getNextEID(): number**

    Get the next EID from recycledEID or the nextEID

- ## **`Component: class`** <a name="component"></a>

  Represents the data structure for all entities

  ### generics

  - **Schema _extends_ Record\<string, ComponentType\> = {}**

  ### properties

  - **_public readonly_ pros: { [K _in keyof_ Schema]: Schema[K] _extends_ ComponentType.NUMBER ? Array\<number\> : Array\<Array\<number\>\> }**

    Stores all the entity properties as an array of specified type

  ### arguments

  - **schema: Schema**

    The properties structure. An empty object can be used for the component act like a tag

  ### methods

  - **_private static_ createProperties<Schema _extends_ Record\<string, ComponentType\>\>(schema: Schema)**

    Creates the properties structure

- ## **`System: class`** <a name="system"></a>

  Represents the functionality of the world

  ### properties

  - **public readonly onStart: SystemFunction**

    Stores the function that will run once it's added to the world

  ### arguments

  - **systemFunction: SystemFunction**

    The function that will run once it's added to the world

- ## **`Query: class`** <a name="query"></a>

  Represents an entity filter based on components

  ### properties

  - **_private readonly_ includeComponents: Set\<Component\>**

    Stores all the components that entities need to be included

  - **_private readonly_ excludeComponents: Set\<Component\>**

    Stores all the components that will exclude entities

  - **_private entities_: Map\<Entity, QueryModifier\>**

    Stores the filtered entities and its corresponding status

  ### arguments

  - **config: QueryConfig**

    The configuration object

  ### methods

  - **_public_ exec(world: World, modifier?: QueryModifier): Array\<Entity\>**

    Filters the entities that satisfies the included and excluded components. A modifier can be used for further filtering

  - **_private_ filterEntitiesByComponent(world: World): Map\<Entity, QueryModifier\>**

    Filters the entities based on the included and excluded components

  - **_private_ filterEntitiesByModifier(modifier: QueryModifier): Array\<Entity\>**

    Filters the already filtered entities based on the modifier

- ## **`World: class`** <a name="world"></a>

  Represents the main hub for entities, components and systems

  ### properties

  - **_public readonly_ entities: Set\<Entity\>**

    Stores entities added to the world

  - **_public readonly_ components: Map\<Component, Map\<Entity, QueryModifier\>\>**

    Stores components and its associated entities

  - **_public readonly_ systems: Map\<System, SystemUpdateFunction | void\>**

    Stores systems and its update function

  - **_public_ hasChanged: boolean**

    Indicates if there has been any change in the world

  - **_private readonly_ deferredChanges: DeferredChanges\<World["entities"], World["components"], World["systems"]\>**

    Stores any change before it be implemented

  ### methods

  - **_public_ addEntity(entity: Entity): void**

    Adds an entity to the world

  - **_public_ addComponent(component: Component): void**

    Adds a component to the world

  - **_public_ addSystem(system: System): void**

    Adds a system to the world

  - **_public_ update(delta: number, time: number): void**

    Updates the world

  - **_public_ removeEntity(entity: Entity): void**

    Removes an entity from the world

  - **_public_ removeComponent(component: Component): void**

    Removes a component from the world

  - **_public_ removeSystem(system: System): void**

    Removes a system from the world

  - **_public_ destroy(): void**

    Erases all the data from the world

  - **_private_ applyDeferredChanges(): void**

    Checks for any deferred changes and implement them

  - **private clearDeferredChanges(): void**

    Clears any previous previous changes
