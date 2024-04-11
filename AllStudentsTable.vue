<template>
  <pms-card
    :header="false"
  >
    <pms-loader v-if="loader" />
    <pms-smart-table
      v-else
      id="all-students-table"
      :items="students"
      :headers="allStudentsTable"
      :sortable="true"
    >
      <template #no="{ idx }">
        {{ idx + 1 }}
      </template>
      <template #id-number="{ item }">
        {{ item.id }}
      </template>
      <template #studentData="{ item }">
        <StudentData :student="item" />
      </template>
      <template #class="{ value }">
        <span class="fs-5 fw-bold">{{ value }}</span>
      </template>
      <template #academicStatus="{ item }">
        <pms-badge
          v-if="item.academic_status"
          :value="item.academic_status"
          :color="getAcademicStatus(item.academic_status)"
          :size="'md'"
          class="me-2"
        />
      </template>
      <template #speciality="{ item }">
        <div class="d-flex align-items-center justify-content-start gap-1">
          <span class="text-gray-800 fw-bold fs-6 d-block flex-shrink-0">
            {{ item.speciality.title }} ({{ item.speciality.code }})
          </span>
          -
          <span class="text-gray-400 fw-semibold d-block fs-7 mt-1">
            {{ item.speciality.language.code }}
          </span>
        </div>
      </template>
      <template #entranceYear="{ item }">
        {{ item.entrance_year }}
      </template>
      <template #financial-lock="{ item }">
        <div
          v-if="item.financial_lock"
          :title="'Financial lock'"
        >
          <pms-kt-icon
            :icon-name="'lock'"
            class="fs-4 text-danger opacity-75"
          />
        </div>
      </template>
      <template #action="{ item }">
        <pms-button
          :size="'sm'"
          :variant="'tonal'"
          @click="handleRedirectToStudentInfo(item.id)"
        >
          {{ $t('common.details') }}
          <pms-kt-icon
            :icon-name="'arrow-right'"
            class="m-0 p-0 ms-2"
          />
        </pms-button>
      </template>
    </pms-smart-table>
    <pms-pagination
      class="p-0 m-0 mt-6"
    />
  </pms-card>
  <div class="student-tooltip">
    <img
      class="student-image"
      src=""
    >
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useLoader } from '@/shared/composable'

import { useAllStudents } from './../store'
import { allStudentsTable } from './../values'
import StudentData from '@domains/AcademicAllStudents/ui/StudentData.vue'
import { LocationQueryRaw, useRouter } from 'vue-router'

const { isActive } = useLoader()
const router = useRouter()
const store = useAllStudents()
const loader = isActive('academic/students')

const students = computed(() => store.getStudents)

function handleRedirectToStudentInfo (id: number) {
  const query : LocationQueryRaw = {}
  query.id = String(id)

  router.push({
    path: '/academic/student',
    query
  })
}

function getAcademicStatus (status: string) {
  let color = 'primary'
  switch (status) {
    case 'Not studying': {
      color = 'secondary'
      break
    }
    case 'Graduated': {
      color = 'success'
      break
    }
  }

  return color
}
</script>

<style scoped>
.student-tooltip {
  position: absolute;
  z-index: 999;
  display: none;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  width: 200px;
  pointer-events: none;

  .student-image {
    width: 100%;
    height: 100%;
    min-height: 250px;
    object-fit: cover;
  }
}
</style>
