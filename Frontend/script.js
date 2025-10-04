// ==================== Draftosaurus — lógica completa ====================

// 🦖 Tipos de dinosaurios
const tiposDeDinos = [
  { nombre: 'T-Rex', imagen: 'red.png', tipo: 'fósil' },
  { nombre: 'Triceratops', imagen: 'green.png', tipo: 'campo' },
  { nombre: 'Stego', imagen: 'light blue.png', tipo: 'uruguay' },
  { nombre: 'Ptera', imagen: 'blue.png', tipo: 'rusia' },
  { nombre: 'Bronto', imagen: 'Yellow.png', tipo: 'ciudad' },
  { nombre: 'Raptor', imagen: 'violet.png', tipo: 'ciudad' }
];

// 🎲 Reglas del dado
const reglasDado = {
  1: ['moscu', 'cheliabinsk', 'montevideo', 'rivera', 'rio'],
  2: ['rivera', 'campo', 'montevideo', 'rio'],
  3: ['moscu', 'cheliabinsk', 'montevideo', 'rivera', 'campo', 'transiberiano', 'rio'],
  4: ['moscu', 'cheliabinsk', 'transiberiano', 'rio'],
  5: ['rivera', 'campo', 'transiberiano', 'rio'],
  6: ['moscu', 'cheliabinsk', 'montevideo', 'rivera', 'campo', 'transiberiano', 'rio'] // Prohibido T-Rex
};

// ==================== Variables globales ====================
let numJugadores = 2;
let jugadorActual = 1;
let turno = 1;
let seleccionado = null;
let ultimoDado = null;

let zoologicos = {};
let manos = {};
let buffer = {};

// ==================== Inicializar juego ====================
function inicializarJuego(jugadores) {
  numJugadores = jugadores;
  zoologicos = {};
  manos = {};
  buffer = {};

  for (let j = 1; j <= numJugadores; j++) {
    zoologicos[j] = { campo: [], montevideo: [], rivera: [], moscu: [], cheliabinsk: [], transiberiano: [], rio: [] };
    manos[j] = [];
    buffer[j] = [];
  }

  jugadorActual = 1;
  turno = 1;
  ultimoDado = null;

  repartirDinos();
  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
}

// ==================== Funciones básicas ====================
function obtenerDinoAleatorio() {
  return tiposDeDinos[Math.floor(Math.random() * tiposDeDinos.length)];
}

function repartirDinos() {
  for (let j = 1; j <= numJugadores; j++) {
    manos[j] = [];
    for (let i = 0; i < 6; i++) manos[j].push(obtenerDinoAleatorio());
  }
}

// ==================== UI: Mano ====================
function actualizarMano() {
  const contenedor = document.getElementById('contenedor-mano');
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
  actualizarZonasValidas();
}

// ==================== Dado ====================
function tirarDado() {
  ultimoDado = Math.floor(Math.random() * 6) + 1;
  document.getElementById('valor-dado').textContent = `🎲 Cubo: ${ultimoDado}`;
  actualizarZonasValidas();
}

// ==================== Zonas ====================
function actualizarZonasValidas() {
  document.querySelectorAll('.zona').forEach(div => {
    div.classList.remove('valid', 'invalid');
    if (seleccionado === null || ultimoDado === null) return;
    const validas = reglasDado[ultimoDado];
    const dino = manos[jugadorActual][seleccionado];
    const zona = div.dataset.zona;

    let cumple = validas.includes(zona) && cumpleReglasZona(zona, dino);

    if (zona === 'moscu' && zoologicos[jugadorActual].moscu.some(d => d.nombre === dino.nombre)) cumple = false;
    if (zona === 'rivera' && zoologicos[jugadorActual].rivera.length > 0 && zoologicos[jugadorActual].rivera[0].nombre !== dino.nombre) cumple = false;

    if (cumple) div.classList.add('valid');
    else div.classList.add('invalid');
  });
}

function colocarDinoEnZona(indice, zona) {
  const dino = manos[jugadorActual][indice];
  if (!dino) return;

  if (ultimoDado === null) {
    alert('🎲 Lanza el dado antes.');
    return;
  }

  const validas = reglasDado[ultimoDado];
  if (!validas.includes(zona)) {
    alert('❌ Zona no permitida por el dado.');
    return;
  }

  if (!cumpleReglasZona(zona, dino)) {
    alert('❌ No puedes colocar este dinosaurio aquí.');
    return;
  }

  zoologicos[jugadorActual][zona].push(dino);
  manos[jugadorActual].splice(indice, 1);
  buffer[jugadorActual] = [...manos[jugadorActual]];

  seleccionado = null;
  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();

  // ¿Fin de partida?
  if (Object.values(manos).every(m => m.length === 0)) {
    finalizarPartida();
    return;
  }

  // Siguiente jugador
  jugadorActual = jugadorActual % numJugadores + 1;

  // ¿Todos jugaron este turno?
  if (Object.values(buffer).every(b => b.length !== 0)) {
    const nuevasManos = {};
    for (let j = 1; j <= numJugadores; j++) {
      const siguiente = j % numJugadores + 1;
      nuevasManos[siguiente] = buffer[j];
    }
    manos = nuevasManos;

    for (let j = 1; j <= numJugadores; j++) buffer[j] = [];

    turno++;
    if (manos[1].length > 0) {
      alert(`✅ Ronda completada! Ahora comienza el turno ${turno}.`);
    }
    ultimoDado = null;
    document.getElementById('valor-dado').textContent = `🎲 Cubo: —`;
  }

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
}

