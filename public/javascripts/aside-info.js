document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
});


function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').textContent = user.username;
        document.getElementById('userEmail').textContent = user.email;
    }
    
    // Afficher la date du jour
    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = today;
}