const express = require('express');
const cors = require('cors');
const { URL } = require('url');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/proxy', async (req, res) => {
  const url = decodeURIComponent(req.query.url);

  // Validate URL
  try {
    new URL(url);
  } catch (err) {
    return res.status(400).send('Invalid URL');
  }

  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    const data = await response.text();
    
    // Set appropriate content-type header
    res.setHeader('Content-Type', contentType || 'text/plain');
    res.send(data);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).send('Failed to fetch URL');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});