import { Button, closeAllModals, Divider, Group, Stack, TextInput } from '@egodb/ui'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldVariantControl } from '../field/field-variant-control'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { IUpdateFieldSchema } from '@egodb/core'
import { updateFieldSchema } from '@egodb/core'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IUpdateFieldProps } from './update-field.props'
import { useUpdateFieldMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'

export const UpdateFieldForm: React.FC<IUpdateFieldProps> = ({ field, onCancel }) => {
  const table = useCurrentTable()

  const defaultValues: IUpdateFieldSchema = {
    type: field.type,
    name: field.name.value,
  }

  const form = useForm<IUpdateFieldSchema>({
    defaultValues,
    resolver: zodResolver(updateFieldSchema),
  })

  const [updateField, { isLoading }] = useUpdateFieldMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await updateField({
      tableId: table.id.value,
      fieldId: field.id.value,
      field: values,
    })
    form.reset()
    closeAllModals()
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Controller
            name="type"
            control={form.control}
            render={(props) => (
              <TextInput
                {...props.field}
                disabled
                readOnly
                required
                label={<FieldInputLabel>type</FieldInputLabel>}
                icon={<FieldIcon type={form.watch('type')} />}
              />
            )}
          />
          <TextInput {...form.register('name')} label={<FieldInputLabel>name</FieldInputLabel>} />
          <FieldVariantControl />

          <Divider />

          <Group position="right">
            <Button
              variant="subtle"
              onClick={() => {
                onCancel?.()
                closeAllModals()
              }}
            >
              Cancel
            </Button>

            <Button
              loading={isLoading}
              miw={200}
              disabled={!form.formState.isValid || !form.formState.isDirty}
              type="submit"
            >
              Update
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  )
}