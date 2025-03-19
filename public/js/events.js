// Gestion de l'authentification
function updateEventAuthSection() {
    const authSection = document.getElementById('auth-section');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        authSection.innerHTML = `
            <div class="user-info">
                <button class="btn-primary" onclick="openCreateEventModal()">
                    <i class="fas fa-plus"></i> Créer un événement
                </button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <div class="auth-buttons">
                <a href="../views/login.html" class="btn-secondary">Se connecter</a>
                <a href="../views/register.html" class="btn-primary">S'inscrire</a>
            </div>
        `;
    }
}

// Gestion du modal
const modal = document.getElementById('create-event-modal');
const closeBtn = document.querySelector('.close-modal');

function openCreateEventModal() {
    modal.style.display = 'block';
}

function closeCreateEventModal() {
    modal.style.display = 'none';
    document.getElementById('event-form').reset();
    document.getElementById('event-error').style.display = 'none';
    document.getElementById('event-success').style.display = 'none';
}

// Fermeture du modal
closeBtn.onclick = closeCreateEventModal;
window.onclick = (event) => {
    if (event.target === modal) {
        closeCreateEventModal();
    }
};

// Gestion des événements
let events = [];

// Fonction pour charger les événements
async function loadEvents() {
    try {
        const response = await fetch('../api/events', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            events = data;
            filterAndDisplayEvents();
        } else {
            console.error('Erreur lors du chargement des événements:', data.error);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour filtrer et afficher les événements
function filterAndDisplayEvents() {
    const container = document.getElementById('events-container');
    const typeFilter = document.getElementById('type-filter').value;
    
    // Filtrer les événements
    let filteredEvents = events;
    if (typeFilter !== 'all') {
        filteredEvents = events.filter(event => event.type === typeFilter);
    }
    
    // Trier les événements par date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Afficher les événements
    if (filteredEvents.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <p>Aucun événement trouvé</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredEvents.map(event => `
        <div class="event-card">
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <span><i class="far fa-calendar"></i>${formatDate(event.date)}</span>
                    <span><i class="fas fa-map-marker-alt"></i>${event.location}</span>
                    <span><i class="fas fa-tag"></i>${event.type}</span>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-actions">
                    <button class="btn-primary" onclick="registerForEvent('${event._id}')">
                        S'inscrire
                    </button>
                    <button class="btn-secondary" onclick="shareEvent('${event._id}')">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Fonction pour formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
}

// Gestion du formulaire de création d'événement
document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        type: document.getElementById('event-type').value
    };
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('../api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const successMessage = document.getElementById('event-success');
            successMessage.textContent = 'Événement créé avec succès !';
            successMessage.style.display = 'block';
            
            // Recharger les événements
            setTimeout(() => {
                closeCreateEventModal();
                loadEvents();
            }, 1500);
        } else {
            const errorMessage = document.getElementById('event-error');
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur:', error);
        const errorMessage = document.getElementById('event-error');
        errorMessage.textContent = 'Erreur lors de la création de l\'événement';
        errorMessage.style.display = 'block';
    }
});

// Fonction pour s'inscrire à un événement
async function registerForEvent(eventId) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../views/login.html';
        return;
    }
    
    try {
        const response = await fetch(`../api/events/${eventId}/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Inscription réussie !');
            loadEvents();
        } else {
            alert(data.error || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'inscription');
    }
}

// Fonction pour partager un événement
function shareEvent(eventId) {
    const event = events.find(e => e._id === eventId);
    if (!event) return;
    
    if (navigator.share) {
        navigator.share({
            title: event.title,
            text: `${event.title} - ${formatDate(event.date)} à ${event.location}`,
            url: window.location.href
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        const shareUrl = window.location.href;
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Lien copié dans le presse-papier !');
    }
}

// Écouteur pour le filtre
document.getElementById('type-filter').addEventListener('change', filterAndDisplayEvents);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    updateEventAuthSection();
});