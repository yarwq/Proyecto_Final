// Draftosaurus — lógica de juego completa con 6 dinos y pase de mano y visualización

const tiposDeDinos = [
  { nombre: 'T-Rex', imagen: 'red.png', tipo: 'fósil' },
  { nombre: 'Triceratops', imagen: 'green.png', tipo: 'campo' },
  { nombre: 'Stego', imagen: 'lightblue.png', tipo: 'uruguay' },
  { nombre: 'Ptera', imagen: 'blue.png', tipo: 'rusia' },
  { nombre: 'Bronto', imagen: 'yellow.png', tipo: 'ciudad' },
  { nombre: 'Raptor', imagen: 'violet.png', tipo: 'ciudad' }
];

let jugadorActual = 1;
let turno = 1;
let seleccionado = null;
let ultimoDado = null;

// Zoológicos de jugadores
let zoologicos = {
  1: { campo: [], montevideo: [], rivera: [], moscu: [], cheliabinsk: [], transiberiano: [], rio: [] },
  2: { campo: [], montevideo: [], rivera: [], moscu: [], cheliabinsk: [], transiberiano: [], rio: [] }
};

// Manos de jugadores
let manos = { 1: [], 2: [] };

// Buffers para pasar las manos después de cada ronda
let buffer = { 1: [], 2: [] };

// Reglas del dado
const reglasDado = {
  1: ['moscu', 'cheliabinsk', 'montevideo', 'rivera'],
  2: ['rivera', 'campo', 'montevideo'],
  3: ['campo', 'transiberiano'],
  4: ['moscu', 'cheliabinsk'],
  5: ['campo', 'transiberiano'],
  6: ['moscu','cheliabinsk','montevideo','rivera','campo','transiberiano'] // Prohibido TRex
};

// Función para obtener un dinosaurio aleatorio
function obtenerDinoAleatorio() {
  return tiposDeDinos[Math.floor(Math.random() * tiposDeDinos.length)];
}

// Repartir 6 dinos a cada jugador al inicio
function repartirDinos() {
  for (let j = 1; j <= 2; j++) {
    manos[j] = [];
    for (let i = 0; i < 6; i++) manos[j].push(obtenerDinoAleatorio());
  }
  actualizarMano();
}

// Mostrar mano actual del jugador
function actualizarMano() {
  const contenedor = document.getElementById('contenedor-mano');
  contenedor.innerHTML = '';
  manos[jugadorActual].forEach((dino, indice) => {
    const div = document.createElement('div');
    div.className = 'dino';
    div.draggable = true;
    div.dataset.index = indice;

    const img = document.createElement('img');
    img.src = 'assets/' + dino.imagen;
    img.alt = dino.nombre;
    img.style.width = '50px';
    img.style.height = '50px';

    div.appendChild(img);
    div.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', indice);
      seleccionarDino(indice);
    });
    div.addEventListener('click', () => seleccionarDino(indice));
    contenedor.appendChild(div);
  });
}

// Seleccionar dinosaurio de la mano
function seleccionarDino(indice) {
  seleccionado = indice;
  document.querySelectorAll('.dino').forEach(d =>
    d.classList.toggle('selected', d.dataset.index == indice)
  );
  actualizarZonasValidas();
}

// Tirar dado una vez por ronda
function tirarDado() {
  if (ultimoDado !== null) return; 
  ultimoDado = Math.floor(Math.random() * 6) + 1;
  document.getElementById('valor-dado').textContent = `🎲 Cubo: ${ultimoDado}`;
  actualizarZonasValidas();
}

// Marcar zonas válidas según el dado y reglas
function actualizarZonasValidas() {
  document.querySelectorAll('.zona').forEach(div => {
    div.classList.remove('valid', 'invalid');
    if (seleccionado === null || ultimoDado === null) return;
    const validas = reglasDado[ultimoDado];
    const dino = manos[jugadorActual][seleccionado];
    const zona = div.dataset.zona;
    if (validas.includes(zona) && cumpleReglasZona(zona, dino)) {
      div.classList.add('valid');
    } else {
      div.classList.add('invalid');
    }
  });
}

