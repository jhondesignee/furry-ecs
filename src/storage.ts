import { Status } from "#constants"
import type { StorageSerializedData } from "#types"

export default class Storage<Data> {
  public hasChanged: boolean
  private readonly data: Map<Data, Status>
  private readonly deferredData: {
    added: Set<Data>
    removed: Set<Data>
  }

  constructor() {
    this.data = new Map()
    this.deferredData = {
      added: new Set(),
      removed: new Set()
    }
    this.hasChanged = false
  }

  public addData(data: Data, immediately: boolean = false): boolean {
    if (this.deferredData.removed.has(data)) {
      this.deferredData.removed.delete(data)
      return true
    }
    if (this.data.has(data) || this.deferredData.added.has(data)) return false
    if (immediately) {
      this.data.set(data, Status.ACTIVE)
    } else {
      this.deferredData.added.add(data)
    }
    return true
  }

  public removeData(data: Data, immediately: boolean = false): boolean {
    if (this.deferredData.added.has(data)) {
      this.deferredData.added.delete(data)
      return true
    }
    if (!this.data.has(data) || this.deferredData.removed.has(data)) return false
    if (immediately) {
      this.data.delete(data)
    } else {
      this.deferredData.removed.add(data)
    }
    return true
  }

  public hasData(data: Data): boolean {
    return this.data.has(data)
  }

  public hasDeferredData(data: Data): boolean {
    return this.deferredData.added.has(data) || this.deferredData.removed.has(data)
  }

  public commitChanges(immediately: boolean = false): void {
    if (this.hasChanged) this.hasChanged = false
    if (immediately) this.applyDeferredChanges()
    this.cleanPreviousChanges()
    if (!immediately) this.applyDeferredChanges()
  }

  public destroy(): void {
    this.data.clear()
    this.cleanDeferredChanges()
  }

  public getDataStatus(data: Data): Status | undefined {
    return this.data.get(data)
  }

  public keys(): MapIterator<Data> {
    return this.data.keys()
  }

  public values(): MapIterator<Status> {
    return this.data.values()
  }

  public length(includeDeferred?: boolean): number {
    const size = this.data.size + (includeDeferred ? this.deferredData.added.size : 0)
    return size
  }

  public serialize(): StorageSerializedData<Data> {
    return {
      data: this.data,
      deferredData: this.deferredData,
      hasChanged: this.hasChanged
    }
  }

  public deserialize(storageData: StorageSerializedData<Data>): boolean {
    const { data, deferredData, hasChanged } = storageData
    if (!(data instanceof Map)) return false
    if (!(deferredData?.["added"] instanceof Set)) return false
    if (!(deferredData?.["removed"] instanceof Set)) return false
    if (typeof hasChanged !== "boolean") return false
    for (const entry of data) {
      this.data.set(entry[0], entry[1])
    }
    for (const value of deferredData.added) {
      this.deferredData.added.add(value)
    }
    for (const value of deferredData.removed) {
      this.deferredData.removed.add(value)
    }
    this.hasChanged = hasChanged
    return true
  }

  *[Symbol.iterator](): Iterator<[Data, Status]> {
    for (const entry of this.data) {
      yield entry
    }
  }

  private applyDeferredChanges(): void {
    for (const data of this.deferredData.added) {
      this.data.set(data, Status.ADDED)
      this.hasChanged = true
    }
    for (const data of this.deferredData.removed) {
      this.data.set(data, Status.REMOVED)
      this.hasChanged = true
    }
    this.cleanDeferredChanges()
  }

  private cleanPreviousChanges(): void {
    for (const [data, status] of this.data) {
      if (status === Status.ADDED) {
        this.data.set(data, Status.ACTIVE)
      } else if (status === Status.REMOVED) {
        this.data.delete(data)
      }
    }
  }

  private cleanDeferredChanges(): void {
    this.deferredData.added.clear()
    this.deferredData.removed.clear()
  }
}
