// ----------------------------
// Frontend/herramienta_apoyo.js
// ----------------------------

// Variables globales
let numJugadores = 2;
let jugadorActual = 1;
let turno = 1;
let zoologicos = {};
let manos = {};
let seleccionado = null;

// Tipos de dinosaurios
const tiposDeDinos = [
  { nombre: 'T-Rex', imagen: 'red.png' },
  { nombre: 'Triceratops', imagen: 'green.png' },
  { nombre: 'Stego', imagen: 'light blue.png' },
  { nombre: 'Ptera', imagen: 'blue.png' },
  { nombre: 'Bronto', imagen: 'Yellow.png' },
  { nombre: 'Raptor', imagen: 'violet.png' }
];

const recintos = [
  'montevideo', 'rivera', 'campo', 'moscu', 'cheliabinsk', 'transiberiano', 'rio'
];

// --------------------
// DOM Ready
// --------------------
document.addEventListener('DOMContentLoaded', () => {
    // Inicializamos el juego directamente con 1 jugador
    numJugadores = 1;
    jugadorActual = 1;
    
    // Inicializamos el zoológico y la mano del jugador
    zoologicos = {};
    manos = {};
    
    // Inicializamos las estructuras para un jugador
    zoologicos[1] = {};
    recintos.forEach(z => zoologicos[1][z] = []);
    manos[1] = [...tiposDeDinos];
    
    // Actualizamos la interfaz
    actualizarMano();
    actualizarZonas();
    
    // Establecemos la puntuación inicial
    const puntuacionEl = document.getElementById('puntuacion');
    if (puntuacionEl) {
        puntuacionEl.textContent = 'Puntuación: 0 puntos';
    }
    
    agregarDropTargets();

    // Event listener para el botón de calcular puntos
    const btnCalcularPuntos = document.getElementById('guardar-partida');
    if (btnCalcularPuntos) {
        btnCalcularPuntos.addEventListener('click', () => {
            const puntos = calcularPuntos(zoologicos[1]); // Siempre usamos jugador 1
            const puntuacionEl = document.getElementById('puntuacion');
            if (puntuacionEl) {
                puntuacionEl.textContent = `Puntuación: ${puntos} puntos`;
            }
        });
    }

    // Mostramos el juego inmediatamente
    document.getElementById('juego').style.display = 'block';
});

 const silenciar = document.getElementById('silenciar-musica');
  if (silenciar) {
    silenciar.addEventListener('click', function () {
      const audio = document.getElementById('musica');
      if (!audio) return;
      audio.muted = !audio.muted;
      this.textContent = audio.muted ? '🔇' : '🔈';
    });
  }


  // Botón iniciar juego
  const iniciarBtn = document.getElementById('iniciar-juego');
  if (iniciarBtn) {
    iniciarBtn.addEventListener('click', function () {
      const seleccion = document.querySelector('.jugador-opcion.selected');
      const cantidad = seleccion ? parseInt(seleccion.dataset.value) : null;
      if (!cantidad) {
        alert('Selecciona la cantidad de jugadores antes de iniciar.');
        return;
      }
      document.getElementById('seleccion-jugadores').style.display = 'none';
      document.getElementById('registro-nombres').style.display = 'block';
      generarCamposNombres(cantidad);
    });
  }

  // Generar campos de nombres
  function generarCamposNombres(numJugadores) {
    const form = document.querySelector('.nombres-form');
    if (!form) return;
    form.innerHTML = '';
    
    for (let i = 1; i <= numJugadores; i++) {
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'nombres-input-field-container';
      fieldContainer.innerHTML = `
        <div class="nombres-input-label">Jugador ${i}</div>
        <input type="text" class="nombres-holo-input" placeholder="Nombre" data-jugador="${i}">
      `;
      form.appendChild(fieldContainer);
    }
  }

  // Botón atrás
  document.addEventListener('click', function(e) {
    if (e.target.closest('.nombres-btn-back')) {
      document.getElementById('registro-nombres').style.display = 'none';
      document.getElementById('seleccion-jugadores').style.display = 'block';
    }
  });

  // Botón continuar
  document.addEventListener('click', function(e) {
    if (e.target.closest('.nombres-btn-continue')) {
      const inputs = document.querySelectorAll('.nombres-holo-input');
      const nombres = [];
      
      inputs.forEach(input => {
        nombres.push(input.value.trim() || `Jugador ${input.dataset.jugador}`);
      });
      
      window.nombresJugadores = nombres;
      document.getElementById('registro-nombres').style.display = 'none';
      document.getElementById('juego').style.display = 'block';
      inicializarJuego(nombres.length);
    }
  });

