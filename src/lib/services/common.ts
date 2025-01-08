import type { AxiosResponse } from 'axios'

export const getAxiosData = async <T>(query: () => Promise<AxiosResponse<T>>): Promise<T> => {
  const response = await query()
  if (response.status !== 200) throw new Error('Error al obtener información del backend.')
  return response.data
}