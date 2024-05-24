class Personaje {
    constructor(nombre, salud, ataque_basico, super_ataque, habilidad_estelar = null) {
        this.nombre = nombre;
        this.salud = salud;
        this.salud_maxima = salud;
        this.ataque_basico = ataque_basico;
        this.super_ataque = super_ataque;
        this.super_ataque_cargado = false;
        this.ataques_para_cargar = 0;
        this.paralizado = false;
        this.habilidad_estelar = habilidad_estelar;
        this.dano_extra_super = 0;
        this.dano_extra_ataque = 0;
        this.trofeos = 0;
        this.rango = 1;
    }

    ataque(objetivo) {
        if (this.super_ataque_cargado) {
            return this.super_ataque;
        } else {
            return this.ataque_basico;
        }
    }

    recibir_ataque(cantidad) {
        if (!this.paralizado) {
            this.salud -= cantidad;
            if (this.salud < 0) {
                this.salud = 0;
            }
        }
    }

    cargar_super_ataque() {
        this.ataques_para_cargar += 1;
        if (this.ataques_para_cargar >= 3) {
            this.super_ataque_cargado = true;
            this.ataques_para_cargar = 0;
        }
    }

    usar_super_ataque(objetivo) {
        if (this.super_ataque_cargado) {
            if (this.nombre === "Frank") {
                objetivo.paralizado = true;
                this.super_ataque += this.dano_extra_super;
            } else if (this.nombre === "Poco") {
                this.super_ataque = 40;
                this.salud += 30;
            } else if (this.nombre === "Spike") {
                this.salud += 30;
            }
            objetivo.recibir_ataque(this.super_ataque);
            this.super_ataque_cargado = false;
            if (this.nombre === "Shelly") {
                this.dano_extra_ataque = this.ataque_basico;
            }
        } else {
            this.dano_extra_ataque = 0;
        }
    }

    aplicar_habilidad_estelar() {
        if (this.habilidad_estelar) {
            if (this.nombre === "Frank") {
                this.salud_maxima += 20;
                this.salud += 20;
                this.dano_extra_super = 15;
            }
        }
    }

    ganar_trofeos(cantidad) {
        this.trofeos += cantidad;
        if (this.trofeos >= this.rango * 25) {
            this.rango += 1;
            return 300; // Monedas ganadas por subir de rango
        }
        return 0;
    }

    toString() {
        return `${this.nombre} - Salud: ${this.salud}, Superataque Cargado: ${this.super_ataque_cargado}`;
    }
}

let trofeos = 0;
let monedas = 0;
let habilidades_compradas = {
    "Shelly": false,
    "Poco": false,
    "Spike": false,
    "Frank": false
};
let personajes = {
    "Shelly": new Personaje("Shelly", 100, 25, 35, habilidades_compradas["Shelly"]),
    "Poco": new Personaje("Poco", 125, 15, 45, habilidades_compradas["Poco"]),
    "Spike": new Personaje("Spike", 90, 30, 35, habilidades_compradas["Spike"]),
    "Frank": new Personaje("Frank", 200, 20, 20, habilidades_compradas["Frank"])
};

const outputElement = document.getElementById("game-output");
const inputElement = document.getElementById("game-input");

function printToGameOutput(message) {
    outputElement.innerText += message + "\n";
    outputElement.scrollTop = outputElement.scrollHeight;
}

function menuInicio() {
    printToGameOutput("Brawl Stars");
    printToGameOutput(`Trofeos: ${trofeos}`);
    printToGameOutput(`Monedas: ${monedas}`);
    printToGameOutput("1. Jugar");
    printToGameOutput("2. Tienda");
    printToGameOutput("3. Personajes");
    printToGameOutput("4. Salir");
}

