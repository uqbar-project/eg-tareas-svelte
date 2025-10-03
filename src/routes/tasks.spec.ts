import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import Page from './+page.svelte'
import { Tarea } from '$lib/domain/tarea'
import axios from 'axios'
import userEvent from '@testing-library/user-event'

vi.mock('axios')
vi.mock('$lib/domain/errorHandler', () => ({
  showError: vi.fn()
}))
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn().mockResolvedValue(true)
}))

import { invalidate, goto } from '$app/navigation'
import { showError } from '$lib/domain/errorHandler'
import { Usuario } from '$lib/domain/usuario'

const mockTareas: Tarea[] = [
  new Tarea(1,'Test tarea 1','Iteración 1',new Usuario('Marcelo'),new Date('2024-06-01'),100),
  new Tarea(2,'Test tarea 2','Iteración 2',undefined,new Date('2024-06-02'),30),
  new Tarea(3,'Test tarea 3','Iteración 1',new Usuario('Gabriela'),new Date('2024-06-02'),51)
]

const defaultData = { data: { tareas: mockTareas }, params: {} }

describe('Página principal de tareas', () => {
  describe('Carga de tareas', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('debería renderizar la descripción de la lista de tareas', async () => {
      const { getByTestId } = render(Page,defaultData)

      await waitFor(() => {
        expect(getByTestId('title_1').textContent).toBe('Test tarea 1')
        expect(getByTestId('title_2').textContent).toBe('Test tarea 2')
        expect(getByTestId('title_3').textContent).toBe('Test tarea 3')
      })
    })

    it('debería renderizar el nombre del asignado a la tarea', async () => {
      const { getByTestId } = render(Page,defaultData)

      await waitFor(() => {
        expect(getByTestId('description_1').textContent).toBe('Marcelo - 01/06/2024')
        expect(getByTestId('description_2').textContent).toBe('⚪ Sin asignar - 02/06/2024')
        expect(getByTestId('description_3').textContent).toBe('Gabriela - 02/06/2024')
      })
    })

    it('debería renderizar el nombre del asignado a la tarea', async () => {
      const { getByTestId } = render(Page,defaultData)

      await waitFor(() => {
        expect(getByTestId('porcentaje_1').textContent).toBe('✅')
        expect(getByTestId('porcentaje_2').textContent).toBe('⌛ 30 %')
        expect(getByTestId('porcentaje_3').textContent).toBe('51 %')
      })
    })

    it('al cumplir la tarea debe dejarla al 100%', async () => {
      const { getByTestId, rerender } = render(Page,defaultData)    
      const botonCumplir = await waitFor(() => getByTestId('cumplir_3'))
      await userEvent.click(botonCumplir)
      const updated = [
        Object.assign(new Tarea(),mockTareas[0]),
        Object.assign(new Tarea(),mockTareas[1]),
        Object.assign(new Tarea(),mockTareas[2], {porcentajeCumplimiento: 100} )
      ]
      await rerender({ data: { tareas: updated }, params: {} })
      await waitFor(() => {
        expect(getByTestId('porcentaje_3').textContent).toBe('✅')
        expect(invalidate).toHaveBeenCalledWith('tareas:list')
      })
    })

    it('al cumplir la tarea si falla debe mostrar el mensaje de error', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ data: mockTareas, status: 200 })
      vi.mocked(axios.put).mockRejectedValue({ error: { response: { data: { message: 'Unexpected error'}}}, status: 400 })
      const { getByTestId } = render(Page,defaultData)
      
      const botonCumplir = await waitFor(() => getByTestId('cumplir_3'))
      await userEvent.click(botonCumplir)
      await waitFor(() => {
        expect(getByTestId('porcentaje_3').textContent).toBe('51 %')
        expect(showError).toHaveBeenCalledWith('Error al cumplir la tarea', expect.anything())
      })
    })

    it('al eliminar la tarea debe desaparecer de la lista', async () => {

      vi.mocked(axios.delete).mockResolvedValue({ data: mockTareas[2], status: 200 })
      const { getByTestId, queryByTestId, rerender} = render(Page, defaultData)
      
      const botonCumplir = await waitFor(() => getByTestId('eliminar_3'))
      await userEvent.click(botonCumplir)
      const updated = [
        Object.assign(new Tarea(),mockTareas[0]),
        Object.assign(new Tarea(),mockTareas[1]),
      ]
      await rerender({ data: { tareas: updated }, params: {} })
      await waitFor(() => {
        expect(queryByTestId('title_3')).toBeNull()
        expect(invalidate).toHaveBeenCalledWith('tareas:list')
      })
    })

    it('al eliminar la tarea si falla debe mostrar el mensaje de error', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ data: mockTareas, status: 200 })
      vi.mocked(axios.delete).mockRejectedValue({ error: { response: { data: { message: 'Unexpected error'}}}, status: 400 })
      const { getByTestId } = render(Page, defaultData)
      
      const botonCumplir = await waitFor(() => getByTestId('eliminar_3'))
      await userEvent.click(botonCumplir)
      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith('Error al eliminar la tarea', expect.anything())
      })
    })

    it('al crear una tarea debe navegar a la página de creación', async () => { 
      const { getByTestId } = render(Page, defaultData)

      const botonCrear = await waitFor(() => getByTestId('crear_tarea'))
      await userEvent.click(botonCrear)
      expect(vi.mocked(goto)).toHaveBeenCalledWith('/tarea/nueva')
    })

    it('al editar una tarea debe navegar a la página de edición', async () => { 
      const { getByTestId } = render(Page, defaultData)

      const botonCrear = await waitFor(() => getByTestId('editar_tarea_3'))
      await userEvent.click(botonCrear)
      expect(vi.mocked(goto)).toHaveBeenCalledWith('/tarea/3')
    })
  })
})
