declare const DEFAULT_WORLD_SIZE = 1000;
declare enum ComponentType {
    NUMBER = 0,
    ARRAY = 1
}
declare enum Status {
    ADDED = 0,
    ACTIVE = 1,
    REMOVED = 2
}
declare enum Serializable {
    NUMBER = 0,
    STRING = 1,
    BOOLEAN = 2,
    ARRAY = 3,
    MAP = 4,
    SET = 5,
    OBJECT = 6
}

type constants_ComponentType = ComponentType;
declare const constants_ComponentType: typeof ComponentType;
declare const constants_DEFAULT_WORLD_SIZE: typeof DEFAULT_WORLD_SIZE;
type constants_Serializable = Serializable;
declare const constants_Serializable: typeof Serializable;
type constants_Status = Status;
declare const constants_Status: typeof Status;
declare namespace constants {
  export { constants_ComponentType as ComponentType, constants_DEFAULT_WORLD_SIZE as DEFAULT_WORLD_SIZE, constants_Serializable as Serializable, constants_Status as Status };
}

declare class Storage<Data> {
    hasChanged: boolean;
    private readonly data;
    private readonly deferredData;
    constructor();
    addData(data: Data, immediately?: boolean): boolean;
    removeData(data: Data, immediately?: boolean): boolean;
    hasData(data: Data): boolean;
    hasDeferredData(data: Data): boolean;
    commitChanges(immediately?: boolean): void;
    destroy(): void;
    getDataStatus(data: Data): Status | undefined;
    keys(): MapIterator<Data>;
    values(): MapIterator<Status>;
    length(includeDeferred?: boolean): number;
    [Symbol.iterator](): Iterator<[Data, Status]>;
    private applyDeferredChanges;
    private cleanPreviousChanges;
    private cleanDeferredChanges;
}

declare class Component<T extends ComponentSchema> implements SerializableClass<Component<any> | Storage<any>> {
    readonly classes: (typeof Storage | typeof Component)[];
    readonly entities: Storage<Entity>;
    readonly size: number;
    private readonly properties;
    constructor(schema?: T, size?: number);
    get props(): ComponentProps<T>;
    getProp<K extends keyof T>(prop: K, EID: number): ComponentPropValue<T[K]> | undefined;
    setProp<K extends keyof T, V extends ComponentPropValue<T[K]>>(prop: K, EID: number, value: V): boolean;
    attachEntity(entity: Entity): boolean;
    detachEntity(entity: Entity): boolean;
    destroy(): void;
    private createProperties;
}

declare class System {
    readonly start: SystemStartFunction | undefined;
    readonly update: SystemUpdateFunction | undefined;
    readonly destroy: SystemDestroyFunction | undefined;
    constructor(config?: SystemConfig);
}

declare class World implements SerializableClass<World | Storage<any>> {
    readonly classes: (typeof Storage | typeof World)[];
    readonly entities: Storage<Entity>;
    readonly components: Storage<Component<any>>;
    readonly systems: Storage<System>;
    readonly size: number;
    constructor(config?: WorldConfig);
    addEntity(entity: Entity): boolean;
    addComponent(component: Component<any>): boolean;
    addSystem(system: System): boolean;
    removeEntity(entity: Entity): boolean;
    removeComponent(component: Component<any>): boolean;
    removeSystem(system: System): boolean;
    update(delta: number, time: number, args?: Array<unknown>): void;
    destroy(): void;
    private applyChanges;
}

declare class Serializer<T, R = SerializedValueType<T>> {
    private readonly serializeHandler;
    private readonly deserializeHandler;
    private readonly classes;
    constructor(config?: SerializerConfig<T, R>);
    serialize(obj: T): SerializedData<R> | undefined;
    deserialize(obj: SerializedData<R>): T | R | undefined;
    private serializeArray;
    private serializeMap;
    private serializeSet;
    private serializeObject;
    private deserializeArray;
    private deserializeMap;
    private deserializeSet;
    private deserializeObject;
}

