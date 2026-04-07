const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json());

// Redirect root to the welcome page
app.get('/', (req, res) => {
    res.redirect('/welcome.html');
});

// API endpoint to get vehicle models
app.get('/api/vehicles', (req, res) => {
    const vehicles = [];
    
    // Create a readable stream for the CSV file
    fs.createReadStream('data/vehicle_data.csv')
        .pipe(csv({
            headers: false, // No headers in the CSV
            skipLines: 1    // Skip any header line if it exists
        }))
        .on('data', (row) => {
            // The second column (index 1) should be the vehicle model
            // Check if it's not already in the array
            if (row[1] && !vehicles.includes(row[1].trim())) {
                vehicles.push(row[1].trim());
            }
        })
        .on('error', (error) => {
            console.error('Error reading vehicle data:', error);
            res.status(500).json({ error: 'Failed to read vehicle data' });
        })
        .on('end', () => {
            console.log(`Found ${vehicles.length} unique vehicle models`);
            res.json({ vehicles });
        });
});

// API endpoint to get years
app.get('/api/years', (req, res) => {
    const years = [];
    
    fs.createReadStream('data/vehicle_data.csv')
        .pipe(csv({
            headers: false, // No headers in the CSV
            skipLines: 1    // Skip any header line if it exists
        }))
        .on('data', (row) => {
            // The first column (index 0) should be the year
            // Check if it's not already in the array
            if (row[0] && !years.includes(row[0].trim())) {
                years.push(row[0].trim());
            }
        })
        .on('error', (error) => {
            console.error('Error reading year data:', error);
            res.status(500).json({ error: 'Failed to read year data' });
        })
        .on('end', () => {
            console.log(`Found ${years.length} unique years`);
            res.json({ years });
        });
});

// API endpoint to get fuel economy data
app.get('/api/fuel-economy', (req, res) => {
    const { model, year } = req.query;
    let found = false;
    let data = {};

    fs.createReadStream('data/vehicle_data.csv')
        .pipe(csv({
            headers: false, // No headers in the CSV
            skipLines: 1    // Skip any header line if it exists
        }))
        .on('data', (row) => {
            // Check if this row matches the requested model and year
            if (row[1] && row[1].trim() === model && row[0] && row[0].trim() === year) {
                found = true;
                data = {
                    success: true,
                    cityMPG: parseFloat(row[2]),
                    highwayMPG: parseFloat(row[3]),
                    combinedMPG: parseFloat(row[4])
                };
            }
        })
        .on('error', (error) => {
            console.error('Error reading fuel economy data:', error);
            res.status(500).json({ error: 'Failed to read fuel economy data' });
        })
        .on('end', () => {
            if (found) {
                res.json(data);
            } else {
                console.log(`No data found for model: ${model}, year: ${year}`);
                res.json({ success: false });
            }
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Welcome page: http://localhost:${port}/welcome.html`);
});