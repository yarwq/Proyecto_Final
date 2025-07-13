// Enable drag & drop and show dinosaurs in zones
const tiposDeDinos = [
  { nombre: 'T-Rex', imagen: 'red.png', tipo: 'fósil' },
  { nombre: 'Triceratops', imagen: 'green.png', tipo: 'campo' },
  { nombre: 'Stego', imagen: 'light blue.png', tipo: 'uruguay' },
  { nombre: 'Ptera', imagen: 'blue.png', tipo: 'rusia' },
  { nombre: 'Bronto', imagen: 'yellow.png', tipo: 'ciudad' },
  { nombre: 'Raptor', imagen: 'violet.png', tipo: 'ciudad' }
];

let mano = [];
let prohibidoTRex = false;
let turno = 1;
let jugadorActual = 1;
let zoologico = {
  campo: [],
  montevideo: [],
  obelisco: [],
  moscu: [],
  cheliabinsk: [],
  transiberiano: []
};

function obtenerDinoAleatorio() {
  return tiposDeDinos[Math.floor(Math.random() * tiposDeDinos.length)];
}

function generarMano() {
  mano = [];
  for (let i = 0; i < 3; i++) mano.push(obtenerDinoAleatorio());
  actualizarMano();
}

function actualizarMano() {
  const contenedor = document.getElementById('contenedor-mano');
  contenedor.innerHTML = '';
  mano.forEach((dino, indice) => {
    const div = document.createElement('div');
    div.className = 'dino';
    div.draggable = true;
    div.dataset.index = indice;

    const img = document.createElement('img');
    img.src = 'assets/' + dino.imagen;
    img.alt = dino.nombre;

    div.appendChild(img);
    div.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', indice);
    });
    contenedor.appendChild(div);
  });
}

function colocarDinoEnZona(indice, zona) {
  const seleccionado = mano[indice];
  if (!seleccionado) return;

  if (prohibidoTRex && seleccionado.nombre === 'T-Rex') {
    alert('🚫 No se puede colocar un T-Rex este turno.');
    return;
  }

  if (!cumpleReglasZona(zona, seleccionado)) {
    alert("❌ No puedes colocar ese dinosaurio aquí según las reglas.");
    return;
  }

  zoologico[zona].push(seleccionado);
  mano.splice(indice, 1);
  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
}

function cumpleReglasZona(zona, dino) {
  const ladoIzquierdo = ['campo', 'montevideo', 'obelisco'];
  const ladoDerecho = ['moscu', 'cheliabinsk', 'transiberiano'];

  if (dino.tipo === 'ciudad' && !['montevideo', 'moscu'].includes(zona)) return false;
  if (dino.tipo === 'uruguay' && !ladoIzquierdo.includes(zona)) return false;
  if (dino.tipo === 'rusia' && !ladoDerecho.includes(zona)) return false;
  if (dino.tipo === 'fósil' && zoologico[zona].length !== 0) return false;
  if (dino.tipo === 'campo' && zona !== 'campo') return false;

  return true;
}

function actualizarZonas() {
  document.querySelectorAll('.zona').forEach(div => {
    const zona = div.dataset.zona;
    div.innerHTML = `<strong>${zona.charAt(0).toUpperCase() + zona.slice(1)}</strong><br>`;
    zoologico[zona].forEach(dino => {
      const img = document.createElement('img');
      img.src = 'assets/' + dino.imagen;
      img.alt = dino.nombre;
      img.style.width = '30px';
      img.style.height = '30px';
      div.appendChild(img);
    });
  });
}

function actualizarPuntuacion() {
  let puntuacion = 0;
  puntuacion += Math.floor(zoologico.campo.length / 3) * 7;
  if (zoologico.montevideo.length > 0 && zoologico.montevideo.length <= 6) puntuacion += 5;
  const ob = zoologico.obelisco.length;
  if ([2, 4, 8, 12, 18, 24].includes(ob)) puntuacion += ob;
  const cantidadMoscu = zoologico.moscu.length;
  const pasos = [1, 3, 6, 10, 15, 21];
  for (let paso of pasos) {
    if (cantidadMoscu >= paso) puntuacion += 1;
  }
  if (zoologico.cheliabinsk.length === 1) puntuacion += 7;
  if (zoologico.transiberiano.length === 1) puntuacion += 7;

  document.getElementById('puntuacion').textContent = `Puntuación: ${puntuacion}`;
  document.getElementById('jugador').textContent = `Jugador ${jugadorActual} — Turno ${turno}`;
}

function siguienteTurno() {
  turno++;
  jugadorActual = jugadorActual === 1 ? 2 : 1;
  prohibidoTRex = Math.random() < 0.5;
  generarMano();
  actualizarZonas();
  actualizarPuntuacion();
}

function agregarDropTargets() {
  document.querySelectorAll('.zona').forEach(div => {
    div.addEventListener('dragover', e => {
      e.preventDefault();
    });
    div.addEventListener('drop', e => {
      e.preventDefault();
      const indice = e.dataTransfer.getData('text/plain');
      const zona = div.dataset.zona;
      colocarDinoEnZona(indice, zona);
    });
  });
}

document.getElementById('siguiente-turno').addEventListener('click', siguienteTurno);

generarMano();
agregarDropTargets();
actualizarZonas();
actualizarPuntuacion();
