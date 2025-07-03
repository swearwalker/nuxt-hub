<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type {
  TodoInterface,
  TodoNewInterface,
  TodoUpdateInterface,
} from '@/types/interfaces/todo.interface'
import type { Row } from '@tanstack/table-core'
import { format } from 'date-fns'

const { t } = useI18n()

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { items } = defineProps<{ items: TodoInterface[] }>()

const emit = defineEmits<{
  (e: 'update:edit', payload: TodoUpdateInterface): void
  (e: 'update:complete', payload: { id: number; complete: boolean }): void
  (e: 'update:delete', payload: number): void
  (e: 'update:duplicate', payload: TodoNewInterface): void
}>()

const columns: TableColumn<TodoInterface>[] = [
  {
    accessorKey: 'id',
    header: t('todo.table.id'),
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'created_at',
    header: t('todo.table.date'),
    cell: ({ row }) => {
      return format(row.getValue('created_at'), 'dd MMM yyyy')
    },
  },
  {
    accessorKey: 'title',
    header: t('todo.table.title'),
  },
  {
    accessorKey: 'description',
    header: t('todo.table.description'),
  },
  {
    accessorKey: 'complete',
    header: t('todo.table.status.title'),
    cell: ({ row }) => {
      const isComplete = row.getValue('complete')
      return h(resolveComponent('USwitch'), {
        modelValue: isComplete,
        'onUpdate:modelValue': (val: boolean) => {
          emit('update:complete', { id: row.original.id, complete: val })
        },
        class: 'align-middle',
        label: isComplete ? t('todo.table.status.complete') : t('todo.table.status.incomplete'),
      })
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown',
            })
        )
      )
    },
  },
]

function getRowItems(row?: Row<TodoInterface>) {
  return [
    {
      type: 'label',
      label: t('todo.table.actions.title'),
    },
    {
      type: 'separator',
    },
    {
      label: t('todo.table.actions.edit'),
      icon: 'i-lucide-edit-2',
      color: 'primary',
      onClick: () => {
        if (row) {
          emit('update:edit', {
            id: row.original.id,
            title: row.original.title,
            description: row.original.description,
            complete: row.original.complete,
          })
        }
      },
    },
    {
      label: t('todo.table.actions.duplicate'),
      icon: 'i-lucide-copy',
      color: 'info',
      onClick: () => {
        if (row) {
          emit('update:duplicate', {
            title: row.original.title,
            description: row.original.description,
            complete: row.original.complete,
          })
        }
      },
    },
    {
      label: t('todo.table.actions.delete'),
      icon: 'i-lucide-trash-2',
      color: 'error',
      onClick: () => {
        if (row) {
          emit('update:delete', row.original.id)
        }
      },
    },
  ]
}
</script>

<template>
  <UTable
    :loading="items.length === 0"
    loading-color="primary"
    loading-animation="swing"
    :data="items"
    :columns="columns"
    class="flex-1"
  />
</template>
