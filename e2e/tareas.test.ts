import { test } from '@playwright/test'

test('flujo principal: creamos una tarea, la editamos, la cumplimos y la eliminamos', async ({
  page
}) => {
  await page.goto('/')
  // await expect(page.locator('h2')).toBeVisible()

  // Probamos la búsqueda disparada por el botón
  // await page.getByTestId('paisBusqueda').fill('ARGENTINA')
  // await page.getByTestId('buscar').click()
  // await irAPaisYVolver(page, 'ARG', 'Argentina')

  // Probamos la búsqueda automática desde el input
  // await page.getByTestId('busquedaAutomatica').check()
  // await page.getByTestId('paisBusqueda').fill('ARGEN')
  // necesitamos disparar el evento keyup
  // await page.keyboard.up('T')
  // await irAPaisYVolver(page, 'ARG', 'Argentina')
})
