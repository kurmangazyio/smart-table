<template>
  <div
    :class="{
      [tableOptions.wrapper?.class || '']: true,
      'table-responsive': tableOptions.wrapper?.responsive
    }"
    :style="tableOptions.wrapper?.style || ''"
  >
    <table
      class="table"
      :class="{
        [tableOptions.table?.class || '']: true,
        'table-hover': tableItems.length > 0,
        'table-striped': tableOptions.design === 'striped'
      }"
      :style="tableOptions.table?.style || ''"
    >
      <thead
        v-if="tableOptions.headers?.show"
      >
        <template
          v-for="(item, index) in tableHeaders"
          :key="index"
        >
          <smart-table-headers
            :tr-index="index"
            :tr-items="item"
            :depth="tableDepth"
            :expandable="expandable"
            :sub-title-state="expandable && hasSubTitles && expandTrackings.length > 0"
            :sortable="sortable"
            :options="options"
            :sort-field="sortField"
            @setSortField="setSortField"
          >
            <template
              v-for="(_, slot) of $slots"
              #[slot]="scope"
            >
              <slot
                :name="slot"
                v-bind="scope"
              />
            </template>
          </smart-table-headers>
        </template>
      </thead>
      <tbody>
        <template
          v-for="(item, index) in tableItems"
          :key="index"
        >
          <smart-table-items
            :item="item"
            :idx="index"
            :options="tableOptions"
            :headers="tableItemHeaders"
            :expandable="expandable"
            :expand-all="expandAll"
            @expandAction="expandAction"
          >
            <template
              v-for="(_, slot) of $slots"
              #[slot]="scope"
            >
              <slot
                :name="slot"
                v-bind="scope"
              />
            </template>
          </smart-table-items>
        </template>
        <tr
          v-if="tableItems.length === 0"
        >
          <td
            :colspan="tableItemHeaders.length + (expandable ? 1 : 0)"
            class="me-2 text-center fs-5"
            style="padding-top: 50px; padding-bottom: 50px;"
          >
            {{ $t('common.no-data') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref, computed, watch } from 'vue'

import { SmartTableItem, SmartTableHeader, SmartTableOptions, SmartTableSortField, ComputedSmartTableHeader } from '@shared/types'
import { objectDeepCopy, handleOptions } from '@shared/utils'

import SmartTableHeaders from './SmartTableHeaders.vue'
import SmartTableItems from './SmartTableItems.vue'

const defaultOptions: SmartTableOptions = {
  design: 'default',

  wrapper: {
    class: '',
    style: '',
    responsive: true
  },

  table: {
    class: 'align-middle gs-0 gy-4 mb-0',
    style: ''
  },

  headers: {
    show: true,
    showExpandTitle: false,
    textAlignment: 'start',

    class: 'fw-bold text-center text-uppercase',
    style: '',
    columnClass: '',
    columnStyle: ''
  },

  items: {
    translate: true,
    textAlignment: 'start',
    expandBackground: 'bg-light-primary',

    class: '',
    style: '',
    columnClass: '',
    columnStyle: ''
  },

  noData: {
    text: 'common.no-data'
  }
}

const props = defineProps({
  headers: {
    type: Array as PropType<Array<SmartTableHeader>>,
    required: true
  },
  items: {
    type: Array as PropType<Array<SmartTableItem>>,
    required: true
  },
  expandable: {
    type: Boolean,
    default: false
  },
  expandAll: {
    type: Boolean,
    default: false
  },
  sortable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object as PropType<SmartTableOptions>,
    default: () => ({})
  }
})

const emit = defineEmits([
  'update:items',
  'update:headers',
  'update:expandable',
  'update:sortable',
  'update:expandAll'
])

const sortField = ref<null| SmartTableSortField>(null)

const setSortField = (header: ComputedSmartTableHeader): void => {
  if (!header.sortable) return

  if (!sortField.value || (sortField.value && sortField.value.field !== header.field)) {
    sortField.value = {
      field: header.field,
      direction: 'desc'
    }
  } else {
    sortField.value.direction === 'desc'
      ? sortField.value.direction = 'asc'
      : sortField.value = null
  }
}

const sortItems = (items: Array<SmartTableItem>): Array<SmartTableItem> => {
  let sortingItems: Array<SmartTableItem> = items

  if (sortField.value !== null) {
    const field = sortField.value.field

    sortingItems = items.sort((a, b) => {
      let order = -1
      if (b[field] === null) {
        b[field] = ''
      }
      if (a[field] === null) {
        a[field] = ''
      }
      if (sortField.value?.direction === 'asc') order = 1
      if (b[field] > a[field]) return order
      if (b[field] < a[field]) return -order
      return 0
    })

    items.forEach(item => {
      if (item && item.nestedItems) {
        item.nestedItems = sortItems(item.nestedItems)
      }
    })
  }
  return sortingItems
}

