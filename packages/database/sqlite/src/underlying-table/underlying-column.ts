import type {
  BoolField,
  ColorField,
  DateField,
  DateRangeField,
  EmailField,
  Field,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  TreeField,
} from '@egodb/core'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_INCREAMENT_ID_NAME as INTERNAL_AUTO_INCREAMENT_ID_NAME,
} from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { IUnderlyingColumn } from '../interfaces/underlying-column.js'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from './constants.js'

export abstract class UnderlyingColumn implements IUnderlyingColumn {
  abstract get name(): string
  abstract build(tb: Knex.TableBuilder, knex: Knex): void
}

export class UnderlyingIdColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_ID_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).notNullable()
  }
}

export class UnderlyingAutoIncreamentColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_AUTO_INCREAMENT_ID_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.increments(this.name).notNullable()
  }
}

export class UnderlyingCreatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_CREATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): void {
    tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
}

export class UnderlyingUpdatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_UPDATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): void {
    tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
}

export class UnderlyingDeletedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_DELETED_AT_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.datetime(this.name).nullable()
  }
}

abstract class UnderlyingFieldColumn<F extends Field> implements IUnderlyingColumn {
  constructor(protected readonly field: F) {}
  get name(): string {
    return this.field.id.value
  }
  abstract build(tb: Knex.TableBuilder, knex: Knex): void
}

export class UnderlyingStringColumn extends UnderlyingFieldColumn<StringField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
}

export class UnderlyingEmailColumn extends UnderlyingFieldColumn<EmailField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
}

export class UnderlyingColorColumn extends UnderlyingFieldColumn<ColorField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name, 10)
  }
}

export class UnderlyingNumberColumn extends UnderlyingFieldColumn<NumberField> {
  build(tb: Knex.TableBuilder): void {
    tb.float(this.name)
  }
}

export class UnderlyingRatingColumn extends UnderlyingFieldColumn<RatingField> {
  build(tb: Knex.TableBuilder): void {
    tb.float(this.name)
  }
}

export class UnderlyingBoolColumn extends UnderlyingFieldColumn<BoolField> {
  build(tb: Knex.TableBuilder): void {
    tb.boolean(this.name)
  }
}

export class UnderlyingDateColumn extends UnderlyingFieldColumn<DateField> {
  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
}

const UNDERLYING_DATE_RANGE_FROM = '_from'

export type UnderlyingDateRangeFromColumnName = `${string}${typeof UNDERLYING_DATE_RANGE_FROM}`

export const isUnlderlyingDateTangeFromColumn = (str: string): str is UnderlyingDateRangeFromColumnName =>
  str.endsWith(UNDERLYING_DATE_RANGE_FROM)

export const getFieldIdFromDateRangeFromColumnName = (name: UnderlyingDateRangeFromColumnName): string =>
  name.replace(UNDERLYING_DATE_RANGE_FROM, '')

export class UnderlyingDateRangeFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): UnderlyingDateRangeFromColumnName {
    return `${super.name}${UNDERLYING_DATE_RANGE_FROM}`
  }

  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
}

const UNDERLYING_DATE_RANGE_TO = '_to'

export type UnderlyingDateRangeToColumnName = `${string}${typeof UNDERLYING_DATE_RANGE_TO}`

export const isUnlderlyingDateTangeToColumn = (str: string): str is UnderlyingDateRangeToColumnName =>
  str.endsWith(UNDERLYING_DATE_RANGE_TO)

export const getFieldIdFromDateRangeToColumnName = (name: UnderlyingDateRangeToColumnName): string =>
  name.replace(UNDERLYING_DATE_RANGE_TO, '')

export class UnderlyingDateRangeToFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): UnderlyingDateRangeToColumnName {
    return `${super.name}${UNDERLYING_DATE_RANGE_TO}`
  }

  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
}

export class UnderlyingSelectColumn extends UnderlyingFieldColumn<SelectField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
}

export class UnderlyingReferenceColumn extends UnderlyingFieldColumn<ReferenceField> {
  build(tb: Knex.TableBuilder): void {
    tb.json(this.name)
  }
}

export class UnderlyingTreeColumn extends UnderlyingFieldColumn<TreeField> {
  build(tb: Knex.TableBuilder): void {
    tb.json(this.name)
  }
}

export class UnderlyingParentColumn extends UnderlyingFieldColumn<ParentField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).nullable()
  }
}