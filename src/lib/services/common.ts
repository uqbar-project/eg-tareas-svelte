import type { AxiosResponse } from 'axios'

export const getAxiosData = async <T>(query: () => Promise<AxiosResponse<T>>): Promise<T> => {
  const response = await query()
  if (response.status !== 200) {
    // eslint-disable-next-line no-console
    console.error(response)
    throw new Error('Error al obtener información del backend.')
  }
  return response.data
}
