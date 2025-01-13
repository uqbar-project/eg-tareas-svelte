<script lang="ts">
  import './edit.css'
  import { goto } from '$app/navigation'
  import { tareaService } from '$lib/services/tareaService'
  import { Tarea, ValidationMessage } from '$lib/domain/tarea'
  import { DateTime } from 'luxon'
  import { showError } from '$lib/domain/errorHandler'
  import ValidationField from '$lib/components/ValidationField.svelte'

  const volver = () => {
    goto('/')
  }

  let { data } = $props()
  const { tarea, asignatarios, nuevaTarea } = data
  if (!tarea) volver()

  let errors: ValidationMessage[] = $state([])

  const actualizar = async () => {
    try {
      const tareaActual: Tarea = Tarea.fromJson(tareaEdit)
      tareaActual.fecha = DateTime.fromFormat(fecha, 'yyyy-MM-dd').toJSDate()
      tareaActual.validar()
      errors = tareaActual.errors
      if (!tareaActual.invalid()) {
        if (nuevaTarea)
          await tareaService.crearTarea(tareaActual)
        else
          await tareaService.actualizarTarea(tareaActual)
        volver()
      }
    } catch (error) {
      showError('Error al actualizar la tarea', error)
    }
  }
  
  let tareaEdit = $state(tarea!.toJSON())
  let fecha = $state(DateTime.fromJSDate(tarea!.fecha!).toUTC().toFormat('yyyy-MM-dd'))
</script>


<h1>{nuevaTarea ? 'Crear' : 'Editar'} Tarea</h1>
<hr>
<div class="row-edit">
  <label for="descripcion">Descripción:</label>
  <input type="text" name="descripcion" bind:value={tareaEdit.descripcion} />
  <span></span>
  <ValidationField errors={errors} field="descripcion"/>
</div>
<div class="row-edit">
  <label for="iteracion">Iteración:</label>
  <input type="text" name="iteracion" bind:value={tareaEdit.iteracion} />
  <span></span>
  <ValidationField errors={errors} field="iteracion"/>
</div>
<div class="row-edit">
  <label for="asignatario">Asignatario:</label>
  <select bind:value={tareaEdit.asignadoA}>
    <option value="">-- Seleccione un Asignatario --</option>
    {#each asignatarios as asignatario}
      <option value={asignatario.nombre}>{asignatario.nombre}</option>
    {/each}
  </select>
  <span></span>
  <ValidationField errors={errors} field="asignadoA"/>
</div>
<div class="row-edit">
  <label for="fecha">Fecha:</label>
  <input type="date" name="fecha" bind:value={fecha} />
  <span></span>
  <ValidationField errors={errors} field="fecha"/>
</div>
<div class="row-edit">
  <label for="porcentaje">% cumplimiento:</label>
  <input type="number" name="porcentaje" bind:value={tareaEdit.porcentajeCumplimiento} />
  <span></span>
  <ValidationField errors={errors} field="porcentajeCumplimiento"/>
</div>
<div class="button-group-edit">
  <button onclick={actualizar} class="primary-edit">{nuevaTarea ? 'Crear' : 'Actualizar'}</button>
  <button onclick={volver} class="secondary-edit">Volver</button>
</div>