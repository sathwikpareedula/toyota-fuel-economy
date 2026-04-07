let fuelEconomyChart = null;
let compareChart = null;

// Document ready function to initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Fetch vehicle data for dropdowns on main page and compare page
    fetchVehicleData();
    
    // Setup form submission handlers
    setupFormHandlers();
});

// Fetch vehicle models and years for the dropdowns
function fetchVehicleData() {
    // Fetch models
    if (document.getElementById('model')) {
        fetch('/api/vehicles')
            .then(response => response.json())
            .then(data => {
                const modelSelect = document.getElementById('model');
                data.vehicles.forEach(vehicle => {
                    const option = document.createElement('option');
                    option.value = vehicle;
                    option.textContent = vehicle;
                    modelSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching vehicle models:', error);
            });
    }

    // Fetch years
    if (document.getElementById('year')) {
        fetch('/api/years')
            .then(response => response.json())
            .then(data => {
                const yearSelect = document.getElementById('year');
                data.years.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    yearSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching years:', error);
            });
    }
}

// Setup event handlers for forms
function setupFormHandlers() {
    // Main page fuel economy form
    const fuelForm = document.getElementById('fuelForm');
    if (fuelForm) {
        fuelForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const model = document.getElementById('model').value;
            const year = document.getElementById('year').value;
            
            fetchFuelEconomy(model, year);
        });
    }
    
    // Compare page form handlers
    const numCarsSubmit = document.getElementById('numCarsSubmit');
    if (numCarsSubmit) {
        numCarsSubmit.addEventListener('click', function() {
            const numCars = document.getElementById('numCars').value;
            if (numCars < 1 || numCars > 3) {
                alert('Please enter a number between 1 and 3.');
                return;
            }
            
            createCarSelectionForm(numCars);
        });
    }
}

