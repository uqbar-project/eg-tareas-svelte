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
      buscarTareas()
    } catch (error: unknown) {
      showError('Error al cumplir la tarea', error)
    }
  }

  const editar = (tarea: Tarea) => {
    goto(`/tarea/${tarea.id}`)
  }

  const eliminar = async (tarea: Tarea) => {
    await tareaService.eliminarTarea(tarea)
    buscarTareas()
  }
</script>

<div class="main-title">Tareas de un equipo de desarrollo</div>

<div class="resumen">
  Tareas: {tareas.length}
</div>

<div class="tareas-table">
  <div class="row header">
    <div class="column">Tarea</div>
    <div class="right">%</div>
    <div>Acciones</div>
  </div>
  {#each tareas as tarea}
    <div class="row">
      <div class="column">
        <span class="title">{tarea.descripcion}</span>
        <span class="description"
          >{tarea.asignatario?.nombre ?? '⚪ Sin asignar'} - {tarea.fechaString}</span
        >
      </div>
      <div>
        <div class="porcentaje">
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
            aria-label="Editar tarea"
          >
            <img src="finish.png" class="icon" aria-label="Cumplir tarea" alt="Cumplir tarea" />
          </button>
        {/if}
        <button
          onclick={() => editar(tarea)}
          class="secondary"
          title="Editar tarea"
          aria-label="Editar tarea"
        >
          <img src="edit.png" class="icon" aria-label="Editar tarea" alt="Editar tarea" />
        </button>
        <button
          onclick={() => eliminar(tarea)}
          class="secondary"
          title="Eliminar tarea"
          aria-label="Eliminar tarea"
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
