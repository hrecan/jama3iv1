document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // Vérifier si l'utilisateur est déjà connecté
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    console.log('État initial:', { 
        user: user ? 'présent' : 'absent', 
        token: token ? 'présent' : 'absent'
    });

    // Fonction pour afficher un message
    function showMessage(element, message, duration = 3000) {
        element.textContent = message;
        element.style.display = 'block';
        
        // Cacher le message après la durée spécifiée
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    // Fonction pour afficher un message de succès avec une durée plus longue
    function showSuccessMessage(message, callback) {
        const SUCCESS_DURATION = 2000; // 10 secondes
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        // Ajouter un compte à rebours
        let timeLeft = Math.floor(SUCCESS_DURATION / 1000);
        const originalMessage = message;
        
        const timer = setInterval(() => {
            timeLeft--;
            successMessage.textContent = `${originalMessage} (${timeLeft}s)`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                successMessage.style.display = 'none';
                if (callback) callback();
            }
        }, 1000);
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Tentative de connexion...');

        // Cacher les messages précédents
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Récupérer les éléments du formulaire
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const requestData = { email, password };
            console.log('Envoi de la requête de connexion pour:', email);
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Réponse reçue:', {
                status: response.status,
                ok: response.ok,
                data: data
            });

            if (response.ok) {
                // Stocker le token et les informations de l'utilisateur
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                console.log('Données stockées dans localStorage:', {
                    token: data.token ? 'présent' : 'absent',
                    user: data.user ? {
                        type: data.user.us_type,
                        email: data.user.email
                    } : 'absent'
                });

                // Redirection directe vers database-admin
                showSuccessMessage('Connexion réussie ! Redirection vers database-admin...', () => {
                    window.location.href = '/views/database-admin.html';
                });
            } else {
                // Afficher l'erreur
                console.error('Erreur de connexion:', data.message);
                showMessage(errorMessage, data.message || 'Identifiants incorrects');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            showMessage(errorMessage, 'Erreur de connexion au serveur');
        }
    });
});
