export default class WeatherApiUrlBuilder {
    BASE_API_URL = 'https://api.open-meteo.com/v1/forecast';

    constructor(
        latitude: number,
        longitude: number,
        current: boolean,
        pastDays: number,
        hourly: boolean
    ) {

    }
}