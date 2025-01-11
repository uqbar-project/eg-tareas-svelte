import { toast } from '@zerodevx/svelte-toast'

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
  toast.push(`${operation}. ${getErrorMessage(error)}`, {
    theme: {
      '--toastBackground': 'darkred',
      '--toastColor': 'white',
      '--toastBarBackground': 'lightgray',
      '--toastWidth': '100%',
    }
  })

}