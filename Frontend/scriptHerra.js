// ==================== Draftosaurus — lógica con puntuación real ====================
// Botón menú principal
document.getElementById('menu').addEventListener('click', () => {
  window.location.href = 'menu_principal.html';
});
// Tipos de dinosaurios
const tiposDeDinos = [
  { nombre: "T-Rex", puntos: 6, imagen: "../assets/red.png" },
  { nombre: "Triceratops", puntos: 5, imagen: "../assets/green.png" },
  { nombre: "Stego", puntos: 4, imagen: "../assets/light blue.png" },
  { nombre: "Ptera", puntos: 3, imagen: "../assets/blue.png" },
  { nombre: "Bronto", puntos: 2, imagen: "../assets/Yellow.png" },
  { nombre: "Raptor", puntos: 1, imagen: "../assets/violet.png" },
];

// Objeto principal del zoológico
const zoo = {
  rivera: [],
  transiberiano: [],
  campo: [],
  moscu: [],
  montevideo: [],
  rio: [],
  cheliabinsk: [],
};

let dinoSeleccionado = null;

document.addEventListener("DOMContentLoaded", () => {
  const contenedorMano = document.getElementById("contenedor-mano");
  const zonas = document.querySelectorAll(".zona");
  const imgDado = document.getElementById("imagen-dado");
  const btnPuntos = document.querySelector(".seccion-info button");
  const puntuacionDiv = document.getElementById("puntuacion");

  // Mostrar todos los dinos al hacer click en la imagen del dado
  imgDado.addEventListener("click", () => {
    mostrarTodosLosDinos(contenedorMano);
  });

  // Contar puntos al presionar el botón
  btnPuntos.addEventListener("click", () => {
    const puntos = calcularPuntos(zoo);
    puntuacionDiv.textContent = `Puntuación: ${puntos}`;
  });

  // Drag & drop sobre las zonas
  zonas.forEach((zona) => {
    zona.addEventListener("click", () => {
      if (!dinoSeleccionado) return;
      const nombreZona = zona.dataset.zona;
      zoo[nombreZona].push(dinoSeleccionado);
      colocarDinoEnZona(zona, dinoSeleccionado);
      dinoSeleccionado = null;
      desmarcarSeleccion();
    });

    zona.addEventListener("dragover", (e) => e.preventDefault());
    zona.addEventListener("drop", (e) => {
      e.preventDefault();
      const dino = JSON.parse(e.dataTransfer.getData("text/plain"));
      const nombreZona = zona.dataset.zona;
      zoo[nombreZona].push(dino);
      colocarDinoEnZona(zona, dino);
    });
  });
});

// ==================== FUNCIONES ====================

function mostrarTodosLosDinos(contenedor) {
  contenedor.innerHTML = "";
  tiposDeDinos.forEach((dino) => {
    const img = document.createElement("img");
    img.src = dino.imagen;
    img.alt = dino.nombre;
    img.classList.add("dino");
    img.title = `${dino.nombre} (${dino.puntos} pts)`;
    img.draggable = true;

    // Drag & drop
    img.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(dino));
    });

    // Selección con click
    img.addEventListener("click", () => seleccionarDino(img, dino));

    contenedor.appendChild(img);
  });
}

function seleccionarDino(img, dino) {
  desmarcarSeleccion();
  img.classList.add("seleccionado");
  dinoSeleccionado = dino;
}

function desmarcarSeleccion() {
  document.querySelectorAll(".dino").forEach((d) => d.classList.remove("seleccionado"));
}

function colocarDinoEnZona(zona, dino) {
  const nuevo = document.createElement("img");
  nuevo.src = dino.imagen;
  nuevo.alt = dino.nombre;
  nuevo.classList.add("dino-zona");
  zona.appendChild(nuevo);
}

// ==================== FUNCIÓN DE PUNTOS ====================

function calcularPuntos(zoo) {
  let puntos = 0;

  if (zoo.campo.length === 3) puntos += 7;

  const pares = {};
  zoo.montevideo.forEach(d => pares[d.nombre] = (pares[d.nombre] || 0) + 1);
  for (let n in pares) puntos += Math.floor(pares[n] / 2) * 5;

  if (zoo.rivera.length > 0 && zoo.rivera.every(d => d.nombre === zoo.rivera[0].nombre)) {
    const tablaRivera = { 1: 2, 2: 4, 3: 8, 4: 12, 5: 18, 6: 24 };
    puntos += tablaRivera[zoo.rivera.length] || 0;
  }

  if (zoo.transiberiano.length > 0) {
    const conteoEspecies = {};
    for (let zona in zoo) {
      zoo[zona].forEach(d => {
        conteoEspecies[d.nombre] = (conteoEspecies[d.nombre] || 0) + 1;
      });
    }
    let maxCantidad = 0;
    for (let especie in conteoEspecies) if (conteoEspecies[especie] > maxCantidad) maxCantidad = conteoEspecies[especie];
    zoo.transiberiano.forEach(d => {
      if (conteoEspecies[d.nombre] === maxCantidad) puntos += 7;
    });
  }

  const distintosMoscu = new Set(zoo.moscu.map(d => d.nombre)).size;
  const tablaMoscu = { 1: 1, 2: 3, 3: 6, 4: 10, 5: 15, 6: 21 };
  if (distintosMoscu > 0) puntos += tablaMoscu[distintosMoscu] || 0;

  if (zoo.cheliabinsk.length === 1) puntos += 7;
  if (zoo.rio) puntos += zoo.rio.length;
  for (let z in zoo) if (zoo[z].some(d => d.nombre === 'T-Rex')) puntos += 1;

  return puntos;
}
