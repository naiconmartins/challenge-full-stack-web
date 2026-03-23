<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    :temporary="isMobile"
    :permanent="!isMobile"
    color="#1B2731"
    aria-label="Navegação principal"
  >
    <div class="flex items-center justify-between px-4 py-4">
      <span v-if="!rail" class="text-white text-base font-semibold tracking-wide">
        Módulo Acadêmico
      </span>
      <v-btn
        v-if="!isMobile"
        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        :aria-label="rail ? 'Expandir menu' : 'Recolher menu'"
        variant="text"
        size="small"
        @click="rail = !rail"
      />
      <v-btn
        v-else
        icon="mdi-close"
        aria-label="Fechar menu"
        variant="text"
        color="slate"
        size="small"
        @click="drawer = false"
      />
    </div>

    <v-list nav density="compact" class="mt-2 bg-[#1B2731]">
      <v-list-item
        :to="{ name: 'home' }"
        prepend-icon="mdi-account-group-outline"
        value="students"
        color="white"
        rounded="lg"
        class="text-white"
        @click="isMobile && (drawer = false)"
      >
        <template #title>
          <span class="text-base">Alunos</span>
        </template>
      </v-list-item>
    </v-list>

    <template #append>
      <v-list nav density="compact" class="bg-[#1B2731] mb-2">
        <v-list-item
          prepend-icon="mdi-logout"
          rounded="lg"
          class="text-white"
          @click="handleLogout"
        >
          <template #title>
            <span class="text-base">Sair</span>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar v-if="isMobile" flat color="white" class="border-b border-slate-200">
    <v-app-bar-nav-icon aria-label="Abrir menu" @click="drawer = !drawer" />
    <v-toolbar-title class="text-slate-900 text-base font-semibold">
      Módulo Acadêmico
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth.store'

const { mobile: isMobile } = useDisplay()
const router = useRouter()
const authStore = useAuthStore()

const drawer = ref(true)
const rail = ref(false)

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>
