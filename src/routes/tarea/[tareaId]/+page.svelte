<script lang="ts">
  import './edit.css'
  import { goto } from '$app/navigation'
  import { tareaService } from '$lib/services/tareaService'
  import { Tarea } from '$lib/domain/tarea'
  import { DateTime } from 'luxon'
  import { showError } from '$lib/domain/errorHandler'

  const actualizar = async () => {
    try {
      const tareaActual: Tarea = Tarea.fromJson(tareaEdit)
      tareaActual.fecha = DateTime.fromFormat(fecha, 'yyyy-MM-dd').toJSDate()
      // TODO: generar un componente para mostrar los errores de una tarea
      tareaActual.validar()
      if (!tareaActual.invalid) {
        await tareaService.actualizarTarea(tareaActual)
        volver()
      }
    } catch (error) {
      showError('Error al actualizar la tarea', error)
    }
  }

  const volver = () => {
    goto('/')
  }

  let { data } = $props()
  const { tarea, asignatarios } = data
  if (!tarea) volver()
  let tareaEdit = $state(tarea!.toJSON())

  let fecha = $state(DateTime.fromJSDate(tarea!.fecha!).toUTC().toFormat('yyyy-MM-dd'))
</script>


<h1>Editar Tarea</h1>
<hr>
<div class="row-edit">
  <label for="descripcion">Descripción:</label>
  <input type="text" name="descripcion" bind:value={tareaEdit.descripcion} />
</div>
<div class="row-edit">
  <label for="iteracion">Iteración:</label>
  <input type="text" name="iteracion" bind:value={tareaEdit.iteracion} />
</div>
<div class="row-edit">
  <label for="asignatario">Asignatario:</label>
  <select bind:value={tareaEdit.asignadoA}>
    <option value="">-- Seleccione un Asignatario --</option>
    {#each asignatarios as asignatario}
      <option value={asignatario.nombre}>{asignatario.nombre}</option>
    {/each}
  </select>
</div>
<div class="row-edit">
  <label for="fecha">Fecha:</label>
  <input type="date" name="fecha" bind:value={fecha} />
</div>
<div class="row-edit">
  <label for="porcentaje">% cumplimiento:</label>
  <input type="number" name="porcentaje" bind:value={tareaEdit.porcentajeCumplimiento} />
</div>
<div class="button-group-edit">
  <button onclick={actualizar} class="primary-edit">Actualizar</button>
  <button onclick={volver} class="secondary-edit">Volver</button>
</div>