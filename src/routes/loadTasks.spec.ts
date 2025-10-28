import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/svelte'
import { load } from './+page'

vi.mock('$lib/domain/errorHandler', () => ({
  showError: vi.fn()
}))

vi.mock('axios')

import { Tarea } from '$lib/domain/tarea'
import { Usuario } from '$lib/domain/usuario'
import axios from 'axios'

const mockTareas = [
  new Tarea(1, 'Test tarea 1', 'Iteración 1', new Usuario('Marcelo'), new Date('2024-06-01'), 100),
  new Tarea(2, 'Test tarea 2', 'Iteración 2', undefined, new Date('2024-06-02'), 30),
]

describe('+page.ts load', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve tareas cuando el service responde OK', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockTareas.map(tarea=> tarea.toJSON()), status: 200 })
    const { tareas } = await load({depends: vi.fn(), params:{ }} as unknown as Parameters<typeof load>[0])
    await waitFor(() => {
      expect(tareas.length).toEqual(2)
    })
  })

  it('en error muestra showError y devuelve arreglo vacío', async () => {
    const err = new Error('network')
    vi.mocked(axios.get).mockRejectedValue(err)

    const { tareas, error } = await load({depends: vi.fn(), params:{}} as unknown as Parameters<typeof load>[0])

    expect(tareas).toEqual([])
    expect(error).toEqual(err)
  })
})
