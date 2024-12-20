const tabs = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('.section');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Cambiar de sección
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('data-target');
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
    });
});

const searchInput = document.getElementById('search-input');
const recentAnimeContainer = document.getElementById('recent-anime-container');
const newAnimeContainer = document.getElementById('new-anime-container');
const actionAnimeContainer = document.getElementById('action-anime-container');
const episodesContainer = document.getElementById('episodes-container');

searchInput.addEventListener('input', searchAnime);

// Buscar animes
async function searchAnime() {
    const searchText = searchInput.value.trim().toLowerCase();
    if (!searchText) {
        recentAnimeContainer.innerHTML = '<p>Introduce un término de búsqueda.</p>';
        return;
    }
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchText)}&limit=10`);
        const data = await response.json();
        const animes = data.data;

        recentAnimeContainer.innerHTML = '';
        if (animes.length === 0) {
            recentAnimeContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        } else {
            animes.forEach(anime => {
                const animeCard = createAnimeCard(anime);
                recentAnimeContainer.appendChild(animeCard);
            });
        }
    } catch (error) {
        console.error("Error al buscar animes:", error);
        recentAnimeContainer.innerHTML = '<p>Ocurrió un error al buscar animes.</p>';
    }
}

// Cargar animes recientes en el home
async function loadRecentAnimes() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const data = await response.json();
        const animes = data.data.slice(0, 10); // Solo los primeros 10

        recentAnimeContainer.innerHTML = '';
        animes.forEach(anime => {
            const animeCard = createAnimeCard(anime);
            recentAnimeContainer.appendChild(animeCard);
        });
    } catch (error) {
        console.error("Error al cargar los animes recientes:", error);
        recentAnimeContainer.innerHTML = '<p>Ocurrió un error al cargar los animes recientes.</p>';
    }
}

// Crear tarjeta de anime
function createAnimeCard(anime) {
    const animeCard = document.createElement('div');
    animeCard.classList.add('anime-card');
    animeCard.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" loading="lazy">
        <h3>${anime.title}</h3>
        <button data-anime-id="${anime.mal_id}" class="view-episodes">Ver episodios</button>
    `;
    animeCard.querySelector('.view-episodes').addEventListener('click', () => loadEpisodes(anime.mal_id, anime.title));
    return animeCard;
}

// Cargar episodios
async function loadEpisodes(animeId, animeTitle) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
        const data = await response.json();
        const episodes = data.data;

        episodesContainer.innerHTML = `
            <h2>Episodios de ${animeTitle}</h2>
            <div class="episode-list">
                ${episodes
                    .map(
                        episode => `
                        <div class="episode-card">
                            <h3>${episode.title}</h3>
                            <p>Episodio ${episode.mal_id}</p>
                            <a href="${episode.url}" target="_blank">Ver ahora</a>
                        </div>
                    `
                    )
                    .join('')}
            </div>
        `;
        // Mostrar la sección de episodios
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById('episodes').classList.add('active');
    } catch (error) {
        console.error("Error al cargar episodios:", error);
        episodesContainer.innerHTML = '<p>Ocurrió un error al cargar los episodios.</p>';
    }
}

// Cargar animes categorizados
async function loadCategorizedAnimes() {
    try {
        // Cargar nuevos animes
        const newAnimeResponse = await fetch('https://api.jikan.moe/v4/top/anime');
        const newAnimeData = await newAnimeResponse.json();
        const newAnimes = newAnimeData.data.slice(); 

        newAnimeContainer.innerHTML = '';
        newAnimes.forEach(anime => {
            const animeCard = createAnimeCard(anime);
            newAnimeContainer.appendChild(animeCard);
        });

        // Cargar animes de acción
        const actionAnimeResponse = await fetch('https://api.jikan.moe/v4/anime?genres=1');
        const actionAnimeData = await actionAnimeResponse.json();
        const actionAnimes = actionAnimeData.data.slice(0, 10);

        actionAnimeContainer.innerHTML = '';
        actionAnimes.forEach(anime => {
            const animeCard = createAnimeCard(anime);
            actionAnimeContainer.appendChild(animeCard);
        });
    } catch (error) {
        console.error("Error al cargar los animes categorizados:", error);
    }
}

// Cargar animes al inicio
loadRecentAnimes();
loadCategorizedAnimes();
