import { tareaService } from '$lib/services/tareaService'
import { usuarioService } from '$lib/services/usuarioService'

export async function load({ params }) {
  const tarea = await tareaService.getTareaById(+params.tareaId)
  const asignatarios = await usuarioService.getAsignatarios()

  return { tarea, asignatarios }
}