// Fetch fuel economy data for a single vehicle
function fetchFuelEconomy(model, year) {
    fetch(`/api/fuel-economy?model=${model}&year=${year}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayResults(data, model, year);
            } else {
                alert('Data not available for the selected vehicle and year.');
            }
        })
        .catch(error => {
            console.error('Error fetching fuel economy data:', error);
        });
}

// Display fuel economy results on the main page
function displayResults(data, model, year) {
    // Update the text values
    document.getElementById('cityMPG').textContent = data.cityMPG;
    document.getElementById('highwayMPG').textContent = data.highwayMPG;
    document.getElementById('combinedMPG').textContent = data.combinedMPG;
    
    // Show the results panel
    document.getElementById('results').style.display = 'block';
    
    // Destroy any existing chart
    if (fuelEconomyChart) {
        fuelEconomyChart.destroy();
    }
    
    // Create a new chart
    const ctx = document.getElementById('fuelEconomyChart').getContext('2d');
    fuelEconomyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['City MPG', 'Highway MPG', 'Combined MPG'],
            datasets: [{
                label: `${model} ${year} Fuel Economy`,
                data: [data.cityMPG, data.highwayMPG, data.combinedMPG],
                backgroundColor: [
                    'rgba(215, 25, 33, 0.7)',
                    'rgba(215, 25, 33, 0.7)',
                    'rgba(215, 25, 33, 0.7)'
                ],
                borderColor: [
                    'rgba(215, 25, 33, 1)',
                    'rgba(215, 25, 33, 1)',
                    'rgba(215, 25, 33, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Miles Per Gallon (MPG)'
                    }
                }
            }
        }
    });
}

// Create the car selection form on the compare page
function createCarSelectionForm(numCars) {
    const carSelectionForm = document.getElementById('carSelectionForm');
    carSelectionForm.innerHTML = ''; // Clear previous form
    
    for (let i = 0; i < numCars; i++) {
        const carDiv = document.createElement('div');
        carDiv.classList.add('car-selection');
        
        const carTitle = document.createElement('h3');
        carTitle.textContent = `Vehicle ${i + 1}`;
        carDiv.appendChild(carTitle);
        
        // Model selection
        const modelLabel = document.createElement('label');
        modelLabel.setAttribute('for', `model${i}`);
        modelLabel.textContent = 'Select Model';
        carDiv.appendChild(modelLabel);
        
        const modelSelect = document.createElement('select');
        modelSelect.id = `model${i}`;
        modelSelect.name = `model${i}`;
        modelSelect.classList.add('model-select');
        carDiv.appendChild(modelSelect);
        
        // Year selection
        const yearLabel = document.createElement('label');
        yearLabel.setAttribute('for', `year${i}`);
        yearLabel.textContent = 'Select Year';
        carDiv.appendChild(yearLabel);
        
        const yearSelect = document.createElement('select');
        yearSelect.id = `year${i}`;
        yearSelect.name = `year${i}`;
        yearSelect.classList.add('year-select');
        carDiv.appendChild(yearSelect);
        
        carSelectionForm.appendChild(carDiv);
    }
    
    // Add the compare button
    const compareButton = document.createElement('button');
    compareButton.id = 'compareSubmit';
    compareButton.classList.add('btn-primary');
    compareButton.textContent = 'Compare Cars';
    carSelectionForm.appendChild(compareButton);
    
    // Show the car selection form
    carSelectionForm.style.display = 'block';
    document.getElementById('numCarsForm').style.display = 'none';
    
    // Fetch data for the dropdowns
    fetch('/api/vehicles')
        .then(response => response.json())
        .then(data => {
            const modelSelects = document.querySelectorAll('.model-select');
            modelSelects.forEach(select => {
                data.vehicles.forEach(vehicle => {
                    const option = document.createElement('option');
                    option.value = vehicle;
                    option.textContent = vehicle;
                    select.appendChild(option);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching vehicle models:', error);
        });

    fetch('/api/years')
        .then(response => response.json())
        .then(data => {
            const yearSelects = document.querySelectorAll('.year-select');
            yearSelects.forEach(select => {
                data.years.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    select.appendChild(option);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching years:', error);
        });
    
    // Add event listener for the compare button
    document.getElementById('compareSubmit').addEventListener('click', function(event) {
        event.preventDefault();
        
        const carData = [];
        const numCars = document.querySelectorAll('.model-select').length;
        
        for (let i = 0; i < numCars; i++) {
            carData.push({
                model: document.getElementById(`model${i}`).value,
                year: document.getElementById(`year${i}`).value
            });
        }
        
        compareCars(carData);
    });
}

// Compare multiple cars and display results
function compareCars(carData) {
    Promise.all(carData.map(car => 
        fetch(`/api/fuel-economy?model=${car.model}&year=${car.year}`)
            .then(response => response.json())
    ))
    .then(results => {
        // Create datasets for the chart
        const datasets = [];
        const colors = [
            {bg: 'rgba(215, 25, 33, 0.7)', border: 'rgba(215, 25, 33, 1)'},
            {bg: 'rgba(0, 102, 204, 0.7)', border: 'rgba(0, 102, 204, 1)'},
            {bg: 'rgba(51, 51, 51, 0.7)', border: 'rgba(51, 51, 51, 1)'}
        ];
        
        results.forEach((result, index) => {
            if (result.success) {
                datasets.push({
                    label: `${carData[index].model} ${carData[index].year}`,
                    data: [result.cityMPG, result.highwayMPG, result.combinedMPG],
                    backgroundColor: colors[index].bg,
                    borderColor: colors[index].border,
                    borderWidth: 1
                });
            } else {
                alert(`Data not available for ${carData[index].model} ${carData[index].year}`);
            }
        });
        
        // Show the results if we have valid data
        if (datasets.length > 0) {
            document.getElementById('compareResults').style.display = 'block';
            
            // Destroy any existing chart
            if (compareChart) {
                compareChart.destroy();
            }
            
            // Create the comparison chart
            const ctx = document.getElementById('compareChart').getContext('2d');
            compareChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['City MPG', 'Highway MPG', 'Combined MPG'],
                    datasets: datasets
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Miles Per Gallon (MPG)'
                            }
                        }
                    }
                }
            });
        }
    })
    .catch(error => {
        console.error('Error comparing cars:', error);
        alert('An error occurred while comparing the vehicles. Please try again.');
    });
}