const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: "ok" });
});

const API_URL = 'https://thronesapi.com/api/v2/Characters'; // Använd din API-länk här

app.get('/fetch-data', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = app;
