import { beforeAll, describe, test, expect } from "vitest"
import Storage from "#storage"
import { Status } from "#constants"

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
