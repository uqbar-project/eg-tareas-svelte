<script lang="ts">
  import { goto } from '$app/navigation'
  import { showError } from '$lib/domain/errorHandler'
  import type { Tarea } from '$lib/domain/tarea'
  import { tareaService } from '$lib/services/tareaService'
  import './main.css'

  let tareas = $state<Tarea[]>([])
  const buscarTareas = async () => {
    tareas = await tareaService.todasLasTareas()
  }

  buscarTareas()

  const cumplir = async (tarea: Tarea) => {
    try {
      tarea.cumplir()
      await tareaService.actualizarTarea(tarea)
    } catch (error: unknown) {
      showError('Error al cumplir la tarea', error)
    } finally {
      await buscarTareas()
    }
  }

  const editar = (tarea: Tarea) => {
    goto(`/tarea/${tarea.id}`)
  }

  const eliminar = async (tarea: Tarea) => {
    try {
      await tareaService.eliminarTarea(tarea)
      buscarTareas()
    } catch (error: unknown) {
      showError('Error al eliminar la tarea', error)
      await buscarTareas()
    }
  }

  const crearTarea = () => {
    goto('/tarea/nueva')
  }
</script>

<div class="main-title">Tareas de un equipo de desarrollo</div>

<div class="resumen">
  <span>
    <b>Tareas:</b> {tareas.length}
  </span>
  <button onclick={crearTarea} class="crear-tarea" data-testid="crear_tarea">➕ Crear tarea</button>
</div>

<div class="tareas-table">
  <div class="row header">
    <div class="column">Tarea</div>
    <div class="right">%</div>
    <div>Acciones</div>
  </div>
  {#each tareas as tarea}
    <div class="row" data-testid={'row_' + tarea.id}>
      <div class="column">
        <span class="title" data-testid={'title_' + tarea.id}>{tarea.descripcion}</span>
        <span class="description" data-testid={'description_' + tarea.id}
          >{tarea.asignatario?.nombre ?? '⚪ Sin asignar'} - {tarea.fechaString}</span
        >
      </div>
      <div>
        <div class="porcentaje" data-testid={'porcentaje_' + tarea.id}>
          {tarea.estaCumplida()
            ? '✅'
            : (tarea.cumplioMenosDe(50) ? '⌛ ' : '') + tarea.porcentajeCumplimiento + ' %'}
        </div>
      </div>
      <div>
        {#if tarea.sePuedeCumplir()}
          <button
            onclick={() => cumplir(tarea)}
            class="secondary"
            title="Cumplir tarea"
            aria-label="Cumplir tarea"
            data-testid={'cumplir_' + tarea.id}
          >
            <img src="finish.png" class="icon" aria-label="Cumplir tarea ícono" alt="Cumplir tarea" />
          </button>
        {/if}
        <button
          onclick={() => editar(tarea)}
          class="secondary"
          title="Editar tarea"
          aria-label="Editar tarea"
        >
          <img src="edit.png" class="icon" aria-label="Editar tarea ícono" alt="Editar tarea" data-testid={'editar_tarea_' + tarea.id}/>
        </button>
        <button
          onclick={() => eliminar(tarea)}
          class="secondary"
          title="Eliminar tarea"
          aria-label="Eliminar tarea"
          data-testid={'eliminar_' + tarea.id}
        >
          <img
            src="delete-button.svg"
            class="icon"
            aria-label="Eliminar tarea"
            alt="Eliminar tarea"
          />
        </button>
      </div>
    </div>
    <hr />
  {/each}
</div>
