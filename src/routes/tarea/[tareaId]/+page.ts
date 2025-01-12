import { Tarea } from '$lib/domain/tarea.js'
import { tareaService } from '$lib/services/tareaService'
import { usuarioService } from '$lib/services/usuarioService'

export async function load({ params }) {
  const nuevaTarea = params.tareaId === 'nueva'
  const tarea = nuevaTarea ? 
    new Tarea() :
    await tareaService.getTareaById(+params.tareaId)
  const asignatarios = await usuarioService.getAsignatarios()

  return { tarea, asignatarios, nuevaTarea }
}