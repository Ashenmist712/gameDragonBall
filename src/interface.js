import Swal from  "sweetalert2";
const atributosPersonaje = {
    "Goku": {
        "atk_basico" : "Punetazoooooo",
        "atk_espescial" : "KAme KAme Haaaaaaaa!!!!!!",
        "carga_ki" : "Aaaaaaaaaaaaaa!!!",
        "semilla" : "curacion",
        fondo: "rgba(7, 196, 238, 0.7 )"
    },
    "Veguetta": {
        "atk_basico" : "Resplandor final",
        "atk_espescial" : "Big Bang",
        "semilla" : "curacion",

        fondo: "rgba(255, 0, 0, 0.7 )"
    },
    "Gohan": {
        "atk_basico" : "Patada Lateral",
        "atk_espescial" : "Kame Hame Haaaaaaa",
        "semilla" : "curacion",
        fondo: "rgba(255, 255, 0, 0.7 )"
    },
    "Piccolo": {
        "atk_basico" : "Makankosappo",
        "atk_espescial" : "Hellzone Grenade",
        "semilla" : "curacion",
        fondo: "rgba(0, 255, 0, 0.7 )"
    },
    "Cell": {
        "atk_basico" : "Patada Lateral",
        "atk_espescial" : "Cell Rojo Fuertoteeeeee!!!!!!",
        "semilla" : "curacion",
        fondo: "rgba(0, 255, 0, 0.7 )"
    },
    "Gogueta": {
        "atk_basico" : "Puñetazooooo",
        "atk_espescial" : "Stardust Breaker",
        "semilla" : "curacion",
        fondo: "rgba(255, 0, 0, 0.7 )"
    },
    "Trunks": {
        "atk_basico" : "Masenko",
        "atk_espescial" : "Espadazo Fuerte",
        "semilla" : "curacion",
        fondo: "rgba(255, 255, 0, 0.7 )"
    },
    "Veguito": {
        "atk_basico" : "Kame Hame Ha",
        "atk_espescial" : "Stardust Breaker",
        "semilla" : "curacion",
        fondo: "rgba(255, 0, 0, 0.7 )"
    }
}

const atk_basico = (j1, j2) => {
    j1.atkBasico();
    j2.setVida(Math.max(0, j2.getVida() - 10));
    Swal.fire({
        text: atributosPersonaje[j1.getPersonaje()].atk_basico,
        imageUrl: `./public/img/DB/${j1.getPersonaje()}/basico.png`,
        imageWidth: 400,
        imageHeight: 400,
        position: "center-center",
        width: 600,
        color: "#fff",
        background: "none",
        backdrop: atributosPersonaje[j1.getPersonaje()].fondo,
        imageAlt: "Ataque Basico",
        showConfirmButton: false,
        timer:1500
    });
};
const atk_especial = (j1, j2) => {
    j1.atkEspecial();
    j2.setVida(Math.max(0, j2.getVida() - 20));
    Swal.fire({
        text: atributosPersonaje[j1.getPersonaje()].atk_espescial,
        imageUrl: `./public/img/DB/${j1.getPersonaje()}/especial.png`,
        imageWidth: 400,
        imageHeight: 400,
        position: "center-center",
        width: 600,
        color: "#fff",
        background: "none",
        backdrop: atributosPersonaje[j1.getPersonaje()].fondo,
        imageAlt: "Ataque Especial",
        showConfirmButton: false,
        timer:1500
    });
}
const carga_ki = (j1) => {
    Swal.fire({
        text: "Aaaaaaaaaaaaaa!!!",
        imageUrl: `./public/img/DB/${j1.getPersonaje()}/energia.png`,
        imageWidth: 400,
        imageHeight: 400,
        position: "center-center",
        width: 600,
        color: "#fff",
        background: "none",
        backdrop: atributosPersonaje[j1.getPersonaje()].fondo,
        imageAlt: "cargando ki",
        showConfirmButton: false,
        timer: 1500
    });
}

const curacion = (j1) => {
    Swal.fire({
        text: "curacion",
        imageUrl: `./public/img/DB/${j1.getPersonaje()}/curar.png`,
        imageWidth: 400,
        imageHeight: 400,
        position: "center-center",
        width: 600,
        color: "#fff",
        background: "none",
        backdrop: atributosPersonaje[j1.getPersonaje()].fondo,
        imageAlt: "curacion",
        timer: 1500
    });
}
export { atk_basico };
export { atk_especial };
export { carga_ki };
export { curacion };