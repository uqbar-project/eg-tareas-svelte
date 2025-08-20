<script lang="ts">
  import { toasts } from './toastStore'
  import { fade, fly } from 'svelte/transition'
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast {toast.type}"
      in:fly={{ x: 200, duration: 200 }}
      out:fade={{ duration: 200 }}
    >
      {toast.message}
    </div>
  {/each}
</div>

<style>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.toast {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: slide-in 0.3s ease-out;
}

/* Colores por tipo */
.toast.success {
  background-color: #16a34a;
}

.toast.error {
  background-color: #dc2626;
}

.toast.info {
  background-color: #2563eb;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
