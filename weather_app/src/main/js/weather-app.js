const BASE_API_URL = 'https://api.open-meteo.com/v1/forecast';
const loader = document.getElementById('loading');
let isLoading = false;
const currentWeather = document.getElementById('current-weather');

const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve({latitude, longitude});
                },
                (error) => {
                    console.error(`Error Code: ${error.code}, Error Message: ${error.message}`);
                    reject(error);
                }
            );
        } else {
            resolve({latitude: 47.54, longitude: 7.64});
        }
    });
};

getUserLocation()
    .then((coords) => {
        fetchWeatherData(coords.latitude, coords.longitude);
    })
    .catch((error) => {
        console.error(`Failed to get user location: ${error.message}`);
    });

const fetchWeatherData = (latitude, longitude) => {
    isLoading = true;
    loader.classList.add('display');

    const url = `${BASE_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,wind_speed_10m`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            loader.classList.remove('display');
            currentWeather.textContent = `${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
        })

    isLoading = false;

};
