// Define global variables
let newsContainer;
let allArticles = [];
let upvotes = JSON.parse(localStorage.getItem("upvotes")) || {};
let currentCategory = "Home"; // Track the current category

// Define fetchCategoryNews globally
window.fetchCategoryNews = async function (category) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/news?q=${category}`
    );
    const data = await response.json();
    allArticles = data.articles
      ? data.articles.filter((article) => !article.title.includes("[Removed]"))
      : [];
    currentCategory = category; // Update the current category
    sortAndDisplayArticles();
    highlightCurrentCategory(category); // Highlight the current category
    toggleTopNewsSection(category); // Show/hide top news section
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    newsContainer.innerHTML = `<p>Failed to load ${category} news. Please try again later.</p>`;
  }
};
// Define fetchTrendingNews globally
window.fetchTrendingNews = async function () {
  try {
    const response = await fetch(
      "http://localhost:5000/api/news?q=cybersecurity"
    );
    const data = await response.json();
    allArticles = data.articles || [];
    sortAndDisplayArticles();
  } catch (error) {
    console.error("Error fetching trending news:", error);
    newsContainer.innerHTML =
      "<p>Failed to load trending news. Please try again later.</p>";
  }
};
// Highlight the current category in the navigation bar
function highlightCurrentCategory(category) {
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach((link) => {
    if (link.textContent === category) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Show/hide top news section based on the current category
function toggleTopNewsSection(category) {
  const topNewsContainer = document.getElementById("top-news-container");
  if (category === "Home") {
    topNewsContainer.style.display = "block"; // Show top news on home page
  } else {
    topNewsContainer.style.display = "none"; // Hide top news on other pages
  }
}

// Sort articles by upvote count and display them
function sortAndDisplayArticles() {
  const sortedArticles = allArticles
    .map((article, index) => ({
      ...article,
      upvotes: upvotes[currentCategory]?.[index] || 0, // Use category-specific upvotes
      index: index,
    }))
    .sort((a, b) => b.upvotes - a.upvotes);

  displayArticles(sortedArticles);
}

// Display articles with upvotes
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
        <span>Upvotes: <span id="upvote-count-${index}">${
      article.upvotes
    }</span></span>
      </div>
    `;
    newsContainer.appendChild(articleElement);
  });
}

// Upvote function
window.upvoteArticle = function (articleIndex) {
  if (!upvotes[currentCategory]) {
    upvotes[currentCategory] = {}; // Initialize upvotes for the current category
  }
  upvotes[currentCategory][articleIndex] =
    (upvotes[currentCategory][articleIndex] || 0) + 1;
  localStorage.setItem("upvotes", JSON.stringify(upvotes));
  sortAndDisplayArticles();
};

// Search function
function searchArticles() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredArticles = allArticles.filter((article) => {
    const title = article.title ? article.title.toLowerCase() : "";
    const description = article.description
      ? article.description.toLowerCase()
      : "";
    return title.includes(searchTerm) || description.includes(searchTerm);
  });
  displayArticles(filteredArticles);
}

// Slideshow functionality
let currentSlide = 0;

function displaySlideshow(articles) {
  const slideshow = document.querySelector(".slideshow");
  const dotsContainer = document.querySelector(".dots");
  slideshow.innerHTML = "";
  dotsContainer.innerHTML = "";

  articles.forEach((article, index) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    if (index === 0) slide.classList.add("active");
    slide.innerHTML = `
      <h4>${article.title}</h4>
      <p>${article.description || "No description available"}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;
    slideshow.appendChild(slide);

    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => changeSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Auto-scroll every 5 seconds
  setInterval(() => {
    changeSlide((currentSlide + 1) % articles.length);
  }, 5000);
}

function changeSlide(newIndex) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");

  currentSlide = newIndex;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  newsContainer = document.getElementById("news-container");
  const topNewsContainer = document.getElementById("top-news-container");

  // Fetch trending news
  async function fetchTrendingNews() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/news?q=cybersecurity"
      );
      const data = await response.json();
      allArticles = data.articles
        ? data.articles.filter(
            (article) => !article.title.includes("[Removed]")
          )
        : [];
      currentCategory = "Home"; // Set current category to Home
      sortAndDisplayArticles();
      highlightCurrentCategory("Home"); // Highlight the Home category
      toggleTopNewsSection("Home"); // Show top news on home page
    } catch (error) {
      console.error("Error fetching trending news:", error);
      newsContainer.innerHTML =
        "<p>Failed to load trending news. Please try again later.</p>";
    }
  }

  // Fetch and display top news based on votes
  async function fetchTopNews() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/news?q=cybersecurity"
      );
      const data = await response.json();
      allArticles = data.articles
        ? data.articles.filter(
            (article) => !article.title.includes("[Removed]")
          )
        : [];
      const sortedArticles = allArticles
        .map((article, index) => ({
          ...article,
          upvotes: upvotes[currentCategory]?.[index] || 0,
          index: index,
        }))
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 5); // Get top 5 articles

      displaySlideshow(sortedArticles);
    } catch (error) {
      console.error("Error fetching top news:", error);
      topNewsContainer.innerHTML =
        "<p>Failed to load top news. Please try again later.</p>";
    }
  }

  // Initialize on page load
  fetchTrendingNews();
  fetchTopNews();

  // Add event listeners for slide controls
  document.querySelector(".prev-btn").addEventListener("click", () => {
    changeSlide((currentSlide - 1 + 5) % 5); // 5 is the number of slides
  });

  document.querySelector(".next-btn").addEventListener("click", () => {
    changeSlide((currentSlide + 1) % 5);
  });
});
