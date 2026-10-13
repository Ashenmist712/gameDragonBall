import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./css/style.css";
import Swal from "sweetalert2";
import Acciones from "./Acciones.js";
import { atk_basico, atk_especial, carga_ki, curacion } from "./interface.js";


const btn_player1 = document.getElementById("btn_player1");
const btn_player2 = document.getElementById("btn_player2");
const player1 = document.getElementById("py1");
const player2 = document.getElementById("py2");
const nombre1 = document.getElementById("player1");
const nombre2 = document.getElementById("player2");
const nombres = document.getElementById("nombres");
const username1 = document.getElementById("username1");
const username2 = document.getElementById("username2");
const personaje1 = document.getElementById("personaje1");
const personaje2 = document.getElementById("personaje2");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const barras1 = document.getElementById("barras1");
const barras2 = document.getElementById("barras2");

// Obtiene las barras de estado del primer jugador
const vida1 = document.getElementById("vida1");
const energia1 = document.getElementById("energia1");
const ki1 = document.getElementById("ki1");
const semillas1 = document.querySelector("#btn_py1 .badge");

// Obtiene las barras de estado del segundo jugador
const vida2 = document.getElementById("vida2");
const energia2 = document.getElementById("energia2");
const ki2 = document.getElementById("ki2");
const semillas2 = document.querySelector("#btn_py2 .badge");
const btn_py1 = document.querySelectorAll("#btn_py1 button");
const btn_py2 = document.querySelectorAll("#btn_py2 button");

// Guarda las selecciones y las instancias de los jugadores
let pj1 = "", pj2 = "";
let jugador1, jugador2;

// Habilita únicamente las acciones del jugador que tiene el turno
const desactivar_botones = () => {
    //para jugador1
    btn_py1.forEach((boton) => {
        boton.disabled = !jugador1.getEsSuTurno();
    });
    //para jugador2
    btn_py2.forEach((boton) => {
        boton.disabled = !jugador2.getEsSuTurno();
    });
};

// Cede el turno después de una acción  y actualiza los botones y barras
const finalizar_turno = (jugadorEnTurno, adversario) => {
    jugadorEnTurno.setEsSuTurno(false);
    adversario.setEsSuTurno(true);
    desactivar_botones();
    barras();
};

// Comprueba el turno, ejecuta una acción y después pasa el turno
const realizar_accion = (jugadorEnTurno, adversario, accion) => {
    // Evita ejecutar acciones antes de crear ambos jugadores.
    if (!jugadorEnTurno || !adversario) {
        return msj_error("Ambos jugadores deben aceptar su personaje antes de comenzar.");
    }

    // Aunque los botones del rival estén deshabilitados, también validamos aquí el turno
    if (!jugadorEnTurno.getEsSuTurno()) {
        return msj_error("Espera a que sea tu turno para realizar una acción.");
    }

    // Ejecuta la acción solicitada; las acciones rechazadas conservan el turno actual
    switch (accion) {
        case "atkBasico":
            if (jugadorEnTurno.getKi() < 10 || jugadorEnTurno.getEnergia() < 5) {
                return msj_error("No tienes suficiente ki o energía. Carga ki/energía antes de volver a atacar.");
            }
            atk_basico(jugadorEnTurno, adversario);
            jugadorEnTurno.aumentarContadorAtk_especial();
            break;
        case "atkEspecial":
            if (jugadorEnTurno.getContadorAtk_especial() < 2) {
                const turnosFaltantes = 2 - jugadorEnTurno.getContadorAtk_especial();
                const conteoTurno = turnosFaltantes === 1 ? "turno" : "turnos";
                return msj_error(`Debes esperar ${turnosFaltantes} ${conteoTurno} para usar el ataque especial.`);
            }
            if (jugadorEnTurno.getKi() < 20 || jugadorEnTurno.getEnergia() < 15) {
                return msj_error("No tienes suficiente ki o energía. Carga ki/energía antes de volver a atacar.");
            }
            atk_especial(jugadorEnTurno, adversario);
            jugadorEnTurno.setContadorAtk_especial(0);
            break;
        case "cargaEnergia":
            if (jugadorEnTurno.getEnergia() >= 100 && jugadorEnTurno.getKi() >= 100) {
                return msj_error("Tu energía y ki ya están al máximo.");
            }
            jugadorEnTurno.cargaEnergia();
            carga_ki(jugadorEnTurno);
            jugadorEnTurno.aumentarContadorAtk_especial();
            break;
        case "curacion":
            if (!jugadorEnTurno.curacion()) {
                const mensaje = jugadorEnTurno.getSemilla() <= 0 ? "Este jugador ya no tiene semillas disponibles.": "Todas las estadísticas ya están al máximo.";
                return msj_error(mensaje);
            }
            curacion(jugadorEnTurno);
            jugadorEnTurno.aumentarContadorAtk_especial();
            break;
        default:
            return msj_error("No se reconoció la acción seleccionada.");
    }
    //validamos despues de cada turno si alguno de las jugadores tiene su vida es 0 para acabr el juego y mostrar el ganador con un alert
    if(adversario.getVida() == 0 ){
        barras();
        Swal.fire({
            title: "Victoria",
            imageUrl: `./public/img/DB/${jugadorEnTurno.getPersonaje()}/base.png`,
            text: `${jugadorEnTurno.getNombre()} ha ganado la batalla.`,
            imageWidth: 400,
            imageHeight: 400,
            position: "center-center",
            width: 600,
            color: "#fff",
            background: "none",
            imageAlt: "Ganador",
            showConfirmButton: true
        }).then(() => {
            window.location.reload();
        });
    }

    // Solo las acciones completadas se guardan aqui
    finalizar_turno(jugadorEnTurno, adversario);
    
};

