<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { TodoInterface, TodoNewInterface, TodoUpdateInterface } from '~/types/interfaces'
import type { Row } from '@tanstack/table-core'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { items } = defineProps<{ items: TodoInterface[] }>()

const emit = defineEmits<{
  (e: 'update:edit', payload: TodoUpdateInterface): void
  (e: 'update:complete', payload: { id: number; complete: boolean }): void
  (e: 'update:delete', payload: { id: number }): void
  (e: 'update:duplicate', payload: TodoNewInterface): void
}>()

const columns: TableColumn<TodoInterface>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'complete',
    header: 'Status',
    cell: ({ row }) => {
      const isComplete = row.getValue('complete')
      return h(resolveComponent('USwitch'), {
        modelValue: isComplete,
        'onUpdate:modelValue': (val: boolean) => {
          emit('update:complete', { id: row.original.id, complete: val })
        },
        class: 'align-middle',
        label: isComplete ? 'Complete' : 'Incomplete',
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
      label: 'Actions',
    },
    {
      type: 'separator',
    },
    {
      label: 'Edit',
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
      label: 'Duplicate',
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
      label: 'Delete',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onClick: () => {
        if (row) {
          emit('update:delete', { id: row.original.id })
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
    loading-animation="carousel"
    :data="items"
    :columns="columns"
    class="flex-1"
  />
</template>
