document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCatways();
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
    document.getElementById('btnAddCatway').addEventListener('click', showAddForm);
    document.getElementById('btnCancelForm').addEventListener('click', hideForm);
    document.getElementById('catwayForm').addEventListener('submit', handleSubmit);
}

function showAddForm() { //ajout d'un catway
    document.getElementById('formTitle').textContent = 'Ajouter un catway';
    document.getElementById('catwayForm').reset();
    document.getElementById('catwayId').value = '';
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('catwayNumber').disabled = false;
    document.getElementById("catwayType").disabled = false;
}

function showEditForm(catway) { //mofication d'un catway
    document.getElementById('formTitle').textContent = 'Modifier un catway';
    document.getElementById('catwayId').value = catway.catwayNumber;
    document.getElementById('catwayNumber').value = catway.catwayNumber;
    document.getElementById('catwayNumber').disabled = true; // Le numéro n'est pas modifiable
    document.getElementById('catwayType').value = catway.catwayType;
    document.getElementById('catwayType').disabled = true; // Le type n'est pas modifiable
    document.getElementById('catwayState').value = catway.catwayState;
    document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('catwayForm').reset();
}

async function loadCatways() {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('catwaysTableBody');

    try {
        const response = await fetch('/api/catways', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!data.success) throw new Error('Erreur chargement');

        if (data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Aucun catway</td></tr>';
        } else {
            tbody.innerHTML = data.data.map(catway => `
                <tr>
                    <td>${catway.catwayNumber}</td>
                    <td><span class="badge badge-${catway.catwayType === 'long' ? 'primary' : 'secondary'}">${catway.catwayType}</span></td>
                    <td>${catway.catwayState}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editCatway(${catway.catwayNumber})">✏️ Modifier</button>
                        <button class="btn btn-sm btn-delete" onclick="deleteCatway(${catway.catwayNumber})">🗑️ Supprimer</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erreur de chargement</td></tr>';
        console.error('Erreur:', error);
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const id = document.getElementById('catwayId').value;
    const catwayNumber = document.getElementById('catwayNumber').value;
    const catwayType = document.getElementById('catwayType').value;
    const catwayState = document.getElementById('catwayState').value;

    const body = { catwayNumber: parseInt(catwayNumber), catwayType, catwayState };

    try {
        const url = id ? `/api/catways/${id}` : '/api/catways';
        const method = id ? 'PUT' : 'POST';

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
            loadCatways();
        } else {
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Erreur lors de l\'enregistrement');
        console.error('Erreur:', error);
    }
}

async function editCatway(id) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/catways/${id}`, {
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

async function deleteCatway(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce catway ?')) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/catways/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            showAlert('success', data.message);
            loadCatways();
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