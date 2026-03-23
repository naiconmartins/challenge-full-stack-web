<template>
  <v-dialog v-model="model" max-width="420" persistent>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 pt-5 px-6">
        <v-icon icon="mdi-alert-circle-outline" color="#FF002B" />
        <span class="text-xl font-medium">Confirmar exclusão</span>
      </v-card-title>

      <v-card-text class="px-6 pb-2">
        <p class="text-base">
          Tem certeza que deseja excluir o aluno
          <span class="font-semibold">{{ student?.name }}</span>?
          Esta ação não pode ser desfeita.
        </p>
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          color="#FF002B"
          density="compact"
          class="mt-3 text-sm"
        >
          {{ error }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="px-6 pb-5 gap-2">
        <v-spacer />
        <v-btn variant="text" color="#64748b" :disabled="loading" @click="emit('cancel')">
          <span class="text-base font-medium">Cancelar</span>
        </v-btn>
        <v-btn variant="flat" color="#FF002B" :loading="loading" @click="emit('confirm')">
          <span class="text-base font-medium">Excluir</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Student } from '@/types/student'

defineProps<{
  student?: Student | null
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const model = defineModel<boolean>()
</script>
