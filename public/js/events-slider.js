class EventsSlider {
    constructor() {
        this.currentSlide = 0;
        this.events = [];
        this.container = document.querySelector('.events-slider');
        this.API_URL = window.APP_CONFIG.API_BASE_URL; // Définition de l'URL de l'API
        // Événements par défaut au cas où l'API n'est pas disponible
        this.defaultEvents = [
            {
                ev_id: 1,
                ev_title: "Prière du vendredi",
                ev_desc: "Prière et sermon du vendredi à la mosquée centrale",
                ev_sdate: new Date(new Date().setHours(13, 0, 0, 0)),
                ev_type: "Prière"
            },
            {
                ev_id: 2,
                ev_title: "Cours de Coran",
                ev_desc: "Cours de mémorisation du Coran pour tous les niveaux",
                ev_sdate: new Date(new Date().setHours(18, 30, 0, 0)),
                ev_type: "Éducation"
            }
        ];
        
        if (this.container) {
            this.init();
        }
    }

    async init() {
        try {
            await this.fetchEvents();
            this.renderEvents();
            this.startAutoSlide();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du slider:', error);
            // En cas d'erreur, utiliser les événements par défaut
            this.events = this.defaultEvents;
            this.renderEvents();
        }
    }

    async fetchEvents() {
        try {
            if (!this.API_URL) {
                throw new Error('API_URL non définie');
            }
            const response = await fetch(`${this.API_URL}/events`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            this.events = Array.isArray(data) && data.length > 0 ? data : this.defaultEvents;
        } catch (error) {
            console.error('Erreur lors de la récupération des événements:', error);
            this.events = this.defaultEvents;
        }
    }

    renderEvents() {
        if (!this.container) return;

        if (this.events.length === 0) {
            this.container.innerHTML = '<p class="no-events">Aucun événement à venir</p>';
            return;
        }

        this.container.innerHTML = `
            <div class="slider-container">
                ${this.events.map(event => this.createEventCard(event)).join('')}
            </div>
            ${this.events.length > 1 ? `
                <div class="slider-controls">
                    <button class="prev-btn" onclick="eventsSlider.prevSlide()">&lt;</button>
                    <button class="next-btn" onclick="eventsSlider.nextSlide()">&gt;</button>
                </div>
            ` : ''}
        `;

        // Initialiser la position du slider
        this.updateSlider();
    }

    createEventCard(event) {
        const date = new Date(event.ev_sdate);
        return `
            <div class="event-card" data-aos="fade-up">
                <div class="event-date">
                    ${date.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                    })}
                </div>
                <h3>${event.ev_title}</h3>
                <p>${event.ev_desc}</p>
                <div class="event-details">
                    <span class="event-time">
                        <i class="fas fa-clock"></i>
                        ${date.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    <span class="event-type">
                        <i class="fas fa-tag"></i>
                        ${event.ev_type}
                    </span>
                </div>
                <button onclick="location.href='/events/${event.ev_id}'" class="event-button">
                    En savoir plus
                </button>
            </div>
        `;
    }

    nextSlide() {
        if (this.events.length <= 1) return;
        this.currentSlide = (this.currentSlide + 1) % this.events.length;
        this.updateSlider();
    }

    prevSlide() {
        if (this.events.length <= 1) return;
        this.currentSlide = (this.currentSlide - 1 + this.events.length) % this.events.length;
        this.updateSlider();
    }

    updateSlider() {
        if (!this.container) return;
        
        const sliderContainer = this.container.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
    }

    startAutoSlide() {
        if (this.container && this.events.length > 1) {
            // Arrêter l'auto-slide précédent s'il existe
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
            }
            // Démarrer un nouvel auto-slide
            this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
        }
    }
}

// Attendre que le DOM soit chargé avant d'initialiser le slider
document.addEventListener('DOMContentLoaded', () => {
    window.eventsSlider = new EventsSlider();
});