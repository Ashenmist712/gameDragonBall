# Guía de estudio: juego de combate

Esta guía explica, paso a paso, cómo funciona la versión actual del proyecto y cómo se conectan sus archivos. Úsala junto con el código fuente de la carpeta `src`.

## 1. Vista general

El programa tiene dos jugadores. Cada uno escribe su nombre, selecciona un personaje y confirma. Después puede atacar, cargar energía o ki, o usar una semilla para curarse.

El flujo general es:

```text
index.js (interfaz y eventos)
    ├── crea jugadores con Acciones
    │       └── hereda los datos y métodos de Personaje
    │               └── hereda la clase base Habilidades
    ├── llama a las acciones del jugador
    └── llama a interface.js para mostrar ataques y aplicar daño
```

## 2. `Personaje.js`: datos y estado de cada jugador

`Personaje` representa a un jugador y guarda su estado. Usa campos privados, indicados con `#`, para que el resto del programa no lea ni modifique esas propiedades directamente.

```js
#vida = 100;
#ki = 100;
#energia = 100;
#semilla = 2;
```

También guarda el nombre y el personaje seleccionado:

```js
#nombre;
#personaje = "";
```

### Constructor

```js
constructor(nombre, personaje){
    super();
    this.#nombre = nombre;
    this.#personaje = personaje;
    this.mostrarEstadisticas("Estado inicial");
}
```

- `constructor` se ejecuta al crear un jugador.
- `super()` llama al constructor de la clase padre (`Habilidades`).
- Los argumentos se guardan en campos privados.
- `mostrarEstadisticas` deja un registro inicial en la consola.

### Getters y setters

Los métodos `getVida()`, `getKi()`, `getEnergia()`, `getSemilla()`, `getNombre()` y `getPersonaje()` devuelven información guardada.

Los métodos `setVida(vida)`, `setKi(ki)`, `setEnergia(energia)` y `setSemilla(semilla)` actualizan esa información. Por ejemplo:

```js
jugador.getVida();  // consulta la vida
jugador.setVida(80); // cambia la vida a 80
```

Esto es importante para entender el error anterior: `setVida` no es una función independiente; se llama sobre la instancia del personaje, por ejemplo `jugador.setVida(...)`.

## 3. `Habilidades.js`: clase base de acciones

`Habilidades` declara métodos vacíos que sirven como estructura general para las acciones del juego, como curación, carga de energía y defensa.

`Personaje` hereda de esta clase con:

```js
class Personaje extends Habilidades
```

Un método vacío no realiza una acción por sí solo. Las acciones que se utilizan en el juego están implementadas en `Acciones`.

## 4. `Acciones.js`: reglas para modificar las estadísticas

`Acciones` hereda de `Personaje`:

```js
class Acciones extends Personaje
```

Al construir `Acciones`, pasa el nombre y el personaje seleccionado a `Personaje`:

```js
constructor(nombre, personaje){
    super(nombre, personaje);
}
```

Así, cada objeto `Acciones` tiene tanto las estadísticas del personaje como los métodos de combate.

### Ataque básico

```js
atkBasico(){
    this.setEnergia(Math.max(0, this.getEnergia() - 5));
    this.setKi(Math.max(0, this.getKi() - 10));
    this.mostrarEstadisticas("Ataque básico");
}
```

`this` es el jugador que está ejecutando el ataque. Se le descuentan 5 puntos de energía y 10 de ki. `Math.max(0, valor)` evita que el resultado sea menor que cero.

Este método descuenta el costo del ataque al atacante. El daño a la vida del oponente se gestiona en `interface.js`.

### Ataque especial

```js
atkEspecial(){
    this.setEnergia(Math.max(0, this.getEnergia() - 15));
    this.setKi(Math.max(0, this.getKi() - 20));
    this.mostrarEstadisticas("Ataque especial");
}
```

El ataque especial tiene un costo mayor: 15 de energía y 20 de ki. Al igual que en el básico, el costo corresponde al atacante y el daño al oponente se aplica desde `interface.js`.

### Curación

```js
curacion(){
    if (this.getSemilla() === 0) {
        return false;
    }

    this.setSemilla(this.getSemilla() - 1);
    this.setEnergia(100);
    this.setKi(100);
    this.setVida(100);
    this.mostrarEstadisticas("Curación");
    return true;
}
```

