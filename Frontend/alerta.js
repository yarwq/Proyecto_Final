// Alerta personalizada para el juego Draftosaurus
function mostrarAlertaDrafto(mensaje) {
  let alerta = document.getElementById('drafto-alerta');
  if (!alerta) {
    alerta = document.createElement('div');
    alerta.id = 'drafto-alerta';
    alerta.className = 'drafto-alert';
    alerta.style.display = 'none';
    alerta.innerHTML = '<span id="drafto-alerta-mensaje"></span><br><button id="drafto-alerta-btn">Aceptar</button>';
    document.body.appendChild(alerta);
    document.getElementById('drafto-alerta-btn').onclick = function() {
      alerta.style.display = 'none';
    };
  }
  document.getElementById('drafto-alerta-mensaje').textContent = mensaje;
  alerta.style.display = 'block';
}
