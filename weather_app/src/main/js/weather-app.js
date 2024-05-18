import WeatherApiUrlBuilder from "./weather-api-url-builder.ts";

const loader = document.getElementById('loading');
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

const fetchWeatherData = async (latitude, longitude) => {
    displayLoader();

    const url = new WeatherApiUrlBuilder(latitude, longitude, true, true, true, 14);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        currentWeather.textContent = `current temperature: ${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
    } finally {
        hideLoader();
    }
};

function displayLoader() {
    loader.classList.add('display');
}

function hideLoader() {
    loader.classList.remove('display');
}