// ==================== Reglas de zonas ====================
function cumpleReglasZona(zona, dino) {
  const zoo = zoologicos[jugadorActual];

  if (ultimoDado === 6) {
   
    return !zoo[zona].some(d => d.nombre === 'T-Rex');
  }
  
  if (zona === 'rio') return true;

  if (ultimoDado === 3 && dino.tipo === 'fósil' && zoo[zona].length > 0) return false;
  if (dino.tipo === 'ciudad' && !['moscu', 'cheliabinsk', 'montevideo', 'rivera'].includes(zona)) return false;
  if (dino.tipo === 'uruguay' && !['rivera', 'campo', 'montevideo'].includes(zona)) return false;
  if (dino.tipo === 'fósil' && zoo[zona].length !== 0) return false;
  if (dino.tipo === 'rusia' && !['moscu', 'cheliabinsk'].includes(zona)) return false;
  if (dino.tipo === 'campo' && !['campo', 'transiberiano'].includes(zona)) return false;
  if (ultimoDado === 6 && zoo[zona].some(d => d.nombre === 'T-Rex')) return false;

  if (zona === 'moscu' && zoo.moscu.some(d => d.nombre === dino.nombre)) return false;
  if (zona === 'rivera' && zoo.rivera.length > 0 && zoo.rivera[0].nombre !== dino.nombre) return false;
  if (zona === 'campo' && zoo.campo.length >= 3) return false;
  if (zona === 'montevideo' && zoo.montevideo.length >= 6) return false;

  if (zona === 'cheliabinsk') {
    for (let z in zoo) {
      if (z !== 'cheliabinsk' && zoo[z].some(dd => dd.nombre === dino.nombre)) return false;
    }
  }
  return true;
}

// ==================== UI: Zonas ====================
function actualizarZonas() {
  document.querySelectorAll('.zona').forEach(div => {
    const zona = div.dataset.zona;
    div.innerHTML = `<strong>${zona}</strong><br>`;

    zoologicos[jugadorActual][zona].forEach(dino => {
      const img = document.createElement('img');
      img.src = '../assets/' + dino.imagen;
      img.alt = dino.nombre;
      img.style.width = '30px';
      img.style.height = '30px';
      div.appendChild(img);
    });
  });
}

// ==================== Puntuación ====================
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
    for (let especie in conteoEspecies) {
      if (conteoEspecies[especie] > maxCantidad) maxCantidad = conteoEspecies[especie];
    }

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

function actualizarPuntuacion() {
  let txt = "";
  for (let j = 1; j <= numJugadores; j++) {
    txt += `P${j}: ${calcularPuntos(zoologicos[j])} pts | `;
  }
  document.getElementById('puntuacion').textContent = txt.slice(0, -3);
  document.getElementById('jugador').textContent = `Jugador ${jugadorActual} — Turno ${turno}`;
}

// ==================== Final de partida ====================
function finalizarPartida() {
  let mensaje = `🏁 Fin de la partida!\n\n`;
  let maxPuntos = -Infinity;
  let ganadores = [];

  for (let j = 1; j <= numJugadores; j++) {
    const pts = calcularPuntos(zoologicos[j]);
    mensaje += `Jugador ${j}: ${pts} pts\n`;
    if (pts > maxPuntos) {
      maxPuntos = pts;
      ganadores = [j];
    } else if (pts === maxPuntos) {
      ganadores.push(j);
    }
  }

  if (ganadores.length === 1) mensaje += `\n🎉 ¡Jugador ${ganadores[0]} gana!`;
  else mensaje += `\n🤝 ¡Empate entre jugadores ${ganadores.join(', ')}!`;

  alert(mensaje);
}

// ==================== Drag & Drop ====================
function agregarDropTargets() {
  document.querySelectorAll('.zona').forEach(div => {
    div.addEventListener('dragover', e => e.preventDefault());
    div.addEventListener('drop', e => {
      e.preventDefault();
      const indice = e.dataTransfer.getData('text/plain');
      colocarDinoEnZona(indice, div.dataset.zona);
    });
    div.addEventListener('click', () => {
      if (seleccionado !== null) colocarDinoEnZona(seleccionado, div.dataset.zona);
    });
  });
}

// ==================== Eventos ====================
document.getElementById('tirar-dado').addEventListener('click', tirarDado);

// 🚀 Nuevo: botón Iniciar Juego
document.getElementById('iniciar-juego').addEventListener('click', () => {
  const jugadores = parseInt(document.getElementById('num-jugadores').value);
  if (isNaN(jugadores) || jugadores < 2 || jugadores > 6) {
    alert("❌ Número de jugadores inválido (elige 2-6).");
    return;
  }

  document.getElementById('seleccion-jugadores').style.display = 'none';
  document.getElementById('juego').style.display = 'block';

  inicializarJuego(jugadores);
  agregarDropTargets();
});
