document.addEventListener('DOMContentLoaded', () => {
    const verRankingBtn = document.getElementById('ver-ranking');
    const tabla = document.getElementById('ranking-tabla');
    const contenedor = document.getElementById('ranking-container');

    if (verRankingBtn && tabla) {
        verRankingBtn.addEventListener('click', async () => {
            try {
                const res = await fetch("../../Backend/routes/api.php?action=getRanking");
                const data = await res.json();

                contenedor.style.display = 'block';

                const tbody = tabla.querySelector('tbody');
                tbody.innerHTML = '';

                if (!data || data.length === 0) {
                    tbody.innerHTML = `
                        <tr><td colspan="4">No ranking records yet.</td></tr>
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
                alert("Error getting ranking: " + err.message);
            }
        });
    }
});