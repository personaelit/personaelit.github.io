const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your OpenCage API key
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
console.log(OPENCAGE_API_KEY);
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get detailed location information
app.get('/location', async (req, res) => {
    const { lat, lng } = req.query;

    // Log the received lat/lng parameters to verify they are correct
    console.log(`Received request for location with lat: ${lat}, lng: ${lng}`);

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${OPENCAGE_API_KEY}`);
        const data = await response.json();
        console.log(data.results)
        const { components } = data.results[0].components;
        const city = components?.city || components?.town || components?.village || 'Unknown City';
        const state = components?.state || 'Unknown State';
        const country = components?.country || 'Unknown Country';

       res.json({ city, state, country });
    } catch (error) {
        console.error('Error fetching data from OpenCage:', error);
        res.status(500).json({ error: 'Unable to fetch location details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