Si no quedan semillas, devuelve `false` y no cura. Si hay una disponible, resta una semilla y restaura la vida, energía y ki a 100. Devuelve `true` para indicar que la acción se completó.

### Carga de energía y ki

`cargaEnergia()` aumenta la energía en 15 y el ki en 10. Los `if` impiden que ninguna estadística supere 100.

### Defensa

`defensa()` está vacío por ahora, así que no tiene comportamiento implementado.

## 5. `interface.js`: efectos visuales y daño

Este archivo importa `SweetAlert2` y guarda los textos y colores asociados a cada personaje en `atributosPersonaje`.

Por ejemplo, al usar un ataque se busca el personaje del atacante:

```js
atributosPersonaje[j1.getPersonaje()]
```

Los nombres de esta tabla deben coincidir con los valores de `alt` de las imágenes de selección. Hay entradas alternativas para nombres como `Veguetta`, `Pikoro` y `Gogueta`.

### Ataque básico

```js
const atk_basico = (j1, j2) => {
    j1.atkBasico();
    j2.setVida(Math.max(0, j2.getVida() - 10));
    // SweetAlert muestra el texto, la imagen y el fondo.
};
```

- `j1` es quien ataca.
- `j2` es quien recibe el ataque.
- Primero se descuenta el costo al atacante llamando a `j1.atkBasico()`.
- Luego se restan 10 puntos de vida al rival con `j2.setVida(...)`.
- `Math.max(0, ...)` evita vida negativa.
- `Swal.fire(...)` presenta el mensaje y la imagen del ataque.

### Ataque especial

`atk_especial(j1, j2)` sigue el mismo patrón. Llama a `j1.atkEspecial()`, resta 20 de vida a `j2` y muestra el aviso correspondiente.

Esta separación es intencional: `Acciones` gestiona el costo del movimiento y `interface.js` gestiona el daño al rival y la presentación visual.

## 6. `index.js`: conexión entre HTML y lógica

`index.js` es el punto de entrada de la aplicación. Importa Bootstrap, Font Awesome, SweetAlert, `Acciones` y las funciones de ataque de `interface.js`.

### Referencias al HTML

Llamadas como:

```js
document.getElementById("player1")
```

buscan en el HTML un elemento cuyo `id` sea `player1`. Los identificadores usados en JavaScript deben existir en el HTML; por ejemplo, `vida1`, `vida2`, `btn_player1` y `btn_player2`.

### Estado de los jugadores

```js
let pj1 = "", pj2 = "";
let jugador1, jugador2;
```

- `pj1` y `pj2` guardan los nombres de los personajes seleccionados.
- `jugador1` y `jugador2` guardan los objetos creados a partir de `Acciones`.

### Selección y confirmación

Al hacer clic en una imagen, un listener guarda su texto `alt` en `pj1` o `pj2` y cambia el color de selección.

Al pulsar el botón de aceptar:

1. Se comprueba que el nombre no esté vacío.
2. Se comprueba que se haya seleccionado un personaje.
3. Se crea el jugador con `new Acciones(nombre, personaje)`.
4. Se bloquea el campo de nombre y se oculta la selección de ese jugador.
5. Cuando los dos jugadores existen, `iniciar_juego()` muestra sus datos y llama a `barras()`.

### Actualización de las barras

`barras()` lee las estadísticas con los getters de cada jugador y actualiza el ancho y el texto de las barras de vida, ki y energía. También muestra cuántas semillas quedan.

Por ejemplo:

```js
vida1.style.width = `${jugador1.getVida()}%`;
vida1.innerText = `${jugador1.getVida()}%`;
```

La primera línea cambia el ancho visual de la barra; la segunda cambia el número que se ve dentro.

### Eventos de los botones de combate

Cada botón se localiza por el contenedor del jugador y el atributo `data-action`, por ejemplo:

```js
document.querySelector("#btn_py1 [data-action='atkBasico']")
```

Al pulsarlo, el programa comprueba que ambos jugadores hayan confirmado. Si falta alguno, muestra un aviso. Si están listos, ejecuta la acción correspondiente y actualiza las barras.

Para los ataques, se pasa el atacante primero y el oponente después:

