<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="students"
      :loading="loading"
      :items-per-page="perPage"
      hide-default-footer
      class="rounded-lg border border-slate-200"
    >
      <template #top>
        <div v-if="error" class="px-4 py-2">
          <v-alert type="error" variant="tonal" color="#FF002B" density="compact" class="text-sm">
            {{ error }}
          </v-alert>
        </div>
      </template>

      <template #item.cpf="{ item }">
        <span class="text-sm text-slate-800">{{ formatCpf(item.cpf) }}</span>
      </template>

      <template #item.ra="{ item }">
        <span class="text-sm text-slate-800">{{ item.ra }}</span>
      </template>

      <template #item.name="{ item }">
        <span class="text-sm text-slate-800">{{ item.name }}</span>
      </template>

      <template #item.email="{ item }">
        <span class="text-sm text-slate-800">{{ item.email }}</span>
      </template>

      <template #item.actions="{ item }">
        <div class="flex items-center justify-center gap-1">
          <v-btn
            icon="mdi-pencil-outline"
            :aria-label="`Editar aluno ${item.name}`"
            variant="text"
            size="small"
            color="#1B2731"
            @click="emit('edit', item)"
          />
          <v-btn
            icon="mdi-trash-can-outline"
            :aria-label="`Excluir aluno ${item.name}`"
            variant="text"
            size="small"
            color="#FF0545"
            @click="emit('delete', item)"
          />
        </div>
      </template>

      <template #no-data>
        <div class="flex flex-col items-center py-12 text-slate-400">
          <v-icon icon="mdi-account-off-outline" size="48" class="mb-3 opacity-40" />
          <p class="text-base font-medium">Nenhum aluno encontrado</p>
          <p class="text-sm mt-1">Tente ajustar os filtros ou cadastre um novo aluno.</p>
        </div>
      </template>

      <template #loading>
        <div class="flex items-center justify-center py-12">
          <v-progress-circular indeterminate color="#5865f2" />
        </div>
      </template>
    </v-data-table>

    <div v-if="lastPage > 1" class="flex justify-center mt-4">
      <v-pagination
        :model-value="currentPage"
        :length="lastPage"
        :total-visible="5"
        color="#5865f2"
        @update:model-value="emit('page-change', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Student } from '@/types/student'

defineProps<{
  students: Student[]
  loading?: boolean
  error?: string | null
  currentPage: number
  perPage: number
  lastPage: number
}>()

const emit = defineEmits<{
  edit: [student: Student]
  delete: [student: Student]
  'page-change': [page: number]
}>()

const headers = [
  { title: 'Reg. Acadêmico (RA)', key: 'ra', sortable: false },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'E-mail', key: 'email', sortable: false },
  { title: 'CPF', key: 'cpf', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center' as const },
]

function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
</script>
