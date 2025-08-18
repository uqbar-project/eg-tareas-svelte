import { describe, expect, it } from 'vitest'
import { getAxiosData } from './common'
import type { UsuarioJSON } from '$lib/domain/usuario'
import type { AxiosResponse } from 'axios'

describe('getAxiosData', () => {
  it('should return data from a successful response', async () => {
    const result = await getAxiosData<UsuarioJSON>(() => Promise.resolve({
      status: 200,
      data: {
        id: 1,
        nombre: 'Fernando'
      },
    } as unknown as AxiosResponse))
    expect(result).toEqual({
      id: 1,
      nombre: 'Fernando'
    })
  })

  it('should throw an exception when status != 200', async () => {
    await expect(getAxiosData<UsuarioJSON>(() => Promise.resolve({
      status: 400,
      message: 'You should pass a non-empty string',
    } as unknown as AxiosResponse))).rejects.toThrow('You should pass a non-empty string')
  })
})