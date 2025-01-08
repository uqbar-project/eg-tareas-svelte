<script lang="ts">
  import './main.css'
  import type { Tarea } from '$lib/domain/tarea'
  import { tareaService } from '$lib/services/tareaService'

  let tareas = $state<Tarea[]>([])
  const buscarTareas = async () => {
    tareas = await tareaService.todasLasTareas()
  }

  buscarTareas()
</script>

Tareas: {tareas.length}

<div class="tareas-table">
{#each tareas as tarea}
  <div class="row">
    <div class="column">
      <span class="title">{tarea.descripcion}</span>
       <span class="description">{tarea.asignatario?.nombre ?? '⚪ Sin asignar'} - {tarea.fechaString()}</span>
    </div>
    <div>
      <div class="porcentaje">
        {tarea.estaCumplida() ? '✅' : (tarea.cumplioMenosDe(50) ? '⌛ ' : '') + tarea.porcentajeCumplimiento + ' %'} 
      </div>
    </div>
    <div></div>
  </div>
  <hr aria-colspan="3">
{/each}
</div>