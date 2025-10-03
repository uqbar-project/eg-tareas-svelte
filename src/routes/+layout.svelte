<script lang="ts">
  import ToastContainer from '$lib/components/toast/ToastContainer.svelte'
  let { children } = $props()
</script>

{@render children()}

<ToastContainer />
