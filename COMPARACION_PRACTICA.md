# Comparación de la práctica con `proyecto_1`

**Fecha de revisión:** 8 de octubre de 2026  
**Proyecto local revisado:** `ejercicio1`  
**Referencia remota:** [ramirosF4/proyecto_1](https://github.com/ramirosF4/proyecto_1), rama `main`, commit `9227aee1845759655117ae810d1af7da95a6616d`.

## Resultado general

Los dos proyectos resuelven esencialmente la misma práctica: un juego de combate de Dragon Ball para dos jugadores, con selección de personajes, estadísticas y acciones de ataque, curación y carga de energía. Comparten una base de clases y reglas muy reconocible, por lo que es razonable que coincidan si se desarrollaron siguiendo las explicaciones del profesor.

**Estimación manual de similitud:**

- **Concepto y funcionalidad: alrededor de 60–65 %.** Coinciden el objetivo, el modelo del personaje, varias estadísticas y el comportamiento base de las acciones.
- **Estructura y texto del código fuente: alrededor de 35–45 %.** Hay bloques y cálculos parecidos, pero el armado de la interfaz, la organización de módulos y el flujo de batalla difieren.

Estos porcentajes son una apreciación cualitativa al comparar los archivos visibles; no son el resultado de un detector de similitud ni permiten determinar quién escribió primero cada parte. El repositorio remoto corresponde al commit indicado arriba y podría no ser exactamente la versión que se revisó en clase.

## Coincidencias principales

| Área | Coincidencia observada |
|---|---|
| Tema | Ambos implementan un juego de combate de Dragon Ball para dos jugadores. |
| Personajes | Se comparten varios personajes, incluidos Goku, Gohan, Cell, Gogueta, Trunks y Veguito; algunos nombres o datos cambian. |
| Estado del jugador | `Personaje` conserva vida, nombre, ki, energía, semillas y métodos para consultar/modificar esos valores. |
| Acciones | Los ataques básico y especial reducen energía y ki con los mismos costos base: 5/10 y 15/20, respectivamente. |
| Recuperación | Curar resta una semilla y restablece vida, ki y energía; cargar recupera 15 de energía y 10 de ki, con tope de 100. |
| Herramientas | Ambos usan JavaScript con módulos ES, webpack, Bootstrap y SweetAlert2. |
| Validación y presentación | Los dos validan la selección de los jugadores, muestran información de combate y actualizan estadísticas en la interfaz. |

## Diferencias importantes

| Tema | Práctica local | Repositorio remoto |
|---|---|---|
| Organización | Tiene `Habilidades.js`, `Personaje.js`, `Acciones.js`, `interface.js` e `index.js`. | Tiene `Personaje.js`, `Acciones.js`, `Interfaz.js`, `alertas.js`, `index.js`, además de `css/main.css`. También incluye `Persona.js` y `reaad.js`, que parecen material anterior o de estudio. |
| Turnos | `Acciones` guarda el turno; `index.js` habilita solo los botones del jugador activo y pasa el turno tras una acción válida. El jugador 1 inicia. | Añade estado de turno y activa/desactiva botones según quién juega. |
| Ataque especial | Un contador deja listo el especial al inicio; después de usarlo, exige dos acciones propias válidas antes de volver a permitirlo. | Añade un contador de usos/turnos antes de permitir otro ataque especial. |
| Curación y carga | Se validan junto a los ataques en un mismo flujo de `index.js`; las acciones inválidas no consumen turno. | Se coordinan desde `Interfaz.js`, que comprueba las condiciones, muestra alertas y finaliza el turno. |
| Ataques visuales | `interface.js` contiene los textos, colores e imágenes para ataques básicos y especiales. | `Interfaz.js` delega la presentación a `alertas.js` y también contempla curación y carga. |
| Interfaz de selección | La implementación local cambia la pantalla al iniciar la batalla y actualiza barras de vida, energía, ki y semillas. | El flujo remoto muestra las tarjetas de batalla, barras y controles; sus acciones además están ligadas al sistema de turnos. |
| Dependencias | El `package.json` identifica al autor local y no incluye `@fortawesome/react-fontawesome`. | Declara a `ramiro` como autor e incluye `@fortawesome/react-fontawesome`; el resto de las dependencias principales coincide. |
| CSS propio | No aparece un archivo CSS de aplicación en `src` entre los archivos locales revisados. | Incluye `src/css/main.css`. |

## Observaciones para revisar en la práctica local

1. `src/index.js` usa `barras1` y `barras2` sin declararlos explícitamente. Los `id` sí aparecen en el HTML compilado de `dist`; para evitar depender de variables globales implícitas del DOM, es más claro obtener esos elementos con `getElementById`.
2. La lógica local ya alterna turnos e inicia con el jugador 1, siguiendo el enfoque del repositorio. El repositorio consultado no inicializa explícitamente al primer jugador, así que la práctica local lo hace de forma explícita.
3. `Acciones.curacion()` protege el consumo cuando no quedan semillas o todas las estadísticas ya están al máximo; la coordinación de interfaz informa el motivo y mantiene el turno si la acción se rechaza.
4. El proyecto remoto contiene archivos adicionales (`Persona.js` y `reaad.js`) que parecen ejercicios o versiones previas. No los conté como funcionalidades equivalentes de la práctica principal.
5. La comparación se concentró en fuentes y configuración. Se excluyeron `node_modules`, `dist` y archivos binarios compilados, porque no representan el código fuente equivalente de ambos proyectos.

## Conclusión

La práctica local **sí se parece bastante en la idea y en la base de programación**, como cabría esperar de una actividad guiada en clase. La referencia remota sirvió como modelo para incorporar turnos y enfriamiento del ataque especial en la estructura local, sin replicar literalmente sus módulos. No hay base en esta comparación para concluir que exista copia indebida; la similitud observada es compatible con haber seguido las mismas instrucciones y ejemplos.

## Guía: lógica de turnos e implementación local

Esta sección documenta la lógica del repositorio y cómo se adaptó a la práctica local.

### Cómo funciona la lógica remota

1. **Estado del turno por jugador:** en `Acciones.js` del repositorio, cada jugador guarda un booleano de turno, con métodos para leerlo y cambiarlo. `Interfaz.js` contiene una función que, al completar una acción válida, pone el turno actual en `false` y el del oponente en `true`.
2. **Controles:** en `index.js`, la función `desactivar_btns` deshabilita los botones del jugador cuyo turno no está activo. Después de cada acción, se actualizan las barras y se aplica esa función.
3. **Enfriamiento del ataque especial:** cada jugador inicia con un contador en `2`. El ataque especial se permite cuando llega a `2` y, al ejecutarse, el contador vuelve a `0`. Los ataques básicos, la carga de energía y una curación válida lo incrementan. Por tanto, la regla de ese código es **dos acciones propias válidas antes de volver a habilitar el ataque especial**, no dos rondas globales. Intentar un especial antes de tiempo muestra un aviso y no cede el turno.
4. **Carga y curación:** el repositorio acepta la carga si energía o ki están por debajo de 100; al cargar, los valores se limitan a 100. Para la semilla, exige que queden semillas y que la vida esté por debajo de 100. Una curación válida consume una semilla, incrementa el contador del especial y cede el turno.

**Detalle importante del repositorio:** en las fuentes consultadas, cada jugador inicia con el turno en `false`, pero no encontré dónde se le asigna `true` al jugador inicial cuando comienza la batalla. Como `desactivar_btns` depende de esos valores, conviene no copiarlo literalmente: al empezar se debe asignar el primer turno de forma explícita y actualizar el estado de los botones. La lógica de alternancia es una buena referencia, pero ese paso inicial debe quedar cubierto.

### Cómo quedó adaptada en la práctica local

La práctica ya tiene las tres piezas visuales que describes, aunque el orden interno de la transición se puede hacer más claro:

| Etapa | Estado local y ajuste conceptual |
|---|---|
| **1. Selección** | Es la vista inicial de `dist/index.html`, con campos de nombre y elección de personaje. Las barras ya se ocultan al inicio con `d-none`. |
| **2. Aviso de inicio** | `iniciar_juego` en `src/index.js` ya muestra una alerta SweetAlert2 de “Iniciando batalla...” con temporizador. Actualmente cambia la pantalla y revela las barras antes de abrir esa alerta; la alerta se superpone a la interfaz de batalla. Para que sean etapas estrictamente secuenciales, primero se mostraría la alerta y, cuando se cierre o termine el temporizador, se pasaría a la batalla. |
| **3. Batalla** | Se muestran nombres, personajes, barras y controles. Al iniciar, los botones del jugador 1 quedan activos y los del jugador 2 deshabilitados hasta que le toque. |

El flujo de turnos implementado queda así:

1. **Estado por jugador:** `Acciones` conserva si ese jugador tiene el turno y su progreso de enfriamiento. El contador comienza en `2`, por lo que el especial está disponible en la primera oportunidad.
2. **Turno inicial y controles:** `iniciar_juego` asigna el primer turno al jugador 1. La función `desactivar_btns` habilita sus cuatro botones y deshabilita los del rival.
3. **Validación central:** los botones de ambos jugadores llaman a `realizar_accion`, que primero comprueba que ambos jugadores existan y que le corresponda actuar al jugador que hizo clic.
4. **Acciones válidas:** los ataques, una carga que realmente pueda recuperar energía o ki, y una curación válida completan su efecto y ceden el turno. Si no se puede cargar, curar o usar el especial, se muestra un aviso y el jugador conserva su turno.
5. **Enfriamiento del especial:** cada acción propia válida que no sea el especial suma uno al contador, hasta un máximo de `2`. Al usar el especial, el contador vuelve a `0`; así hacen falta dos acciones propias válidas antes de volver a usarlo.
6. **Fin del turno:** una vez completada la acción, se desactiva el jugador actual, se activa al rival, se actualizan los botones y se refrescan las barras de estadísticas.

### Resumen del estado actual

- La **selección de nombre y personaje** y la **alerta de inicio** ya están en `src/index.js`.
- La **vista de batalla con barras** también existe; actualmente se prepara antes de mostrar la alerta, aunque la alerta la cubre visualmente.
- La **carga de ki/energía ya tiene tope de 100** y no consume turno cuando ambas estadísticas están completas.
- La **semilla** no se consume cuando no quedan unidades o cuando vida, ki y energía están al máximo.
- La **alternancia de turnos** y el **enfriamiento del especial** ya siguen el enfoque del repositorio, con el primer turno asignado explícitamente al jugador 1.
- El orden de la alerta de inicio y la vista de batalla permanece como estaba; no se cambió en esta tarea.
