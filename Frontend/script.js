//  Draftosaurus — lógica completa 
//  Variables globales 
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
document.getElementById('silenciar-musica').addEventListener('click', function() {
  const audio = document.getElementById('musica');
  audio.muted = !audio.muted;
  this.textContent = audio.muted ? '🔇' : '🔈';
});
//  Tipos de dinosaurios
const tiposDeDinos = [
  { nombre: 'T-Rex', imagen: 'red.png'},
  { nombre: 'Triceratops', imagen: 'green.png'},
  { nombre: 'Stego', imagen: 'light blue.png'},
  { nombre: 'Ptera', imagen: 'blue.png'},
  { nombre: 'Bronto', imagen: 'Yellow.png'},
  { nombre: 'Raptor', imagen: 'violet.png'}
];
const recintos = [
  {nombre: 'montevideo', pais: 'uruguay', area: 'ciudad' },
  {nombre: 'rivera', pais: 'uruguay', area: 'campo' },
  {nombre: 'campo', pais: 'uruguay', area: 'campo' },
  {nombre: 'moscu', pais: 'rusia', area: 'ciudad' },
  {nombre: 'cheliabinsk', pais: 'rusia', area: 'ciudad' },
  {nombre: 'transiberiano', pais: 'rusia', area: 'campo' },
  {nombre: 'rio', pais: '', area: '' }
]

const getRecintosPor = (propiedad, valor) => {
    return recintos
        // Filtra los objetos donde la 'propiedad' coincide con el 'valor' (ej: 'ciudad')
        .filter(recinto => recinto[propiedad] === valor)
        // Mapea el resultado para devolver solo el nombre
        .map(recinto => recinto.nombre);
};

// 3. Objeto de reglas para el dado (1 al 6)
/*const reglasDado = {
    // 1: Área 'ciudad' (montevideo, moscu, cheliabinsk)
    1: getRecintosPor('area', 'ciudad'), 

    // 2: País 'uruguay' (montevideo, rivera, campo)
    2: getRecintosPor('pais', 'uruguay'),

    // 3: Vacío por ahora
    3: recintos
      .filter(r => r.nombre !== 'rio') // Excluye el recinto 'rio'
      .filter(r => zoologicos[jugadorActual][r.nombre].length === 0) // Solo recintos vacíos
      .map(r => r.nombre), 

    // 4: País 'rusia' (moscu, cheliabinsk, transiberiano)
    4: getRecintosPor('pais', 'rusia'),

    // 5: Área 'campo' (rivera, campo, transiberiano)
    5: getRecintosPor('area', 'campo'),

    // 6: Vacío por ahora
    6: recintos
      .filter(r => !zoologicos[jugadorActual][r.nombre].some(d => d.nombre === 'T-Rex'))
      .map(r => r.nombre)
};*/

// Replace the reglasDado object with this function:
function reglasDado(valor) {
  switch (valor) {
    case 1: // Area 'ciudad'
      return getRecintosPor('area', 'ciudad');
    case 2: // Country 'uruguay'
      return getRecintosPor('pais', 'uruguay');
    case 3: // Only empty enclosures except 'rio'
      return recintos
        .filter(r => r.nombre !== 'rio')
        .filter(r => zoologicos[jugadorActual] && zoologicos[jugadorActual][r.nombre].length === 0)
        .map(r => r.nombre);
    case 4: // Country 'rusia'
      return getRecintosPor('pais', 'rusia');
    case 5: // Area 'campo'
      return getRecintosPor('area', 'campo');
    case 6: // Only enclosures without a T-Rex
      return recintos
        .filter(r => zoologicos[jugadorActual] && !zoologicos[jugadorActual][r.nombre].some(d => d.nombre === 'T-Rex'))
        .map(r => r.nombre);
    default:
      return [];
  }
}


//  Inicializar juego 
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

//  Funciones básicas 
function obtenerDinoAleatorio() {
  return tiposDeDinos[Math.floor(Math.random() * tiposDeDinos.length)];
}

function repartirDinos() {
  for (let j = 1; j <= numJugadores; j++) {
    manos[j] = [];
    for (let i = 0; i < 5; i++) manos[j].push(obtenerDinoAleatorio());
  }
}