```js
atk_basico(jugador1, jugador2); // ataca el jugador 1
atk_basico(jugador2, jugador1); // ataca el jugador 2
```

El orden importa porque el primer argumento paga el costo del ataque y el segundo recibe el daño.

## 7. Ejemplo completo: el jugador 1 usa un ataque básico

Supongamos que ambos jugadores tienen 100 de vida, ki y energía.

1. El usuario pulsa el botón básico del jugador 1.
2. El evento de `index.js` confirma que existen ambos jugadores.
3. `index.js` llama `atk_basico(jugador1, jugador2)`.
4. `interface.js` llama `jugador1.atkBasico()`.
5. En `Acciones.js`, el jugador 1 pierde 5 de energía y 10 de ki.
6. `interface.js` reduce la vida del jugador 2 en 10.
7. `Swal.fire` muestra el ataque.
8. `index.js` llama `barras()` y actualiza los valores visibles.

Resultado esperado:

| Estadística | Jugador 1 (atacante) | Jugador 2 (oponente) |
|---|---:|---:|
| Vida | 100 | 90 |
| Energía | 95 | 100 |
| Ki | 90 | 100 |

## 8. Conceptos que conviene poder explicar

- **Clase:** molde para crear objetos. `Personaje` y `Acciones` son clases.
- **Objeto/instancia:** jugador concreto creado con `new Acciones(...)`.
- **Herencia:** `Acciones` hereda de `Personaje`; `Personaje` hereda de `Habilidades`.
- **`this`:** el objeto actual. Dentro de `atkBasico`, se refiere al atacante.
- **`super(...)`:** llama al constructor de la clase padre.
- **Campo privado:** propiedad con `#`, accesible directamente solo desde su clase.
- **Getter/setter:** métodos públicos para consultar o modificar un campo privado.
- **Evento:** código que se ejecuta cuando sucede algo, como un clic.
- **`addEventListener`:** registra un manejador para un evento.
- **`querySelector`:** busca el primer elemento HTML que coincide con un selector CSS.
- **`Math.max(0, valor)`:** elige el mayor entre 0 y `valor`, evitando resultados negativos.
- **`export` e `import`:** permiten compartir funciones y clases entre archivos.

## 9. Preguntas posibles de evaluación

**¿Por qué se usa `j2.setVida(...)` y no `setVida(...)`?**  
Porque `setVida` es un método del objeto jugador. Se debe indicar en qué jugador se ejecuta.

**¿Quién pierde vida cuando el jugador 1 ataca?**  
El segundo argumento de la función de ataque, que en ese caso es `jugador2`.

**¿Qué hace `Math.max(0, j2.getVida() - 10)`?**  
Resta 10 a la vida del oponente y limita el resultado mínimo a cero.

**¿Qué diferencia hay entre `getVida()` y `setVida(...)`?**  
El getter consulta la vida; el setter la modifica.

**¿Por qué se llama `barras()` después de una acción?**  
Para reflejar en pantalla los valores nuevos que quedaron guardados en los objetos.

**¿Qué hace `return false` en la curación?**  
Indica que no se pudo curar porque no quedan semillas. `index.js` usa ese resultado para mostrar un aviso.

**¿Qué pasa si se intercambia el orden de los argumentos de un ataque?**  
Se intercambian el atacante y quien recibe el daño.

## 10. Detalles para revisar al comparar con el código

- En `interface.js`, SweetAlert tiene la opción escrita como `widh: 600`; el nombre habitual de la opción es `width`.
- `Habilidades.js` declara `ataqueBasico()` y `ataqueEspecial()`, mientras que `Acciones.js` implementa `atkBasico()` y `atkEspecial()`. Actualmente los botones llaman directamente los métodos de `Acciones`, así que esas declaraciones vacías de la clase base no son las que ejecutan los ataques.
- Las rutas de imágenes deben existir con el mismo nombre y mayúsculas/minúsculas que se usan en `./public/img/DB/<personaje>/...`.

## 11. Ejecutar el proyecto

Desde la carpeta del proyecto:

```bash
npm run dev
```

Para comprobar que el proyecto compila:

```bash
npm run build
```

El código que debes estudiar y comparar está en `src/`. `dist/` contiene archivos generados para ejecutar la página; normalmente se modifica el código de `src/`, no el bundle compilado.
