// Dino types available
const tiposDeDinos = ['T-Rex', 'Stego', 'Ptera', 'Tricera', 'Bronto'];

// Player's current hand
let mano = [];

// Player's zoo per zone
let zoologico = {
  campo: [],
  montevideo: [],
  obelisco: [],
  moscu: [],
  cheliabinsk: [],
  transiberiano: []
};

// Get a random dino
function obtenerDinoAleatorio() {
  return tiposDeDinos[Math.floor(Math.random() * tiposDeDinos.length)];
}

// Generate 3 random dinos for the hand
function generarMano() {
  mano = [];
  for (let i = 0; i < 3; i++) mano.push(obtenerDinoAleatorio());
  actualizarMano();
}

// Update UI for hand
function actualizarMano() {
  const contenedor = document.getElementById('contenedor-mano');
  contenedor.innerHTML = '';
  mano.forEach((dino, indice) => {
    const div = document.createElement('div');
    div.className = 'dino';
    div.textContent = dino;
    div.onclick = () => seleccionarDino(indice);
    contenedor.appendChild(div);
  });
}

// When player clicks a dino to place it
function seleccionarDino(indice) {
  const seleccionado = mano[indice];
  const zona = prompt("¿Dónde colocar el dinosaurio? (campo, montevideo, obelisco, moscu, cheliabinsk, transiberiano)");
  if (!zoologico[zona]) {
    alert("Zona inválida.");
    return;
  }
  zoologico[zona].push(seleccionado);
  mano.splice(indice, 1);
  actualizarMano();
  actualizarPuntuacion();
}

// Calculate score based on all zones
function actualizarPuntuacion() {
  let puntuacion = 0;

  // Campo: 7 points for every 3 dinos
  puntuacion += Math.floor(zoologico.campo.length / 3) * 7;

  // Montevideo: if between 1–6 dinos, +5
  if (zoologico.montevideo.length > 0 && zoologico.montevideo.length <= 6)
    puntuacion += 5;

  // Obelisco: bonus if count is 2, 4, 8, 12, etc.
  const ob = zoologico.obelisco.length;
  if ([2, 4, 8, 12, 18, 24].includes(ob)) puntuacion += ob;

  // Moscú: step progression (1,3,6,10,...)
  const cantidadMoscu = zoologico.moscu.length;
  const pasos = [1, 3, 6, 10, 15, 21];
  for (let paso of pasos) {
    if (cantidadMoscu >= paso) puntuacion += 1;
  }

  // Cheliábinsk: exactly 1 dino = +7
  if (zoologico.cheliabinsk.length === 1) puntuacion += 7;

  // Transiberiano: 1 dino = 👑 = 7
  if (zoologico.transiberiano.length === 1) puntuacion += 7;

  document.getElementById('puntuacion').textContent = `Puntuación: ${puntuacion}`;
}

// Start the game by giving the first hand
generarMano();
