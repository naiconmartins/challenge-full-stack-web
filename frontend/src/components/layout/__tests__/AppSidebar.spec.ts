import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { VApp } from 'vuetify/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createRouter, createWebHashHistory } from 'vue-router'
import AppSidebar from '../AppSidebar.vue'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const mocks = vi.hoisted(() => ({
  logout: vi.fn().mockResolvedValue(undefined),
  push: vi.fn(),
}))

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({ logout: mocks.logout }),
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return { ...actual, useRouter: () => ({ push: mocks.push }) }
})

const vuetify = createVuetify({ components, directives })

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/login', name: 'login', component: { template: '<div />' } },
  ],
})

function mountSidebar() {
  const Wrapper = {
    components: { AppSidebar, VApp },
    template: '<VApp><AppSidebar /></VApp>',
  }
  const wrapper = mount(Wrapper, {
    global: { plugins: [vuetify, router] },
  })
  return wrapper.findComponent(AppSidebar)
}

describe('AppSidebar', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('visual rendering', () => {
    it('renders "Módulo Acadêmico" title', () => {
      const wrapper = mountSidebar()
      expect(wrapper.text()).toContain('Módulo Acadêmico')
    })

    it('renders the "Alunos" navigation item', () => {
      const wrapper = mountSidebar()
      expect(wrapper.text()).toContain('Alunos')
    })

    it('renders the "Sair" logout item', () => {
      const wrapper = mountSidebar()
      expect(wrapper.text()).toContain('Sair')
    })
  })

  describe('logout', () => {
    it('calls authStore.logout() when Sair is clicked', async () => {
      const wrapper = mountSidebar()
      const listItems = wrapper.findAll('.v-list-item')
      const logoutItem = listItems.find(item => item.text().includes('Sair'))
      await logoutItem!.trigger('click')
      await flushPromises()
      expect(mocks.logout).toHaveBeenCalledOnce()
    })

    it('redirects to login after logout', async () => {
      const wrapper = mountSidebar()
      const listItems = wrapper.findAll('.v-list-item')
      const logoutItem = listItems.find(item => item.text().includes('Sair'))
      await logoutItem!.trigger('click')
      await flushPromises()
      expect(mocks.push).toHaveBeenCalledWith({ name: 'login' })
    })

    it('calls logout before redirecting', async () => {
      const callOrder: string[] = []
      mocks.logout.mockImplementation(() => { callOrder.push('logout'); return Promise.resolve() })
      mocks.push.mockImplementation(() => callOrder.push('push'))

      const wrapper = mountSidebar()
      const listItems = wrapper.findAll('.v-list-item')
      const logoutItem = listItems.find(item => item.text().includes('Sair'))
      await logoutItem!.trigger('click')
      await flushPromises()

      expect(callOrder).toEqual(['logout', 'push'])
    })
  })
})
