declare module "furry-ecs" {
  export type SystemUpdateFunction = (delta: number, time: number) => void
  export type SystemFunction = (world: World, args: Array<unknown>) => SystemUpdateFunction | void

  export interface QueryConfig {
    include: Array<Component>
    exclude: Array<Component>
  }

  interface DeferredChanges<EntitySet, ComponentMap, SystemMap> {
    added: {
      entities: EntitySet
      components: ComponentMap
      systems: SystemMap
    }
    removed: {
      entities: EntitySet
      components: ComponentMap
      systems: SystemMap
    }
  }

  enum ComponentType {
    NUMBER,
    ARRAY
  }
  enum QueryModifier {
    ADDED,
    ACTIVE,
    REMOVED
  }

  export default class ECS {
    public static readonly ComponentType: typeof ComponentType
    public static readonly QueryModifier: typeof QueryModifier

    public static createWorld(): World
    public static createEntity(): Entity
    public static defineComponent<Schema extends Record<string, ComponentType>>(schema: Schema): Component<Schema>
    public static defineSystem(systemFunction: SystemFunction): System
    public static defineQuery(config: QueryConfig): Query
    public static addEntity(world: World, entities: Array<Entity>): void
    public static addComponent(world: World, entities: Array<Entity>, components: Array<Component>): void
    public static addSystem(world: World, systems: Array<System>, ...args: Array<unknown>): void
    public static removeEntity(world: World, entities: Array<Entity>): void
    public static removeComponent(world: World, entities: Array<Entity>, components: Array<Component>): void
    public static removeSystem(world: World, systems: Array<System>): void
    public static update(world: World, delta: number, time: number): void
    public static destroyWorld(world: World): void
  }

  export const Constants: {
    ComponentType: typeof ComponentType
    QueryModifier: typeof QueryModifier
  }

  export class Entity {
    public readonly EID: number
    private static nextEID: number
    private static recycledEID: Set<number>

    constructor()
    public static recycleEID(EID: number): void
    public static reset(): void
    private static getNextEID(): number
  }

  export class Component<Schema extends Record<string, ComponentType> = {}> {
    public readonly props: { [K in keyof Schema]: Schema[K] extends ComponentType.NUMBER ? Array<number> : Array<Array<number>> }

    constructor(schema: Schema)
    private static createProperties<Schema extends Record<string, ComponentType>>(schema: Schema)
  }

  export class System {
    public readonly onStart: SystemFunction

    constructor(systemFunction: SystemFunction)
  }

  export class Query {
    private readonly includeComponents: Set<Component>
    private readonly excludeComponents: Set<Component>
    private entities: Map<Entity, QueryModifier>

    constructor(config: QueryConfig)
    public exec(world: World, modifier?: QueryModifier): Array<Entity>
    private filterEntitiesByComponent(world: World): Map<Entity, QueryModifier>
    private filterEntitiesByModifier(modifier: QueryModifier): Array<Entity>
  }

  export class World {
    public readonly entities: Set<Entity>
    public readonly components: Map<Component, Map<Entity, QueryModifier>>
    public readonly systems: Map<System, SystemUpdateFunction | void>
    public hasChanged: boolean
    private readonly deferredChanges: DeferredChanges<World["entities"], World["components"], World["systems"]>

    constructor()
    public addEntity(entity: Entity): void
    public addComponent(entity: Entity, component: Component): void
    public addSystem(system: System, args: Array<unknown>): void
    public removeEntity(entity: Entity): void
    public removeComponent(entity: Entity, component: Component): void
    public removeSystem(system: System): void
    public update(delta: number, time: number): void
    public destroy(): void
    private applyDeferredChanges(): void
    private clearDeferredChanges(): void
  }
}
