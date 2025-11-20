import { beforeEach, describe, expect, it } from 'vitest'
import { Tarea } from './tarea'
import { Usuario } from './usuario'

describe('tarea', () => {
  let tarea: Tarea

  beforeEach(() => {
    tarea = new Tarea()
    tarea.id = 1
    tarea.descripcion = 'Test tarea'
    tarea.porcentajeCumplimiento = 20
    tarea.iteracion = '1'
    tarea.fecha = new Date('2024-06-01')
    tarea.asignatario = new Usuario('Usuario Test')
  })

  it('debe decir si contiene una palabra - caso feliz por descripción', () => {
    expect(tarea.contiene('Test')).toBe(true)
  })

  it('debe decir si contiene una palabra - caso feliz por iteración', () => {
    expect(tarea.contiene('Usu')).toBe(true)
  })

  it('debe decir si contiene una palabra - caso en el que falla', () => {
    expect(tarea.contiene('Best')).toBe(false)
  })

  it('debe decir si contiene una palabra - caso en el que falla porque no tiene descripción', () => {
    tarea.descripcion = ''
    expect(tarea.contiene('Best')).toBe(false)
  })

  it('debe decir si contiene una palabra - caso en el que falla porque no tiene usuario', () => {
    tarea.desasignar()
    expect(tarea.contiene('Best')).toBe(false)
  })

  it('debe decir si cumplió con un porcentaje específico - caso feliz', () => {
    expect(tarea.cumplio(20)).toBe(true)
  })

  it('debe decir si cumplió con un porcentaje específico - caso en el que falla', () => {
    expect(tarea.cumplio(50)).toBe(false)
  })

  it('debe decir si cumplió menos de un porcentaje específico - caso feliz', () => {
    expect(tarea.cumplioMenosDe(50)).toBe(true)
  })

  it('debe decir si cumplió menos de un porcentaje específico - caso en el que falla', () => {
    expect(tarea.cumplioMenosDe(20)).toBe(false)
  })

  it('debe decir si se puede cumplir - caso feliz', () => {
    expect(tarea.sePuedeCumplir()).toBe(true)
  })

  it('debe decir si se puede cumplir - caso en el que falla', () => {
    tarea.porcentajeCumplimiento = 100
    expect(tarea.sePuedeCumplir()).toBe(false)
  })

  it('no se puede cumplir una tarea si no está asignada', () => {
    tarea.asignatario = undefined
    expect(tarea.sePuedeCumplir()).toBe(false)
  })

  it('debe cumplir la tarea', () => {
    tarea.cumplir()
    expect(tarea.porcentajeCumplimiento).toBe(100)
  })

  it('debe desasignar la tarea', () => {
    tarea.desasignar()
    expect(tarea.asignatario).toBeUndefined()
  })

  it('debe decir si se puede desasignar - caso feliz', () => {
    expect(tarea.sePuedeDesasignar()).toBe(true)
  })

  it('debe decir si se puede desasignar - caso en el que falla', () => {
    tarea.porcentajeCumplimiento = 100
    expect(tarea.sePuedeDesasignar()).toBe(false)
  })

  it('debe asignar a un usuario', () => {
    const usuario = new Usuario('Nuevo Usuario')
    tarea.asignarA(usuario)
    expect(tarea.asignatario).toEqual(usuario)
  })

  it('debe decir si está asignado a un usuario - caso feliz', () => {
    const usuario = new Usuario('Usuario Test')
    expect(tarea.estaAsignadoA(usuario)).toBe(true)
  })

  it('debe decir si está asignado a un usuario - caso en el que falla', () => {
    const otroUsuario = new Usuario('Otro Usuario')
    expect(tarea.estaAsignadoA(otroUsuario)).toBe(false)
  })

  it('debe decir si se puede asignar - caso feliz', () => {
    expect(tarea.sePuedeAsignar()).toBe(true)
  })

  it('debe decir si se puede asignar - caso en el que falla', () => {
    tarea.porcentajeCumplimiento = 100
    expect(tarea.sePuedeAsignar()).toBe(false)
  })

  it('debe decir si está cumplida - caso feliz', () => {
    tarea.porcentajeCumplimiento = 100
    expect(tarea.estaCumplida()).toBe(true)
  })

  it('debe decir si está cumplida - caso en el que falla', () => {
    tarea.porcentajeCumplimiento = 50
    expect(tarea.estaCumplida()).toBe(false)
  })

  it('debe decir si está asignada - caso feliz', () => {
    expect(tarea.estaAsignada()).toBe(true)
  })

  it('debe decir si está asignada - caso en el que falla', () => {
    tarea.desasignar()
    expect(tarea.estaAsignada()).toBe(false)
  })

  it('debe convertir a JSON correctamente', () => {
    const json = tarea.toJSON()
    expect(json).toEqual({
      id: 1,
      descripcion: 'Test tarea',
      iteracion: '1',
      fecha: '01/06/2024',
      porcentajeCumplimiento: 20,
      asignadoA: 'Usuario Test'
    })
  })

  it('debe devolver la key de la tarea cuando tiene id', () => {
    expect(tarea.key()).toBe(1)
  })

  it('debe devolver la key de la tarea cuando no tiene id', () => {
    expect(new Tarea().key()).toBe(0)
  })

  it('debe saber si es inválida - caso feliz', () => {
    tarea.descripcion = ''
    tarea.validar()
    expect(tarea.invalid()).toBe(true)
  })

  it('debe saber si es inválida - caso en el que falla', () => {
    tarea.validar()
    expect(tarea.invalid()).toBe(false)
  })

  it('validación incorrecta de descripción', () => {
    tarea.descripcion = ''
    tarea.validar()
    expect(tarea.errors).toEqual([{ field: 'descripcion', message: 'Debe ingresar descripción' }])
  })

  it('validación incorrecta de iteración', () => {
    tarea.iteracion = ''
    tarea.validar()
    expect(tarea.errors).toEqual([{ field: 'iteracion', message: 'Debe ingresar iteración' }])
  })

  it('validación incorrecta de fecha', () => {
    tarea.fecha = undefined
    tarea.validar()
    expect(tarea.errors).toEqual([{ field: 'fecha', message: 'Debe ingresar fecha' }])
  })

  it('validación incorrecta de porcentaje de cumplimiento negativo', () => {
    tarea.porcentajeCumplimiento = -1
    tarea.validar()
    expect(tarea.errors).toEqual([{ field: 'porcentajeCumplimiento', message: 'El porcentaje debe ser positivo' }])
  })

  it('validación incorrecta de porcentaje de cumplimiento superior al rango máximo', () => {
    tarea.porcentajeCumplimiento = 101
    tarea.validar()
    expect(tarea.errors).toEqual([{ field: 'porcentajeCumplimiento', message: 'El porcentaje no puede ser superior a 100' }])
  })
})
