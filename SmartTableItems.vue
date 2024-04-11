<template>
  <tr
    :row-id="`${nestedLevel}${idx}`"
    :class="{
      [options.items?.class || '']: true,
      'text-center': options.items?.textAlignment === 'center',
      'text-end': options.items?.textAlignment === 'end',
      'text-start': options.items?.textAlignment === 'start',
      [options.items?.expandBackground || '']: expandable && (isExpanded || expanded)
    }"
    :style="{
      ...handleStyle(options.items?.style || ''),
      ...{
        borderBottomColor: isExpanded && nestedLevel > 0 ? 'var(--bs-gray-500)' : 'inherit',
        borderBottomWidth: isExpanded && nestedLevel > 0 ? '1px' : 'inherit',
        borderBottomStyle: isExpanded && nestedLevel > 0 ? 'dashed' : 'inherit'
      },
      ...{
        borderBottomColor: options.design === 'bordered' && nestedLevel === 0 ? 'var(--bs-gray-300)' : 'inherit',
        borderBottomWidth: options.design === 'bordered' && nestedLevel === 0 ? '1px' : 'inherit',
        borderBottomStyle: options.design === 'bordered' && nestedLevel === 0 ? 'solid' : 'inherit'
      },
      ...{
        borderBottomColor: options.design === 'bordered-dashed' && nestedLevel === 0 ? 'var(--bs-gray-400)' : 'inherit',
        borderBottomWidth: options.design === 'bordered-dashed' && nestedLevel === 0 ? '1px' : 'inherit',
        borderBottomStyle: options.design === 'bordered-dashed' && nestedLevel === 0 ? 'dashed' : 'inherit',
      }
    }"
  >
    <td
      v-if="expandable"
      class="text-center ps-0 pe-0"
    >
      <button
        v-if="item.nestedItems && item.nestedItems.length > 0"
        type="button"
        class="btn btn-sm btn-icon h-25px w-25px btn-active-primary"
        :class="{
          'btn-primary': isExpanded,
          'btn-light': !isExpanded,
          [`ms-${nestedLevel + 2}`]: nestedLevel > 0
        }"
        @click="handleExpandBtnClick()"
      >
        <span class="svg-icon svg-icon-3 m-0">
          <inline-svg
            v-if="!isExpanded"
            src="/media/icons/duotune/arrows/arr087.svg"
          />
          <inline-svg
            v-if="isExpanded"
            src="/media/icons/duotune/arrows/arr089.svg"
          />
        </span>
      </button>
    </td>
    <template v-if="item.oneLineSlotItem && item.oneLineSlotItem.length > 0">
      <td
        class="ps-4 pe-3"
        :colspan="headers.length"
        :class="{
          [options.items?.columnClass || '']: true
        }"
        :style="{
          ...handleStyle(options.items?.columnStyle || '')
        }"
      >
        <slot
          :name="item.oneLineSlotItem"
          :row="item"
          :item="item"
          :idx="idx"
        />
      </td>
    </template>
    <template v-else>
      <template
        v-for="(header, hIndex) in headers"
        :key="hIndex"
      >
        <td
          :cell-id="hIndex + 1"
          class="ps-4 pe-3"
          :class="{
            [header.cellClass || '']: true,
            [options.items?.columnClass || '']: true
          }"
          :style="{
            ...handleStyle(header.cellStyle || ''),
            ...handleStyle(options.items?.columnStyle || '')
          }"
        >
          <template v-if="header.slotCellName">
            <slot
              :name="header.slotCellName"
              :value="item[header.field]"
              :row="item"
              :item="item"
              :idx="idx"
            />
          </template>
          <template v-else>
            <slot
              v-if="`item-${header.field}` in $slots"
              :name="`item-${header.field}`"
              :value="item[header.field]"
              :row="item"
              :item="item"
              :idx="idx"
            />
            <template v-else>
              {{ options.items?.translate ? $t(item[header.field] || '') : item[header.field] }}
            </template>
          </template>
        </td>
      </template>
    </template>
  </tr>
  <template v-if="expandable && isExpanded && item.nestedItems && item.nestedItems.length > 0">
    <template
      v-for="(nestedItem, nestedIndex) in item.nestedItems"
      :key="nestedIndex"
    >
      <smart-table-items
        :item="nestedItem"
        :idx="nestedIndex"
        :options="options"
        :headers="headers"
        :expandable="expandable"
        :expanded="isExpanded"
        :expand-all="expandAll"
        :nested-level="nestedLevel + 1"
        @expandAction="() => {}"
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
  </template>
</template>
<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { SmartTableHeader, SmartTableItem, SmartTableOptions } from '@shared/types'
import { handleStyle } from '@shared/utils'

const props = defineProps({
  item: {
    type: Object as PropType<SmartTableItem>,
    required: true
  },
  idx: {
    type: Number,
    required: true
  },
  options: {
    type: Object as PropType<SmartTableOptions>,
    default: () => ({})
  },
  headers: {
    type: Array as PropType<Array<SmartTableHeader>>,
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
  expanded: {
    type: Boolean,
    default: false
  },

  nestedLevel: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'expandAction'
])

const isExpanded = ref(false)

const handleExpandBtnClick = () => {
  isExpanded.value = !isExpanded.value
  emit('expandAction', {
    row: props.idx,
    action: isExpanded.value ? 'expand' : 'collapse'
  })
}

watch(
  () => props.expandAll,
  (newValue) => { isExpanded.value = newValue }
)
</script>
<style lang="scss" scoped>
.no-hover:hover {
  background: var(--kt-primary-light) !important;
  background-color: var(--kt-primary-light) !important;
}
</style>
