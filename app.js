const NEWS_API_KEY = '7b25a46ee1504776b141fb0da6acb109'; // NewsAPI key

const newsContainer = document.getElementById('news-container');
const topNewsContainer = document.getElementById('top-news-container');
let allArticles = []; // Global array to store articles for searching
let upvotes = {}; // Object to track upvotes

// Fetch general cybersecurity news for Trending section
async function fetchTrendingNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=cybersecurity&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();
        allArticles = data.articles ? data.articles.filter(article => !article.title.includes("[Removed]")) : [];
        sortAndDisplayArticles();
    } catch (error) {
        console.error("Error fetching trending news:", error);
        newsContainer.innerHTML = '<p>Failed to load trending news. Please try again later.</p>';
    }
}

// Fetch and display top news as a slideshow
async function fetchTopNews() {
    const topics = ["cybersecurity", "hacking", "data breach", "ransomware", "malware"];
    let allArticles = [];

    try {
        console.log("Fetching top cybersecurity news...");

        // Fetch articles for each topic and accumulate results
        for (const topic of topics) {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`);
            const data = await response.json();

            if (data.articles) {
                allArticles = allArticles.concat(data.articles);
            }
        }

        // Remove duplicates based on article URL and limit to 5
        const uniqueArticles = Array.from(new Map(allArticles.map(article => [article.url, article])).values()).slice(0, 5);

        if (uniqueArticles.length > 0) {
            displaySlideshow(uniqueArticles);
        } else {
            topNewsContainer.innerHTML = '<p>No relevant cybersecurity articles available in top news.</p>';
        }
    } catch (error) {
        console.error("Error fetching top news:", error);
        topNewsContainer.innerHTML = '<p>Failed to load top news. Please try again later.</p>';
    }
}




// Function to display a slideshow for top news
function displaySlideshow(articles) {
    console.log("Displaying slideshow with articles:", articles);
    const topNewsContainer = document.getElementById('top-news-container');  // Ensure this is defined
    topNewsContainer.innerHTML = '<h2>Top News</h2><div class="slideshow"></div><div class="slide-controls"><button class="prev-btn">Prev</button><div class="dots"></div><button class="next-btn">Next</button></div>';
    
    const slideshow = document.querySelector(".slideshow");
    const dotsContainer = document.querySelector(".dots");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    // Create the slides
    articles.forEach((article, index) => {
        const slide = document.createElement("div");
        slide.classList.add("slide");
        if (index === 0) slide.classList.add("active");  // Start with first slide active
        slide.innerHTML = `
            <h4>${article.title}</h4>
            <p>${article.description || "No description available"}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;
        slideshow.appendChild(slide);

        // Create a dot for each slide
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active"); // First dot active
        dotsContainer.appendChild(dot);
    });

    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    // Function to update the active slide and dot
    function changeSlide(newIndex) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");
        
        currentSlide = newIndex;
        
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    // Auto slide change every 5 seconds
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        changeSlide(nextSlide);
    }, 5000);

    // Event listeners for buttons
    prevBtn.addEventListener("click", () => {
        let prevSlide = (currentSlide - 1 + slides.length) % slides.length;
        changeSlide(prevSlide);
    });

    nextBtn.addEventListener("click", () => {
        let nextSlide = (currentSlide + 1) % slides.length;
        changeSlide(nextSlide);
    });

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            changeSlide(index);
        });
    });
}



// Fetch and display category-specific news
async function fetchCategoryNews(category) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${category}&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();
        allArticles = data.articles ? data.articles.filter(article => !article.title.includes("[Removed]")) : [];
        sortAndDisplayArticles();
    } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
        newsContainer.innerHTML = `<p>Failed to load ${category} news. Please try again later.</p>`;
    }
}

// Sort articles by upvote count and display them
function sortAndDisplayArticles() {
    const sortedArticles = allArticles
        .map((article, index) => ({
            ...article,
            upvotes: upvotes[index] || 0, // Include upvote count with each article
            index: index
        }))
        .sort((a, b) => b.upvotes - a.upvotes); // Sort by upvotes in descending order

    displayArticles(sortedArticles);
}

// Display function for articles with upvotes and sorting
function displayArticles(articles) {
    newsContainer.innerHTML = "";
    articles.forEach((article, index) => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("news-article");
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || "No description available"}</p>
            <a href="${article.url}" target="_blank">Read More</a>
            <div class="upvote-section">
                <button class="upvote-btn" onclick="upvoteArticle(${index})">
                    Upvote
                </button>
                <span>Upvotes: <span id="upvote-count-${index}">${article.upvotes}</span></span>
            </div>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Upvote function
function upvoteArticle(articleIndex) {
    upvotes[articleIndex] = (upvotes[articleIndex] || 0) + 1;
    sortAndDisplayArticles(); // Refresh articles to show sorted order with updated upvotes
}

// Search function to filter articles based on search term
function searchArticles() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filteredArticles = allArticles.filter(article => {
        const title = article.title ? article.title.toLowerCase() : "";
        const description = article.description ? article.description.toLowerCase() : "";
        return title.includes(searchTerm) || description.includes(searchTerm);
    });
    displayArticles(filteredArticles);
}

// Event listeners to load category-specific news
document.querySelector('a[onclick="fetchCategoryNews(\'Data Breaches\')"]').addEventListener("click", () => fetchCategoryNews("data breach"));
document.querySelector('a[onclick="fetchCategoryNews(\'Cyber Attacks\')"]').addEventListener("click", () => fetchCategoryNews("cyber attack"));
document.querySelector('a[onclick="fetchCategoryNews(\'Vulnerabilities\')"]').addEventListener("click", () => fetchCategoryNews("vulnerability"));
document.querySelector('a[onclick="fetchCategoryNews(\'Webinars\')"]').addEventListener("click", () => fetchCategoryNews("webinars"));
document.querySelector('a[onclick="fetchCategoryNews(\'Expert Insights\')"]').addEventListener("click", () => fetchCategoryNews("expert insights"));

// Initialize with trending news and top news slideshow on page load
window.onload = () => {
    fetchTrendingNews();
    fetchTopNews();
};
