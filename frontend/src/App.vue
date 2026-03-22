<template>
  <v-app>
    <RouterView />

    <v-snackbar v-model="visible" :color="color" :timeout="3000" location="top">
      <span class="font-semibold">{{ message }}</span>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { useNotification } from '@/composables/shared/useNotification'

const { message, visible, color } = useNotification()
</script>
