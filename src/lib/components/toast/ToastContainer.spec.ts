import { render } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'
import { toasts } from './toastStore'
import ToastContainer from '$lib/components/toast/ToastContainer.svelte'

describe('ToastContainer', () => {
  it('renders no toasts when store is empty', () => {
    const { container } = render(ToastContainer)
    expect(container.querySelectorAll('.toast').length).toBe(0)
  })

  it('renders a single toast', async () => {
    toasts.push('Hello world', { type: 'success' })
    const { findByText } = render(ToastContainer)
    expect(await findByText('Hello world')).toBeTruthy()
  })

  it('renders multiple toasts', async () => {
    toasts.push('Toast 1', { type: 'info' })
    toasts.push('Toast 2', { type: 'error' })
    const { findByText } = render(ToastContainer)
    expect(await findByText('Toast 1')).toBeTruthy()
    expect(await findByText('Toast 2')).toBeTruthy()
  })

  it('applies correct class based on toast type', async () => {
    toasts.push('Success toast', { type: 'success' })
    toasts.push('Error toast', { type: 'error' })
    toasts.push('Info toast', { type: 'info' })
    const { container } = render(ToastContainer)
    expect(container.querySelector('.toast.success')).toBeTruthy()
    expect(container.querySelector('.toast.error')).toBeTruthy()
    expect(container.querySelector('.toast.info')).toBeTruthy()
  })
})
