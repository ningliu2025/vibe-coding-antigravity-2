const express = require('express');
const cors = require('cors');
const names = require('./names.json');
const { calculateMatch } = require('./matchAlgorithm');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Get all names with optional filters
app.get('/api/names', (req, res) => {
    const { gender, origin, search } = req.query;

    let results = names;

    if (gender) {
        results = results.filter(n => n.gender.toLowerCase() === gender.toLowerCase());
    }

    if (origin) {
        results = results.filter(n => n.origin.toLowerCase() === origin.toLowerCase());
    }

    if (search) {
        results = results.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.json(results);
});

// Calculate match
app.post('/api/match', (req, res) => {
    const { name1, name2 } = req.body;

    if (!name1 || !name2) {
        return res.status(400).json({ error: "Both names are required" });
    }

    const result = calculateMatch(name1, name2);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
