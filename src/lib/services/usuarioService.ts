import { Usuario, type UsuarioJSON } from '$lib/domain/usuario'
import { getAxiosData } from './common'
import { REST_SERVER_URL } from './configuration'
import axios from 'axios'

class UsuarioService {

  async getAsignatarios() {
    const queryTareas = () => axios.get<UsuarioJSON[]>(REST_SERVER_URL + '/usuarios')
    return (await getAxiosData(queryTareas))
      .map(usuarioJson => Usuario.fromJSON(usuarioJson.nombre))
      .filter(usuario => usuario !== null)
  }

}

export const usuarioService = new UsuarioService()