const newsContainer = document.getElementById('news-container');
let allArticles = []; // Store all fetched articles for searching

async function fetchNews() {
   try {
      const response = await fetch('http://192.168.0.111:3000/news'); // Updated to use your local IP

      const articles = await response.json();

      // Debug: Check if articles are being fetched
      console.log('Fetched articles:', articles);

      allArticles = articles;  // Store all articles globally
      displayArticles(articles);  // Call the display function with the fetched data
   } catch (error) {
      console.error('Error fetching news:', error);
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

   // Debug: Log the search term
   console.log('Search term:', searchTerm);

   const filteredArticles = allArticles.filter(article => {
      const title = article.title ? article.title.toLowerCase() : '';  // Default to empty string if null
      const description = article.description ? article.description.toLowerCase() : '';  // Default to empty string if null

      // Debug: Log titles and descriptions being checked
      console.log('Checking article:', { title, description });

      return title.includes(searchTerm) || description.includes(searchTerm);
   });

   // Debug: Log the filtered results
   console.log('Filtered articles:', filteredArticles);

   // Display the filtered articles
   displayArticles(filteredArticles);
}


// Fetch the news when the page loads
fetchNews();
