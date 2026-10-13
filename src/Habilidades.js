// Declara las acciones que pueden implementar los personajes.
class Habilidades {
    // Ataque básico contra otro jugador.
    ataqueBasico() {}

    // Ataque especial contra otro jugador.
    ataqueEspecial() {}

    // Recupera las estadísticas del personaje.
    curacion() {}

    // Recupera ki y energía.
    cargaEnergia() {}

    // Espacio reservado para implementar defensa.
    defensa() {}
}

// Permite heredar las acciones desde otros módulos.
export default Habilidades;