//ocultamos las barras
barras1.classList.add("d-none");
barras2.classList.add("d-none");

// Muestra los personajes y nombres cuando los dos jugadores aceptan
const iniciar_juego = () => {
    // La batalla empieza con el jugador 1; el jugador 2 espera su primera acción
    jugador1.setEsSuTurno(true);
    jugador2.setEsSuTurno(false);
    desactivar_botones();

    document.body.classList.replace("selection-screen", "battle-screen");
    username1.innerText = nombre1.value;
    username2.innerText = nombre2.value;
    personaje1.innerText = pj1;
    personaje2.innerText = pj2;
    img1.src = `./public/img/DB/${pj1}/base.png`;
    img2.src = `./public/img/DB/${pj2}/base.png`;
    img1.alt = pj1;
    img2.alt = pj2;

    //Ocultamos las barras con
    document.getElementById("barras1").classList.remove("d-none");
    document.getElementById("barras2").classList.remove("d-none");

    //alerta de inio de juego
    let timerInterval;
    Swal.fire({
    title: "Iniciando batalla...",
    imageUrl: "./public/img/alert.jpeg",
    imageAlt: "Inicio de batalla",
    imageWidth: 250,
    imageHeight: 250,
    html: "¡Prepárense!",
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading();
    }
});
    //mandamos a llamar la funcion de barras para que se muestren los valores iniciales
    barras();
}

// Actualiza el ancho y el texto de las barras de ambos jugadores
const barras = () => {

    //para jugador 1
    vida1.style.width = `${jugador1.getVida()}%`;
    vida1.innerText = `${jugador1.getVida()}%`;
    energia1.style.width = `${jugador1.getEnergia()}%`;
    energia1.innerText = `${jugador1.getEnergia()}%`;
    ki1.style.width = `${jugador1.getKi()}%`;
    ki1.innerText = `${jugador1.getKi()}%`;
    semillas1.innerText = jugador1.getSemilla();

    //para jugador 2
    vida2.style.width = `${jugador2.getVida()}%`;
    vida2.innerText = `${jugador2.getVida()}%`;
    energia2.style.width = `${jugador2.getEnergia()}%`;
    energia2.innerText = `${jugador2.getEnergia()}%`;
    ki2.style.width = `${jugador2.getKi()}%`;
    ki2.innerText = `${jugador2.getKi()}%`;
    semillas2.innerText = jugador2.getSemilla();

}

// Permite solamente letras y números en los nombres
//para jugador1
nombre1.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/g, "");
});

//para jugador2
nombre2.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/g, "");
});

//quitamos el color rojo y le agregamos otro
const remover_seleccion = (color, ...elementos) => {
    elementos.forEach((elemento) => {
        elemento.classList.remove("bg-warning");
        elemento.classList.add("bg-" + color);
    });
};

// Muestra avisos de validación al usuario
const msj_error = (msj) => {
    Swal.fire({
        icon: "warning",
        title: "Error!",
        text: msj
    });
};

// Guarda el personaje elegido por el jugador y resalta su imagen
//para jugador1
[...player1.querySelectorAll("img")].forEach((imagen) => {
    imagen.addEventListener("click", (event) => {
        remover_seleccion("danger", ...player1.querySelectorAll("img"));
        event.target.classList.remove("bg-danger");
        event.target.classList.add("bg-warning");
        pj1 = event.target.alt;
    });
});


//para jugador2
[...player2.querySelectorAll("img")].forEach((imagen) => {
    imagen.addEventListener("click", (event) => {
        remover_seleccion("primary", ...player2.querySelectorAll("img"));
        event.target.classList.remove("bg-primary");
        event.target.classList.add("bg-warning");
        pj2 = event.target.alt;
    });
});

// Valida la selección del primer jugador y crea su personaje al aceptar
//para jugador1
btn_player1.addEventListener("click", () => {
    if (nombre1.value.trim() === "") {
        return msj_error("El jugador 1 no ha ingresado un nombre de usuario!");
    } else if (pj1 === "") {
        return msj_error("El jugador 1 debe seleccionar un personaje!");
    }

    jugador1 = new Acciones(nombre1.value.trim(), pj1);
    nombre1.disabled = true;
    player1.classList.add("d-none");
    btn_player1.disabled = true;
    if (jugador1 && jugador2) {
        nombres.classList.add("d-none");
        iniciar_juego();
    }
});

// Valida la selección del segundo jugador y crea su personaje al aceptar
//para jugador2
btn_player2.addEventListener("click", () => {
    if (nombre2.value.trim() === "") {
        return msj_error("El jugador 2 no ha ingresado un nombre de usuario!");
    } else if (pj2 === "") {
        return msj_error("El jugador 2 debe seleccionar un personaje!");
    }

    jugador2 = new Acciones(nombre2.value.trim(), pj2);
    nombre2.disabled = true;
    player2.classList.add("d-none");
    btn_player2.disabled = true;
    if (jugador1 && jugador2) {
        nombres.classList.add("d-none");
        iniciar_juego();
    }
});

//COnecta cada boton a la validacion de turnos, para mantenerlo conistente
//para jugador1
btn_py1.forEach((boton) => {
    boton.addEventListener("click", () => {
        realizar_accion(jugador1, jugador2, boton.dataset.action);
    });
});

//para jugador2
btn_py2.forEach((boton) => {
    //esperamos un click en cualquier boton
    boton.addEventListener("click", () => {
        realizar_accion(jugador2, jugador1, boton.dataset.action);
    });
});
