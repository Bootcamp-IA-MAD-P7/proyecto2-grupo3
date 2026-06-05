# Retrospectiva del proyecto

## Proyecto

Sistema de Gestión para Escape Rooms.

## Equipo

Grupo 3.

## Periodo revisado

Proyecto desarrollado entre el 25/05/2026 y el 05/06/2026.

## Objetivo de la retrospectiva

Analizar el trabajo realizado durante el proyecto, identificar aprendizajes, valorar la organización del equipo y recoger mejoras aplicables a futuros desarrollos.

## Qué salió bien

- Se definió un negocio concreto y alineado con el briefing: gestión de escape rooms.
- Se creó un tablero Jira con épicas, historias de usuario, subtareas, responsables y seguimiento por sprints.
- Se documentaron dailys y decisiones de trabajo en el repositorio.
- Se implementó una API REST funcional con FastAPI.
- Se diseñó una base de datos relacional conectada a PostgreSQL/Supabase.
- Se incorporaron tests automatizados para las entidades principales.
- Se añadió documentación interactiva mediante Swagger/OpenAPI.
- Se incorporó autenticación JWT y rutas protegidas.
- Se construyó un frontend básico en React para mostrar la aplicación funcionando.
- Se configuró Docker para backend y frontend.
- Se preparó un workflow de despliegue en Azure mediante GitHub Actions.

## Qué dificultades encontramos

- El nivel técnico del equipo era desigual, por lo que algunas tareas necesitaron más acompañamiento y explicación.
- En varios momentos se hicieron merges o ramas sin una revisión previa suficientemente ordenada.
- Algunas funcionalidades evolucionaron más rápido que la documentación, provocando desfases en el README.
- La configuración de variables de entorno y credenciales generó dudas durante el desarrollo.
- La incorporación de JWT obligó a adaptar los tests, ya que las rutas protegidas cambiaron el comportamiento esperado.
- Docker y despliegue añadieron complejidad al final del proyecto.

## Qué aprendimos

- Es importante dividir el trabajo en tareas pequeñas y revisables.
- Las ramas deben tener un objetivo claro y estar asociadas a una subtarea concreta.
- Los tests deben evolucionar al mismo tiempo que cambia la arquitectura.
- La documentación no debe dejarse para el final, porque ayuda a detectar inconsistencias.
- Swagger facilita mucho la validación y presentación de la API.
- Docker permite demostrar el proyecto de forma más profesional, pero requiere controlar bien las variables de entorno.
- En un proyecto colaborativo, la comunicación diaria y los checkpoints técnicos reducen errores.

## Qué mejoraríamos en un próximo proyecto

- Definir desde el primer día una convención estricta para ramas, commits y pull requests.
- Revisar cada PR antes de hacer merge a `main`.
- Crear antes una guía común de instalación y ejecución para todo el equipo.
- Mantener el README actualizado al cierre de cada sprint.
- Añadir tests de autenticación desde el momento en que se implemente JWT.
- Separar mejor funcionalidades esenciales, medias, avanzadas y expertas para evitar mezclar alcances.
- Usar secretos de entorno desde el inicio para evitar exponer credenciales.

## Decisiones finales

- Se mantiene FastAPI como backend principal.
- Se mantiene PostgreSQL/Supabase como base de datos del proyecto.
- Se mantiene React/Vite como frontend de presentación.
- Se mantiene Docker como vía principal para levantar el sistema completo.
- Se documenta Jira como herramienta SCRUM del proyecto.

## Conclusión

El proyecto cumple el nivel esencial del briefing y avanza sobre requisitos de nivel medio, avanzado y experto. El equipo consiguió transformar una idea de negocio en una aplicación funcional con API REST, base de datos, frontend, tests, documentación y configuración de despliegue.

La principal mejora para futuros proyectos será mantener un flujo de trabajo más ordenado desde el inicio, con revisiones técnicas más frecuentes y tareas más pequeñas.
