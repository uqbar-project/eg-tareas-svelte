import { tareaService } from '$lib/services/tareaService'

export const load = async ({ depends }) => {
  try {
    depends('tareas:list') 
    const tareas = await tareaService.todasLasTareas()
    return { tareas }
  } catch (error) {
    return { tareas: [], error }
  }
}
