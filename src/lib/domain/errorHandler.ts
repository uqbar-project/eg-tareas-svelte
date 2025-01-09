// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data && error.response.data.status < 500 && error.response.data.message) {
    return error.response.data.message
  } else if (error.message) {
    return error.message
  } else {
    return 'Error desconocido'
  }
}