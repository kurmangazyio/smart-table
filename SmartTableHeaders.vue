<template>
  <tr
    style="vertical-align: middle;"
    :class="{[options.headers?.class || '']: true}"
    :style="{
      ...handleStyle(options.headers?.style || ''),
      ...{
        backgroundColor: themeMode === 'light' ? '#F3F6F9' : '#474761',
      }
    }"
  >
    <th
      v-if="expandable"
      class="ps-4 w-50px border-end border-gray-300"
      :class="{
        'resizable': options.headers?.resizable || false
      }"
      :style="{
        borderTopLeftRadius: trIndex === 0 ? borderRadius : 'inherit',
        borderBottomLeftRadius: trIndex === 1 || depth === 1 ? borderRadius : 'inherit',
      }"
    />
    <template
      v-for="(th, index) in trItems"
      :key="index"
    >
      <th
        class="ps-4 pe-3 resizable"
        :rowspan="th.rowSpan"
        :colspan="th.colSpan"
        :class="{
          'border-top border-gray-300': trIndex !== 0,
          'border-start border-gray-300': th.borderStart,
          [th.headerClass || '']: true,
          [options.headers?.columnClass || '']: true,
          'resizable': options.headers?.resizable || false
        }"
        :style="{
          ...handleBorderRadiuses(th, index, trItems.length - 1),
          ...handleStyle(options.headers?.columnStyle || '')
        }"
      >
        <div
          v-if="th.subHeaders"
          class="text-center"
        >
          <template v-if="th.slotName">
            <slot
              :name="th.slotName"
              :item="th"
            />
          </template>
          <template v-else>
            <div v-html="isTranslatable(th.title) ? $t(th.title) : th.title" />
          </template>
        </div>
        <div
          v-else
          class="d-flex justify-content-between"
        >
          <div
            class="w-100"
            :class="{
              'text-center': options.headers?.textAlignment === 'center',
              'text-end': options.headers?.textAlignment === 'end',
              'text-start': options.headers?.textAlignment === 'start',
            }"
            style="margin-top: 1px !important;"
          >
            <template v-if="th.slotName">
              <slot
                :name="th.slotName"
                :item="th"
                :column="th"
              />
            </template>
            <template v-else>
              <div
                :class="{
                  'opacity-25': subTitleState
                }"
                v-html="isTranslatable(th.title) ? $t(th.title) : th.title"
              />
              <div
                v-if="th.subTitle && subTitleState"
                class="fs-8"
                v-html="isTranslatable(th.subTitle) ? $t(th.subTitle) : th.subTitle"
              />
            </template>
          </div>
          <span
            v-if="!th.subHeaders && th.sortable && sortable"
            v-styler="{ paddingTop: '2px', paddingLeft: '5px'}"
            class="svg-icon svg-icon-2"
            :class="{
              'svg-icon-dark': sortField?.field !== th.field,
              'svg-icon-primary': sortField?.field === th.field,
              'cursor-pointer': sortable && th.sortable && !th.subHeaders,
              'pt-3': th.subTitle && subTitleState
            }"
            @click="handleSortBtnClick(th)"
          >
            <inline-svg
              v-if="sortField?.field === th.field && sortField?.direction === 'desc'"
              src="/media/icons/duotune/arrows/arr065.svg"
            />
            <inline-svg
              v-else-if="sortField?.field === th.field && sortField?.direction === 'asc'"
              src="/media/icons/duotune/arrows/arr066.svg"
            />
            <inline-svg
              v-else
              src="/media/icons/duotune/arrows/arr032.svg"
            />
          </span>
        </div>
      </th>
    </template>
  </tr>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { ComputedSmartTableHeader, SmartTableOptions, SmartTableSortField } from '@shared/types'
import { handleStyle, isTranslatable } from '@shared/utils'
import { themeMode } from '@shared/composable/pattern'

const borderRadius = '0.625rem'

const props = defineProps({
  trIndex: {
    type: Number,
    required: true
  },
  trItems: {
    type: Object as PropType<Array<ComputedSmartTableHeader>>,
    required: true
  },
  depth: {
    type: Number,
    required: true
  },
  expandable: {
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
  },
  sortField: {
    type: Object as PropType<SmartTableSortField | null>,
    default: () => (null)
  },
  subTitleState: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'setSortField'
])

const handleBorderRadiuses = (th: ComputedSmartTableHeader, index: number, lastIndex: number): Record<string, string> => {
  if (index === 0 && !props.expandable) {
    return {
      borderTopLeftRadius: th.startTopRadius ? borderRadius : 'inherit',
      borderBottomLeftRadius: th.startBottomRadius ? borderRadius : 'inherit'
    }
  }

  if (index === lastIndex) {
    return {
      borderTopRightRadius: th.endTopRadius ? borderRadius : 'inherit',
      borderBottomRightRadius: th.endBottomRadius ? borderRadius : 'inherit'
    }
  }

  return {}
}

const handleSortBtnClick = (header: ComputedSmartTableHeader): void => {
  emit('setSortField', header)
}
</script>

<style scoped lang="scss">
.resizable {
  resize: horizontal;
  overflow: auto;
}
</style>
