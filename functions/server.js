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

module.exports = app;