//  UI: Mano 
// Actualiza la visualización de la mano del jugador actual
function actualizarMano() {
  // Obtiene el contenedor HTML donde se mostrarán los dinosaurios de la mano
  const contenedor = document.getElementById('contenedor-mano');
  // Limpia el contenido previo del contenedor para actualizar la mano
  contenedor.innerHTML = '';
  // Recorre cada dinosaurio en la mano del jugador actual
  manos[jugadorActual].forEach((dino, indice) => {
    // Crea un div para representar visualmente al dinosaurio
    const div = document.createElement('div');
    // Asigna la clase CSS 'dino' para estilos
    div.className = 'dino';
    // Permite que el div sea arrastrable (drag & drop)
    div.draggable = true;
    // Guarda el índice del dinosaurio en un atributo personalizado
    div.dataset.index = indice;

    // Crea la imagen del dinosaurio y la configura
    const img = document.createElement('img');
    // Asigna la ruta de la imagen correspondiente
    img.src = '../assets/' + dino.imagen;
    // Asigna el nombre del dinosaurio como texto alternativo
    img.alt = dino.nombre;

    // Añade la imagen al div del dinosaurio
    div.appendChild(img);
    // Evento: al iniciar el arrastre, guarda el índice y selecciona el dino
    div.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', indice);
      seleccionarDino(indice);
    });
    // Evento: al hacer clic, selecciona el dinosaurio
    div.addEventListener('click', () => seleccionarDino(indice));
    // Añade el div del dinosaurio al contenedor de la mano
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

//  Dado 
function tirarDado() {
  ultimoDado = Math.floor(Math.random() * 6) + 1;
  document.getElementById('valor-dado').textContent = `🎲 Cubo: ${ultimoDado}`;
  actualizarZonasValidas();
}

//  Zonas 
// Función que actualiza visualmente qué zonas son válidas para colocar un dinosaurio
function actualizarZonasValidas() {
  // Selecciona todos los elementos con clase 'zona' y ejecuta una función para cada uno
  document.querySelectorAll('.zona').forEach(div => {
    // Remueve las clases 'valid' e 'invalid' del elemento
    div.classList.remove('valid', 'invalid');
    // Si no hay dinosaurio seleccionado o no se ha tirado el dado, termina la función
    if (seleccionado === null || ultimoDado === null) return;
    // Obtiene las zonas válidas según el resultado del dado
    //const validas = reglasDado[ultimoDado];

    const validas = reglasDado(ultimoDado);
    // Obtiene el dinosaurio seleccionado de la mano del jugador actual
    const dino = manos[jugadorActual][seleccionado];
    // Obtiene el nombre de la zona del atributo data-zona del div
    const zona = div.dataset.zona;

    // Verifica si la zona es válida y cumple con las reglas
    let cumple = validas.includes(zona) && cumpleReglasZona(zona, dino);

    // Reglas específicas para Moscú: puede haber dinosaurios repetidos
    if (zona === 'moscu' && zoologicos[jugadorActual].moscu.some(d => d.nombre === dino.nombre)) cumple = false;
    // Reglas específicas para Rivera: todos los dinosaurios deben ser iguales
    if (zona === 'rivera' && zoologicos[jugadorActual].rivera.length > 0 && zoologicos[jugadorActual].rivera[0].nombre !== dino.nombre) cumple = false;
    // Reglas específicas para Moscú: puede haber dinosaurios repetidos
    if (zona === 'moscu' && zoologicos[jugadorActual].moscu.some(d => d.nombre === dino.nombre)) cumple = false;
    // Reglas específicas para Rivera: todos los dinosaurios deben ser iguales
    if (zona === 'rivera' && zoologicos[jugadorActual].rivera.length > 0 && zoologicos[jugadorActual].rivera[0].nombre !== dino.nombre) cumple = false;
    // Reglas específicas para Campo: máximo 3 dinosaurios
    if (zona === 'campo' && zoologicos[jugadorActual].campo.length >= 3) cumple = false;
    // Reglas específicas para Montevideo: cualquier tipo de dinosaurio permitido (no hay restricción)
    // No es necesario agregar código, ya que no hay restricción.
    // Reglas específicas para Transiberiano: solo se puede colocar un dinosaurio
    if (zona === 'transiberiano' && zoologicos[jugadorActual].transiberiano.length >= 1) cumple = false;
    // Reglas específicas para Cheliabinsk: solo se puede colocar un dinosaurio
    if (zona === 'cheliabinsk' && zoologicos[jugadorActual].cheliabinsk.length >= 1) cumple = false;

    // Añade la clase 'valid' o 'invalid' según corresponda
    if (cumple) div.classList.add('valid');
    else div.classList.add('invalid');
  });
}

// Función que maneja la colocación de un dinosaurio en una zona específica
function colocarDinoEnZona(indice, zona) {
  // Obtiene el dinosaurio seleccionado de la mano del jugador actual
  const dino = manos[jugadorActual][indice];
  // Si no hay dinosaurio, termina la función
  if (!dino) return;

  if (ultimoDado === null) {
    alert('🎲 Lanza el dado antes.');
    return;
  }

  //const validas = reglasDado[ultimoDado];

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

//  Reglas de zonas 
function cumpleReglasZona(zona, dino) {
  // Obtiene el zoológico del jugador actual
  const zoo = zoologicos[jugadorActual];

  // Si la zona es 'rio', siempre permite colocar el dinosaurio
  if (zona === 'rio') return true;

  // En Moscú, no se permiten dinosaurios repetidos
  if (zona === 'moscu' && zoo.moscu.some(d => d.nombre === dino.nombre)) return true;

  // En Rivera, si ya hay dinosaurios, deben ser todos iguales
  if (zona === 'rivera' && zoo.rivera.length > 0 && zoo.rivera[0].nombre !== dino.nombre) return false;

  // En Campo, máximo 3 dinosaurios
  if (zona === 'campo' && zoo.campo.length >= 3) return false;

  // En Montevideo, máximo 6 dinosaurios
  if (zona === 'montevideo' && zoo.montevideo.length >= 6) return false;

  // En Cheliabinsk, el dinosaurio no puede estar en otra zona del zoológico
  if (zona === 'cheliabinsk') {
    for (let z in zoo) {
      if (z !== 'cheliabinsk' && zoo[z].some(dd => dd.nombre === dino.nombre)) return false;
      if (zona === 'cheliabinsk' && zoo.cheliabinsk.length >= 1) return false;
    }
  }

  // Si ninguna regla bloquea, permite colocar el dinosaurio
  return true;
}

//  UI: Zonas 
function actualizarZonas() {
  document.querySelectorAll('.zona').forEach(div => {
    const zona = div.dataset.zona;
    div.innerHTML = '';
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

//  Puntuación 
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

//  Final de partida 
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

//  Drag & Drop 
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

//  Eventos 
document.getElementById('tirar-dado').addEventListener('click', tirarDado);

// 🚀 Nuevo: botón Iniciar Juego
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
