const tiposDeDinos = [
  { nombre: 'T-Rex', imagen: 'red.png', tipo: 'fósil' },
  { nombre: 'Triceratops', imagen: 'green.png', tipo: 'campo' },
  { nombre: 'Stego', imagen: 'light blue.png', tipo: 'uruguay' },
  { nombre: 'Ptera', imagen: 'blue.png', tipo: 'rusia' },
  { nombre: 'Bronto', imagen: 'yellow.png', tipo: 'ciudad' },
  { nombre: 'Raptor', imagen: 'violet.png', tipo: 'ciudad' }
];

let mano = [];
let turno = 1;
let jugadorActual = 1;
let prohibidoTRex = false;
let ultimoDado = null;

let zoologico = {
  campo: [],
  montevideo: [],
  obelisco: [],
  moscu: [],
  cheliabinsk: [],
  transiberiano: []
};

// reglas de dado -> zonas válidas
const reglasDado = {
  1: ['campo', 'montevideo'],
  2: ['obelisco', 'montevideo'],
  3: ['campo', 'moscu', 'transiberiano'],
  4: ['obelisco', 'cheliabinsk'],
  5: ['moscu', 'obelisco', 'montevideo'],
  6: ['transiberiano', 'cheliabinsk', 'campo']
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
      seleccionarDino(indice);
    });
    div.addEventListener('click', () => seleccionarDino(indice));
    contenedor.appendChild(div);
  });
}

let seleccionado = null;
function seleccionarDino(indice) {
  seleccionado = indice;
  document.querySelectorAll('.dino').forEach(d =>
    d.classList.toggle('selected', d.dataset.index == indice)
  );
  actualizarZonasValidas();
}

function tirarDado() {
  ultimoDado = Math.floor(Math.random() * 6) + 1;
  document.getElementById('valor-dado').textContent = `🎲 Cubo: ${ultimoDado}`;
  actualizarZonasValidas();
}

function actualizarZonasValidas() {
  document.querySelectorAll('.zona').forEach(div => {
    div.classList.remove('valid', 'invalid');
    if (seleccionado === null || ultimoDado === null) return;
    const validas = reglasDado[ultimoDado];
    const dino = mano[seleccionado];
    if (validas.includes(div.dataset.zona) && cumpleReglasZona(div.dataset.zona, dino)) {
      div.classList.add('valid');
    } else {
      div.classList.add('invalid');
    }
  });
}

function colocarDinoEnZona(indice, zona) {
  const dino = mano[indice];
  if (!dino) return;

  if (!cumpleReglasZona(zona, dino)) {
    alert('❌ No puedes colocar este dinosaurio aquí según las reglas.');
    return;
  }

  zoologico[zona].push(dino);
  mano.splice(indice, 1);
  seleccionado = null;
  ultimoDado = null;
  document.getElementById('valor-dado').textContent = '🎲 Cubo: —';

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
}

function cumpleReglasZona(zona, dino) {
  const ladoIzquierdo = ['campo', 'montevideo', 'obelisco'];
  const ladoDerecho = ['moscu', 'cheliabinsk', 'transiberiano'];

  if (dino.nombre === 'T-Rex' && prohibidoTRex) return false;
  if (dino.tipo === 'ciudad' && !['moscu','obelisco','montevideo'].includes(zona)) return false;
  if (dino.tipo === 'uruguay' && !ladoIzquierdo.includes(zona)) return false;
  if (dino.tipo === 'rusia' && !ladoDerecho.includes(zona)) return false;
  if (dino.tipo === 'fósil' && zoologico[zona].length !== 0) return false;
  if (dino.tipo === 'campo' && zona !== 'campo') return false;

  // Reglas específicas de zonas
  switch(zona){
    case 'campo': return zoologico[zona].length < 3;
    case 'montevideo': return zoologico[zona].length < 6 && (zoologico[zona].length % 2 === 0 || zoologico[zona].some(d=>d.nombre===dino.nombre));
    case 'obelisco': return zoologico[zona].every(d=>d.nombre===dino.nombre);
    case 'moscu': return !zoologico[zona].some(d=>d.nombre===dino.nombre);
    case 'cheliabinsk': return !Object.values(zoologico).flat().some(d=>d.nombre===dino.nombre);
    case 'transiberiano': return zoologico[zona].length === 0;
  }
  return true;
}

function actualizarZonas() {
  document.querySelectorAll('.zona').forEach(div => {
    const zona = div.dataset.zona;
    div.innerHTML = `<strong>${zona}</strong><br>`;
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

  // Campo: exactamente 3 dinos → 7 pts
  if (zoologico.campo.length === 3) puntuacion += 7;

  // Montevideo: parejas
  const pares = {};
  zoologico.montevideo.forEach(d=>pares[d.nombre]=(pares[d.nombre]||0)+1);
  for(let n in pares) puntuacion += Math.floor(pares[n]/2)*5;

  // Obelisco: todos mismo tipo → 1 pts por dino
  if (zoologico.obelisco.length > 0 && zoologico.obelisco.every(d=>d.nombre===zoologico.obelisco[0].nombre))
    puntuacion += zoologico.obelisco.length;

  // Moscu: dinos distintos → 2 pts por cada
  puntuacion += zoologico.moscu.length*2;

  // Cheliabinsk: único → 7 pts si solo ese tipo
  if (zoologico.cheliabinsk.length===1) puntuacion += 7;

  // Transiberiano: 7 pts si más que все
  if (zoologico.transiberiano.length===1){
    const tipo = zoologico.transiberiano[0].nombre;
    let max = 0;
    for(let z in zoologico){
      max = Math.max(max, zoologico[z].filter(d=>d.nombre===tipo).length);
    }
    if (zoologico.transiberiano.filter(d=>d.nombre===tipo).length===max) puntuacion +=7;
  }

  // T-Rex bonus: +1 por zona con T-Rex
  for(let z in zoologico){
    if(zoologico[z].some(d=>d.nombre==='T-Rex')) puntuacion += 1;
  }

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

document.getElementById('siguiente-turno').addEventListener('click', siguienteTurno);
document.getElementById('tirar-dado').addEventListener('click', tirarDado);

generarMano();
agregarDropTargets();
actualizarZonas();
actualizarPuntuacion();
