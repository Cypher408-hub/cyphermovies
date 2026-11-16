// ===============================================
// === DARK MODE TOGGLE LOGIC (PASTE THIS BLOCK) ===
// ===============================================

// 1. Select the button
const toggleBtn = document.getElementById('theme-toggle');

// 2. Check Local Storage for saved preference
const savedTheme = localStorage.getItem('theme');

// 3. Set the DEFAULT theme to DARK MODE
if (savedTheme === 'light') {
    // If the user previously saved 'light', apply light mode (i.e., do nothing)
    document.body.classList.remove('dark-mode'); 
    toggleBtn.textContent = '🌙'; // Set icon to Moon
} else {
    // If savedTheme is null (first-time visitor) OR 'dark', apply dark mode.
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️'; // Set icon to Sun
}

// 4. Listen for the click event
toggleBtn.addEventListener('click', () => {
    
    document.body.classList.toggle('dark-mode');

    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }

    // Save the new preference to Local Storage
    localStorage.setItem('theme', theme);
});

// ===============================================
// === END OF DARK MODE LOGIC ===
// ===============================================


// REMAINING CODE BELOW: (TMDB API logic, BASE_URL, getMovies function, etc.)
// const API_KEY = "YOUR_TMDB_API_KEY";
// ...


// REPLACE THIS WITH YOUR ACTUAL TMDB API KEY
const API_KEY = "ef180afb4ccf8fafe7dce201870ab225";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIES_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // For poster images

const resultsContainer = document.getElementById("movie-results");
const searchForm = document.getElementById("search-form");
const searchTermInput = document.getElementById("search-term");


// --- 1. Function to Fetch and Display Movies ---
async function getMovies(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Clear old results and display new ones
        displayMovies(data.results); 

    } catch (error) {
        resultsContainer.innerHTML = `<p class="placeholder-text">Error fetching data: ${error.message}</p>`;
        console.error("Fetch error:", error);
    }
}


function displayMovies(movies) {
    resultsContainer.innerHTML = ""; // Clear the 'Loading...' text
    
    if (movies.length === 0) {
        resultsContainer.innerHTML = `<p class="placeholder-text">No movies found for that search term.</p>`;
        return;
    }

    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie; 

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        // *** 1. ADD CLICK LISTENER HERE ***
        movieCard.addEventListener('click', () => {
            // Toggles the 'expanded' class on click
            movieCard.classList.toggle('expanded');
        });
        
        const posterUrl = poster_path ? `${IMAGE_BASE_URL}${poster_path}` : 'https://via.placeholder.com/250x375?text=No+Image';

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${title} Poster">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="rating">${vote_average.toFixed(1)} / 10</span>
                <p>${overview.substring(0, 100)}...</p> 
            </div>
        `;

        resultsContainer.appendChild(movieCard);
    });
}


// --- 3. Event Listener for Search Form ---
searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop the form from reloading the page
    
    const searchTerm = searchTermInput.value;

    if (searchTerm && searchTerm !== "") {
        // Search for specific term
        getMovies(SEARCH_URL + searchTerm);
        searchTermInput.value = ""; // Clear input box
    } else {
        // Go back to popular movies
        getMovies(POPULAR_MOVIES_URL); 
    }
});


// --- 4. Load Popular Movies on Page Load ---
getMovies(POPULAR_MOVIES_URL);