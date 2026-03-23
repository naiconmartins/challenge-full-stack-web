<template>
  <v-layout class="h-screen overflow-hidden">
    <AppSidebar />

    <v-main class="bg-slate-50 overflow-y-auto">
      <header class="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <nav
          class="max-w-6xl mx-auto flex min-h-16 items-center justify-end gap-4 px-6"
          aria-label="Barra superior do dashboard"
        >
          <div class="flex items-center gap-3 pl-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {{ userName.charAt(0).toUpperCase() || 'U' }}
            </div>
            <p class="text-sm font-medium text-slate-700">
              {{ userName ? `Olá, ${userName}` : 'Olá, usuário' }}
            </p>
          </div>
        </nav>
      </header>

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
      :error="deleteError"
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
import { useAuthProfile } from '@/composables/auth/useAuthProfile'
import { useStudentList } from '@/composables/students/useStudentList'
import { useStudentActions } from '@/composables/students/useStudentActions'
import type { Student } from '@/types/student'

const router = useRouter()
const { userName, fetchProfile } = useAuthProfile()

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
  deleteError,
  openDeleteDialog,
  closeDeleteDialog,
  confirmDelete,
} = useStudentActions()

onMounted(async () => {
  await Promise.allSettled([
    fetchStudents(),
    fetchProfile(),
  ])
})

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
