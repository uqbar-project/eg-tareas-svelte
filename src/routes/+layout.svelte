<script>
  import { SvelteToast } from '@zerodevx/svelte-toast'

  const options = {
  }

  let { children } = $props()
</script>

<SvelteToast {options} />

{@render children()}