const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());

const NEWS_API_KEY = '1bde3b2ab6194cfa8def8d1907b543a6';

app.get('/news', async (req, res) => {
   try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=cybersecurity&apiKey=${NEWS_API_KEY}`);
      const articles = response.data.articles;
      res.status(200).json(articles);
   } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).send('Error fetching news');
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
