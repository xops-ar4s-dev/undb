import type { ICreateOptionSchema } from '@egodb/core'
import { createOptionSchema, OptionKey } from '@egodb/core'
import { useCreateOptionMutation } from '@egodb/store'
import { Stack, TextInput, Group, Button, closeAllModals } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'
import { OptionColorPicker } from '../field-inputs/option-color-picker'
import type { ICreateOptionFormProps } from './create-option-form.props'

export const CreateOptionForm: React.FC<ICreateOptionFormProps> = ({ field, color, onSuccess }) => {
  const table = useCurrentTable()
  const form = useForm<ICreateOptionSchema>({
    defaultValues: {
      name: '',
      color,
    },
    resolver: zodResolver(createOptionSchema),
  })

  const [createOption, { isLoading }] = useCreateOptionMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    values.key = OptionKey.create().value
    await createOption({
      tableId: table.id.value,
      fieldId: field.id.value,
      option: values,
    })

    form.reset()
    onSuccess?.()
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group>
          <Controller
            name="color"
            control={form.control}
            render={(props) => (
              <OptionColorPicker {...props.field} option={{ name: form.watch('name'), color: props.field.value }} />
            )}
          />
          <TextInput data-autofocus variant="unstyled" placeholder="option name" {...form.register('name')} />
        </Group>
        <Group position="right">
          <Button size="xs" variant="white" onClick={() => closeAllModals()}>
            Cancel
          </Button>
          <Button
            size="xs"
            type="submit"
            disabled={!form.formState.isValid || !form.formState.isDirty}
            loading={isLoading}
          >
            Done
          </Button>
        </Group>
      </Stack>
    </form>
  )
}