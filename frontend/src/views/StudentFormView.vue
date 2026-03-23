<template>
  <v-layout class="h-screen overflow-hidden">
    <AppSidebar />

    <v-main class="bg-slate-50 overflow-y-auto pt-20">
      <div class="max-w-2xl mx-auto px-6 py-8">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-slate-800">
            {{ isEditMode ? 'Editar Aluno' : 'Cadastrar Aluno' }}
          </h1>
          <p class="text-base text-slate-500 mt-1">
            {{ isEditMode ? 'Atualize os dados do aluno' : 'Preencha os dados para cadastrar um novo aluno' }}
          </p>
        </div>

        <v-card rounded="lg" elevation="0" class="py-10 px-6">
          <div v-if="isFetching" class="flex justify-center py-12">
            <v-progress-circular indeterminate color="#5865f2" />
          </div>

          <div v-else-if="loadFailed" class="py-4">
            <v-alert
              type="error"
              color="#FF002B"
              variant="tonal"
              class="mb-6"
            >
              {{ errorMessage }}
            </v-alert>

            <div class="flex justify-end gap-3">
              <v-btn
                variant="outlined"
                color="#1B2731"
                size="large"
                @click="handleCancel"
              >
                Voltar
              </v-btn>

              <v-btn
                color="#FF002B"
                variant="flat"
                size="large"
                @click="retryLoadStudent"
              >
                Tentar novamente
              </v-btn>
            </div>
          </div>

          <v-form v-else ref="formRef" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <v-text-field
                v-model="form.ra"
                label="Registro Acadêmico (RA)"
                placeholder="Ex: 20210001"
                prepend-inner-icon="mdi-identifier"
                variant="outlined"
                :rules="raRules"
                :error-messages="fieldErrors.ra"
                :disabled="isLoading || isEditMode"
                :readonly="isEditMode"
                class="mb-2"
                @input="form.ra = form.ra.replace(/\D/g, '')"
              />

              <v-text-field
                v-model="form.cpf"
                label="CPF"
                placeholder="Ex: 000.000.000-00"
                prepend-inner-icon="mdi-card-account-details-outline"
                variant="outlined"
                :rules="cpfRules"
                :error-messages="fieldErrors.cpf"
                :disabled="isLoading || isEditMode"
                :readonly="isEditMode"
                class="mb-2"
                @input="form.cpf = maskCpf(form.cpf)"
              />
            </div>

            <v-text-field
              v-model="form.name"
              label="Nome"
              placeholder="Nome completo do aluno"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              :rules="nameRules"
              :error-messages="fieldErrors.name"
              :disabled="isLoading"
              class="mb-2"
            />

            <v-text-field
              v-model="form.email"
              label="E-mail"
              type="email"
              placeholder="aluno@email.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              :rules="emailRules"
              :error-messages="fieldErrors.email"
              :disabled="isLoading"
              class="mb-4"
            />

            <v-alert
              v-if="errorMessage"
              type="error"
              color="#FF002B"
              variant="tonal"
              density="compact"
              class="mb-4 text-sm"
            >
              {{ errorMessage }}
            </v-alert>

            <div class="flex justify-end gap-3">
              <v-btn
                variant="outlined"
                color="#1B2731"
                size="large"
                :disabled="isLoading"
                @click="handleCancel"
              >
                Cancelar
              </v-btn>

              <v-btn
                type="submit"
                color="#FF002B"
                variant="flat"
                size="large"
                :loading="isLoading"
                :disabled="isLoading"
              >
                Salvar
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useStudentForm } from '@/composables/students/useStudentForm'
import { maskCpf } from '@/utils/masks'

const {
  formRef,
  form,
  fieldErrors,
  isEditMode,
  isLoading,
  isFetching,
  loadFailed,
  errorMessage,
  raRules,
  nameRules,
  emailRules,
  cpfRules,
  handleSubmit,
  handleCancel,
  retryLoadStudent,
} = useStudentForm()
</script>
