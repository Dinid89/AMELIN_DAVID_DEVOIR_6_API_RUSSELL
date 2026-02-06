function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const usernameSpan = document.getElementById('asideUsername');
        const emailSpan = document.getElementById('asideUserEmail');
        
        if (usernameSpan) usernameSpan.textContent = user.username;
        if (emailSpan) emailSpan.textContent = user.email;
    }
    
    // Afficher la date du jour
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const today = new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateEl.textContent = today;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
});
