const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;
app.get('/', (req, res) => {
    res.send('Pocetna');
});
app.get('/zaposlenici', (req, res) => {
    fs.readFile('zaposlenici.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Greška (čitanje podataka).' });
        }
        const zaposlenici = JSON.parse(data);
        res.json(zaposlenici);
    });
});
app.listen(PORT, error => {
    if(error) {
        console.error(`Greška: ${error.message}`);
    } else {
        console.log(`Server dela na http://localhost:${PORT}`);
    }
});
