import { ITableRepository, TableFactory } from '@egodb/core'
import { type ICommandHandler } from '@egodb/domain'
import type { ICreateTableOutput } from './create-table.command.interface.js'
import type { CreateTableCommand } from './create-table.command.js'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand, ICreateTableOutput>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableOutput> {
    const table = TableFactory.from(command).unwrap()

    await this.repo.insert(table)

    return { id: table.id.value }
  }
}