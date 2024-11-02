declare class Entity {
    readonly EID: number;
    private static nextEID;
    private static recycledEID;
    constructor();
    static recycleEID(EID: number): void;
    static reset(): void;
    private static getNextEID;
}

declare const DEFAULT_WORLD_SIZE = 1000;
declare const DEFAULT_ARRAY_SIZE = 1000;
declare enum ComponentType {
    NUMBER = 0,
    ARRAY = 1
}
declare enum Status {
    ADDED = 0,
    ACTIVE = 1,
    REMOVED = 2
}

type constants_ComponentType = ComponentType;
declare const constants_ComponentType: typeof ComponentType;
declare const constants_DEFAULT_ARRAY_SIZE: typeof DEFAULT_ARRAY_SIZE;
declare const constants_DEFAULT_WORLD_SIZE: typeof DEFAULT_WORLD_SIZE;
type constants_Status = Status;
declare const constants_Status: typeof Status;
declare namespace constants {
  export { constants_ComponentType as ComponentType, constants_DEFAULT_ARRAY_SIZE as DEFAULT_ARRAY_SIZE, constants_DEFAULT_WORLD_SIZE as DEFAULT_WORLD_SIZE, constants_Status as Status };
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

declare class System {
    readonly start: SystemStartFunction | undefined;
    readonly update: SystemUpdateFunction | undefined;
    readonly destroy: SystemDestroyFunction | undefined;
    constructor(config?: SystemConfig);
}

declare class World {
    readonly entities: Storage<Entity>;
    readonly components: Storage<Component>;
    readonly systems: Storage<System>;
    readonly size: number;
    constructor(config?: WorldConfig);
    get hasChanged(): boolean;
    addEntity(entity: Entity): boolean;
    addComponent(entity: Entity, component: Component): boolean;
    addSystem(system: System): boolean;
    removeEntity(entity: Entity): boolean;
    removeComponent(entity: Entity, component: Component): boolean;
    removeSystem(system: System): boolean;
    update(delta: number, time: number, args?: Array<unknown>): void;
    destroy(): void;
    private applyChanges;
}

type SystemStartFunction = (world: World) => void;
type SystemUpdateFunction = (world: World, delta: number, time: number, args?: Array<unknown>) => void;
type SystemDestroyFunction = (world: World) => void;
type ComponentSchema<T> = {
    [key: string]: {
        type: T;
        length?: T extends ComponentType.NUMBER ? undefined : number;
    };
};
type DeprecatedComponentSchema = Record<string, ComponentType>;
type ComponentProps<Schema extends ComponentSchema<ComponentType>> = {
    [K in keyof Schema]: Schema[K]["type"] extends ComponentType.NUMBER ? Array<number> : Schema[K]["type"] extends ComponentType.ARRAY ? Array<Array<number>> : null;
};
interface SystemConfig {
    start?: SystemStartFunction;
    update: SystemUpdateFunction;
    destroy?: SystemDestroyFunction;
}
interface QueryConfig {
    include: Array<Component>;
    exclude?: Array<Component>;
}
interface WorldConfig {
    size?: number;
}

declare class Component<Schema extends ComponentSchema<ComponentType> = {}> {
    readonly props: ComponentProps<Schema>;
    readonly entities: Storage<Entity>;
    readonly size: number;
    constructor(schema?: Schema | DeprecatedComponentSchema, size?: number);
    attachEntity(entity: Entity): boolean;
    detachEntity(entity: Entity): boolean;
    private createProperties;
    private resolveDeprecatedSchema;
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
}

declare class ECS {
    static readonly ComponentType: typeof ComponentType;
    static readonly Status: typeof Status;
    static createWorld(): World;
    static createEntity(): Entity;
    static defineComponent<Schema extends ComponentSchema<ComponentType>>(schema?: Schema, size?: number): Component<Schema>;
    static defineSystem(systemConfig?: SystemConfig): System;
    static defineQuery(queryConfig?: QueryConfig): Query;
    static addEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): Array<boolean>;
    static addComponent(worlds: World | Array<World>, entities: Entity | Array<Entity>, components: Component | Array<Component>): Array<boolean>;
    static addSystem(worlds: World | Array<World>, systems: System | Array<System>): Array<boolean>;
    static removeEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): Array<boolean>;
    static removeComponent(worlds: World | Array<World>, entities: Entity | Array<Entity>, components: Component | Array<Component>): Array<boolean>;
    static removeSystem(worlds: World | Array<World>, systems: System | Array<System>): Array<boolean>;
    static update(worlds: World | Array<World>, delta: number, time: number, ...args: Array<unknown>): void;
    static destroyWorld(worlds: World | Array<World>): void;
}

export { Component, type ComponentProps, type ComponentSchema, constants as Constants, ECS, Entity, Query, type QueryConfig, Storage, System, type SystemConfig, type SystemDestroyFunction, type SystemStartFunction, type SystemUpdateFunction, World, type WorldConfig, ECS as default };
