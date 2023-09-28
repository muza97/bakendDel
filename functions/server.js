const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require ('fs');
const cors = require ('cors');



// Middleware för att tolka JSON-förfrågningar
app.use (express.json);
app.use(bodyParser.json());
app.use (cors());

// Array för att lagra data
let bilar = [];

fs.readFile('bilar.json', 'utf8',(err,data)=> {
  if(!err){
    bilar = JSON.parse(data);
  }
})

// POST-rutt för att lägga till data i "bilar"
app.post('/bilar', (req, res) => {
  const nyBil = req.body;
  data.push(nyBil);
  res.json({ meddelande: 'Bilen har lagts till i "bilar".' });
});

// GET-rutt för att hämta data från "data"
app.get('/bilar', (req, res) => {
  res.json(bilar);
});

