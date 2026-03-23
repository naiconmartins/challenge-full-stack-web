import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import StudentSearchBar from '../StudentSearchBar.vue'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const vuetify = createVuetify({ components, directives })

function mountSearchBar(props: Record<string, unknown> = {}) {
  return mount(StudentSearchBar, {
    props: { modelValue: '', ...props },
    global: { plugins: [vuetify] },
  })
}

describe('StudentSearchBar', () => {
  describe('visual rendering', () => {
    it('renders the search input field', () => {
      const wrapper = mountSearchBar()
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('displays the current modelValue in the input', () => {
      const wrapper = mountSearchBar({ modelValue: 'João Silva' })
      expect(wrapper.find('input').element.value).toBe('João Silva')
    })

    it('renders Pesquisar and Cadastrar Aluno action buttons', () => {
      const wrapper = mountSearchBar()
      const text = wrapper.text()
      expect(text).toContain('Pesquisar')
      expect(text).toContain('Cadastrar Aluno')
    })

    it('passes loading prop to the Pesquisar button when a fetch is in progress', () => {
      const wrapper = mountSearchBar({ loading: true })
      const vBtns = wrapper.findAllComponents(VBtn)
      const pesquisarVBtn = vBtns.find(b => b.text().includes('Pesquisar'))
      expect(pesquisarVBtn?.props('loading')).toBe(true)
    })
  })

  describe('user interactions', () => {
    it('emits "search" when Pesquisar is clicked', async () => {
      const wrapper = mountSearchBar()
      const pesquisarBtn = wrapper.findAll('button').find(b => b.text().includes('Pesquisar'))
      await pesquisarBtn!.trigger('click')
      expect(wrapper.emitted('search')).toHaveLength(1)
    })

    it('emits "search" when Enter is pressed in the input', async () => {
      const wrapper = mountSearchBar()
      await wrapper.find('input').trigger('keyup', { key: 'Enter' })
      expect(wrapper.emitted('search')).toHaveLength(1)
    })

    it('emits "create" when Cadastrar Aluno is clicked', async () => {
      const wrapper = mountSearchBar()
      const cadastrarBtn = wrapper.findAll('button').find(b => b.text().includes('Cadastrar'))
      await cadastrarBtn!.trigger('click')
      expect(wrapper.emitted('create')).toHaveLength(1)
    })

    it('emits "update:modelValue" when the user types', async () => {
      const wrapper = mountSearchBar({ modelValue: '' })
      await wrapper.find('input').setValue('Maria')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })
})
