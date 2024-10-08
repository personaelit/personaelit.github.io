navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const apiKey = process.env.OPENWEATHER_API_KEY; // Use environment variable for OpenWeather API key
    const geocodingApiKey = process.env.OPENCAGE_API_KEY; // Use environment variable for OpenCage API key
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(position);
            console.log(data); // Handle the weather data here
            
            // Reverse geocoding to get city name
            const reverseGeocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lon}&key=${geocodingApiKey}`;
            return fetch(reverseGeocodingUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Geocoding response was not ok');
            }
            return response.json();
        })
        .then(geoData => {
            const city = geoData.results[0].components.city || geoData.results[0].components.town; // Get city or town
            console.log(geoData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}, error => {
    console.error('Error getting location:', error);
});
