document.addEventListener('DOMContentLoaded', () => {
  const cargarBtn = document.getElementById('cargar-partida');
  const listaPartidas = document.getElementById('lista-partidas');

  if (!cargarBtn || !listaPartidas) return;

  // --- Cargar lista de partidas guardadas ---
  cargarBtn.addEventListener('click', async () => {
    const userId = Number(localStorage.getItem('userId') || 1); 
    alert(`UserID: ${userId}`);

    try {
      const res = await fetch(`../Backend/routes/api.php/getMatches/${userId}`);
      const result = await res.json();

      if (result.success) {
        listaPartidas.innerHTML = '';
        result.matches.forEach(m => {
          const option = document.createElement('option');
          option.value = m.id;
          option.textContent = `ID: ${m.id} | Fecha: ${m.fecha} | Turno: ${m.turno} | Jugadores: ${m.num_jugadores}`;
          listaPartidas.appendChild(option);
        });
        listaPartidas.style.display = 'block';
      } else {
        alert("  Error al cargar partidas: " + (result.error || ""));
      }
    } catch (err) {
      alert("  No se pudo conectar con el servidor: " + err.message);
    }
  });

  // --- Cargar una partida seleccionada ---
  listaPartidas.addEventListener('change', async (e) => {
    const matchId = e.target.value;
    if (!matchId) return;

    try {
      const res = await fetch(`../Backend/routes/api.php/loadMatch/${matchId}`);
      const result = await res.json();

      if (result.success) {
        const match = result.match;

        // Estas variables están definidas en script.js
        numJugadores = match.num_jugadores;
        jugadorActual = match.jugador_actual || 1;
        turno = match.turno || 1;
        zoologicos = match.zoologicos || {};
        manos = match.manos || {};
        buffer = {};
        for (let j = 1; j <= numJugadores; j++) {
          buffer[j] = manos[j] ? [...manos[j]] : [];
        }
        jugadoresQueColocaron = new Set();
        rondaActiva = false;
        ultimoDado = null;

        // Actualizamos el juego visualmente
        if (typeof actualizarMano === 'function') actualizarMano();
        if (typeof actualizarZonas === 'function') actualizarZonas();
        if (typeof actualizarPuntuacion === 'function') actualizarPuntuacion();
        if (typeof agregarDropTargets === 'function') agregarDropTargets();

        alert("Partida cargada correctamente!");
      } else {
        alert("Error al cargar partida: " + (result.error || ""));
      }
    } catch (err) {
      alert("No se pudo conectar con el servidor: " + err.message);
    }
  });

  // --- Guardar partida (ejemplo) ---
  const guardarBtn = document.getElementById('guardar-partida');
  if (guardarBtn) {
    guardarBtn.addEventListener('click', async () => {
      const userId = Number(localStorage.getItem('userId') || 1);
      const payload = {
        numJugadores,
        jugadorActual,
        turno,
        zoologicos,
        manos,
        fecha: new Date(),
        jugadores: Object.keys(manos).map(k => Number(k)),
        userId
      };

      try {
        const res = await fetch('../Backend/routes/api.php/saveMatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
          alert("Partida guardada correctamente!");
        } else {
          alert("Error al guardar partida: " + (result.error || ""));
        }
      } catch (err) {
        alert("No se pudo conectar con el servidor: " + err.message);
      }
    });
  }
});
