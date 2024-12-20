export const DEFAULT_WORLD_SIZE = 1000

export enum ComponentType {
  NUMBER,
  ARRAY
}

export enum Status {
  ADDED,
  ACTIVE,
  REMOVED
}

export enum Serializable {
  NUMBER,
  STRING,
  BOOLEAN,
  ARRAY,
  MAP,
  SET,
  OBJECT
}

export enum QueryOperation {
  ALL,
  ANY,
  EXACT
}
