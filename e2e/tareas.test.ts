import { expect, test, type Page } from '@playwright/test'

test.describe('flujo principal', () => {

  let asignatarioId: number

  test.beforeEach(async ({ request }) => {
    // Creamos un usuario
    const response = await request.post('http://localhost:9000/usuarios', {
      data: { nombre: 'Eva Dida' }
    })
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    asignatarioId = json.id
  })
  
  test.afterEach(async ({ request }) => {
    // Creamos un usuario
    const response = await request.delete(`http://localhost:9000/usuarios/${asignatarioId}`)
    expect(response.ok()).toBeTruthy()
  })
  
  test('creamos una tarea, la editamos, la cumplimos y la eliminamos', async ({
    page
  }) => {
    // Comenzamos desde la página principal
    await page.goto('/')
      
    // Creamos una tarea
    await page.getByTestId('crear_tarea').click()
    await page.goto(`/tarea/nueva`)
    const tareaId = await editarTarea({
      descripcion: 'Agregar tests e2e',
      iteracion: 'Kepler',
      asignadoA: '',
      fecha: '2025-11-25',
      porcentajeCumplimiento: 40,
    }, page)

    // Volvemos a la página principal
    await page.goto('/')
    await expect(page.getByTestId(`row_${tareaId}`)).toBeVisible()
    await expect(page.getByTestId(`title_${tareaId}`)).toHaveText('Agregar tests e2e')
    await expect(page.getByTestId(`description_${tareaId}`)).toHaveText('⚪ Sin asignar - 25/11/2025')
    await expect(page.getByTestId(`porcentaje_${tareaId}`)).toHaveText('⌛ 40 %')

    // Modificamos datos de la tarea
    await page.getByTestId(`editar_tarea_${tareaId}`).click()
    await editarTarea({
      descripcion: 'Agregar tests e2e con Playwright',
      iteracion: 'Leibnitz',
      asignadoA: 'Eva Dida',
      fecha: '2025-11-26',
      porcentajeCumplimiento: 50,
    }, page)

    // Volvemos a la página principal
    await page.goto('/')
    await expect(page.getByTestId(`row_${tareaId}`)).toBeVisible()
    await expect(page.getByTestId(`title_${tareaId}`)).toHaveText('Agregar tests e2e con Playwright')
    await expect(page.getByTestId(`description_${tareaId}`)).toHaveText('Eva Dida - 26/11/2025')
    await expect(page.getByTestId(`porcentaje_${tareaId}`)).toHaveText('50 %')

    // Cumplimos la tarea
    await page.getByTestId(`cumplir_${tareaId}`).click()
    await expect(page.getByTestId(`porcentaje_${tareaId}`)).toHaveText('✅')
    await expect(page.getByTestId(`cumplir_${tareaId}`)).not.toBeVisible()

    // Eliminamos la tarea
    await page.getByTestId(`eliminar_${tareaId}`).click()
    await expect(page.getByTestId(`row_${tareaId}`)).not.toBeVisible()
  })
})

const editarTarea = async ({
  descripcion,
  iteracion,
  asignadoA,
  fecha,
  porcentajeCumplimiento
}: {
  descripcion: string,
  iteracion: string,
  asignadoA: string,
  fecha: string,
  porcentajeCumplimiento: number,
}, page: Page) => {
  await page.getByTestId('descripcion').fill(descripcion)
  await page.getByTestId('iteracion').fill(iteracion)
  if (asignadoA) {
    await page.getByTestId('asignatario').selectOption(asignadoA)
  }
  if (fecha) {
    await page.getByTestId('fecha').fill(fecha)
  }
  await page.getByTestId('porcentajeCumplimiento').fill(porcentajeCumplimiento.toString())
  // escuchamos al backend para obtener el id de la tarea que creamos/editamos
  const [response] = await Promise.all([
    page.waitForResponse(backendResponse =>
      ['POST', 'PUT'].includes(backendResponse.request().method())
    ),
    await page.getByTestId('guardar').click()
  ])
  const json = await response.json()
  return json.id
}
