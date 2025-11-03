document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('../Backend/routes/api.php/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    console.log(json);

    if (json.success) {
      alert("Inicio de sesión exitoso");
      localStorage.setItem('token', json.token);
      localStorage.setItem('userId', json.user.id);
      window.location.href = "menu_principal.html";
    } else {
      alert(json.error);
    }
  } catch (err) {
    console.error("Error al hacer login:", err);
    alert("No se pudo conectar con el servidor");
  }
});
