import { describe, expect, it, vi } from 'vitest'
import { showError } from './errorHandler'

vi.mock('@zerodevx/svelte-toast', () => ({
  toast: { push: vi.fn() },
}))

import { toast } from '@zerodevx/svelte-toast'

describe('errorHandler', () => {
  it('should handle common errors correctly', () => {
    const error = new Error('Error inesperado')
    showError('Error al crear una tarea', error)

    expect(toast.push).toHaveBeenCalledWith('Error al crear una tarea. Error inesperado', expect.any(Object))
  })

  it('should handle axios 5xx errors correctly', () => {
    showError('Error al crear una tarea', {
      response: {
        data: {
          status: 500,
          message: 'Unexpected server error',
        }
      },
    })

    expect(toast.push).toHaveBeenCalledWith('Error al crear una tarea. Ocurrió un error, consulte al administrador del sistema.', expect.any(Object))
  })

  it('should handle axios 4xx errors correctly', () => {
    showError('Error al crear una tarea', {
      response: {
        data: {
          status: 400,
          message: 'Unexpected server error',
        }
      },
    })

    expect(toast.push).toHaveBeenCalledWith('Error al crear una tarea. Unexpected server error', expect.any(Object))
  })

  it('should handle unknown errors correctly', () => {
    showError('Error al crear una tarea', {})

    expect(toast.push).toHaveBeenCalledWith('Error al crear una tarea. Error desconocido', expect.any(Object))
  })
})