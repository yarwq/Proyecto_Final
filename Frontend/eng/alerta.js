// Custom alert for Draftosaurus game
function showDraftoAlert(message) {
  let alert = document.getElementById('drafto-alert');
  if (!alert) {
    alert = document.createElement('div');
    alert.id = 'drafto-alert';
    alert.className = 'drafto-alert';
    alert.style.display = 'none';
    alert.innerHTML = '<span id="drafto-alert-message"></span><br><button id="drafto-alert-btn">OK</button>';
    document.body.appendChild(alert);
    document.getElementById('drafto-alert-btn').onclick = function() {
      alert.style.display = 'none';
    };
  }
  document.getElementById('drafto-alert-message').textContent = message;
  alert.style.display = 'block';
}