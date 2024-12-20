<!--
- ## **`MEMBER: INITIALIZER`** <a name="LINK"></a>

  DESCRIPTION

  ### generics

  - **TYPE**

    DESCRIPTION

  ### implements

  - **TYPE**

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

# Furry ECS API

here are the type definition and description for all the members of Furry ECS library

## Table of contents

- [SystemStartFunction](#system-start-function)
- [SystemUpdateFunction](#system-update-function)
- [SystemDestroyFunction](#system-destroy-function)
- [ComponentPropValue](#component-prop-value)
- [ComponentSchema](#component-schema)
- [ComponentProps](#component-props)
- [ComponentPropsObject](#component-props-object)
- [SystemConfig](#system-config)
- [QueryConfig](#query-config)
- [WorldConfig](#world-config)
- [Constructor](#constructor)
- [CustomSerializeHandler](#custom-serialize-handler)
- [CustomDeserializeHandler](#custom-deserialize-handler)
- [SerializedArray](#serialized-array)
- [SerializedMap](#serialized-map)
- [SerializedSet](#serialized-set)
- [SerializedObject](#serialized-object)
- [SerializedPrimitive](#serialized-primitive)
- [SerializedValueType](#serialized-value-type)
- [SerializedData](#serialized-data)
- [SerializerConfig](#serializer-config)
- [SerializableClass](#serializable-class)
- [DEFAULT_WORLD_SIZE](#default-world-size)
- [ComponentType](#component-type)
- [Status](#status)
- [Serializable](#serializable)
- [QueryOperation](#query-operation)
- [Constants](#constants)
- [ECS](#ecs)
- [Entity](#entity)
- [Component](#component)
- [System](#system)
- [Query](#query)
- [Storage](#storage)
- [Serializer](#serializer)
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

- ## **`ComponentPropValue: type`** <a name="component-prop-value"></a>

  Represents the type of a property value

  ### generics

  - **T _extends_ ComponentSchema[_keyof_ ComponentSchema]**

    The enumerated type of the value

  ### returns

  - **T _extends_ ComponentType.NUMBER<br>? number<br>: T _extends_ ComponentType.ARRAY<br>? Array<number><br>: null**

    Conditionals type of the property value

- ## **`ComponentSchema: type`** <a name="component-schema"></a>

  Represents a schema of properties

  ### returns

  - **Record\<string, ComponentType\>**

    The component properties

- ## **`ComponentProps: type`** <a name="component-props"></a>

  Represents each property mapped

  ### generics

  - **T _extends_ ComponentSchema>**

    The properties schema

  ### returns

  - **Map\<_keyof_ T, Map\<number, ComponentPropValue\<T[_keyof_ T]\>\>\>**

    the component properties

- ## **`ComponentPropsObject: type`** <a name="component-props-object"></a>

  Represents the properties as an object

  ### generics

  - **T _extends_ ComponentSchema>**

    The properties schema

  ### returns

  - **{ [K _in keyof_ T]: ComponentPropValue\<T[K]\> }**

    The properties object

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

  - **include: Array\<Component\<any\>\>**

    Defines all the components to be included in the entity query result

  - **exclude?: Array\<Component\<any\>\>**

    Defines all the components to be excluded from the entity query result

  - **includeOperation?: QueryOperation**

    The operation used for include logic

  - **excludeOperation?: QueryOperation**

    The operation used for exclude logic

- ## **`WorldConfig: interface`** <a name="world-config"></a>

  Represents the world configuration structure

  ### properties

  - **size?: number**

    The limit of items inside the world

- ## **`Constructor: type`** <a name="constructor"></a>

  Represents a class

  ### generics

  - **T**

    The type of the class instance

  ### arguments

  - **...args: any**

    The arguments of the class

  ### returns

  - **T**

- ## **`CustomSerializeHandler: type`** <a name="custom-serialize-handler"></a>

  Represents a callback used for custom serialization logic

  ### generics

  - **T**

    The type of the object being serialized

  - **R**

    The type of the serialized object

  ### arguments

  - **obj: T**

    The object being serialized

  - **self: Serializer\<T, R\>**

    The serializer instance

  ### returns

  - **SerializedData\<R\> | undefined**

- ## **`CustomDeserializeHandler: type`** <a name="custom-deserialize-handler"></a>

  Represents a callback used for custom deserialization logic

  ### generics

  - **T**

    The original type of the object before serialization

  - **R**

    The type of the serialized object

  ### arguments

  - **obj: SerializedData\<R\>**

    The serialized object

  - **self: Serializer\<T, R\>**

    The serializer instance

  ### returns

  - **T | R | undefined**

- ## **`SerializedArray: type`** <a name="serialized-array"></a>

  Represents the serialized version of an array

  ### generics

  - **T**

    The object being serialized

  ### returns

  - **Array\<SerializedData\<T\>\>**

- ## **`SerializedMap: type`** <a name="serialized-map"></a>

  Represents the serialized version of a map

  ### generics

  - **T**

    The object being serialized

  ### returns

  - **Array\<[SerializedData\<_keyof_ T\>, SerializedData\<T[_keyof_ T]\>]\>**

- ## **`SerializedSet: type`** <a name="serialized-set"></a>

  Represents the serialized version of a set

  ### generics

  - **T**

    The object being serialized

  ### returns

  - **Array\<SerializedData\<T\>\>**

- ## **`SerializedObject: type`** <a name="serialized-object"></a>

  Represents the serialized version of an object

  ### generics

  - **T**

    The object being serialized

  ### returns

  - **Array\<[_keyof_ T & string, SerializedData\<T[_keyof_ T]\>\>**

- ## **`SerializedPrimitive: type`** <a name="serialized-primitive"></a>

  Represents all the possible primitive types of an object

  ### returns

  - **number | string | boolean**

- ## **`SerializedValueType: type`** <a name="serialized-value-type"></a>

  Conditional type to infer the correct value structure

  ### generics

  - **T**

    The object being serialized

  ### returns

  - **T _extends_ Array\<_infer_ U\><br>? SerializedArray\<U\><br>: T _extends_ Map\<unknown, unknown\><br>? SerializedMap\<T\><br>: T _extends_ Set\<_infer_ U\><br>? SerializedSet\<U\><br>: T _extends_ object<br>? SerializedObject\<T\><br>: T _extends_ SerializedPrimitive<br>? T<br>: never**

- ## **`SerializedData: interface`** <a name="serialized-data"></a>

  Represents the final serialized structure

  ### generics

  - **T**

    The object being serialized

  ### properties

  - **type: Serializable**

    The enumerated type of the object

  - **name: string**

    The name of the object constructor

  - **value: SerializedValueType\<T\>**

    The serialized object value

- ## **`SerializerConfig: interface`** <a name="serializer-config"></a>

  Represents the serializer configuration object structure

  ### generics

  - **T**

    The type of the object being serialized

  - **R**

    The type of the serialized object

  ### properties

  - **serializeHandler?: CustomSerializeHandler\<T, R\>**

    The custom serialize handler

  - **deserializeHandler?: CustomDeserializeHandler\<T, R\>**

    The custom deserialize handler

- ## **`SerializableClass: interface`** <a name="serializable-class"></a>

  Represents a class that can be serialized

  ### generics

  - **T**

    The class definitions

  ### parameters

  - **classes: Array\<Constructor\<T\>\>**

    List of class definitions used to restore the instance of objects

- ## **`DEFAULT_WORLD_SIZE: const`** <a name="default-world-size"></a>

  Default length value of entities in the world

  ### returns

  - **1000**

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

- ## **`Serializable: enum`** <a name="serializable"></a>

  Enum of serializable values

  ### properties

  - **NUMBER: 0**

    Represents a value of type number

  - **STRING: 1**

    Represents a value of type string

  - **BOOLEAN: 2**

    Represents a value of type boolean

  - **ARRAY: 3**

    Represents an array object

  - **MAP: 4**

    Represents a map object

  - **SET: 5**

    Represents a set object

  - **OBJECT: 6**

    Represents a plain object or a class

- ## **`QueryOperation: enum`** <a name="query-operation"></a>

  Enum of query filtering operations

  ### properties

  - **ALL: 0**

    Represents the operation that checks for the existence of all of the components

  - **ANY: 1**

    Represents the operation that checks for the existence of any of the components

  - **EXACT: 2**

    Represents the operation that checks for the existence of exactly the components

- ## **`Constants: const`** <a name="constants"></a>

  Set of constant values

  ### properties

  - **DEFAULT_WORLD_SIZE:** **_typeof_** **DEFAULT_WORLD_SIZE**

    Default length value of entities in the world

  - **DEFAULT_ARRAY_SIZE:** **_typeof_** **DEFAULT_ARRAY_SIZE**

    Default length of property arrays

  - **ComponentType: _typeof_ ComponentType**

    Enum of all possible types of component properties

  - **Status: _typeof_ Status**

    Status of items in the world

  - **Serializable: _typeof_ Serializable**

    Set of serializable values

- ## **`ECS: class`** <a name="ecs"></a>

  Utility class to facilitate multiple members management

  ### properties

  - **_public static readonly_ Constants: _typeof_ Constants**

    All the exported constants

  ### methods

  - **_public static_ createWorld(): World**

    Creates a world instance

  - **_public static_ createEntity(): Entity**

    Creates an Entity instance

  - **_public static_ defineComponent<Schema _extends_ ComponentSchema\>(schema?: Schema, size?: number): Component\<Schema\>**

    Creates a Component instance

  - **_public static_ defineSystem(systemConfig: SystemConfig): System**

    Creates a System instance

  - **_public static_ defineQuery(queryConfig: QueryConfig): Query**

    Creates a Query instance

  - **_public static_ defineSerializer\<T, R = SerializedValueType\<T\>\>(serializerConfig: SerializerConfig\<T, R\>): Serializer\<T, R\>**

    Creates a Serializer instance

  - **_public static_ addEntity(worlds: World | Array\<World\>, entities: Entity | Array\<Entity\>): Array\<boolean\>**

    Adds entities to the world

  - **_public static_ addComponent(worlds: World | Array\<World\>, components: Component\<any\> | Array\<Component\<any\>\>): Array\<boolean\>**

    Adds components to the world

  - **_public static_ addSystem(worlds: World | Array\<World\>, systems: System | Array\<System\>): Array\<boolean\>**

    Adds systems to the world

  - **_public static_ removeEntity(worlds: World | Array<\World\>, entities: Entity | Array\<Entity\>): Array\<boolean\>**

    Removes entities from the world

  - **_public static_ removeComponent(worlds: World | Array\<World\>, components: Component\<any\> | Array\<Component\<any\>\>): Array\<boolean\>**

    Removes components from entities in the world

  - **_public static_ removeSystem(worlds: World | Array\<World\>, systems: System | Array\<System\>): Array\<boolean\>**

    Removes systems from the world

  - **_public static_ attachEntity(components: Component\<any\> | Array\<Component\<any\>\>, entities: Entity | Array\<Entity\>): Array\<boolean\>**

    Attaches entities to components

  - **_public static_ detachEntity(components: Component\<any\> | Array\<Component\<any\>\>, entities: Entity | Array\<Entity\>): Array\<boolean\>**

    Detaches entities from components

  - **_public static_ update(worlds: World | Array\<World\>, delta: number, time: number, args?: Array\<unknown\>): void**

    Updates the world

  - **_public static_ destroyWorld(worlds: World | Array\<World\>): void**

    Erases all the data from the world

- ## **`Entity: class`** <a name="entity"></a>

  Represents an entity in the world

  ### implements

  - **SerializableClass\<Entity\>**

  ### properties

  - **_public readonly_ classes = [Entity]**

    The class definitions used to restore the instance

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

  - **T _extends_ ComponentSchema**

  ### implements

  - **SerializableClass\<Component\<any\>\>**

  ### properties

  - **_public readonly_ classes = [Component]**

    The class definitions used to restore the instance

  - **_public readonly_ properties: ComponentProps<T>**

    Stores all the entity properties as an array of specified type

  - **_public readonly_ size: number**

    The limit of entities inside the component

  ### arguments

  - **schema?: T**

    The properties structure. An empty object can be used so the component acts like a tag

  - **size?: number**

    The limit of entities inside the component. Uses the default world size if not provided

  ### methods

  - **_public get_ props(): ComponentProps\<T\>**

    Returns all the properties as a Map

  - **_public_ getProp\<K _extends keyof_ T\>(prop: K, EID: number): ComponentPropValue\<T[K]\> | undefined**

    Gets the property value of the entity

  - **_public_ setProp\<K _extends keyof_ T, V _extends_ ComponentPropValue\<T[K]\>\>(prop: K, EID: number, value: V): boolean**

    Sets the property value for the entity

  - **_public_ deleteProp\<K _extends keyof_ T\>(prop: K, EID: number): boolean**

    Deletes the property value of the entity

  - **_public_ getProps(EID: number): Partial\<ComponentPropsObject\<T\>\>**

    Gets all the properties of the entity

  - **_public_ setProps(EID: number, props: Partial\<ComponentPropsObject\<T\>\>): boolean**

    Sets all the properties of the entity

  - **public deleteProps(EID: number): boolean**

    Deletes all the properties of the entity

  - **_public_ attachEntity(entity: Entity): boolean**

    Adds an entity to the component

  - **_public_ detachEntity(entity: Entity): boolean**

    Removes an entity from the component

  - **_private_ createProperties(schema: T): ComponentProps\<T\>**

    Creates the properties structure

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

  - **config?: SystemConfig**

    the system configuration that takes the functions

- ## **`Query: class`** <a name="query"></a>

  Represents an entity filter based on components

  ### properties

  - **_private readonly_ includeComponents: Set\<Component\<any\>\>**

    Stores all the components that entities need to be included

  - **_private readonly_ excludeComponents: Set\<Component\<any\>\>**

    Stores all the components that will exclude entities

  - **private readonly includeOperation: QueryOperation**

    The operation used for include logic

  - **private readonly excludeOperation: QueryOperation**

    The operation used for exclude logic

  - **private readonly operationTable: {<br>&nbsp;[QueryOperation.ALL]: Query["hasAllComponents"]<br>&nbsp;[QueryOperation.ANY]: Query["hasAnyComponents"]<br>&nbsp;[QueryOperation.EXACT]: Query["hasExactComponents"]<br>}**

    The map of the operations and its methods

  - **_private_ entities: Set\<Entity\>**

    Stores the filtered entities

  - **_private_ world!: World**

    The current world the query is using

  ### arguments

  - **config?: QueryConfig**

    The configuration object

  ### methods

  - **_public_ exec(world: World, status?: Status, component: Component\<any\>): Array\<Entity\>**

    Filters the entities that satisfies the included and excluded components. The status and/or a component can be used for further filtering

  - **_private_ filterEntitiesByComponent(): Set\<Entity\>**

    Filters the entities based on the included and excluded components

  - **_private_ filterEntitiesByStatus(status: Status, component?: Component\<any\>): Array\<Entity\>**

    Filters the already filtered entities based on their status inside the world. If a component is provided it uses the status inside the component

  - **_private_ hasAllComponents(entity: Entity, components: Set\<Component\<any\>\>): boolean**

    Check if entity exists in all of the components

  - **_private_ hasAnyComponents(entity: Entity, components: Set\<Component\<any\>\>): boolean**

    Check if entity exists in any of the components

  - **_private_ hasExactComponents(entity: Entity, components: Set\<Component\<any\>\>): boolean**

    Check if entity exists in exactly all of the components

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

  - **\*\[Symbol.iterator\](): Iterator\<\[Data, Status\]\>**

    Instance can be used as an iterator

  - **_private_ applyDeferredChanges(): void**

    Applies all the deferred changes

  - **_private_ cleanPreviousChanges(): void**

    Clean the data status and remove pendent data

  - **_private_ cleanDeferredChanges(): void**

    Erases all the deferred data

- ## **`Serializer: class`** <a name="serializer"></a>

  Represents the serialization system

  ### generics

  - **T**

    The type of the object being serialized

  - **R = SerializedValueType\<T\>**

    The type of the serialized object

  ### properties

  - **_private readonly_ serializeHandler: CustomSerializeHandler\<T, R\> | undefined**

    The callback used for custom serialization logic

  - **_private readonly_ deserializeHandler: CustomSerializeHandler\<T, R\> | undefined**

    The callback used for custom deserialization logic

  - **_private readonly_ classes: Array\<Constructor\<T\>\>**

    List of all class definitions used to restore the instance of objects

  ### arguments

  - **config?: SerializerConfig\<T, R\>**

    The serializer configuration object

  ### methods

  - **_public_ serialize(obj: T): SerializedData\<R\> | undefined**

    Serializes the data into a JSON-like object

  - **_public_ deserialize(obj: SerializedData\<R\>): T | R | undefined**

    Deserializes the data into their corresponding types

  - **_private_ serializeArray(arr: Array\<unknown\>): SerializedData\<R\>**

    Serializes an array

  - **_private_ serializeMap(map: Map\<unknown, unknown\>): SerializedData\<R\>**

    Serializes a map

  - **_private_ serializeSet(set: Set\<unknown\>): SerializedData\<R\>**

    Serializes a set

  - **_private_ serializeObject(obj: object): SerializedData\<R\>**

    Serializes an object or class

  - **_private_ deserializeArray(obj: SerializedData\<R\>): T | R**

    Deerializes an array

  - **_private_ deserializeMap(obj: SerializedData\<R\>): T | R**

    Deerializes a map

  - **_private_ deserializeSet(obj: SerializedData\<R\>): T | R**

    Deerializes a set

  - **_private_ deserializeObject(obj: SerializedData\<R\>): T | R**

    Deerializes an object or class

- ## **`World: class`** <a name="world"></a>

  Represents the main hub for entities, components and systems

  ### implements

  - **SerializableClass\<World | Storage\<any\>\>**

  ### properties

  - **_public readonly_ classes = [World, Storage]**

    The class definitions used to restore the instance

  - **_public readonly_ entities: Storage\<Entity\>**

    Stores entities in the world

  - **_public readonly_ components: Storage\<Component\<any\>\>**

    Stores components in the world

  - **_public readonly_ systems: Storage\<System\>**

    Stores systems in the world

  - **_public readonly_ size: boolean**

    The limit of items inside the world

  ### arguments

  - **config?: WorldConfig**

    Represents the world configuration structure

  ### methods

  - **_public_ addEntity(entity: Entity): boolean**

    Adds an entity to the world

  - **_public_ addComponent(component: Component\<any\>): boolean**

    Adds a component to the world

  - **_public_ addSystem(system: System): boolean**

    Adds a system to the world

  - **_public_ removeEntity(entity: Entity): boolean**

    Removes an entity from the world

  - **_public_ removeComponent(component: Component\<any\>): boolean**

    Removes a component from the world

  - **_public_ removeSystem(system: System): boolean**

    Removes a system from the world

  - **_public_ update(delta: number, time: number, args?: Array\<unknown\>): void**

    Updates the world

  - **_public_ destroy(): void**

    Erases all the data from the world

  - **_private_ applyChanges(): void**

    Applies any deferred changes to the woeld
