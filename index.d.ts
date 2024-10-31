declare module "furry-ecs" {
  export type SystemStartFunction = (world: World) => void
  export type SystemUpdateFunction = (world: World, delta: number, time: number, args?: Array<unknown>) => void
  export type SystemDestroyFunction = (world: World) => void
  export type ComponentSchema<T> = {
    [key: string]: {
      type: T
      length?: T extends ComponentType.NUMBER ? undefined : number
    }
  }
  export type DeprecatedComponentSchema = Record<string, ComponentType>
  export type ComponentProps<Schema extends ComponentSchema<ComponentType>> = {
    [K in keyof Schema]: Schema[K]["type"] extends ComponentType.NUMBER
      ? Array<number>
      : Schema[K]["type"] extends ComponentType.ARRAY
      ? Array<Array<number>>
      : null
  }

  export interface SystemConfig {
    start?: SystemStartFunction
    update: SystemUpdateFunction
    destroy?: SystemDestroyFunction
  }

  export interface QueryConfig {
    include: Array<Component>
    exclude?: Array<Component>
  }

  const DEFAULT_WORLD_SIZE = 1000
  const DEFAULT_ARRAY_SIZE = 100

  enum ComponentType {
    NUMBER = 0,
    ARRAY = 1
  }

  enum Status {
    ADDED = 0,
    ACTIVE = 1,
    REMOVED = 2
  }

  export const Constants: {
    DEFAULT_WORLD_SIZE: typeof DEFAULT_WORLD_SIZE
    DEFAULT_ARRAY_SIZE: typeof DEFAULT_ARRAY_SIZE
    ComponentType: typeof ComponentType
    Status: typeof Status
  }

  export default class ECS {
    static readonly ComponentType: typeof ComponentType
    static readonly Status: typeof Status

    static createWorld(): World
    static createEntity(): Entity
    static defineComponent<Schema extends ComponentSchema<ComponentType>>(schema?: Schema | DeprecatedComponentSchema): Component<Schema>
    static defineSystem(systemConfig?: SystemConfig): System
    static defineQuery(queryConfig?: QueryConfig): Query
    static addEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): void
    static addComponent(worlds: World | Array<World>, entities: Entity | Array<Entity>, components: Component | Array<Component>): void
    static addSystem(worlds: World | Array<World>, systems: System | Array<System>): void
    static removeEntity(worlds: World | Array<World>, entities: Entity | Array<Entity>): void
    static removeComponent(worlds: World | Array<World>, entities: Entity | Array<Entity>, components: Component | Array<Component>): void
    static removeSystem(worlds: World | Array<World>, systems: System | Array<System>): void
    static update(worlds: World | Array<World>, delta: number, time: number, ...args: Array<unknown>): void
    static destroyWorld(worlds: World | Array<World>): void
  }

  export class Entity {
    readonly EID: number
    private static nextEID
    private static recycledEID

    constructor()
    static recycleEID(EID: number): void
    static reset(): void
    private static getNextEID
  }

  export class Component<Schema extends ComponentSchema<ComponentType> = {}> {
    readonly props: ComponentProps<Schema>
    readonly entities: Storage<Entity>

    constructor(schema?: Schema | DeprecatedComponentSchema)
    private createProperties
    private resolveDeprecatedSchema
  }

  export class System {
    readonly start: SystemStartFunction | undefined
    readonly update: SystemUpdateFunction | undefined
    readonly destroy: SystemDestroyFunction | undefined

    constructor(config?: SystemConfig)
  }

  export class Query {
    private readonly includeComponents
    private readonly excludeComponents
    private entities
    private updated

    constructor(config?: QueryConfig)
    exec(world: World, status?: Status): Array<Entity>
    private hasChanges
    private cleanChanges
    private filterEntitiesByComponent
    private filterEntitiesByStatus
  }

  export class Storage<Data> {
    hasChanged: boolean
    private readonly data
    private readonly deferredData

    constructor()
    addData(data: Data, immediately?: boolean): void
    removeData(data: Data, immediately?: boolean): void
    hasData(data: Data): boolean
    hasDeferredData(data: Data): boolean
    commitChanges(immediately?: boolean): void
    destroy(): void
    getDataStatus(data: Data): Status | undefined
    keys(): MapIterator<Data>
    values(): MapIterator<Status>
    length(): number
    [Symbol.iterator](): Iterator<[Data, Status]>
    private applyDeferredChanges
    private cleanPreviousChanges
    private cleanDeferredChanges
  }

  export class World {
    readonly entities: Storage<Entity>
    readonly components: Storage<Component>
    readonly systems: Storage<System>
    constructor()
    get hasChanged(): boolean
    addEntity(entity: Entity): void
    addComponent(entity: Entity, component: Component): void
    addSystem(system: System): void
    removeEntity(entity: Entity): void
    removeComponent(entity: Entity, component: Component): void
    removeSystem(system: System): void
    update(delta: number, time: number, args?: Array<unknown>): void
    destroy(): void
    private applyChanges
  }
}
