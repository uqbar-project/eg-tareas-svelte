
## Tareas de un equipo de desarrollo

![demo](./videos/demo.gif)

[![Build](https://github.com/uqbar-project/eg-tareas-svelte/actions/workflows/build.yml/badge.svg)](https://github.com/uqbar-project/eg-tareas-svelte/actions/workflows/build.yml) [![codecov](https://codecov.io/gh/uqbar-project/eg-tareas-svelte/branch/master/graph/badge.svg?token=5J8fFm1oEE)](https://codecov.io/gh/uqbar-project/eg-tareas-svelte)

Este ejemplo muestra

- la interacción con un backend, incluyendo el manejo de errores
- cómo se modela un formulario con validaciones
- la navegación de una página principal a una donde se toma información del backend

### Errores de negocio

![demo errores de negocio](./videos/demoErrorNegocio.gif)

### Errores de sistema

![demo errores de sistema](./videos/demoErrorSistema.gif)

## TODO (Cosas que faltan)

- Agregar explicación README
- Agregar test e2e en local
- Que funcione test e2e en CI para lo cual hay que reapuntar a host.docker.internal en lugar de localhost (podemos reemplazar como hacía angular porque el manejo de variables de entorno en Svelte te fuerza a que uses server side)