type SystemStartFunction = (world: World) => void;
type SystemUpdateFunction = (world: World, delta: number, time: number, args?: Array<unknown>) => void;
type SystemDestroyFunction = (world: World) => void;
type ComponentPropValue<T extends ComponentSchema[keyof ComponentSchema]> = T extends ComponentType.NUMBER ? number : T extends ComponentType.ARRAY ? Array<number> : null;
type ComponentSchema = Record<string, ComponentType>;
type ComponentProps<T extends ComponentSchema> = Map<keyof T, Map<number, ComponentPropValue<T[keyof T]>>>;
interface SystemConfig {
    start?: SystemStartFunction;
    update: SystemUpdateFunction;
    destroy?: SystemDestroyFunction;
}
interface QueryConfig {
    include: Array<Component<any>>;
    exclude?: Array<Component<any>>;
}
interface WorldConfig {
    size?: number;
}
type Constructor<T> = new (...args: any) => T;
type CustomSerializeHandler<T, R> = (obj: T, self: Serializer<T, R>) => SerializedData<R> | undefined;
type CustomDeserializeHandler<T, R> = (obj: SerializedData<R>, self: Serializer<T, R>) => T | R | undefined;
type SerializedArray<T> = Array<SerializedData<T>>;
type SerializedMap<T> = Array<[SerializedData<keyof T>, SerializedData<T[keyof T]>]>;
type SerializedSet<T> = Array<SerializedData<T>>;
type SerializedObject<T> = Array<[keyof T & string, SerializedData<T[keyof T]>]>;
type SerializedPrimitive = number | string | boolean;
type SerializedValueType<T> = T extends Array<infer U> ? SerializedArray<U> : T extends Map<unknown, unknown> ? SerializedMap<T> : T extends Set<infer U> ? SerializedSet<U> : T extends object ? SerializedObject<T> : T extends SerializedPrimitive ? T : never;
type SerializedData<T> = {
    type: Serializable;
    name: string;
    value: SerializedValueType<T>;
};
interface SerializerConfig<T, R> {
    serializeHandler?: CustomSerializeHandler<T, R>;
    deserializeHandler?: CustomDeserializeHandler<T, R>;
}
interface SerializableClass<T> {
    classes: Array<Constructor<T>>;
}

declare class Entity implements SerializableClass<Entity> {
    readonly classes: (typeof Entity)[];
    readonly EID: number;
    private static nextEID;
    private static recycledEID;
    constructor();
    static recycleEID(EID: number): void;
    static reset(): void;
    private static getNextEID;
}

declare class Query {
    private readonly includeComponents;
    private readonly excludeComponents;
    private entities;
    private updated;
    constructor(config?: QueryConfig);
    exec(world: World, status?: Status): Array<Entity>;
    private hasChanges;
    private cleanChanges;
    private filterEntitiesByComponent;
    private filterEntitiesByStatus;
    private hasAllComponents;
    private hasAnyComponents;
}

declare class ECS {
    static createWorld(): World;
    static createEntity(): Entity;
    static defineComponent<Schema extends ComponentSchema>(schema?: Schema, size?: number): Component<Schema>;
    static defineSystem(systemConfig?: SystemConfig): System;
    static defineQuery(queryConfig?: QueryConfig): Query;
    static defineSerializer<T, R = SerializedValueType<T>>(serializerConfig?: SerializerConfig<T, R>): Serializer<T, R>;
    static addEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): Array<boolean>;
    static addComponent(worlds: World | Array<World>, components: Component<any> | Array<Component<any>>): Array<boolean>;
    static addSystem(worlds: World | Array<World>, systems: System | Array<System>): Array<boolean>;
    static removeEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): Array<boolean>;
    static removeComponent(worlds: World | Array<World>, components: Component<any> | Array<Component<any>>): Array<boolean>;
    static removeSystem(worlds: World | Array<World>, systems: System | Array<System>): Array<boolean>;
    static attachEntity(components: Component<any> | Array<Component<any>>, entities: Entity | Array<Entity>): Array<boolean>;
    static detachEntity(components: Component<any> | Array<Component<any>>, entities: Entity | Array<Entity>): Array<boolean>;
    static update(worlds: World | Array<World>, delta: number, time: number, args?: Array<unknown>): void;
    static destroyWorld(worlds: World | Array<World>): void;
}

export { Component, type ComponentProps, type ComponentSchema, constants as Constants, type Constructor, type CustomDeserializeHandler, type CustomSerializeHandler, ECS, Entity, Query, type QueryConfig, type SerializableClass, type SerializedArray, type SerializedData, type SerializedMap, type SerializedObject, type SerializedPrimitive, type SerializedSet, type SerializedValueType, Serializer, type SerializerConfig, Storage, System, type SystemConfig, type SystemDestroyFunction, type SystemStartFunction, type SystemUpdateFunction, World, type WorldConfig, ECS as default };
