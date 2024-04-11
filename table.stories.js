import { createUi } from '@shared-utils/storybook'

import SmartTable from '../shared/table/SmartTable.vue'

const template = `
  <pms-card :header="false">
    <pms-smart-table v-bind="args">
      <template #slotCellName={value}>
        {{value}} + acacsascasc
      </template>
      <template #slotItem>
        sdvsdvsdsvd
      </template>
      <template #slotItem2>
      <pms-smart-table
        v-bind="args"
        :expandable="true"
      >
        <template #slotCellName={value}>
          {{value}} + acacsascasc
        </template>
        <template #slotItem>
          Why do we use it?
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
        </template>
      </pms-smart-table>
      </template>
    </pms-smart-table>
    <button class="btn btn-light bg-light">asdasd</button>
  </pms-card>
`

const Template = createUi({
  template,
  components: {
    PmsSmartTable: SmartTable
  }
})

export const Default = Template.bind({})

Default.args = {
  headers: [
    { title: 'header 1', field: 'header1', sortable: true },
    { title: 'header 2', field: 'header2', headerClass: 'text-center', headerStyle: 'text-align: center;', sortable: true },
    { title: 'sub header 1', field: 'subHeader1', sortable: true },
    { title: 'sub header 2', field: 'subHeader2', sortable: true },
    { title: 'sub header 3', field: 'subHeader3', sortable: true }
  ],
  items: [
    { header1: 'b' },
    {
      oneLineSlotItem: 'slotItem',
      nestedItems: [
        { oneLineSlotItem: 'slotItem2' }
      ]
    },
    { header1: 'b' },
    { header1: 'b' },
    { header1: 'b' }
  ],
  sortable: true,
  expandable: true,
  options: {
    headers: {
      textAlignment: 'start'
    }
  }
}

export default {
  title: 'UI/Smart/Table',
  component: SmartTable,
  parameters: {
    design: '',
    status: {
      type: 'released',
      url: 'https://automation-team.jetbrains.space/p/pms/issue-boards'
    }
  },
  argTypes: {}
}
