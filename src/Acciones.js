// Importa la clase que contiene los datos y estadísticas del personaje
import Personaje from "./Personaje.js";

// Define las acciones para cada jugador
class Acciones extends Personaje {

    // Guarda el turno del jugador e inicia el contador en 0 para el ataque especial
    #turno = false;
    #contadorAtk_especial = 0;

    // Crea al jugador con su nombre y personaje elegido
    constructor(nombre,personaje){
        super(nombre,personaje);
    }

    // Permite consultar y actualizar de quién es el turno
    getEsSuTurno(){
        return this.#turno;
    }

    setEsSuTurno(turno){
        this.#turno = turno;
    }

    // Consulta y reinicia el progreso de espera del ataque especial
    getContadorAtk_especial(){
        return this.#contadorAtk_especial;
    }

    setContadorAtk_especial(valor){
        this.#contadorAtk_especial = valor;
    }

    // Cuenta una acción propia válida, hasta dejar listo el ataque especial
    aumentarContadorAtk_especial(){
        this.#contadorAtk_especial = Math.min(2, this.#contadorAtk_especial + 1);
    }

    // Resta energía y ki al jugador que realiza el ataque básico
    atkBasico(){
        this.setEnergia(Math.max(0, this.getEnergia() - 5));
        this.setKi(Math.max(0, this.getKi() - 10));
        this.mostrarEstadisticas();
    }

    // Resta energía y ki al jugador que realiza el ataque especial
    atkEspecial(){
        this.setEnergia(Math.max(0, this.getEnergia() - 15));
        this.setKi(Math.max(0, this.getKi() - 20));
        this.mostrarEstadisticas();
    }

    // Usa una semilla para recuperar las estadísticas del jugador
    curacion(){
        if (this.getSemilla() <= 0 ||
            [this.getVida(), this.getKi(), this.getEnergia()].every(estadistica => estadistica >= 100)) {
            return false;
        }
        this.setEnergia(100);
        this.setKi(100);
        this.setVida(100);
        this.setSemilla(this.getSemilla() - 1);
        this.mostrarEstadisticas("Curacion");
        return true;
    }

    // Suma energía y ki sin pasar de 100
    cargaEnergia(){
        this.setEnergia((this.getEnergia() + 15) > 100 ? 100 : (this.getEnergia() + 15));
        this.setKi((this.getKi() + 10) > 100 ? 100 : (this.getKi() + 10));
        this.mostrarEstadisticas("Carga de energía");
    }

    // La defensa todavía no tiene nada por el momento
    defensa(){
    }
}

export default Acciones;