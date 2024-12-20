import { Status } from "#constants"

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
    if (immediately) this.applyDeferredChanges()
    this.cleanPreviousChanges()
    if (!immediately) this.applyDeferredChanges()
  }

  public destroy(): void {
    this.data.clear()
    this.cleanDeferredChanges()
    this.hasChanged = false
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
    let hasChanged = false
    for (const [data, status] of this.data) {
      if (status === Status.ADDED) {
        this.data.set(data, Status.ACTIVE)
        hasChanged = true
      } else if (status === Status.REMOVED) {
        this.data.delete(data)
        hasChanged = true
      }
    }
    this.hasChanged = hasChanged
  }

  private cleanDeferredChanges(): void {
    this.deferredData.added.clear()
    this.deferredData.removed.clear()
  }
}
