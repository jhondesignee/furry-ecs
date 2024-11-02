export { default } from "#ecs"
export { default as ECS } from "#ecs"
export * as Constants from "#constants"
export { default as Entity } from "#entity"
export { default as Component } from "#component"
export { default as System } from "#system"
export { default as Query } from "#query"
export { default as Storage } from "#storage"
export { default as World } from "#world"

export type {
  SystemStartFunction,
  SystemUpdateFunction,
  SystemDestroyFunction,
  ComponentSchema,
  ComponentProps,
  SystemConfig,
  QueryConfig,
  WorldConfig
} from "#types"
