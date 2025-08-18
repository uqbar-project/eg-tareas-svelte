import { Tarea } from '$lib/domain/tarea.js'
import { tareaService } from '$lib/services/tareaService'
import { usuarioService } from '$lib/services/usuarioService'
import { redirect } from '@sveltejs/kit'

export async function load({ params }) {
  try {
    const nuevaTarea = params.tareaId === 'nueva'
    const tarea = nuevaTarea ? 
      new Tarea() :
      await tareaService.getTareaById(+params.tareaId)
    const asignatarios = await usuarioService.getAsignatarios()
    return { tarea, asignatarios, nuevaTarea }
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error al cargar la tarea:', error)
    throw redirect(302, '/')
  }
}