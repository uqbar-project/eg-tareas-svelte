<script lang='ts'>
  import type { ValidationMessage } from '$lib/domain/tarea'

  const errorsFrom = (errors: ValidationMessage[], field: string) => errors
    .filter((_) => _.field === field)
    .map((_) => _.message)
    .join('. ')

  let { field, errors } = $props()

  let errorMessage = $derived(errorsFrom(errors, field))
</script>
<style>
.error {
  border: 1px solid darkred;
  background-color: rgb(236, 35, 35);
  color: white;
  margin: 0.25rem 0;
  padding: 0.5rem;
}
</style>
{#if !!errorMessage}
  <div class='error' data-testid={'error-field-' + field}>
    {errorMessage}
  </div>
{/if}