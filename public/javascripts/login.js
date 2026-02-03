document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    console.log("login.js chargé")

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Submit intercepté par JS !");

            // Récupérer les valeurs du formulaire
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Cacher l'alerte précédente
            hideAlert();

            console.log('fetch POST lancé', {email, password});

            try {
                // Envoyer la requête POST à l'API
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Stocker le token et les infos utilisateur
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Rediriger vers le dashboard
                    window.location.href = '/dashboard';
                } else {
                    // Afficher l'erreur
                    showAlert(data.message || 'Erreur de connexion');
                }
            } catch (error) {
                showAlert('Erreur de connexion au serveur');
                console.error('Erreur:', error);
            }
        });
    }
});

// Afficher un message d'alerte
function showAlert(message) {
    const container = document.getElementById('alert-container');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger">
                <p>${message}</p>
            </div>
        `;
    }
}

// Cacher le message d'alerte
function hideAlert() {
    const container = document.getElementById('alert-container');
    if (container) {
        container.innerHTML = '';
    }
}