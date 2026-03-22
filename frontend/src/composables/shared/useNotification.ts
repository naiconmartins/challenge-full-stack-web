import { ref } from 'vue'

const message = ref('')
const visible = ref(false)
const color = ref('#00B8BF')

export function useNotification() {
  function notify(msg: string, notificationColor = '#00B8BF') {
    message.value = msg
    color.value = notificationColor
    visible.value = true
  }

  return { message, visible, color, notify }
}
