<template>
  <div class="flex h-screen overflow-hidden">
    <div class="hidden md:block w-1/2 shrink-0">
      <v-img src="@/assets/2148213818.webp" cover height="100vh" />
    </div>

    <div
      class="w-full md:w-1/2 flex items-center justify-center bg-white overflow-y-auto"
    >
      <v-sheet
        width="100%"
        max-width="440"
        theme="light"
        class="px-6 px-sm-10 py-10"
        elevation="0"
      >
        <h1 class="text-2xl font-medium mb-1">Módulo Acadêmico</h1>
        <p class="text-base text-medium text-slate-600 mb-8">
          Informe suas credenciais para continuar
        </p>

        <v-form ref="formRef" @submit.prevent="handleLogin">
          <v-text-field
            v-model="form.email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            :rules="emailRules"
            :error-messages="fieldErrors.email"
            :disabled="isLoading"
            autocomplete="email"
            class="mb-2"
          />

          <v-text-field
            v-model="form.password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="
              showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            variant="outlined"
            :rules="passwordRules"
            :error-messages="fieldErrors.password"
            :disabled="isLoading"
            autocomplete="current-password"
            class="mb-4"
            @click:append-inner="showPassword = !showPassword"
          />

          <div v-if="errorMessage" class="text-center bg-white mb-6 text-[#FF0545] p-0">
            {{ errorMessage }}
          </div>

          <v-btn
            type="submit"
            color="#5865f2"
            variant="flat"
            size="large"
            block
            :loading="isLoading"
            :disabled="isLoading"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-sheet>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoginForm } from "@/composables/auth/useLoginForm";

const {
  formRef,
  form,
  fieldErrors,
  showPassword,
  errorMessage,
  isLoading,
  emailRules,
  passwordRules,
  handleLogin,
} = useLoginForm();
</script>
