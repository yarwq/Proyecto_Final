// frontend/js/api.js

async function callApi(endpoint, options = {}) {
    const baseUrl = 'D:\Xampp\mysql\draftosaurus/backend/public/index.php';
    const url = `${baseUrl}?path=${endpoint}`;

    try {
        const response = await fetch(url, options);
        // La clave es que el servidor siempre devuelva JSON, incluso si hay un error.
        const data = await response.json(); 
        if (!response.ok) {
            throw new Error(data.error || 'Error desconocido en la API');
        }
        return data;
    } catch (error) {
        console.error('Error en la llamada a la API:', error);
        throw error;
    }
}

async function loginUser(formData) {
    return callApi('auth/login.php', {
        method: 'POST',
        body: formData
    });
}

async function registerUser(formData) {
    return callApi('auth/register.php', {
        method: 'POST',
        body: formData
    });
}

async function logoutUser() {
    return callApi('auth/logout.php');
}

async function getGameData() {
    return callApi('game/game.php');
}

async function getPlayerHand() {
    return callApi('game/player.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'init_hand' })
    });
}

async function rollDice() {
    return callApi('game/dice.php');
}