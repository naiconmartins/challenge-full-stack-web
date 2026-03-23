import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

export function useAuthProfile() {
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  const userName = computed(() => user.value?.name ?? '')

  async function fetchProfile(): Promise<void> {
    await authStore.fetchMe()
  }

  return {
    userName,
    fetchProfile,
  }
}
