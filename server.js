const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Define your News API key
const NEWS_API_KEY = 'YOUR_API_KEY';  // Replace with your actual News API key

// Route to fetch news
app.get('/news', async (req, res) => {
   try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=cybersecurity&apiKey=${NEWS_API_KEY}`);
      const articles = response.data.articles;
      res.status(200).json(articles);  // Return the fetched articles
   } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });  // Handle errors gracefully
   }
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
