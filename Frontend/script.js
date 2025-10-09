// Draftosaurus — lógica completa
// Variables globales
let numJugadores = 2;
let jugadorActual = 1;
let turno = 1;
let seleccionado = null;
let ultimoDado = null;

let zoologicos = {};
let manos = {};
let buffer = {};

document.getElementById('menu').addEventListener('click', () => {
  window.location.href = 'menu_principal.html';
});

document.getElementById('silenciar-musica').addEventListener('click', function () {
  const audio = document.getElementById('musica');
  audio.muted = !audio.muted;
  this.textContent = audio.muted ? '🔇' : '🔈';
});

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
  { nombre: 'montevideo', pais: 'uruguay', area: 'ciudad' },
  { nombre: 'rivera', pais: 'uruguay', area: 'campo' },
  { nombre: 'campo', pais: 'uruguay', area: 'campo' },
  { nombre: 'moscu', pais: 'rusia', area: 'ciudad' },
  { nombre: 'cheliabinsk', pais: 'rusia', area: 'ciudad' },
  { nombre: 'transiberiano', pais: 'rusia', area: 'campo' },
  { nombre: 'rio', pais: '', area: '' }
];

const getRecintosPor = (propiedad, valor) => {
  return recintos
    .filter(recinto => recinto[propiedad] === valor)
    .map(recinto => recinto.nombre);
};

function reglasDado(valor) {
  switch (valor) {
    case 1: // Area 'ciudad'
      return getRecintosPor('area', 'ciudad');
    case 2: // País 'uruguay'
      return getRecintosPor('pais', 'uruguay');
    case 3: // Solo recintos vacíos excepto 'rio'
      return recintos
        .filter(r => r.nombre !== 'rio')
        .filter(r => zoologicos[jugadorActual] && zoologicos[jugadorActual][r.nombre].length === 0)
        .map(r => r.nombre);
    case 4: // País 'rusia'
      return getRecintosPor('pais', 'rusia');
    case 5: // Area 'campo'
      return getRecintosPor('area', 'campo');
    case 6: // Solo recintos sin T-Rex
      return recintos
        .filter(r => zoologicos[jugadorActual] && !zoologicos[jugadorActual][r.nombre].some(d => d.nombre === 'T-Rex'))
        .map(r => r.nombre);
    default:
      return [];
  }
}

// Inicializar juego
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

// Funciones básicas
function obtenerDinoAleatorio() {
  return tiposDeDinos[Math.floor(Math.random() * tiposDeDinos.length)];
}

function repartirDinos() {
  for (let j = 1; j <= numJugadores; j++) {
    manos[j] = [];
    for (let i = 0; i < 5; i++) manos[j].push(obtenerDinoAleatorio());
  }
}

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
  actualizarZonasValidas();
}

// Dado
function tirarDado() {
  ultimoDado = Math.floor(Math.random() * 6) + 1;
  const dadoContainer = document.getElementById('valor-dado');
  dadoContainer.innerHTML = `🎲 Cubo: <img src="../assets/dado${ultimoDado}.png" alt="Dado ${ultimoDado}" class="dado-imagen">`;
  actualizarZonasValidas();
}

function actualizarZonasValidas() {
  const todasLasZonas = document.querySelectorAll('.grid-item.zona');
  todasLasZonas.forEach(div => div.classList.remove('valid', 'invalid'));

  if (ultimoDado === null) return;

  const zonasPermitidasPorDado = reglasDado(ultimoDado);

  todasLasZonas.forEach(div => {
    const zonaActual = div.dataset.zona;

    if (!zonasPermitidasPorDado.includes(zonaActual)) {
      div.classList.add('invalid');
      return;
    }

    if (seleccionado !== null) {
      const dinoSeleccionado = manos[jugadorActual][seleccionado];

      if (cumpleReglasZona(zonaActual, dinoSeleccionado)) {
        div.classList.add('valid');
      } else {
        div.classList.add('invalid');
      }
    }
  });
}

function colocarDinoEnZona(indice, zona) {
  const dino = manos[jugadorActual][indice];
  if (!dino) return;

  if (ultimoDado === null) {
    alert('🎲 Lanza el dado antes.');
    return;
  }

  const validas = reglasDado(ultimoDado);
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

  if (Object.values(manos).every(m => m.length === 0)) {
    finalizarPartida();
    return;
  }

  jugadorActual = jugadorActual % numJugadores + 1;

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
    document.getElementById('valor-dado').innerHTML = `🎲 Cubo: —`;
  }

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
  actualizarZonasValidas();
}

// Reglas de zonas
function cumpleReglasZona(zona, dino) {
  const zoo = zoologicos[jugadorActual];
  if (zona === 'rio') return true;
  if (zona === 'moscu' && zoo.moscu.some(d => d.nombre === dino.nombre)) return false;
  if (zona === 'rivera' && zoo.rivera.length > 0 && zoo.rivera[0].nombre !== dino.nombre) return false;
  if (zona === 'campo' && zoo.campo.length >= 3) return false;
  if (zona === 'montevideo' && zoo.montevideo.length >= 6) return false;
  if (zona === 'transiberiano' && zoo.transiberiano.length >= 1) return false;
  if (zona === 'cheliabinsk') {
    if (zoo.cheliabinsk.length >= 1) return false;
    for (let z in zoo) {
      if (z !== 'cheliabinsk' && zoo[z].some(dd => dd.nombre === dino.nombre)) return false;
    }
  }
  return true;
}

