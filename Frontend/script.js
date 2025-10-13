// ----------------------------
// Frontend/script.js (corregido)
// ----------------------------

// Variables globales (estado del juego)
let numJugadores = 2;
let jugadorActual = 1;
let turno = 1;
let seleccionado = null;
let ultimoDado = null;

let zoologicos = {};
let manos = {};
let buffer = {};
let jugadoresQueColocaron = new Set();
let rondaActiva = false;
let terminandoRonda = false;

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

function reglasDado(valor, jugador = jugadorActual) {
  switch (valor) {
    case 1: // Area 'ciudad'
      return getRecintosPor('area', 'ciudad');
    case 2: // País 'uruguay'
      return getRecintosPor('pais', 'uruguay');
    case 3: // Solo recintos vacíos excepto 'rio'
      return recintos
        .filter(r => r.nombre !== 'rio')
        .filter(r => zoologicos[jugador] && zoologicos[jugador][r.nombre].length === 0)
        .map(r => r.nombre);
    case 4: // País 'rusia'
      return getRecintosPor('pais', 'rusia');
    case 5: // Area 'campo'
      return getRecintosPor('area', 'campo');
    case 6: // Solo recintos sin T-Rex
      return recintos
        .filter(r => zoologicos[jugador] && !zoologicos[jugador][r.nombre].some(d => d.nombre === 'T-Rex'))
        .map(r => r.nombre);
    default:
      return [];
  }
}

