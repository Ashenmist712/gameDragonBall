// Importa las acciones comunes que heredan todos los personajes
import Habilidades from "./Habilidades.js";

// Guarda el estado y los datos básicos de un personaje
class Personaje extends Habilidades {

    // Define los valores iniciales del personaje
    #vida = 100;
    #nombre;
    #ki = 100;
    #energia = 100;
    #semilla = 2;
    #personaje = "";

    // Recibe el nombre del jugador y el personaje que seleccionó
    constructor(nombre, personaje){
        super();
        this.#nombre = nombre;
        this.#personaje = personaje;
        this.mostrarEstadisticas("Estado inicial");
    }

    // Muestra en consola el estado actual después de una acción
    mostrarEstadisticas(accion){
        console.log(`
            ========================================
            accion: ${accion}
            nombre: ${this.#nombre}
            vida: ${this.#vida}
            ki: ${this.#ki}
            energia: ${this.#energia}
            semilla: ${this.#semilla}

            `);
    }

    // Devuelve el personaje elegido
    getPersonaje(){
        return this.#personaje;
    }

    // Devuelve la vida actual
    getVida(){
        return this.#vida;
    }

    // Devuelve el ki actual
    getKi(){
        return this.#ki;
    }

    // Devuelve la energía actual
    getEnergia(){
        return this.#energia;
    }

    // Devuelve las semillas disponibles
    getSemilla(){
        return this.#semilla;
    }

    // Devuelve el nombre del jugador
    getNombre(){
        return this.#nombre;
    }

    // Actualiza la vida del personaje
    setVida(vida){
        this.#vida = Math.min(100, Math.max(0, vida));
    }
    
    // Actualiza el ki del personaje
    setKi(ki){
        this.#ki = Math.min(100, Math.max(0, ki));
    }

    // Actualiza la energía del personaje
    setEnergia(energia){
        this.#energia = Math.min(100, Math.max(0, energia));
    }

    // Actualiza la cantidad de semillas
    setSemilla(semilla){
        this.#semilla = semilla;
    }
}

export default Personaje;