import { ValueObject } from '@egodb/domain'
import type { ISortDirection, ISorts } from './sort.schema.js'

export class Sorts extends ValueObject<ISorts> {
  public get sorts() {
    return this.props
  }

  public unpack() {
    return this.sorts
  }

  public toArray() {
    return this.sorts
  }

  setFieldSort(fieldId: string, direction: ISortDirection): Sorts {
    const found = this.sorts.some((s) => s.fieldId === fieldId)
    if (found) {
      const sorts = this.sorts.map((sort) => (sort.fieldId === fieldId ? { fieldId, direction } : sort))
      return new Sorts(sorts)
    }

    const sorts = [...this.sorts, { fieldId, direction }]
    return new Sorts(sorts)
  }
}