// UI: Zonas
function actualizarZonas() {
  document.querySelectorAll('.grid-item.zona').forEach(div => {
    const zona = div.dataset.zona;
    const contenedorDinos = div.querySelector('.dinos-en-zona');
    contenedorDinos.innerHTML = '';

    zoologicos[jugadorActual][zona].forEach(dino => {
      const img = document.createElement('img');
      img.src = '../assets/' + dino.imagen;
      img.alt = dino.nombre;
      img.className = 'dino-colocado';
      contenedorDinos.appendChild(img);
    });
  });
}

// Puntuación
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

// Final de partida
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

// Drag & Drop
function agregarDropTargets() {
  document.querySelectorAll('.grid-item.zona').forEach(div => {
    div.addEventListener('dragover', e => e.preventDefault());

    div.addEventListener('dragenter', () => {
      div.classList.add('drag-over-effect');
    });

    div.addEventListener('dragleave', () => {
      div.classList.remove('drag-over-effect');
    });

    div.addEventListener('drop', e => {
      e.preventDefault();
      div.classList.remove('drag-over-effect');

      const indice = e.dataTransfer.getData('text/plain');
      const zonaTarget = e.target.closest('.grid-item.zona');
      if (zonaTarget) {
        colocarDinoEnZona(indice, zonaTarget.dataset.zona);
      }
    });

    div.addEventListener('click', (e) => {
      if (seleccionado !== null) {
        const zonaTarget = e.target.closest('.grid-item.zona');
        if (zonaTarget) {
          colocarDinoEnZona(seleccionado, zonaTarget.dataset.zona);
        }
      }
    });
  });
}


// Eventos
document.getElementById('tirar-dado').addEventListener('click', tirarDado);

document.getElementById('iniciar-juego').addEventListener('click', () => {
  const jugadores = parseInt(document.getElementById('num-jugadores').value);
  if (isNaN(jugadores) || jugadores < 2 || jugadores > 5) {
    alert("❌ Número de jugadores inválido (elige 2-5).");
    return;
  }

  document.getElementById('seleccion-jugadores').style.display = 'none';
  document.getElementById('juego').style.display = 'block';

  inicializarJuego(jugadores);
  agregarDropTargets();
});


document.getElementById('guardar-partida').addEventListener('click', async () => {
  const jugadoresID = [1, 2];

  const data = {
    numJugadores,
    jugadorActual,
    turno,
    zoologicos,
    manos,
    jugadores: jugadoresID,
    fecha: new Date().toISOString()
  };

  try {
    const res = await fetch('http://localhost/JSandPHP/Backend/routes/api.php/saveMatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
      alert("✅ Partida guardada exitosamente!");
    } else {
      alert("⚠️ Error al guardar la partida: " + (result.error || ""));
    }
  } catch (err) {
    alert("❌ No se pudo conectar con el servidor: " + err.message);
  }
});


document.getElementById('cargar-partida').addEventListener('click', async () => {
    const userId = 1;
    try {
        const res = await fetch(`http://localhost/JSandPHP/Backend/routes/api.php/getMatches/${userId}`);
        const result = await res.json();

        if (result.success) {
            const select = document.getElementById('lista-partidas');
            select.innerHTML = '';
            result.matches.forEach(m => {
                const option = document.createElement('option');
                option.value = m.id;
                option.textContent = `ID: ${m.id} | Fecha: ${m.fecha} | Turno: ${m.turno} | Jugadores: ${m.num_jugadores}`;
                select.appendChild(option);
            });
            select.style.display = 'block';
        } else {
            alert("Error al cargar partidas: " + (result.error || ""));
        }
    } catch (err) {
        alert("No se pudo conectar con el servidor: " + err.message);
    }
});


document.getElementById('lista-partidas').addEventListener('change', async (e) => {
    const matchId = e.target.value;
    if (!matchId) return;

    try {
        const res = await fetch(`http://localhost/JSandPHP/Backend/routes/api.php/loadMatch/${matchId}`);
        const result = await res.json();

        if (result.success) {
            const match = result.match;

           
            numJugadores = match.num_jugadores;
            jugadorActual = match.jugador_actual;
            turno = match.turno;
            zoologicos = match.zoologicos;
            manos = match.manos;
            buffer = {};
            for (let j = 1; j <= numJugadores; j++) buffer[j] = [];

            actualizarMano();
            actualizarZonas();
            actualizarPuntuacion();
            agregarDropTargets();

            alert("✅ Partida cargada correctamente!");
        } else {
            alert("Error al cargar partida: " + (result.error || ""));
        }
    } catch (err) {
        alert("No se pudo conectar con el servidor: " + err.message);
    }
});