const tableOptions = computed(() => handleOptions<SmartTableOptions>(props.options, defaultOptions))
const tableDepth = computed(() => getDepth(props.headers))
const tableHeaders = computed(() => handleHeaders(props.headers) || [])

const tableItemHeaders = computed(() => handleItemHeaders(props.headers) || [])

const tableItems = computed(() => {
  const items = objectDeepCopy(props.items) as Array<SmartTableItem>
  return sortField.value === null
    ? props.items
    : sortItems(items)
})

const expandTrackings = ref<Array<{ row: number, action: string }>>([])

const hasSubTitles = computed(() => {
  let has = false
  props.headers.forEach(header => { if (header && header.subTitle) has = true })
  return has
})

const expandAction = (value: { row: number, action: string }) => {
  if (value.action === 'expand') {
    expandTrackings.value.push(value)
  } else {
    expandTrackings.value = expandTrackings.value.filter(item => item.row !== value.row)
  }
}

const getDepth = (headers: Array<SmartTableHeader>): number => {
  let depth = 1

  headers.forEach((header) => { if (header.subHeaders) depth = 2 })
  return depth
}

const handleHeaders = (headers: Array<SmartTableHeader>): Array<Array<ComputedSmartTableHeader>> => {
  const tableHeaders: Array<Array<ComputedSmartTableHeader>> = []
  const depth = getDepth(headers)

  if (depth === 1) {
    return [
      headers.map((header, index) => {
        return {
          ...header,
          colSpan: 1,
          rowSpan: 1,
          startTopRadius: index === 0,
          startBottomRadius: index === 0,
          endTopRadius: index === headers.length - 1,
          endBottomRadius: index === headers.length - 1,
          borderStart: index !== 0
        }
      })
    ]
  }

  for (let i = 0; i < depth; i++) tableHeaders.push([])

  for (const index in headers) {
    let level = 0
    const header = headers[index]
    const headerItem = {
      ...header,
      rowSpan: !header.subHeaders ? depth : 1,
      colSpan: !header.subHeaders ? 1 : header.subHeaders.length,
      borderStart: true
    } as ComputedSmartTableHeader

    if (header.subHeaders) {
      level += 1
      for (const subIndex in header.subHeaders) {
        const subHeader = header.subHeaders[subIndex]
        const subHeaderItem = {
          ...subHeader,
          rowSpan: 1,
          colSpan: 1,
          borderStart: true
        } as ComputedSmartTableHeader

        if (parseInt(index) === 0 && parseInt(subIndex) === 0) {
          subHeaderItem.startBottomRadius = true
          subHeaderItem.borderStart = false
        }

        if (parseInt(index) === headers.length - 1 && parseInt(subIndex) === header.subHeaders.length - 1) {
          subHeaderItem.endBottomRadius = true
        }

        tableHeaders[level].push(subHeaderItem)
      }
      level -= 1
    }

    if (parseInt(index) === 0) {
      headerItem.startTopRadius = true
      headerItem.borderStart = false

      if (headerItem.rowSpan === depth) {
        headerItem.startBottomRadius = true
      }
    }

    if (parseInt(index) === headers.length - 1) {
      headerItem.endTopRadius = true

      if (headerItem.rowSpan === depth) {
        headerItem.endBottomRadius = true
      }
    }

    tableHeaders[level].push(headerItem)
  }

  return tableHeaders
}

const handleItemHeaders = (headers: Array<SmartTableHeader>): Array<SmartTableHeader> => {
  const itemHeaders: Array<SmartTableHeader> = []

  headers.forEach((header) => {
    if (header.subHeaders) {
      header.subHeaders.forEach((subHeader) => { itemHeaders.push(subHeader) })
    } else {
      itemHeaders.push(header)
    }
  })
  return itemHeaders
}

watch(
  () => props.headers,
  (newValue) => { emit('update:headers', newValue) },
  { deep: true }
)

watch(
  () => props.items,
  (newValue) => { emit('update:items', newValue) },
  { deep: true }
)

watch(
  () => props.expandAll,
  (newValue) => { emit('update:expandAll', newValue) }
)

watch(
  () => props.sortable,
  (newValue) => { emit('update:sortable', newValue) }
)
</script>
