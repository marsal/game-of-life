# Game of Life

## Descripción

El ["Game of Life"](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) es un autómata celular diseñado por el matemático británico John Horton Conway en 1970. Es un juego de cero jugadores, lo que significa que su evolución está determinada por su estado inicial, sin necesidad de ninguna entrada posterior. Interactúas con el "Game of Life" configurando un estado inicial y observando cómo evoluciona.

## Reglas del Juego

El universo del "Game of Life" es una cuadrícula bidimensional de celdas, cada una de las cuales está en uno de dos posibles estados, viva o muerta. Cada celda interactúa con sus ocho vecinos, que son las celdas adyacentes horizontales, verticales o diagonalmente. En cada paso del tiempo, ocurren las siguientes transiciones:

1. Cualquier celda viva con menos de dos celdas vecinas vivas muere, como por soledad.
2. Cualquier celda viva con dos o tres celdas vecinas vivas sigue viva para la siguiente generación.
3. Cualquier celda viva con más de tres celdas vecinas vivas muere, como por sobrepoblación.
4. Cualquier celda muerta con exactamente tres celdas vecinas vivas se convierte en una celda viva, como por reproducción.

El patrón inicial constituye la semilla del sistema. La primera generación es creada aplicando las reglas simultáneamente a cada celda en el patrón inicial. Se observa la condición inicial y se produce una nueva generación. La misma regla se aplica para crear la siguiente generación y así sucesivamente.

## Objetivo

Implementar el "Game of Life" en TypeScript.

## Requisitos

- Escoge el paradigma de programación adecuado (orientado a objetos, funcional, etc.) para implementar el "Game of Life". En este caso, se recomienda el uso del paradigma orientado a objetos.
- Utiliza estructuras de datos apropiadas para manejar la cuadrícula del juego y las celdas.
- Aplica los principios SOLID para asegurar un diseño robusto y mantenible
- Utiliza patrones de diseño adecuados para mejorar la estructura y la flexibilidad del código:
- Escribe pruebas unitarias para verificar el comportamiento.
- Asegúrate de que el código esté bien documentado y sea fácil de entender.
- Utiliza comentarios y convenciones de nombres claras para mejorar la legibilidad del código.
- Implmenta la PIPELINE con Github actions para compilar y deployar el código en Vercel

## Consideraciones

- El estado inicial se va a determinar aleatoriamente
- La cuadrícula tendrá un tamaño fijo de 40\*40
- Asegúrate de manejar correctamente los bordes de la cuadrícula.
- Utiliza TDD (Desarrollo Guiado por Pruebas) para implementar y verificar el comportamiento de tu solución.

# Fase 2

## Funcionalidades Adicionales

- **Dimensiones de la cuadrícula:** Implementa un sistema para poder seleccionar las dimensiones de la cuadrícula
- **Contador de Generaciones:** Lleva un registro del número total de generaciones que han sido generadas desde el inicio.
- **Controles de Simulación:**
  - **Iniciar:** Comienza la generación automática de nuevas generaciones.
  - **Pausar:** Detiene temporalmente la generación automática sin reiniciar el contador de generaciones.
  - **Reanudar:** Continúa la generación automática después de una pausa.

# Fase 3

## Funcionalidades Adicionales

- **Sistema de patrónes iniciales:** Implementa un sistema para poder cargar patrones "estandards" en puntos determinados de la cuadrícula
- **Edición del estado inicial:** Cuando estemos en la generación 0, implementa un sistema por el cual se pueda determinar si una celda esta viva o muerta para luego ejecutar el juego

# Fase 4

## Funcionalidades Adicionales

- **Contador de Estado final:** Normalmente, después de un determinado número de ciclos, se puede llegar a alguno de los siguientes estados finales:
  - **Extinción:** Al cabo de un número finito de generaciones desaparecen todos los miembros de la población o células vivas.
  - **Estabilizacion:** Al cabo de un número finito de generaciones la población queda estabilizada, ya sea de forma rígida o bien de forma oscilante entre dos o más formas
  - **Crecimiento constante:** La población crece turno tras turno y se mantiene así un número infinito de generaciones. En un principio esta evolución solo se contemplo de forma teórica, aunque más tarde se encontrarán patrones que crecían de forma indefinida, durante un número infinito de turnos.
