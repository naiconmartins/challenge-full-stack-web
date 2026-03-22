import type { App } from 'vue'

import vuetify from './vuetify'
import router from '@/router'
import { createPinia } from 'pinia'

export function registerPlugins (app: App) {
  app.use(createPinia())
  app.use(vuetify)
  app.use(router)
}
