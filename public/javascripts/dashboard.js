// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserInfo();
    loadCurrentReservations();
    setupLogout();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }
}

async function loadCurrentReservations() {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('reservationsTableBody');

    try {
        // Récupérer tous les catways
        const response = await fetch('/api/catways', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error('Erreur lors du chargement des catways');
        }

        const today = new Date();
        today.setHours(0,0,0,0); // Ignorer heures, minutes, secondes
        let allReservations = [];

        // Parcours des catways
        for (const catway of data.data) {
            const resResponse = await fetch(`/api/catways/${catway.catwayNumber}/reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const resData = await resResponse.json();

            if (resData.success && resData.data) {
                // Filtrer les réservations en cours
                const activeReservations = resData.data.filter(res => {
                    const start = new Date(res.startDate);
                    start.setHours(0,0,0,0);
                    const end = new Date(res.endDate);
                    end.setHours(0,0,0,0);
                    return today >= start && today <= end;
                });

                allReservations = allReservations.concat(activeReservations);
            }
        }

        // Mettre à jour le compteur
        document.getElementById('activeReservationsCount').textContent = allReservations.length;

        // Afficher les réservations
        if (allReservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucune réservation en cours</td></tr>';
        } else {
            tbody.innerHTML = allReservations.map(res => {
                const start = new Date(res.startDate).toLocaleDateString('fr-FR');
                const end = new Date(res.endDate).toLocaleDateString('fr-FR');
                return `
                    <tr>
                        <td>${res.catwayNumber}</td>
                        <td>${res.clientName}</td>
                        <td>${res.boatName}</td>
                        <td>${start}</td>
                        <td>${end}</td>
                        <td><span class="badge badge-success">En cours</span></td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erreur de chargement</td></tr>';
        console.error('Erreur:', error);
    }
}


function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        });
    }
}
        