// --------------------
// Funciones de juego
// --------------------
function inicializarJuego(jugadores) {
  numJugadores = jugadores;
  zoologicos = {};
  manos = {};

  for (let j = 1; j <= numJugadores; j++) {
    zoologicos[j] = {};
    recintos.forEach(z => zoologicos[j][z] = []);
    manos[j] = [...tiposDeDinos]; // 6 dinosaurios diferentes
  }

  jugadorActual = 1;
  turno = 1;

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
  agregarDropTargets();
}

function actualizarMano() {
  const contenedor = document.getElementById('contenedor-mano');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  manos[jugadorActual].forEach((dino, indice) => {
    const div = document.createElement('div');
    div.className = 'dino';
    div.draggable = true;
    div.dataset.index = indice;

    const img = document.createElement('img');
    img.src = '../assets/' + dino.imagen;
    img.alt = dino.nombre;
    div.appendChild(img);

    div.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', indice);
      seleccionarDino(indice);
      document.body.classList.add('is-dragging');
    });

    div.addEventListener('dragend', () => {
      document.body.classList.remove('is-dragging');
    });

    div.addEventListener('click', () => seleccionarDino(indice));
    contenedor.appendChild(div);
  });
}

function seleccionarDino(indice) {
  seleccionado = indice;
  document.querySelectorAll('.dino').forEach(d =>
    d.classList.toggle('selected', d.dataset.index == indice)
  );
}

function colocarDinoEnZona(indice, zona) {
  if (!manos[jugadorActual] || manos[jugadorActual].length === 0) return;
  const dino = manos[jugadorActual][indice];
  if (!dino) return;

  // Añadimos una copia del dinosaurio en lugar del original
  zoologicos[jugadorActual][zona].push({...dino});
  seleccionado = null;

  actualizarMano();
  actualizarZonas();
}

function actualizarZonas() {
  document.querySelectorAll('.grid-item.zona').forEach(div => {
    const zona = div.dataset.zona;
    const contenedorDinos = div.querySelector('.dinos-en-zona');
    if (!contenedorDinos) return;
    contenedorDinos.innerHTML = '';

    const zoo = zoologicos[jugadorActual];
    if (!zoo) return;
    (zoo[zona] || []).forEach(dino => {
      const img = document.createElement('img');
      img.src = '../assets/' + dino.imagen;
      img.alt = dino.nombre;
      img.className = 'dino-colocado';
      contenedorDinos.appendChild(img);
    });
  });
}

// Esta función ya no es necesaria ya que los puntos solo se calcularán al hacer clic en el botón
function actualizarPuntuacion() {
    // No hacer nada, los puntos se calculan solo al presionar el botón
}

// Drag & Drop
function agregarDropTargets() {
  document.querySelectorAll('.grid-item.zona').forEach(div => {
    if (div.dataset.dropBound === '1') return;

    div.addEventListener('dragover', e => e.preventDefault());

    div.addEventListener('dragenter', () => div.classList.add('drag-over-effect'));
    div.addEventListener('dragleave', () => div.classList.remove('drag-over-effect'));

    div.addEventListener('drop', e => {
      e.preventDefault();
      div.classList.remove('drag-over-effect');
      const indice = e.dataTransfer.getData('text/plain');
      colocarDinoEnZona(indice, div.dataset.zona);
    });

    div.addEventListener('click', () => {
      if (seleccionado !== null) colocarDinoEnZona(seleccionado, div.dataset.zona);
    });

    div.dataset.dropBound = '1';
  });
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
