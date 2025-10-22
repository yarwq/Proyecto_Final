// window.cargarPartidas = async function() {
//   const listaPartidas = document.getElementById('lista-partidas');
//   const userId = Number(localStorage.getItem('userId') || 1); 

//   try {
//     const res = await fetch(`../Backend/routes/api.php/getMatches/${userId}`);
//     const result = await res.json();

//     if (result.success) {
//       listaPartidas.innerHTML = '';
//       result.matches.forEach(m => {
//         const option = document.createElement('option');
//         option.value = m.id;
//         option.textContent = `ID: ${m.id} | Fecha: ${m.fecha} | Turno: ${m.turno} | Jugadores: ${m.num_jugadores}`;
//         listaPartidas.appendChild(option);
//       });
//       listaPartidas.style.display = 'block';
//     } else {
//       alert("  Error al cargar partidas: " + (result.error || ""));
//     }
//   } catch (err) {
//     alert("No se pudo conectar con el servidor: " + err.message);
//   }
// };

// async function cargarUltimaPartida() {
//   await cargarPartidas(); 

//   const lista = document.getElementById('lista-partidas');
//   if (lista && lista.options.length > 0) {
//     lista.value = lista.options[0].value;       
//     lista.dispatchEvent(new Event('change'));    
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   const cargarBtn = document.getElementById('cargar-partida');
//   const listaPartidas = document.getElementById('lista-partidas');

//   if (!cargarBtn || !listaPartidas) return;

//   // --- Evento normal del botón ---
//   cargarBtn.addEventListener('click', cargarPartidas);

//   // --- Autocargar si hay ?load=true en la URL ---
// if (window.location.search.includes('load=true')) {
//   // Mostrar el juego
//   const juegoDiv = document.getElementById('juego');
//   if (juegoDiv) juegoDiv.style.display = 'block';

//   // Ocultar selección de jugadores y registro de nombres
//   const selJugadores = document.getElementById('seleccion-jugadores');
//   if (selJugadores) selJugadores.style.display = 'none';
//   const registroNombres = document.getElementById('registro-nombres');
//   if (registroNombres) registroNombres.style.display = 'none';

//   cargarUltimaPartida();
// }


//   // --- Listener para selección de partida ---
//   listaPartidas.addEventListener('change', async (e) => {
//     const matchId = e.target.value;
//     if (!matchId) return;

//     try {
//       const res = await fetch(`../Backend/routes/api.php/loadMatch/${matchId}`);
//       const result = await res.json();

//       if (result.success) {
//         const match = result.match;

//         numJugadores = match.num_jugadores;
//         jugadorActual = match.jugador_actual || 1;
//         turno = match.turno || 1;
//         zoologicos = match.zoologicos || {};
//         manos = match.manos || {};
//         buffer = {};
//         for (let j = 1; j <= numJugadores; j++) {
//           buffer[j] = manos[j] ? [...manos[j]] : [];
//         }
//         jugadoresQueColocaron = new Set();
//         rondaActiva = false;
//         ultimoDado = null;

//         if (typeof actualizarMano === 'function') actualizarMano();
//         if (typeof actualizarZonas === 'function') actualizarZonas();
//         if (typeof actualizarPuntuacion === 'function') actualizarPuntuacion();
//         if (typeof agregarDropTargets === 'function') agregarDropTargets();

//         alert("Partida cargada correctamente!");
//       } else {
//         alert("Error al cargar partida: " + (result.error || ""));
//       }
//     } catch (err) {
//       alert("No se pudo conectar con el servidor: " + err.message);
//     }
//   });
// });

// --- Mostrar Ranking Global ---
document.addEventListener('DOMContentLoaded', () => {
    const verRankingBtn = document.getElementById('ver-ranking');
    const tabla = document.getElementById('ranking-tabla');
    const contenedor = document.getElementById('ranking-container');

    if (verRankingBtn && tabla) {
        verRankingBtn.addEventListener('click', async () => {
            try {
                const res = await fetch("../Backend/routes/api.php?action=getRanking");
                const data = await res.json();

                contenedor.style.display = 'block';

                const tbody = tabla.querySelector('tbody');
                tbody.innerHTML = '';

                if (!data || data.length === 0) {
                    tbody.innerHTML = `
                        <tr><td colspan="4">No hay registros de ranking aún.</td></tr>
                    `;
                    return;
                }

                data.forEach((item, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.username}</td>
                        <td>${item.score}</td>
                        <td>-</td>
                    `;
                    tbody.appendChild(tr);
                });

            } catch (err) {
                alert("Error al obtener el ranking: " + err.message);
            }
        });
    }
});
