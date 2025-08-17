import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import Page from './+page.svelte'
import { Tarea } from '$lib/domain/tarea'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

import { goto } from '$app/navigation'
import { Usuario } from '$lib/domain/usuario'
import { REST_SERVER_URL } from '$lib/services/configuration'
import { tick } from 'svelte'

vi.mock('axios')
vi.mock('$lib/domain/errorHandler', () => ({
  showError: vi.fn()
}))

import { showError } from '$lib/domain/errorHandler'

describe('Crear una nueva tarea', () => {
  it('al iniciar la página debe mostrar una tarea en blanco y las acciones correspondientes', async () => { 
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea: new Tarea(),
          asignatarios: [],
          nuevaTarea: true,
        },
      }
    })

    const matchValue = (value: string, testid: string) => expect((getByTestId(testid) as HTMLInputElement).value).toBe(value)
    matchValue('', 'descripcion')
    matchValue('', 'iteracion')
    matchValue('', 'asignatario')
    matchValue('', 'fecha')
    matchValue('0', 'porcentajeCumplimiento')

    const botonCrear = getByTestId('guardar')
    expect(botonCrear.textContent).toBe('Crear')
    expect(getByTestId('titulo').textContent).toBe('Crear Tarea')
  })

  it('al hacer click en el botón "Volver" debe navegar a la página principal de tareas', async () => {
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea: new Tarea(),
          asignatarios: [],
          nuevaTarea: true,
        },
      }
    })

    const botonVolver = getByTestId('volver')
    await userEvent.click(botonVolver)

    expect(goto).toHaveBeenCalledWith('/')
  })

  it('si la tarea tiene errores de validación al hacer click en el botón "Guardar" debe mostrarlos', async () => {
    const tarea = Object.assign(new Tarea(), { porcentajeCumplimiento: -1 })
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea,
          asignatarios: [],
          nuevaTarea: true,
        },
      }
    })

    const botonGuardar = getByTestId('guardar')
    await userEvent.click(botonGuardar)

    expect(getByTestId('error-field-descripcion').textContent).toBe('Debe ingresar descripción')
    expect(getByTestId('error-field-iteracion').textContent).toBe('Debe ingresar iteración')
    expect(getByTestId('error-field-porcentajeCumplimiento').textContent).toBe('El porcentaje debe ser positivo')
  })

  it('si la tarea está ok al hacer click en el botón "Guardar" debe enviarla al backend', async () => {
    const asignatario = new Usuario('Fernando')
    const tarea = Object.assign(new Tarea(), { porcentajeCumplimiento: 50, descripcion: 'Tarea de prueba', iteracion: '1', fecha: new Date('2025-02-03'), asignatario })
    vi.mocked(axios.post).mockResolvedValue({ data: tarea, status: 200 })
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea: new Tarea(),
          asignatarios: [asignatario, new Usuario('Beatriz')],
          nuevaTarea: true,
        },
      }
    })

    const type = async (testid: string, value: string) => {
      const input = getByTestId(testid) as HTMLInputElement
      await userEvent.clear(input)
      await userEvent.type(input, value)
    }
    await type('descripcion', 'Tarea modificada de prueba')
    await type('iteracion', '1')
    await userEvent.selectOptions(getByTestId('asignatario'), 'Fernando')
    await type('fecha', '2025-02-03')
    await type('porcentajeCumplimiento', '50')

    await tick()

    const botonGuardar = getByTestId('guardar')
    await userEvent.click(botonGuardar)

    expect(axios.post).toHaveBeenCalledWith(REST_SERVER_URL + '/tareas', {
      descripcion: 'Tarea modificada de prueba',
      iteracion: '1',
      fecha: '03/02/2025',
      porcentajeCumplimiento: 50,
      asignadoA: 'Fernando',
    })
  })
})

