class CoursesPage {
    constructor() {
        this.videos = [];
        this.initializeElements();
        this.initializeCategories();
        this.setupEventListeners();
        this.init();
    }

    initializeElements() {
        this.elements = {
            categoryFilter: document.getElementById('category-filter'),
            authorFilter: document.getElementById('author-filter'),
            videosContainer: document.getElementById('videos-container')
        };
        this.authors = new Set();
    }

    initializeCategories() {
        this.categories = [
            { id: '1', name: 'Coran' },
            { id: '2', name: 'Hadith' },
            { id: '3', name: 'Fiqh' },
            { id: '4', name: 'Histoire islamique' },
            { id: '5', name: 'Education' }
        ];
    }

    setupEventListeners() {
        const { categoryFilter, authorFilter } = this.elements;
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterVideos());
        if (authorFilter) authorFilter.addEventListener('change', () => this.filterVideos());
    }

    async init() {
        this.loadCategories();
        await this.loadVideos();
    }

    loadCategories() {
        const { categoryFilter } = this.elements;
        if (!categoryFilter) return;

        categoryFilter.innerHTML = '<option value="all">Toutes les catégories</option>' +
            this.categories.map(category => 
                `<option value="${category.id}">${category.name}</option>`
            ).join('');
    }

    updateAuthorsFilter() {
        const { authorFilter } = this.elements;
        if (!authorFilter) return;

        authorFilter.innerHTML = '<option value="all">Tous les récitateurs</option>' +
            Array.from(this.authors).sort().map(author => 
                `<option value="${author}">${author}</option>`
            ).join('');
    }

    async loadVideos() {
        const { videosContainer } = this.elements;
        try {
            const response = await fetch('/api/database/content/ghtvid', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            this.videos = Array.isArray(result) ? result : (result.data || []);
            
            this.authors = new Set(this.videos.map(video => video.vd_auth).filter(Boolean));
            this.updateAuthorsFilter();
            this.filterVideos();

        } catch (error) {
            console.error('Erreur lors du chargement des vidéos:', error);
            this.videos = [];
            if (videosContainer) {
                videosContainer.innerHTML = '<p class="error-message">Une erreur est survenue lors du chargement des vidéos.</p>';
            }
        }
    }

    displayVideos(videos) {
        const { videosContainer } = this.elements;
        if (!videosContainer) return;

        if (!videos?.length) {
            videosContainer.innerHTML = '<p class="no-videos">Aucune vidéo disponible.</p>';
            return;
        }

        videosContainer.innerHTML = '';
        videos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            if (videoCard) videosContainer.appendChild(videoCard);
        });
    }

    filterVideos() {
        const { categoryFilter, authorFilter } = this.elements;
        if (!Array.isArray(this.videos)) return;

        const selectedCategory = categoryFilter?.value || 'all';
        const selectedAuthor = authorFilter?.value || 'all';

        const filteredVideos = this.videos.filter(video => 
            (selectedCategory === 'all' || String(video.vd_cate) === String(selectedCategory)) &&
            (selectedAuthor === 'all' || video.vd_auth === selectedAuthor)
        );

        this.displayVideos(filteredVideos);
    }

    getCategoryName(categoryId) {
        return this.categories.find(cat => cat.id === String(categoryId))?.name || 'Non catégorisé';
    }

    createVideoCard(video) {
        if (!video || typeof video !== 'object') return null;

        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        
        const iframe = document.createElement('iframe');
        Object.assign(iframe, {
            src: `https://www.youtube.com/embed/${video.vd_url}`,
            frameBorder: '0',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            allowFullscreen: true
        });

        const videoInfo = document.createElement('div');
        videoInfo.className = 'video-info';
        videoInfo.innerHTML = `
            <h3>${video.vd_title || 'Sans titre'}</h3>
            <p>${video.vd_desc || ''}</p>
            <div class="video-metadata">
                <span class="author">Récitateur: ${video.vd_auth || 'Anonyme'}</span>
                <span class="category">Catégorie: ${this.getCategoryName(video.vd_cate)}</span>
            </div>
        `;

        videoCard.append(iframe, videoInfo);
        return videoCard;
    }
}

document.addEventListener('DOMContentLoaded', () => new CoursesPage());