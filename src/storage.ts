import { Status } from "#constants"

export default class Storage<Data> {
  public readonly data: Map<Data, Status>
  private readonly deferredData: Map<Data, Status>

  constructor() {
    this.data = new Map()
    this.deferredData = new Map()
  }

  public addData(data: Data, immediately: boolean = false): void {
    if (immediately) {
      this.data.set(data, Status.ACTIVE)
    } else {
      this.deferredData.set(data, Status.ADDED)
    }
  }

  public removeData(data: Data, immediately: boolean = false): void {
    if (this.deferredData.has(data)) {
      this.deferredData.delete(data)
      return
    }
    if (immediately) {
      this.data.delete(data)
    } else {
      if (this.data.has(data)) {
        this.deferredData.set(data, Status.REMOVED)
      }
    }
  }

  public commitChanges(immediately: boolean = false): void {
    if (immediately) this.applyDeferredChanges()
    this.cleanPreviousChanges()
    if (!immediately) this.applyDeferredChanges()
  }

  public destroy(): void {
    this.data.clear()
    this.deferredData.clear()
  }

  private applyDeferredChanges(): void {
    for (const [data, status] of this.deferredData) {
      this.data.set(data, status)
    }
    this.deferredData.clear()
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
}
