import { Tarea, type TareaJSON } from '../domain/tarea'
import { getAxiosData } from './common'
import { REST_SERVER_URL } from './configuration'
import axios from 'axios'

class TareaService {

  async todasLasTareas() {
    const queryTareas = () => axios.get<TareaJSON[]>(REST_SERVER_URL + '/tareas')
    return (await getAxiosData(queryTareas)).map(Tarea.fromJson)
  }

  async getTareaById(id: number) {
    const queryById = () => axios.get<TareaJSON>(REST_SERVER_URL + '/tareas/' + id)
    const tareaJson = await getAxiosData(queryById)
    return Tarea.fromJson(tareaJson)
  }

  async actualizarTarea(tarea: Tarea) {
    return axios.put<TareaJSON>(REST_SERVER_URL + '/tareas/' + tarea.id, tarea.toJSON())
  }

  async crearTarea(tarea: Tarea) {
    return axios.post(REST_SERVER_URL + '/tareas', tarea.toJSON())
  }

  // BUGAZO!!! Cambiarlo por id
  async eliminarTarea(tarea: Tarea) {
    return axios.delete(REST_SERVER_URL + '/tareas/' + tarea.descripcion)
  }

}

export const tareaService = new TareaService()