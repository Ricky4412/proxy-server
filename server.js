const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/proxy', async (req, res) => {
  const url = decodeURIComponent(req.query.url);

  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    const data = await response.text();
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