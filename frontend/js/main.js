// frontend/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameDisplay = document.getElementById('username-display');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            try {
                const result = await loginUser(formData);
                if (result.success) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('username', result.username);
                    window.location.href = 'menu_principal.html';
                }
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            try {
                const result = await registerUser(formData);
                if (result.success) {
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    window.location.href = 'login.html';
                }
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const result = await logoutUser();
                if (result.success) {
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                }
            } catch (error) {
                alert('Error al cerrar sesión.');
            }
        });
    }

    if (usernameDisplay) {
        const username = sessionStorage.getItem('username');
        if (username) {
            usernameDisplay.textContent = username;
        } else {
            window.location.href = 'login.html';
        }
    }
});