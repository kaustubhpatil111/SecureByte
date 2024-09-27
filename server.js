const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const path = require('path');  // For serving static files

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the /news route
app.get('/news', async (req, res) => {
   try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=cybersecurity&apiKey=${YOUR_API_KEY}`);
      const articles = response.data.articles;
      res.status(200).json(articles);
   } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });
   }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to serve the index.html for other routes
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
