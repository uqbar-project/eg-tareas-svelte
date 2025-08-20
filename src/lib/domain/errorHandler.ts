import { toasts } from '$lib/components/toast/toastStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    return error.response.data.status < 500 ? error.response.data.message : 'Ocurrió un error, consulte al administrador del sistema.'
  } else if (error.message) {
    return error.message
  } else {
    return 'Error desconocido'
  }
}

export const showError = (operation: string, error: unknown) => {
  // eslint-disable-next-line no-console
  console.info(operation, error)
  toasts.push(`${operation}. ${getErrorMessage(error)}`, { type: 'error' })
}