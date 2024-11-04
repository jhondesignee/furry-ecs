<!--
- ## **`MEMBER: INITIALIZER`** <a name="LINK"></a>

  DESCRIPTION

  ### generics

  - **MEMBER: TYPE**

    DESCRIPTION

  ### properties

  - **MEMBER: TYPE**

    DESCRIPTION

  ### arguments

  - **MEMBER: TYPE**

    DESCRIPTION

  ### methods

  - **MEMBER: TYPE**

    DESCRIPTION

  ### returns

  - **TYPE**

    DESCRIPTION
-->

# Furry ECS documentation

here are the type definition and description for all the members of Furry ECS library

## Table of contents

- [SystemStartFunction](#system-start-function)
- [SystemUpdateFunction](#system-update-function)
- [SystemDestroyFunction](#system-destroy-function)
- [ComponentSchema](#component-schema)
- [DeprecatedComponentSchema](#deprecated-component-schema)
- [ComponentProps](#component-props)
- [SystemConfig](#system-config)
- [QueryConfig](#query-config)
- [WorldConfig](#world-config)
- [StorageSerializedData](#storage-serialized-data)
- [DEFAULT_WORLD_SIZE](#default-world-size)
- [DEFAULT_ARRAY_SIZE](#default-array-size)
- [ComponentType](#component-type)
- [Status](#status)
- [Constants](#constants)
- [ECS](#ecs)
- [Entity](#entity)
- [Component](#component)
- [System](#system)
- [Query](#query)
- [Storage](#storage)
- [World](#world)

---

- ## **`SystemStartFunction: type`** <a name="system-start-function"></a>

  Represents the function that will run once it's added to the world

  ### arguments

  - **world: World**

    The world instance

  ### returns

  - **void**

- ## **`SystemUpdateFunction: type`** <a name="system-update-function"></a>

  Represents the function that will run at the system update

  ### arguments

  - **world: World**

    The world instance

  - **delta: number**

    The difference between the current and previous time

  - **time: number**

    The current time

  - **args?: Array\<unknown\>**

    List of some optional args from the world update method

  ### returns

  - **void**

- ## **`SystemDestroyFunction: type`** <a name="system-destroy-function"></a>

  Represents the function that will run once it's removed from the world

  ### arguments

  - **world: World**

    The world instance

  ### returns

  - **void**

- ## **`ComponentSchema: type`** <a name="component-schema"></a>

  Represents a schema of properties

  ### generics

  - **T**

    Enum of possible types

  ### properties

  - **[key: string]: { type: T; length?: T _extends_ ComponentType.NUMBER ? undefined : number }**

    The component properties

- ## **`DeprecatedComponentSchema: type`** <a name="deprecated-component-schema"></a>

  Represents the old type definition for component schema

  ### returns

  - **Record\<string, ComponentType\>**

- ## **`ComponentProps: type`** <a name="component-props"></a>

  Represents each property mapped to an array

  ### generics

  - **Schema _extends_ ComponentSchema\<ComponentType\>**

    The properties schema

  ### properties

  - **[K _in keyof_ Schema]: Schema[K]["type"] _extends_ ComponentType.NUMBER ? Array<number> : Schema[K]["type"] _extends_ ComponentType.ARRAY ? Array<Array<number>> : null**

    the component properties

- ## **`SystemConfig: interface`** <a name="system-config"></a>

  Represents the system configuration object structure

  ### properties

  - **start?: SystemStartFunction**

    The function that will run once it's added to the world

  - **update: SystemUpdateFunction**

    The function that will run at the system update

  - **destroy?: SystemDestroyFunction**

    The function that will run once it's removed from the world

- ## **`QueryConfig: interface`** <a name="query-config"></a>

  Represents the query configuration object structure

  ### properties

  - **include: Array\<Component\>**

    Defines all the components to be included in the entity query result

  - **exclude?: Array\<Component\>**

    Defines all the components to be excluded from the entity query result

- ## **`WorldConfig: interface`** <a name="world-config"></a>

  Represents the world configuration structure

  ### properties

  - **size?: number**

    The limit of items inside the world

- ## **`StorageSerializedData: interface`** <a name="storage-serialized-data"></a>

  Represents the storage serialized data structure

  ### generics

  - **Data**

    The type of the stored data

  ### properties

  - **data: Map\<Data, Status\>**

    The data map from the storage

  - **deferredData: { added: Set\<Data\>; removed: Set\<Data\> }**

    The deferred data from the storage

  - **hasChanged: boolean**

    The flag indicating changes from the storage

- ## **`DEFAULT_WORLD_SIZE: const`** <a name="default-world-size"></a>

  Default length value of entities in the world

  ### returns

  - **1000**

- ## **`DEFAULT_ARRAY_SIZE: const`** <a name="default-array-size"></a>

  Default length of property arrays

  ### returns

  - **100**

- ## **`ComponentType: enum`** <a name="component-type"></a>

  Enum of all possible types of component properties

  ### properties

  - **NUMBER: 0**

    Represents a component property of type number

  - **ARRAY: 1**

    Represents a component property of type array of number

- ## **`Status: enum`** <a name="status"></a>

  Status of items in the world

  ### properties

  - **ADDED: 0**

    Represents a recently added item

  - **ACTIVE: 1**

    Represents an active item

  - **REMOVED: 2**

    Represents a recently removed item

- ## **`Constants: const`** <a name="constants"></a>

  Set of constant values

  ### properties

  - **DEFAULT*WORLD_SIZE: \_typeof* DEFAULT_WORLD_SIZE**

    Default length value of entities in the world

  - **DEFAULT*ARRAY_SIZE: \_typeof* DEFAULT_ARRAY_SIZE**

    Default length of property arrays

  - **ComponentType: _typeof_ ComponentType**

    Enum of all possible types of component properties

  - **Status: _typeof_ Status**

    Status of items in the world

- ## **`ECS: class`** <a name="ecs"></a>

  Utility class to centralize access to resources

  ### properties

  - **_public static readonly_ ComponentType: _typeof_ ComponentType**

    Enum of all possible types of component properties

  - **_public static readonly_ Status: _typeof_ Status**

    Status of items in the world

  ### methods

  - **_public static_ createWorld(): World**

    Creates a world instance

  - **_public static_ createEntity(): Entity**

    Creates a entity instance

  - **_public static_ defineComponent<Schema _extends_ Record\<string, ComponentType\>\>(schema?: Schema, size?: number): Component\<Schema\>**

    Creates a component instance

  - **_public static_ defineSystem(systemFunction: SystemFunction): System**

    Creates a system instance

  - **_public static_ defineQuery(config: QueryConfig): Query**

    Creates a query instance

  - **_public static_ addEntity(worlds: World | Array\<World\>, entities: Entity | Array\<Entity\>): boolean**

    Adds entities to the world

  - **_public static_ addComponent(worlds: World | Array\<World\>, entities: Entity | Array\<Entity\>, components: Component | Array\<Component\>): boolean**

    Adds components to entities in the world

  - **_public static_ addSystem(worlds: World | Array\<World\>, systems: System | Array\<System\>): boolean**

    Adds systems to the world

  - **_public static_ removeEntity(worlds: World | Array<\World\>, entities: Entity | Array\<Entity\>): boolean**

    Removes entities from the world

  - **_public static_ removeComponent(worlds: World | Array\<World\>, entities: Entity | Array\<Entity\>, components: Component | Array\<Component\>): boolean**

    Removes components from entities in the world

  - **_public static_ removeSystem(worlds: World | Array\<World\>, systems: System | Array\<System\>): boolean**

    Removes systems from the world

  - **_public static_ update(worlds: World | Array\<World\>, delta: number, time: number, ...args: Array\<unknown\>): void**

    Updates the world

  - **_public static_ destroyWorld(worlds: World | Array\<World\>): void**

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

  - **_public static_ reset(): void**

    Reset the EID counter and clear the recycledEID

  - **_private static_ getNextEID(): number**

    Get the next EID from recycledEID or the nextEID

- ## **`Component: class`** <a name="component"></a>

  Represents the data structure for all entities

  ### generics

  - **Schema _extends_ ComponentSchema\<ComponentType\> = {}**

  ### properties

  - **_public readonly_ props: ComponentProps<Schema>**

    Stores all the entity properties as an array of specified type

  - **_public readonly_ size: number**

    The limit of entities inside the component

  ### arguments

  - **schema?: Schema | DeprecatedComponentSchema**

    The properties structure. An empty object can be used for the component act like a tag

  - **size?: number**

    The limit of entities inside the component. Uses the default world size if not provided

  ### methods

  - **_public_ attachEntity(entity: Entity): boolean**

    Adds an entity to the component

  - **_public_ detachEntity(entity: Entity): boolean**

    Removes an entity from the component

  - **_private_ createProperties\<Schema _extends_ ComponentSchema\<ComponentType\>\>(schema: Schema): ComponentProps\<Schema\>**

    Creates the properties structure

  - **_private_ resolveDeprecatedSchema(deprecatedSchema: DeprecatedComponentSchema): Schema**

    Resolves the old schema structure into the new schema

- ## **`System: class`** <a name="system"></a>

  Represents the functionality of the world

  ### properties

  - **public readonly start?: SystemStartFunction**

    The function that will run once it's added to the world

  - **public readonly update?: SystemUpdateFunction**

    The function that will run at the system update

  - **public readonly destroy?: SystemDestroyFunction**

    The function that will run once it's removed from the world

  ### arguments

  - **config: SystemConfig**

    the system configuration that takes the functions

- ## **`Query: class`** <a name="query"></a>

  Represents an entity filter based on components

  ### properties

  - **_private readonly_ includeComponents: Set\<Component\>**

    Stores all the components that entities need to be included

  - **_private readonly_ excludeComponents: Set\<Component\>**

    Stores all the components that will exclude entities

  - **_private entities_: Map\<Entity, Status\>**

    Stores the filtered entities and its corresponding status

  - **_private_ updated: boolean**

    Flag that indicates if the entities map is up-to-dated

  ### arguments

  - **config: QueryConfig**

    The configuration object

  ### methods

  - **_public_ exec(world: World, status?: Status): Array\<Entity\>**

    Filters the entities that satisfies the included and excluded components. The status can be used for further filtering

  - **_private_ hasChanged(): boolean**

    Checks if some of the components has changes

  - **_private_ cleanChanges(): boolean**

    Cleans the previous changes by changing the status of the components

  - **_private_ filterEntitiesByComponent(world: World): Map\<Entity, Status\>**

    Filters the entities based on the included and excluded components

  - **_private_ filterEntitiesByModifier(status: Status): Array\<Entity\>**

    Filters the already filtered entities based on their status

- ## **`Storage: class`** <a name="storage"></a>

  Storage system for any iterable data

  ### generics

  - **Data**

    The data type that will be stored

  ### properties

  - **_public_ hasChanged: boolean**

    Determines if there have been any changes

  - **_private readonly_ data: Map\<Data, Status\>**

    Stores the data and their current status

  - **_private readonly_ deferredData: { added: Set\<Data\>; removed: Set\<Data\> }**

    Stores the deferred data in added and removed structures

  ### methods

  - **_public_ addData(data: Data, immediately?: boolean): boolean**

    Adds the data

  - **_public_ removeData(data: Data, immediately?: boolean): boolean**

    Removes the data

  - **_public_ hasData(data: Data): boolean**

    Checks if data exists

  - **_public_ hasDeferredData(data: Data): boolean**

    Checks if data is deferred

  - **_public_ commitChanges(immediately?: boolean): void**

    Applies any changes

  - **_public_ destroy(): void**

    Erases all the data

  - **_public_ getDataStatus(data: Data): Status | undefined**

    Get the status of the data

  - **_public_ keys(): MapIterator\<Data\>**

    Gets an array of all the data

  - **_public_ values(): MapIterator\<Status\>**

    Gets an array of all the status

  - **_public_ length(includeDeferred?: boolean): number**

    Gets the count of data stored. Can sum the size of deferred additions as well

  - **_public_ serialize(): StorageSerializedData\<Data\>**

    Gets the current state of the storage into an object

  - **_public_ deserialize(storageData: StorageSerializedData\<Data\>): boolean**

    Reconstruct the state of the storage, erasing the current state. Returns false if the data is invalid

  - **\*\[Symbol.iterator\](): Iterator\<\[Data, Status\]\>**

    Instance can be used as an iterator

  - **_private_ applyDeferredChanges(): void**

    Applies all the deferred changes

  - **_private_ cleanPreviousChanges(): void**

    Clean the data status and remove pendent data

  - **_private_ cleanDeferredChanges(): void**

    Erases all the deferred data

- ## **`World: class`** <a name="world"></a>

  Represents the main hub for entities, components and systems

  ### properties

  - **_public readonly_ entities: Storage\<Entity\>**

    Stores entities in the world

  - **_public readonly_ components: Storage\<Component\>**

    Stores components in the world

  - **_public readonly_ systems: Storage\<System\>**

    Stores systems in the world

  - **_public readonly_ size: boolean**

    The limit of items inside the world

  ### arguments

  - **config?: WorldConfig**

    Represents the world configuration structure

  ### methods

  - **_get_ hasChanged(): boolean**

    DEPRECATED! Check if has changes in the entities map

  - **_public_ addEntity(entity: Entity): boolean**

    Adds an entity to the world

  - **_public_ addComponent(component: Component): boolean**

    Adds a component to the world

  - **_public_ addSystem(system: System): boolean**

    Adds a system to the world

  - **_public_ removeEntity(entity: Entity): boolean**

    Removes an entity from the world

  - **_public_ removeComponent(component: Component): boolean**

    Removes a component from the world

  - **_public_ removeSystem(system: System): boolean**

    Removes a system from the world

  - **_public_ update(delta: number, time: number, args?: Array\<unknown\>): void**

    Updates the world

  - **_public_ destroy(): void**

    Erases all the data from the world

  - **_private_ applyChanges(): void**

    Applies any deferred changes to the woeld
