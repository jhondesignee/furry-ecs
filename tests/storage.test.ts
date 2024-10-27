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
      storage.addData(0)
      expect(storage.data.size).toBe(0)
      storage.commitChanges()
      expect(storage.data.size).toBe(1)
      expect(storage.data.get(0)).toBe(Status.ADDED)
      storage.commitChanges()
      expect(storage.data.size).toBe(1)
      expect(storage.data.get(0)).toBe(Status.ACTIVE)
    })
    test("Addition should be deferred", () => {
      storage.addData(1)
      expect(storage.data.size).toBe(1)
      storage.commitChanges()
      expect(storage.data.size).toBe(2)
    })
    test("Should be possible to immediately do the change", () => {
      storage.addData(2, true)
      expect(storage.data.size).toBe(3)
      storage.commitChanges()
      expect(storage.data.size).toBe(3)
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
      storage.removeData(0)
      expect(storage.data.size).toBe(3)
      storage.commitChanges()
      expect(storage.data.size).toBe(3)
      expect(storage.data.get(0)).toBe(Status.REMOVED)
      storage.commitChanges()
      expect(storage.data.size).toBe(2)
      expect(storage.data.get(0)).toBeUndefined()
    })
    test("Removal should be deferred only if the data already exist", () => {
      storage.removeData(1)
      expect(storage.data.size).toBe(2)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.data.size).toBe(1)
      storage.removeData(3)
      expect(storage.data.size).toBe(1)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.data.size).toBe(1)
    })
    test("Previous deferred data should be deleted immediately", () => {
      storage.addData(2)
      storage.removeData(2)
      expect(storage.data.size).toBe(1)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.data.size).toBe(1)
    })
    test("Should be possible to immediately do the change", () => {
      storage.removeData(2, true)
      expect(storage.data.size).toBe(0)
      storage.commitChanges()
      storage.commitChanges()
      expect(storage.data.size).toBe(0)
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
      expect(storage.data.size).toBe(0)
    })
    test("Deferred data should be destroyed", () => {
      storage.commitChanges()
      expect(storage.data.size).toBe(0)
    })
  })
  test("Immediate commit should clean the data status", () => {
    const storage = new Storage<number>()
    storage.addData(0)
    storage.addData(1)
    storage.commitChanges()
    expect(storage.data.get(0)).toBe(Status.ADDED)
    expect(storage.data.get(1)).toBe(Status.ADDED)
    storage.addData(2)
    storage.removeData(0)
    storage.commitChanges(true)
    expect(storage.data.get(0)).toBeUndefined()
    expect(storage.data.get(1)).toBe(Status.ACTIVE)
    expect(storage.data.get(2)).toBe(Status.ACTIVE)
  })
})
