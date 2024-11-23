const express = require('express');
const app = express();
const fs = require('fs');


const PORT = 3000;
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Home');
});

app.get('/zaposlenici', (req, res) => {
    const { sortiraj_po_godinama, pozicija, godine_staža_min, godine_staža_max } = req.query;
    fs.readFile('zaposlenici.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'greska kod ucitavanja podataka' });
        }
        let zaposlenici = JSON.parse(data);
        if (pozicija) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.pozicija.toLowerCase() === pozicija.toLowerCase());
        }
        if (godine_staža_min) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.godine_staža >= parseInt(godine_staža_min));
        }
        if (godine_staža_max) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.godine_staža <= parseInt(godine_staža_max));
        }
        if (sortiraj_po_godinama === 'asc') {
            zaposlenici.sort((a, b) => a.godine_staža - b.godine_staža);
        } else if (sortiraj_po_godinama === 'desc') {
            zaposlenici.sort((a, b) => b.godine_staža - a.godine_staža);
        }
        
        res.json(zaposlenici);
    });
});

app.get('/zaposlenici/:id', (req, res) => {
    const id_zaposlenika = req.params.id;
    fs.readFile('zaposlenici.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'greska kod ucitavanja podataka' });
        }
        const zaposlenici = JSON.parse(data); 
        const zaposlenik = zaposlenici.find(zaposlenik => zaposlenik.id == id_zaposlenika);
        if (zaposlenik) {
            res.json(zaposlenik);
        } else {
            res.json({ message: 'zaposlenik ne postoji' });
        }
    });
});

app.post('/zaposlenici', (req, res) => {
    const { ime, prezime, godine_staža, pozicija } = req.body;
    if (!ime || !prezime || !godine_staža || !pozicija) {
        return res.status(400).json({ message: 'svi se podatci moraju poslat' });
    }
    if (typeof godine_staža !== 'number' || godine_staža < 0) {
        return res.status(400).json({ message: 'godine staza moraju biti vece od nule' });
    }
    fs.readFile('zaposlenici.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'greska kod citanja podataka' });
        }
        const zaposlenici = JSON.parse(data);
        const novi_id = zaposlenici.length + 1;
        const new_zaposlenik = {
            id: novi_id,
            ime,
            prezime,
            godine_staža,
            pozicija
        };
        zaposlenici.push(new_zaposlenik);
        fs.writeFile('zaposlenici.json', JSON.stringify(zaposlenici, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'greska kod spremanja podataka' });
            }
            res.status(201).json({ message: 'dodan zaposlenik', zaposlenik: new_zaposlenik });
        });
    });
});

app.listen(PORT, error => {
    if(error) {
        console.error(`Greška: ${error.message}`);
    } else {
        console.log(`Server dela na http://localhost:${PORT}`);
    }
});
