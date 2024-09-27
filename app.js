const newsContainer = document.getElementById('news-container');
let allArticles = [];  // Declare global variable to store all articles

// Fetch news from the backend
async function fetchNews() {
    newsContainer.innerHTML = '<p>Loading news...</p>'; // Show loading message

    try {
        const response = await fetch('https://securebyte.railway.app/news'); // Ensure backend is running
        const articles = await response.json();

        allArticles = articles;  // Store articles globally for search functionality
        displayArticles(articles);  // Call the display function with the fetched data
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Failed to load news. Please try again later.</p>'; // Show error message
    }
}

// Function to display articles in the HTML
function displayArticles(articles) {
    newsContainer.innerHTML = '';  // Clear any previous content
    articles.forEach(article => {
        // Create a new div for each article
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');

        // Set the inner HTML of the article div
        articleElement.innerHTML = `
            <h2>${article.title || 'Untitled'}</h2>
            <p>${article.description || 'No description available'}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;

        // Append the new article to the news container
        newsContainer.appendChild(articleElement);
    });
}

// Search function to filter and display articles based on search input
function searchArticles() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    // Filter the articles based on the search term
    const filteredArticles = allArticles.filter(article => {
        const title = article.title ? article.title.toLowerCase() : '';
        const description = article.description ? article.description.toLowerCase() : '';
        return title.includes(searchTerm) || description.includes(searchTerm);
    });

    // Display the filtered articles
    displayArticles(filteredArticles);
}

// Fetch the news when the page loads
fetchNews();