// Colocar dinosaurio en zona
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

  // Guardar el resto de la mano en buffer para el intercambio
  buffer[jugadorActual] = manos[jugadorActual].filter((_, i) => i !== indice);
  manos[jugadorActual] = []; // mano limpia hasta el intercambio

  seleccionado = null;
  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();

  // Cambiar jugador
  jugadorActual = jugadorActual === 1 ? 2 : 1;

  // Si ambos jugadores ya colocaron su dinosaurio, intercambiar manos
  if (manos[jugadorActual].length === 0 && buffer[1].length + buffer[2].length > 0) {
    manos[1] = buffer[2];
    manos[2] = buffer[1];
    buffer[1] = [];
    buffer[2] = [];
    turno++;
    alert(`Ronda completada! Ahora comienza el turno ${turno}.`);
    // Tirar dado de nuevo para la nueva ronda
    ultimoDado = null;
    document.getElementById('valor-dado').textContent = `🎲 Cubo: —`;
  }

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
}

// Comprobar reglas de zona
function cumpleReglasZona(zona, dino) {
  const zoo = zoologicos[jugadorActual];
  if (dino.tipo === 'ciudad' && !['moscu','cheliabinsk','montevideo','rivera'].includes(zona)) return false;
  if (dino.tipo === 'uruguay' && !['rivera','campo','montevideo'].includes(zona)) return false;
  if (dino.tipo === 'fósil' && zoo[zona].length !== 0) return false;
  if (dino.tipo === 'rusia' && !['moscu','cheliabinsk'].includes(zona)) return false;
  if (dino.tipo === 'campo' && !['campo','transiberiano'].includes(zona)) return false;
  if (ultimoDado === 6 && zoo[zona].some(d=>d.nombre==='T-Rex')) return false;
  return true;
}

// Actualizar visualización de zonas
function actualizarZonas() {
  document.querySelectorAll('.zona').forEach(div => {
    const zona = div.dataset.zona;
    div.innerHTML = `<strong>${zona}</strong><br>`;
    [1,2].forEach(j => {
      zoologicos[j][zona].forEach(dino => {
        const img = document.createElement('img');
        img.src = 'assets/' + dino.imagen;
        img.alt = dino.nombre;
        img.style.width = '30px';
        img.style.height = '30px';
        div.appendChild(img);
      });
    });
  });
}

// Calcular puntos de un zoológico
function calcularPuntos(zoo) {
  let puntos = 0;
  if (zoo.campo.length === 3) puntos += 7;
  const pares = {};
  zoo.montevideo.forEach(d=>pares[d.nombre]=(pares[d.nombre]||0)+1);
  for(let n in pares) puntos += Math.floor(pares[n]/2)*5;
  if (zoo.rivera.length > 0 && zoo.rivera.every(d=>d.nombre===zoo.rivera[0].nombre)) puntos += zoo.rivera.length;
  if (zoo.transiberiano.length===1){
    const especie = zoo.transiberiano[0].nombre;
    let max = 0;
    for(let z in zoo) max = Math.max(max, zoo[z].filter(d=>d.nombre===especie).length);
    if (zoo.transiberiano.filter(d=>d.nombre===especie).length===max) puntos +=7;
  }
  puntos += zoo.moscu.length*2;
  if (zoo.cheliabinsk.length===1) puntos += 7;
  if (zoo.rio) puntos += zoo.rio.length;
  for(let z in zoo) if(zoo[z].some(d=>d.nombre==='T-Rex')) puntos += 1;
  return puntos;
}

// Actualizar puntuación en pantalla
function actualizarPuntuacion() {
  const puntos1 = calcularPuntos(zoologicos[1]);
  const puntos2 = calcularPuntos(zoologicos[2]);
  document.getElementById('puntuacion').textContent = `P1: ${puntos1} pts | P2: ${puntos2} pts`;
  document.getElementById('jugador').textContent = `Jugador ${jugadorActual} — Turno ${turno}`;
}

// Agregar listeners para drag & drop
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

// Inicialización
document.getElementById('tirar-dado').addEventListener('click', tirarDado);
repartirDinos();
agregarDropTargets();
actualizarZonas();
actualizarPuntuacion();
