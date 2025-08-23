import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import Page from './+page.svelte'
import type { TareaJSON } from '$lib/domain/tarea'
import axios from 'axios'
import userEvent from '@testing-library/user-event'

vi.mock('axios')
vi.mock('$lib/domain/errorHandler', () => ({
  showError: vi.fn()
}))

import { showError } from '$lib/domain/errorHandler'
import { goto } from '$app/navigation'

const mockTareas: TareaJSON[] = [
  {
    id: 1,
    descripcion: 'Test tarea 1',
    asignadoA: 'Marcelo',
    fecha: '01/06/2024',
    porcentajeCumplimiento: 100,
    iteracion: 'Iteración 1',
  },
  {
    id: 2,
    descripcion: 'Test tarea 2',
    fecha: '02/06/2024',
    porcentajeCumplimiento: 30,
    iteracion: 'Iteración 2',
  },
  {
    id: 3,
    descripcion: 'Test tarea 3',
    fecha: '02/06/2024',
    porcentajeCumplimiento: 51,
    asignadoA: 'Gabriela',
    iteracion: 'Iteración 1',
  }
]

describe('Página principal de tareas', () => {
  describe('Carga de tareas', () => {
    beforeEach(() => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockTareas, status: 200 })
      vi.mocked(showError).mockClear()
    })

    it('debería renderizar la descripción de la lista de tareas', async () => {
      const { getByTestId } = render(Page)

      await waitFor(() => {
        expect(getByTestId('title_1').textContent).toBe('Test tarea 1')
        expect(getByTestId('title_2').textContent).toBe('Test tarea 2')
        expect(getByTestId('title_3').textContent).toBe('Test tarea 3')
      })
    })

    it('debería renderizar el nombre del asignado a la tarea', async () => {
      const { getByTestId } = render(Page)

      await waitFor(() => {
        expect(getByTestId('description_1').textContent).toBe('Marcelo - 01/06/2024')
        expect(getByTestId('description_2').textContent).toBe('⚪ Sin asignar - 02/06/2024')
        expect(getByTestId('description_3').textContent).toBe('Gabriela - 02/06/2024')
      })
    })

    it('debería renderizar el nombre del asignado a la tarea', async () => {
      const { getByTestId } = render(Page)

      await waitFor(() => {
        expect(getByTestId('porcentaje_1').textContent).toBe('✅')
        expect(getByTestId('porcentaje_2').textContent).toBe('⌛ 30 %')
        expect(getByTestId('porcentaje_3').textContent).toBe('51 %')
      })
    })

    it('al cumplir la tarea debe dejarla al 100%', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ data: mockTareas, status: 200 })
        .mockResolvedValueOnce({ data: [
          { ...mockTareas[0] },
          { ...mockTareas[1] },
          { ...mockTareas[2], porcentajeCumplimiento: 100 }
        ], status: 200 })
      vi.mocked(axios.put).mockResolvedValue({ data: mockTareas[2], status: 200 })
      const { getByTestId } = render(Page)      
      const user = userEvent.setup()
      const botonCumplir = await waitFor(() => getByTestId('cumplir_3'))
      await user.click(botonCumplir)
      await waitFor(() => {
        expect(getByTestId('porcentaje_3').textContent).toBe('✅')
      })
    })

    it('al cumplir la tarea si falla debe mostrar el mensaje de error', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ data: mockTareas, status: 200 })
      vi.mocked(axios.put).mockRejectedValue({ error: { response: { data: { message: 'Unexpected error'}}}, status: 400 })
      const { getByTestId } = render(Page)
      
      const user = userEvent.setup()
      const botonCumplir = await waitFor(() => getByTestId('cumplir_3'))
      await user.click(botonCumplir)
      await waitFor(() => {
        expect(getByTestId('porcentaje_3').textContent).toBe('51 %')
        expect(showError).toHaveBeenCalledWith('Error al cumplir la tarea', expect.anything())
      })
    })

    it('al eliminar la tarea debe desaparecer de la lista', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ data: mockTareas, status: 200 })
        .mockResolvedValueOnce({ data: [{ ...mockTareas[0] }, { ...mockTareas[1] }], status: 200 })
      vi.mocked(axios.delete).mockResolvedValue({ data: mockTareas[2], status: 200 })
      const { getByTestId, queryByTestId } = render(Page)
      
      const user = userEvent.setup()
      const botonCumplir = await waitFor(() => getByTestId('eliminar_3'))
      await user.click(botonCumplir)
      await waitFor(() => {
        expect(queryByTestId('title_3')).toBeNull()
      })
    })

    it('al eliminar la tarea si falla debe mostrar el mensaje de error', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ data: mockTareas, status: 200 })
      vi.mocked(axios.delete).mockRejectedValue({ error: { response: { data: { message: 'Unexpected error'}}}, status: 400 })
      const { getByTestId } = render(Page)
      
      const user = userEvent.setup()
      const botonCumplir = await waitFor(() => getByTestId('eliminar_3'))
      await user.click(botonCumplir)
      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith('Error al eliminar la tarea', expect.anything())
      })
    })

    it('al crear una tarea debe navegar a la página de creación', async () => { 
      const { getByTestId } = render(Page)

      const user = userEvent.setup()
      const botonCrear = await waitFor(() => getByTestId('crear_tarea'))
      await user.click(botonCrear)
      expect(vi.mocked(goto)).toHaveBeenCalledWith('/tarea/nueva')
    })

    it('al editar una tarea debe navegar a la página de edición', async () => { 
      const { getByTestId } = render(Page)

      const user = userEvent.setup()
      const botonCrear = await waitFor(() => getByTestId('editar_tarea_3'))
      await user.click(botonCrear)
      expect(vi.mocked(goto)).toHaveBeenCalledWith('/tarea/3')
    })
  })
})
