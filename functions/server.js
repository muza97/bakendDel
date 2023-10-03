const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());

// Läs in befintlig data från JSON-fil
const dataFilePath = path.join(__dirname, 'bilar.json');
let bilar = [];

try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    bilar = JSON.parse(rawData);
} catch (err) {
    console.error("Fel vid inläsning av bilar.json:", err);
}

// GET-anrop
app.get('/bilar', (req, res) => {
    res.json(bilar);
});

// POST-anrop
app.post('/bilar', (req, res) => {
    let nyaBilar = req.body;

    if (!Array.isArray(nyaBilar)) {
        nyaBilar = [nyaBilar];  // Gör en enskild bil till en lista med en bil
    }

    for (const bil of nyaBilar) {
        const { id, name, modell, farg } = bil;

        // Kontrollera om alla fält finns
        if (!id || !name || !modell || !farg) {
            return res.status(400).json({ error: `Alla fält (id, name, modell, farg) är obligatoriska. Problem med bilen: ${JSON.stringify(bil)}` });
        }

        bilar.push(bil);
    }

    // Spara till JSON-fil
    fs.writeFileSync(dataFilePath, JSON.stringify(bilar, null, 2), 'utf8');

    res.json({ meddelande: `${nyaBilar.length} bil(ar) har lagts till.`, bilar: nyaBilar });
});

app.delete('/bilar/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Ta ID från URL-parametern

  // Hitta indexet för bilen med det angivna ID:t
  const index = bilar.findIndex(bil => bil.id === id);

  if (index === -1) {
      return res.status(404).json({ error: 'Bil med angivet ID hittades inte.' });
  }

  // Ta bort bilen från listan
  bilar.splice(index, 1);

  // Spara den uppdaterade listan till JSON-fil
  fs.writeFileSync(dataFilePath, JSON.stringify(bilar, null, 2), 'utf8');

  res.json({ meddelande: `Bil med ID ${id} har tagits bort.` });
});

app.patch('/bilar/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Ta ID från URL-parametern

  // Hitta bilen med det angivna ID:t
  const bil = bilar.find(b => b.id === id);

  if (!bil) {
      return res.status(404).json({ error: 'Bil med angivet ID hittades inte.' });
  }

  // Uppdatera bilens egenskaper
  if (req.body.name) {
      bil.name = req.body.name;
  }
  if (req.body.modell) {
      bil.modell = req.body.modell;
  }
  if (req.body.farg) {
      bil.farg = req.body.farg;
  }

  // Spara den uppdaterade listan till JSON-fil
  fs.writeFileSync(dataFilePath, JSON.stringify(bilar, null, 2), 'utf8');

  res.json({ meddelande: `Bil med ID ${id} har uppdaterats.`, uppdateradBil: bil });
});



module.exports = app;
