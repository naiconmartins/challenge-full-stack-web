<template>
  <div class="flex flex-col md:flex-row items-center gap-3">
    <v-text-field
      v-model="model"
      placeholder="Buscar por nome, CPF ou RA..."
      aria-label="Buscar alunos"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      hide-details
      clearable
      class="flex-1 min-w-0 w-full"
      @keyup.enter="emit('search')"
      @click:clear="emit('clear')"
    />

    <div class="flex gap-2 shrink-0 w-full md:w-auto">
      <v-btn color="#FF002B" variant="flat" prepend-icon="mdi-magnify" :loading="loading" class="flex-1 md:flex-none" @click="emit('search')">
        <span class="text-sm font-medium">Pesquisar</span>
      </v-btn>

      <v-btn color="#FF002B" variant="outlined" prepend-icon="mdi-plus" class="flex-1 md:flex-none" @click="emit('create')">
        <span class="text-sm font-medium">Cadastrar Aluno</span>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: []
  clear: []
  create: []
}>()

const model = defineModel<string>()
</script>
