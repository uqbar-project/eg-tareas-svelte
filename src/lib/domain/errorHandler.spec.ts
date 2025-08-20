import { describe, expect, it, vi } from 'vitest'
import { showError } from './errorHandler'

vi.mock('$lib/components/toast/toastStore', () => ({
  toasts: { push: vi.fn() },
}))

import { toasts } from '$lib/components/toast/toastStore'

describe('errorHandler', () => {
  it('should handle common errors correctly', () => {
    const error = new Error('Error inesperado')
    showError('Error al crear una tarea', error)

    expect(toasts.push).toHaveBeenCalledWith('Error al crear una tarea. Error inesperado', { type: 'error' })
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

    expect(toasts.push).toHaveBeenCalledWith('Error al crear una tarea. Ocurrió un error, consulte al administrador del sistema.', { type: 'error' })
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

    expect(toasts.push).toHaveBeenCalledWith('Error al crear una tarea. Unexpected server error', { type: 'error' })
  })

  it('should handle unknown errors correctly', () => {
    showError('Error al crear una tarea', {})

    expect(toasts.push).toHaveBeenCalledWith('Error al crear una tarea. Error desconocido', { type: 'error' })
  })
})