describe('Actualizar una nueva tarea', () => {
  let asignatario: Usuario
  let tarea: Tarea

  beforeEach(() => {
    asignatario = new Usuario('Julián')
    tarea = Object.assign(new Tarea(), { porcentajeCumplimiento: 50, descripcion: 'Tarea de prueba', iteracion: '1', fecha: new Date('2025-02-03'), asignatario })
  })

  it('al iniciar la página debe mostrar la información de la tarea y las acciones correspondientes', async () => { 
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea,
          asignatarios: [asignatario],
          nuevaTarea: false,
        },
      }
    })

    const matchValue = (value: string, testid: string) => expect((getByTestId(testid) as HTMLInputElement).value).toBe(value)
    matchValue('Tarea de prueba', 'descripcion')
    matchValue('1', 'iteracion')
    matchValue('Julián', 'asignatario')
    matchValue('2025-02-03', 'fecha')
    matchValue('50', 'porcentajeCumplimiento')

    const botonGuardar = getByTestId('guardar')
    expect(botonGuardar.textContent).toBe('Actualizar')
    expect(getByTestId('titulo').textContent).toBe('Editar Tarea')
  })

  it('al hacer click en el botón "Volver" debe navegar a la página principal de tareas', async () => {
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea,
          asignatarios: [],
          nuevaTarea: false,
        },
      }
    })

    const botonVolver = getByTestId('volver')
    await userEvent.click(botonVolver)

    expect(goto).toHaveBeenCalledWith('/')
  })

  it('si la tarea tiene errores de validación al hacer click en el botón "Guardar" debe mostrarlos', async () => {
    const tarea = Object.assign(new Tarea(), { porcentajeCumplimiento: 102 })
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea,
          asignatarios: [asignatario],
          nuevaTarea: false,
        },
      }
    })

    const botonGuardar = getByTestId('guardar')
    await userEvent.click(botonGuardar)

    expect(getByTestId('error-field-descripcion').textContent).toBe('Debe ingresar descripción')
    expect(getByTestId('error-field-iteracion').textContent).toBe('Debe ingresar iteración')
    expect(getByTestId('error-field-porcentajeCumplimiento').textContent).toBe('El porcentaje no puede ser superior a 100')
  })

  it('si la tarea está ok al hacer click en el botón "Guardar" debe enviarla al backend', async () => {
    const asignatario = new Usuario('Fernando')
    const tarea = Object.assign(new Tarea(), { id: 5, porcentajeCumplimiento: 50, descripcion: 'Tarea de prueba', iteracion: '1', fecha: new Date('2025-02-03'), asignatario })
    vi.mocked(axios.put).mockResolvedValue({ data: tarea, status: 200 })
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea,
          asignatarios: [asignatario, new Usuario('Beatriz')],
          nuevaTarea: false,
        },
      }
    })

    const inputDescripcion = getByTestId('descripcion') as HTMLInputElement
    await userEvent.clear(inputDescripcion)
    await userEvent.type(inputDescripcion, 'Tarea modificada de prueba')

    // forzamos a que se procesen los cambios
    await tick()

    const botonGuardar = getByTestId('guardar')
    await userEvent.click(botonGuardar)
    expect(axios.put).toHaveBeenCalledWith(REST_SERVER_URL + '/tareas/5', {
      descripcion: 'Tarea modificada de prueba',
      id: 5,
      iteracion: '1',
      fecha: '03/02/2025',
      porcentajeCumplimiento: 50,
      asignadoA: 'Fernando',
    })
  })

  it('si la tarea falla al actualizar debe mostrar un mensaje de error', async () => {
    const asignatario = new Usuario('Fernando')
    const tarea = Object.assign(new Tarea(), { id: 5, porcentajeCumplimiento: 50, descripcion: 'Tarea de prueba', iteracion: '1', fecha: new Date('2025-02-03'), asignatario })
    vi.mocked(axios.put).mockRejectedValue({ data: tarea, status: 500 })
    const { getByTestId } = render(Page, {
      props: {
        data: {
          tarea,
          asignatarios: [asignatario, new Usuario('Beatriz')],
          nuevaTarea: false,
        },
      }
    })

    const inputDescripcion = getByTestId('descripcion') as HTMLInputElement
    await userEvent.clear(inputDescripcion)
    await userEvent.type(inputDescripcion, 'Tarea modificada de prueba')

    // forzamos a que se procesen los cambios
    await tick()

    const botonGuardar = getByTestId('guardar')
    await userEvent.click(botonGuardar)

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Error al actualizar la tarea', expect.anything())
    })
  })

})