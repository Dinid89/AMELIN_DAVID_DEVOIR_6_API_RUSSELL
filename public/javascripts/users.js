document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUsers();
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
    document.getElementById('btnAddUser').addEventListener('click', showAddForm);
    document.getElementById('btnCancelForm').addEventListener('click', hideForm);
    document.getElementById('userForm').addEventListener('submit', handleSubmit);
}

function showAddForm() {
    document.getElementById('formTitle').textContent = 'Ajouter un utilisateur';
    document.getElementById('userForm').reset();
    document.getElementById('oldEmail').value = '';
    document.getElementById('email').disabled = false;
    document.getElementById('password').required = true;
    document.getElementById('passwordNote').style.display = 'none';
    document.getElementById('formContainer').style.display = 'block';
}

function showEditForm(user) {
    document.getElementById('formTitle').textContent = 'Modifier un utilisateur';
    document.getElementById('oldEmail').value = user.email;
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('email').disabled = true;
    document.getElementById('password').value = '';
    document.getElementById('password').required = false;
    document.getElementById('passwordNote').style.display = 'inline';
    document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('userForm').reset();
}

async function loadUsers() {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('usersTableBody');

    try {
        const response = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!data.success) throw new Error('Erreur chargement');

        if (data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Aucun utilisateur</td></tr>';
        } else {
            tbody.innerHTML = data.data.map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editUser('${user.email}')">✏️ Modifier</button>
                        <button class="btn btn-sm btn-delete" onclick="deleteUser('${user.email}')">🗑️ Supprimer</button>
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
    const oldEmail = document.getElementById('oldEmail').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Valeurs du formulaire:', { username, email, password });

    const body = { username, email };
    if (password) {
        body.password = password;
    }

    try {
        let url, method;
        
        if (oldEmail) {
            // Modification
            url = `/api/users/${oldEmail}`;
            method = 'PUT';
        } else {
            // Création
            url = '/api/users';
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
            loadUsers();
        } else {
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Erreur lors de l\'enregistrement');
        console.error('Erreur:', error);
    }
}

async function editUser(email) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/users/${email}`, {
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

async function deleteUser(email) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/users/${email}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            showAlert('success', data.message);
            loadUsers();
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

