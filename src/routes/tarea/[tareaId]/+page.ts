import { Tarea } from '$lib/domain/tarea.js'
import { tareaService } from '$lib/services/tareaService'
import { usuarioService } from '$lib/services/usuarioService'
import { redirect } from '@sveltejs/kit'

export async function load({ params }) {
  const nuevaTarea = params.tareaId === 'nueva'
  const tarea = nuevaTarea ? 
    new Tarea() :
    await tareaService.getTareaById(+params.tareaId)
  const asignatarios = await usuarioService.getAsignatarios()

  if (!tarea) throw redirect(302, '/')

  return { tarea, asignatarios, nuevaTarea }
}