// --------------------
// DOM ready bootstrap
// --------------------
document.addEventListener('DOMContentLoaded', () => {
  // Selección visual de número de jugadores
  document.querySelectorAll('.jugador-opcion').forEach(el => {
    el.addEventListener('click', function() {
      document.querySelectorAll('.jugador-opcion').forEach(e => e.classList.remove('selected'));
      this.classList.add('selected');
      numJugadores = parseInt(this.dataset.value);
    });
  });

  // Botón menú
  const menuBtn = document.getElementById('menu');
  if (menuBtn) menuBtn.addEventListener('click', () => { window.location.href = 'menu_principal.html'; });

  // Botón silenciar
  const silenciar = document.getElementById('silenciar-musica');
  if (silenciar) {
    silenciar.addEventListener('click', function () {
      const audio = document.getElementById('musica');
      if (!audio) return;
      audio.muted = !audio.muted;
      this.textContent = audio.muted ? '🔇' : '🔈';
    });
  }

  // Botón tirar dado
  const tirarDadoBtn = document.getElementById('tirar-dado');
  if (tirarDadoBtn) tirarDadoBtn.addEventListener('click', tirarDado);

  // Overlay tiro dado
  const tirarDadoOverlay = document.getElementById('tirar-dado-overlay');
  if (tirarDadoOverlay) {
    tirarDadoOverlay.addEventListener('click', function(e) {
      mostrarAlertaDrafto('Espera a la siguiente ronda para lanzar el dado');
      e.preventDefault();
    });
  }

  // Hook para el botón iniciar juego
  const iniciarBtn = document.getElementById('iniciar-juego');
  if (iniciarBtn) {
    iniciarBtn.addEventListener('click', function () {
      const seleccion = document.querySelector('.jugador-opcion.selected');
      const cantidad = seleccion ? parseInt(seleccion.dataset.value) : null;
      if (!cantidad) {
        mostrarAlertaDrafto('Selecciona la cantidad de jugadores antes de iniciar.');
        return;
      }
      mostrarAlertaNombresJugadores(cantidad, function(nombres) {
        window.nombresJugadores = nombres;
        const selDiv = document.getElementById('seleccion-jugadores');
        if (selDiv) selDiv.style.display = 'none';
        const juegoDiv = document.getElementById('juego');
        if (juegoDiv) juegoDiv.style.display = '';
        inicializarJuego(cantidad);
      });
    });
  }

const guardarBtn = document.getElementById('guardar-partida');
if (guardarBtn) {
  guardarBtn.addEventListener('click', async () => {
    // Agregar array de jugadores (IDs del 1 al numJugadores)
    const data = { 
      numJugadores, 
      jugadorActual, 
      turno, 
      zoologicos, 
      manos, 
      fecha: new Date().toISOString(),
      jugadores: Array.from({length: numJugadores}, (_, i) => i + 1)
    };

    try {
      const res = await fetch('http://localhost/JS and PHP/Backend/routes/api.php/saveMatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) alert("✅ Partida guardada exitosamente!");
      else alert("⚠️ Error al guardar la partida: " + (result.error || ""));
    } catch (err) {
      alert("❌ No se pudo conectar con el servidor: " + err.message);
    }
  });
}


  // Cargar partidas (lista)
  const cargarBtn = document.getElementById('cargar-partida');
  if (cargarBtn) {
    cargarBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`http://localhost/JSandPHP/Backend/routes/api.php/getMatches/1`);
        const result = await res.json();
        if (result.success) {
          const select = document.getElementById('lista-partidas');
          if (!select) return;
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
  }

  // Cambio en select de lista partidas
  const listaPartidas = document.getElementById('lista-partidas');
  if (listaPartidas) {
    listaPartidas.addEventListener('change', async (e) => {
      const matchId = e.target.value;
      if (!matchId) return;
      try {
        const res = await fetch(`http://localhost/JSandPHP/Backend/routes/api.php/loadMatch/${matchId}`);
        const result = await res.json();
        if (result.success) {
          const match = result.match;
          numJugadores = match.num_jugadores;
          jugadorActual = match.jugador_actual || 1;
          turno = match.turno || 1;
          zoologicos = match.zoologicos || {};
          manos = match.manos || {};
          buffer = {};
          for (let j = 1; j <= numJugadores; j++) buffer[j] = manos[j] ? [...manos[j]] : [];
          jugadoresQueColocaron = new Set();
          rondaActiva = false;
          ultimoDado = null;

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
  }

  // Inicializar overlay disabled hook (si existe botón)
  if (typeof HTMLButtonElement !== 'undefined' && document.getElementById('tirar-dado')) {
    const tirarDadoBtn2 = document.getElementById('tirar-dado');
    const originalDisable = Object.getOwnPropertyDescriptor(HTMLButtonElement.prototype, 'disabled');
    if (originalDisable && originalDisable.set && originalDisable.get) {
      Object.defineProperty(tirarDadoBtn2, 'disabled', {
        set: function(val) {
          originalDisable.set.call(this, val);
          actualizarBotonTirarDado();
        },
        get: function() {
          return originalDisable.get.call(this);
        }
      });
    }
  }

  // Asegurar que los drop targets estén inicializados al cargar
  agregarDropTargets();
  actualizarBotonTirarDado();
});

// --------------------
// Funciones de juego
// --------------------
function inicializarJuego(jugadores) {
  numJugadores = jugadores;
  zoologicos = {};
  manos = {};
  buffer = {};
  jugadoresQueColocaron = new Set();

  for (let j = 1; j <= numJugadores; j++) {
    zoologicos[j] = { campo: [], montevideo: [], rivera: [], moscu: [], cheliabinsk: [], transiberiano: [], rio: [] };
    manos[j] = [];
    buffer[j] = null;
  }

  jugadorActual = 1;
  turno = 1;
  ultimoDado = null;
  rondaActiva = false;

  
  repartirDinos();
  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
}

function obtenerDinoAleatorio() {
  return tiposDeDinos[Math.floor(Math.random() * tiposDeDinos.length)];
}

function repartirDinos() {
  for (let j = 1; j <= numJugadores; j++) {
    manos[j] = [];
    for (let i = 0; i < 6; i++) manos[j].push(obtenerDinoAleatorio());
  }
}

function actualizarMano() {
  const contenedor = document.getElementById('contenedor-mano');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (!manos[jugadorActual]) manos[jugadorActual] = [];

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

  agregarDropTargets(); // asegurar que los eventos estén activos
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
  // Solo permitir tirar si no hay ronda activa
  if (rondaActiva) {
    mostrarAlertaDrafto('Ya hay una ronda activa. Espera a que todos coloquen.');
    return;
  }

  // Aquí: si querés que el jugador actual pueda tirar el dado, reemplaza la condición.
  // Actualmente reinicia rondas siempre desde jugador 1 — si prefieres que el
  // jugador actual inicie la ronda, elimina la comprobación siguiente.
  if (jugadorActual !== 1) {
    mostrarAlertaDrafto('Solo el Jugador 1 puede tirar el dado para iniciar la ronda.');
    return;
  }

  ultimoDado = Math.floor(Math.random() * 6) + 1;
  const dadoContainer = document.getElementById('valor-dado');
  if (dadoContainer) dadoContainer.innerHTML = `🎲 Cubo: <img src="../assets/dado${ultimoDado}.png" alt="Dado ${ultimoDado}" class="dado-imagen">`;
  actualizarZonasValidas();
  rondaActiva = true;
  const tirarBtn = document.getElementById('tirar-dado');
  if (tirarBtn) tirarBtn.disabled = true;
  if (typeof updateDebugBanner === 'function') updateDebugBanner();
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
      const dinoSeleccionado = manos[jugadorActual] && manos[jugadorActual][seleccionado];
      if (dinoSeleccionado && cumpleReglasZona(zonaActual, dinoSeleccionado)) {
        div.classList.add('valid');
      } else {
        div.classList.add('invalid');
      }
    }
  });
}

function colocarDinoEnZona(indice, zona) {
  if (!manos[jugadorActual] || manos[jugadorActual].length === 0) return;
  const dino = manos[jugadorActual][indice];
  if (!dino) return;

  if (ultimoDado === null) {
    mostrarAlertaDrafto('🎲 Lanza el dado antes.');
    return;
  }

  const validas = reglasDado(ultimoDado);
  if (!validas.includes(zona)) {
    mostrarAlertaDrafto('❌ Zona no permitida por el dado.');
    return;
  }

  if (!cumpleReglasZona(zona, dino)) {
    mostrarAlertaDrafto('❌ No puedes colocar este dinosaurio aquí.');
    return;
  }

  zoologicos[jugadorActual][zona].push(dino);
  manos[jugadorActual].splice(indice, 1);

  jugadoresQueColocaron.add(jugadorActual);

  seleccionado = null;

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
  if (typeof updateDebugBanner === 'function') updateDebugBanner();

  // Si todas las manos están vacías, finalizar
  if (Object.values(manos).every(m => m.length === 0)) {
    finalizarPartida();
    return;
  }

  // Si todos los jugadores han colocado en esta ronda, terminarla
  if (jugadoresQueColocaron.size === numJugadores) {
    terminarRonda();
    return;
  }

  // Avanzar al siguiente jugador que no haya colocado
  avanzarAlSiguienteJugadorNoColocado();

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
  actualizarZonasValidas();
}

function terminarRonda() {
  if (terminandoRonda) return;
  terminandoRonda = true;

  jugadoresQueColocaron = new Set();
  turno++;
  jugadorActual = 1;
  ultimoDado = null;
  rondaActiva = false;
  const dadoContainer = document.getElementById('valor-dado');
  if (dadoContainer) dadoContainer.innerHTML = `🎲 Cubo: —`;
  const tirarBtn = document.getElementById('tirar-dado');
  if (tirarBtn) tirarBtn.disabled = false;

  mostrarAlertaDrafto(`✅ Ronda completada! Ahora comienza el turno ${turno}.`);

  actualizarMano();
  actualizarZonas();
  actualizarPuntuacion();
  actualizarZonasValidas();
  if (typeof updateDebugBanner === 'function') updateDebugBanner();

  terminandoRonda = false;
}

function tieneMovimientoValido(jugador) {
  if (ultimoDado === null) return false;
  if (!manos[jugador] || manos[jugador].length === 0) return false;
  const zonasPermitidas = reglasDado(ultimoDado, jugador);
  for (let i = 0; i < manos[jugador].length; i++) {
    const dino = manos[jugador][i];
    for (let z = 0; z < zonasPermitidas.length; z++) {
      const zona = zonasPermitidas[z];
      if (cumpleReglasZona(zona, dino, jugador)) return true;
    }
  }
  return false;
}

function avanzarAlSiguienteJugadorNoColocado() {
  let siguiente = jugadorActual % numJugadores + 1;
  let intentos = 0;
  while (intentos < numJugadores) {
    if (!jugadoresQueColocaron.has(siguiente)) {
      if (tieneMovimientoValido(siguiente)) {
        jugadorActual = siguiente;
        mostrarAlertaDrafto(`Turno del ${window.nombresJugadores?.[jugadorActual - 1] || `Jugador ${jugadorActual}`}`);
        if (typeof updateDebugBanner === 'function') updateDebugBanner();
        return;
      } else {
        jugadoresQueColocaron.add(siguiente);
        mostrarAlertaDrafto(`Jugador ${siguiente} no tiene movimientos válidos; se salta.`);
        if (jugadoresQueColocaron.size === numJugadores) {
          terminarRonda();
          return;
        }
      }
    }
    siguiente = siguiente % numJugadores + 1;
    intentos++;
  }
  if (jugadoresQueColocaron.size === numJugadores) terminarRonda();
}

function updateDebugBanner() {
  let b = document.getElementById('debug-banner');
  if (!b) return;
  b.textContent = `Turno:${turno} JugadorActual:${jugadorActual} RondaAct:${rondaActiva} Colocados:[${Array.from(jugadoresQueColocaron)}] ManoSizes:[${Object.values(manos).map(m=>m.length)}]`;
}

// Reglas y UI (se mantienen tus validaciones)
function cumpleReglasZona(zona, dino, jugador = jugadorActual) {
  const zoo = zoologicos[jugador];
  if (!zoo) return false;
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

function calcularPuntos(zoo) {
  let puntos = 0;
  if (!zoo) return 0;
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
  const puntuacionEl = document.getElementById('puntuacion');
  if (puntuacionEl) puntuacionEl.textContent = txt.slice(0, -3);

  let nombre = window.nombresJugadores && window.nombresJugadores[jugadorActual - 1]
    ? window.nombresJugadores[jugadorActual - 1]
    : `Jugador ${jugadorActual}`;
  const jugadorEl = document.getElementById('jugador');
  if (jugadorEl) jugadorEl.textContent = `${nombre} — Turno ${turno}`;
}

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
  mostrarAlertaDrafto(mensaje);
}

// Drag & Drop: se evita re-registrar listeners usando dataset flag
function agregarDropTargets() {
  document.querySelectorAll('.grid-item.zona').forEach(div => {
    // evitar binding duplicado
    if (div.dataset.dropBound === '1') return;

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

    div.dataset.dropBound = '1';
  });
}

// UI helpers
function mostrarAlertaNombresJugadores(cantidad, callback) {
  const alertaExistente = document.querySelector('.drafto-alert');
  if (alertaExistente) alertaExistente.remove();

  const popup = document.createElement('div');
  popup.className = 'drafto-alert';

  const titulo = document.createElement('h2');
  titulo.textContent = 'Ingresa los nombres de los jugadores';
  popup.appendChild(titulo);

  const form = document.createElement('form');
  form.className = 'popup-nombres-form';

  const inputs = [];
  for (let i = 0; i < cantidad; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Jugador ${i + 1}`;
    input.className = 'nombre-jugador-input';
    input.required = true;
    form.appendChild(input);
    inputs.push(input);
  }

  popup.appendChild(form);

  const continuarContainer = document.createElement('div');
  continuarContainer.className = 'popup-nombres-botones';
  const btnContinuar = document.createElement('button');
  btnContinuar.type = 'submit';
  btnContinuar.textContent = 'Continuar';
  btnContinuar.className = 'btn';
  continuarContainer.appendChild(btnContinuar);
  popup.appendChild(continuarContainer);

  const volverContainer = document.createElement('div');
  volverContainer.className = 'popup-nombres-botones';
  const btnVolver = document.createElement('button');
  btnVolver.type = 'button';
  btnVolver.textContent = 'Volver';
  btnVolver.className = 'btn';
  btnVolver.onclick = function() {
    popup.remove();
    const sel = document.getElementById('seleccion-jugadores');
    if (sel) sel.style.display = '';
  };
  volverContainer.appendChild(btnVolver);
  popup.appendChild(volverContainer);

  document.body.appendChild(popup);

  btnContinuar.onclick = function(e) {
    e.preventDefault();
    const nombres = inputs.map(input => input.value.trim() || input.placeholder);
    popup.remove();
    callback(nombres);
  };
}

// funcion de mostrar alerta
function mostrarAlertaDrafto(mensaje) {
  const alerta = document.querySelector('.drafto-inline-alert');
  if (alerta) {
    alerta.textContent = mensaje;
    alerta.classList.add('visible');
    setTimeout(() => alerta.classList.remove('visible'), 3000);
  } else {
    // Crear popup modal si no existe alerta inline
    let popup = document.createElement('div');
    popup.className = 'drafto-alert-popup';

    let msg = document.createElement('div');
    msg.textContent = mensaje;
    msg.style.marginBottom = '16px';
    popup.appendChild(msg);

    let btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.className = 'btn';
    btn.onclick = () => popup.remove();
    popup.appendChild(btn);

    document.body.appendChild(popup);
  }
}

function actualizarBotonTirarDado() {
  const tirarDadoBtn = document.getElementById('tirar-dado');
  const tirarDadoOverlay = document.getElementById('tirar-dado-overlay');
  if (!tirarDadoBtn || !tirarDadoOverlay) return;
  if (tirarDadoBtn.disabled) tirarDadoOverlay.style.display = 'block';
  else tirarDadoOverlay.style.display = 'none';
}
