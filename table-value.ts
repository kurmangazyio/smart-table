import { SmartTableHeader } from '@/shared/types'

export const allStudentsTable: Array<SmartTableHeader> = [
  {
    title: 'common.no',
    field: 'no',
    slotCellName: 'no'
  },
  {
    title: 'common.table.student-card-id',
    field: 'id',
    slotCellName: 'id-number',
    sortable: true
  },
  {
    title: 'common.table.student-id',
    field: 'surname',
    slotCellName: 'studentData',
    sortable: true,
    cellClass: 'text-center'
  },
  {
    title: 'common.table.class',
    field: 'class',
    slotCellName: 'class',
    sortable: true,
    cellClass: 'text-center'
  },
  {
    title: 'common.table.academic-status',
    field: 'academic_status',
    slotCellName: 'academicStatus',
    sortable: true,
    cellClass: 'text-center'
  },
  {
    title: 'common.table.speciality',
    field: 'speciality',
    slotCellName: 'speciality',
    sortable: false
  },
  {
    title: 'common.table.entrance-year',
    field: 'entrance_year',
    slotCellName: 'entranceYear',
    sortable: true,
    cellClass: 'text-center'
  },
  {
    title: 'common.table.financial-lock',
    field: 'financial_lock',
    slotCellName: 'financial-lock',
    headerClass: 'text-center',
    sortable: false,
    cellClass: 'text-center'
  },
  {
    title: 'common.table.action',
    field: 'action',
    slotCellName: 'action',
    cellClass: 'text-center'
  }
]
