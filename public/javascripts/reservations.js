document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCatways();
    loadReservations();
    setupEventListeners();
    setupLogout();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }
}

function setupEventListeners() {
    document.getElementById('btnAddReservation').addEventListener('click', showAddForm);
    document.getElementById('btnCancelForm').addEventListener('click', hideForm);
    document.getElementById('reservationForm').addEventListener('submit', handleSubmit);
}

function showAddForm() {
    document.getElementById('formTitle').textContent = 'Ajouter une réservation';
    document.getElementById('reservationForm').reset();
    document.getElementById('reservationId').value = '';
    document.getElementById('oldCatwayNumber').value = '';
    document.getElementById('catwayNumber').disabled = false;
    document.getElementById('formContainer').style.display = 'block';
}

function showEditForm(reservation) {
    document.getElementById('formTitle').textContent = 'Modifier une réservation';
    document.getElementById('reservationId').value = reservation._id;
    document.getElementById('oldCatwayNumber').value = reservation.catwayNumber;
    document.getElementById('catwayNumber').value = reservation.catwayNumber;
    document.getElementById('clientName').value = reservation.clientName;
    document.getElementById('boatName').value = reservation.boatName;
    document.getElementById('startDate').value = reservation.startDate.split('T')[0];
    document.getElementById('endDate').value = reservation.endDate.split('T')[0];
    document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('reservationForm').reset();
}

async function loadCatways() {
    const token = localStorage.getItem('token');
    const select = document.getElementById('catwayNumber');

    try {
        const response = await fetch('/api/catways', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            select.innerHTML = '<option value="">-- Choisir un catway --</option>' +
                data.data.map(catway => `<option value="${catway.catwayNumber}">Catway ${catway.catwayNumber} (${catway.catwayType})</option>`).join('');
        }
    } catch (error) {
        console.error('Erreur chargement catways:', error);
    }
}

async function loadReservations() {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('reservationsTableBody');

    try {
        const response = await fetch('/api/catways', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (!data.success) throw new Error('Erreur chargement');

        let allReservations = [];

        for (const catway of data.data) {
            const resResponse = await fetch(`/api/catways/${catway.catwayNumber}/reservations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const resData = await resResponse.json();
            if (resData.success && resData.data) {
                allReservations = allReservations.concat(resData.data);
            }
        }

        if (allReservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucune réservation</td></tr>';
        } else {
            tbody.innerHTML = allReservations.map(res => {
                const today = new Date();
                const start = new Date(res.startDate);
                const end = new Date(res.endDate);
                const isActive = today >= start && today <= end;
                const isPast = today > end;
                
                let status = 'À venir';
                let badgeClass = 'badge-warning';
                if (isActive) {
                    status = 'En cours';
                    badgeClass = 'badge-success';
                } else if (isPast) {
                    status = 'Terminée';
                    badgeClass = 'badge-secondary';
                }

                return `
                    <tr>
                        <td>${res.catwayNumber}</td>
                        <td>${res.clientName}</td>
                        <td>${res.boatName}</td>
                        <td>${new Date(res.startDate).toLocaleDateString('fr-FR')}</td>
                        <td>${new Date(res.endDate).toLocaleDateString('fr-FR')}</td>
                        <td><span class="badge ${badgeClass}">${status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-edit" onclick="editReservation('${res.catwayNumber}', '${res._id}')">✏️</button>
                            <button class="btn btn-sm btn-delete" onclick="deleteReservation('${res.catwayNumber}', '${res._id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Erreur de chargement</td></tr>';
        console.error('Erreur:', error);
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const reservationId = document.getElementById('reservationId').value;
    const oldCatwayNumber = document.getElementById('oldCatwayNumber').value;
    const catwayNumber = document.getElementById('catwayNumber').value;
    const clientName = document.getElementById('clientName').value;
    const boatName = document.getElementById('boatName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const body = { 
        catwayNumber: parseInt(catwayNumber),
        clientName, 
        boatName, 
        startDate, 
        endDate 
    };

    try {
        let url, method;
        
        if (reservationId) {
            // Modification
            url = `/api/catways/${oldCatwayNumber}/reservations/${reservationId}`;
            method = 'PUT';
        } else {
            // Création
            url = `/api/catways/${catwayNumber}/reservations`;
            method = 'POST';
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.success) {
            showAlert('success', data.message);
            hideForm();
            loadReservations();
        } else {
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Erreur lors de l\'enregistrement');
        console.error('Erreur:', error);
    }
}

async function editReservation(catwayNumber, reservationId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/catways/${catwayNumber}/reservations/${reservationId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            showEditForm(data.data);
        }
    } catch (error) {
        showAlert('danger', 'Erreur lors du chargement');
    }
}

async function deleteReservation(catwayNumber, reservationId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/catways/${catwayNumber}/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            showAlert('success', data.message);
            loadReservations();
        } else {
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Erreur lors de la suppression');
    }
}

function showAlert(type, message) {
    const container = document.getElementById('alert-container');
    container.innerHTML = `
        <div class="alert alert-${type}">
            <p>${message}</p>
        </div>
    `;
    setTimeout(() => container.innerHTML = '', 3000);
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