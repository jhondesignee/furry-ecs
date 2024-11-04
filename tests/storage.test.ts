import { beforeAll, describe, test, expect } from "vitest"
import Storage from "#storage"
import { Status } from "#constants"
import type { StorageSerializedData } from "#types"

describe("Storage class test", () => {
  describe("Data addition test", () => {
    let storage: Storage<number>

    beforeAll(() => {
      storage = new Storage()
    })

    test("Added data should be marked as ADDED for one frame", () => {
      expect(storage.addData(0)).toBeTruthy()
      expect(storage.length()).toBe(0)
      expect(storage.hasData(0)).toBeFalsy()
      expect(storage.hasDeferredData(0)).toBeTruthy()
      storage.commitChanges()
      expect(storage.length()).toBe(1)
      expect(storage.hasData(0)).toBeTruthy()
      expect(storage.hasDeferredData(0)).toBeFalsy()
      expect(storage.getDataStatus(0)).toBe(Status.ADDED)
      storage.commitChanges()
      expect(storage.length()).toBe(1)
      expect(storage.getDataStatus(0)).toBe(Status.ACTIVE)
    })
    test("Addition should be deferred", () => {
      storage.addData(1)
      expect(storage.length()).toBe(1)
      storage.commitChanges()
      expect(storage.length()).toBe(2)
    })
    test("Should be possible to immediately do the change", () => {
      expect(storage.addData(2, true)).toBeTruthy()
      expect(storage.length()).toBe(3)
      storage.commitChanges()
      expect(storage.length()).toBe(3)
    })
    test("Inore if data already exists", () => {
      expect(storage.addData(2, true)).toBeFalsy()
      expect(storage.length()).toBe(3)
      storage.commitChanges()
      expect(storage.length()).toBe(3)
    })
  })
  describe("Data removal test", () => {
    let storage: Storage<number>

    beforeAll(() => {
      storage = new Storage()
      storage.addData(0)
      storage.addData(1)
      storage.addData(2)
      storage.commitChanges()
    })

    test("Removed data should be marked as REMOVED for one frame", () => {
      expect(storage.removeData(0)).toBeTruthy()
      expect(storage.length()).toBe(3)
      expect(storage.hasData(0)).toBeTruthy()
      expect(storage.hasDeferredData(0)).toBeTruthy()
      storage.commitChanges()
      expect(storage.length()).toBe(3)
      expect(storage.hasData(0)).toBeTruthy()
      expect(storage.hasDeferredData(0)).toBeFalsy()
      expect(storage.getDataStatus(0)).toBe(Status.REMOVED)
      storage.commitChanges()
      expect(storage.length()).toBe(2)
      expect(storage.hasData(0)).toBeFalsy()
      expect(storage.hasDeferredData(0)).toBeFalsy()
      expect(storage.getDataStatus(0)).toBeUndefined()
    })
    test("Removal should be deferred only if the data already exist", () => {
      expect(storage.removeData(1)).toBeTruthy()
      expect(storage.length()).toBe(2)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.length()).toBe(1)
      expect(storage.removeData(3)).toBeFalsy()
      expect(storage.length()).toBe(1)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.length()).toBe(1)
    })
    test("Previous deferred data should be deleted immediately", () => {
      expect(storage.addData(3)).toBeTruthy()
      expect(storage.removeData(3)).toBeTruthy()
      expect(storage.length()).toBe(1)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.length()).toBe(1)
    })
    test("Should be possible to immediately do the change", () => {
      expect(storage.removeData(2, true)).toBeTruthy()
      expect(storage.length()).toBe(0)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.length()).toBe(0)
    })
  })
  describe("Storage data destruction test", () => {
    let storage: Storage<number>

    beforeAll(() => {
      storage = new Storage()
      storage.addData(0)
      storage.addData(1)
      storage.commitChanges()
      storage.addData(2)
      storage.addData(3)
      storage.destroy()
    })

    test("Current data should be destroyed", () => {
      expect(storage.length()).toBe(0)
    })
    test("Deferred data should be destroyed", () => {
      storage.commitChanges()
      expect(storage.length()).toBe(0)
    })
  })
  describe("Serialization test", () => {
    let storage1: Storage<number>
    let storage2: Storage<number>
    let serialized: StorageSerializedData<number>

    beforeAll(() => {
      storage1 = new Storage()
      storage2 = new Storage()
      storage1.addData(0)
      storage1.addData(1)
      storage1.commitChanges()
      storage1.addData(2)
      storage1.removeData(0)
    })

    test("All current and deferred changes should be serialized", () => {
      serialized = storage1.serialize()
      expect(serialized.data.size).toBe(2)
      expect(serialized.deferredData.added.size).toBe(1)
      expect(serialized.deferredData.removed.size).toBe(1)
      expect(serialized.hasChanged).toBeTruthy()
    })
    test("Serialized data should de restored", () => {
      storage2.deserialize(serialized)
      expect(storage2.length()).toBe(2)
      expect(storage2.length(true)).toBe(3)
      expect(storage2.hasChanged).toBeTruthy()
    })
    test("Invalid data should return false", () => {
      // @ts-expect-error
      expect(storage2.deserialize({ data: [] })).toBeFalsy()
      // @ts-expect-error
      expect(storage2.deserialize({ data: new Map(), deferredData: [] })).toBeFalsy()
      // @ts-expect-error
      expect(storage2.deserialize({ data: new Map(), deferredData: { added: [], removed: new Set() } })).toBeFalsy()
      // @ts-expect-error
      expect(storage2.deserialize({ data: new Map(), deferredData: { added: new Set(), removed: [] } })).toBeFalsy()
      // @ts-expect-error
      expect(storage2.deserialize({ data: new Map(), deferredData: { added: new Set(), removed: new Set() }, hasChanged: undefined })).toBeFalsy()
      expect(storage2.deserialize({ data: new Map(), deferredData: { added: new Set(), removed: new Set() }, hasChanged: false })).toBeTruthy()
    })
  })
  test("Immediate commit should clean the data status", () => {
    const storage = new Storage<number>()
    storage.addData(0)
    storage.addData(1)
    storage.commitChanges()
    expect(storage.getDataStatus(0)).toBe(Status.ADDED)
    expect(storage.getDataStatus(1)).toBe(Status.ADDED)
    storage.addData(2)
    storage.removeData(0)
    storage.commitChanges(true)
    expect(storage.getDataStatus(0)).toBeUndefined()
    expect(storage.getDataStatus(1)).toBe(Status.ACTIVE)
    expect(storage.getDataStatus(2)).toBe(Status.ACTIVE)
  })
  test("Same frame changes should be done immediately", () => {
    const storage = new Storage<number>()
    storage.addData(0)
    storage.removeData(0)
    storage.addData(1, true)
    storage.removeData(1)
    storage.addData(1)
    storage.commitChanges()
    expect(storage.length()).toBe(1)
  })
  test("Storage should e an iterator", () => {
    const storage = new Storage<number>()
    storage.addData(0)
    storage.addData(1)
    storage.addData(2)
    storage.addData(3)
    storage.addData(4)
    storage.addData(5)
    storage.commitChanges()
    let index = 0
    for (const [data, status] of storage) {
      expect(data).toBe(index)
      expect(status).toBe(Status.ADDED)
      index++
    }
    index = 0
    for (const data of storage.keys()) {
      expect(data).toBe(index)
      index++
    }
    index = 0
    for (const status of storage.values()) {
      expect(status).toBe(Status.ADDED)
      index++
    }
  })
})
