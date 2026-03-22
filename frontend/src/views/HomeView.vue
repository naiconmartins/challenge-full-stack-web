<template>
  <v-layout class="h-screen overflow-hidden">
    <AppSidebar />

    <v-main class="bg-slate-50 overflow-y-auto pt-20">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-slate-800">Alunos</h1>
          <p class="text-base text-slate-500 mt-1">Gerencie os cadastros de alunos da instituição</p>
        </div>

        <v-card rounded="lg" elevation="0" class="bg-white border border-slate-200 p-4 mb-4">
          <StudentSearchBar
            v-model="searchTerm"
            :loading="isLoading"
            @search="search"
            @clear="onClear"
            @create="goToCreate"
          />
        </v-card>

        <v-card rounded="lg" elevation="0" class="border border-slate-200">
          <StudentTable
            :students="students"
            :loading="isLoading"
            :error="error"
            :current-page="currentPage"
            :per-page="perPage"
            :last-page="lastPage"
            @edit="goToEdit"
            @delete="openDeleteDialog"
            @page-change="changePage"
          />
        </v-card>
      </div>
    </v-main>

    <StudentDeleteDialog
      v-model="deleteDialog"
      :student="selectedStudent"
      :loading="isDeleting"
      @confirm="confirmDelete(() => fetchStudents())"
      @cancel="closeDeleteDialog"
    />
  </v-layout>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import StudentSearchBar from '@/components/students/StudentSearchBar.vue'
import StudentTable from '@/components/students/StudentTable.vue'
import StudentDeleteDialog from '@/components/students/StudentDeleteDialog.vue'
import { useStudentList } from '@/composables/students/useStudentList'
import { useStudentActions } from '@/composables/students/useStudentActions'
import type { Student } from '@/types/student'

const router = useRouter()

const {
  students,
  isLoading,
  error,
  searchTerm,
  currentPage,
  perPage,
  lastPage,
  fetchStudents,
  search,
  changePage,
} = useStudentList()

const {
  deleteDialog,
  selectedStudent,
  isDeleting,
  openDeleteDialog,
  closeDeleteDialog,
  confirmDelete,
} = useStudentActions()

onMounted(() => fetchStudents())

function onClear(): void {
  searchTerm.value = ''
  fetchStudents()
}

function goToCreate(): void {
  router.push({ name: 'student-create' })
}

function goToEdit(student: Student): void {
  router.push({ name: 'student-edit', params: { id: student.id } })
}
</script>