function menuTienda() {
    printToGameOutput("Bienvenido a la tienda");
    printToGameOutput(`Monedas disponibles: ${monedas}`);
    const personajes = ["Shelly", "Poco", "Spike", "Frank"];
    const habilidades = {
        "Shelly": "Doble daño en próximo ataque básico después de super ataque",
        "Poco": "Super ataque cura 30 puntos de vida y hace 40 puntos de daño",
        "Spike": "Super ataque cura 30 puntos de vida",
        "Frank": "Super ataque hace 15 puntos más de daño y +20 puntos de vida"
    };
    personajes.forEach((personaje, i) => {
        const estado = habilidades_compradas[personaje] ? "Comprada" : "Disponible";
        printToGameOutput(`${i + 1}. ${personaje} - ${habilidades[personaje]} (${estado}) - 2000 monedas`);
    });
    printToGameOutput("5. Volver al menú principal");
}

function menuPersonajes() {
    printToGameOutput("Tus personajes:");
    for (let personaje in personajes) {
        const estado_habilidad = habilidades_compradas[personaje] ? "Comprada" : "No comprada";
        printToGameOutput(`${personaje} - Rango: ${personajes[personaje].rango} - Habilidad Estelar: ${estado_habilidad}`);
    }
}

function menuSeleccionPersonaje() {
    printToGameOutput("Selecciona tu personaje:");
    printToGameOutput("1. Shelly (Desbloqueado)");
    if (trofeos >= 25) {
        printToGameOutput("2. Poco (Desbloqueado)");
    } else {
        printToGameOutput("2. Poco (Bloqueado - Desbloquea con 25 trofeos)");
    }
    if (trofeos >= 50) {
        printToGameOutput("3. Spike (Desbloqueado)");
    } else {
        printToGameOutput("3. Spike (Bloqueado - Desbloquea con 50 trofeos)");
    }
    if (trofeos >= 100) {
        printToGameOutput("4. Frank (Desbloqueado)");
    } else {
        printToGameOutput("4. Frank (Bloqueado - Desbloquea con 100 trofeos)");
    }
}

function turnoJugador(jugador, enemigo) {
    printToGameOutput("Es tu turno.");
    printToGameOutput(`Tu salud: ${jugador.salud}`);
    printToGameOutput(`Salud del enemigo: ${enemigo.salud}`);
    if (jugador.super_ataque_cargado) {
        printToGameOutput("Superataque Cargado: Sí");
    } else {
        printToGameOutput(`Ataques para cargar el super: ${3 - jugador.ataques_para_cargar}`);
    }

    printToGameOutput("¿Qué deseas hacer?");
    if (jugador.super_ataque_cargado) {
        printToGameOutput("1. Ataque básico");
        printToGameOutput("2. Curarse");
        printToGameOutput("3. Superataque");
    } else {
        printToGameOutput("1. Ataque básico");
        printToGameOutput("2. Curarse");
    }
}

function turnoEnemigo(jugador, enemigo) {
    printToGameOutput("Turno del enemigo.");
    if (enemigo.paralizado) {
        printToGameOutput(`${enemigo.nombre} está paralizado y no puede atacar este turno.`);
        enemigo.paralizado = false;
    } else {
        if (enemigo.super_ataque_cargado) {
            enemigo.usar_super_ataque(jugador);
        } else {
            jugador.recibir_ataque(enemigo.ataque_basico);
            enemigo.cargar_super_ataque();
        }
    }
}

function miniMenu(ganador, trofeos_cambio, monedas_cambio) {
    if (ganador) {
        printToGameOutput(`¡Ganaste! Trofeos ganados: +${trofeos_cambio}, Monedas ganadas: +${monedas_cambio}`);
    } else {
        printToGameOutput(`¡Perdiste! Trofeos perdidos: -${Math.abs(trofeos_cambio)}, Monedas ganadas: +${monedas_cambio}`);
    }
    printToGameOutput("1. Volver al menú principal");
    printToGameOutput("2. Volver a jugar");
}

function main() {
    menuInicio();
}

main();

document.getElementById("game-submit").addEventListener("click", function() {
    const input = document.getElementById("game-input").value;
    document.getElementById("game-input").value = "";

    // Aquí puedes manejar el input del jugador y actualizar el juego.
    printToGameOutput(input);
});
