import { describe, expect, it, vi } from 'vitest'
import { load } from './+page'

vi.mock('axios')

const mockedAsignatarios = [
  { id: 1, nombre: 'Usuario 1' },
  { id: 2, nombre: 'Usuario 2' },
]

vi.mock('@sveltejs/kit', () => ({
  redirect: vi.fn()
}))

import { redirect } from '@sveltejs/kit'
import axios from 'axios'
import { Usuario } from '$lib/domain/usuario'

describe('Editar una tarea existente', () => {
  it('para una nueva tarea crea una nueva tarea como parte de la información', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockedAsignatarios, status: 200 })
    const { tarea, asignatarios, nuevaTarea } = await load({ params: { tareaId: 'nueva' } } as unknown as Parameters<typeof load>[0])
    expect(tarea.descripcion).toBe('')
    expect(asignatarios).toEqual([
      new Usuario('Usuario 1'),
      new Usuario('Usuario 2'),
    ])
    expect(nuevaTarea).toBe(true)
  })

  it('para una tarea existente pasa la información de dicha tarea', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: {
      id: 1,
      descripcion: 'Test tarea 1',
      asignadoA: 'Usuario 1',
      fecha: '01/06/2024',
      porcentajeCumplimiento: 100,
      iteracion: 'Iteración 1',
    }, status: 200 })
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockedAsignatarios, status: 200 })
    
    const { tarea, asignatarios, nuevaTarea } = await load({ params: { tareaId: '1' } } as unknown as Parameters<typeof load>[0])
    expect(tarea.descripcion).toBe('Test tarea 1')
    expect(asignatarios).toEqual([
      new Usuario('Usuario 1'),
      new Usuario('Usuario 2'),
    ])
    expect(nuevaTarea).toBe(false)
  })

  
  it('para una tarea inexistente redirige a la página principal', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce({ status: 404, message: 'Task not found' })
    await expect(load({ params: { tareaId: '999' } } as unknown as Parameters<typeof load>[0])).rejects.toEqual(redirect(302, '/'))
  })

})