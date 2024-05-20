export default class WeatherApiUrlBuilder {
    BASE_API_URL = 'https://api.open-meteo.com/v1/forecast';

    constructor(
        latitude,
        longitude,
        current = false,
        hourly = false,
        daily = false,
        forecastDays = 0,
        pastDays = 0
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.current = current;
        this.hourly = hourly;
        this.daily = daily;
        this.forecastDays = forecastDays;
        this.pastDays = pastDays;
    }

    buildURL() {
        let url = `${this.BASE_API_URL}?latitude=${this.latitude}&longitude=${this.longitude}`;

        if (this.current) url += `&current=temperature_2m`;

        if (this.hourly) url += `&hourly=temperature_2m`;

        if (this.daily) url += `&daily=sunrise,sunset`;

        if (this.forecastDays > 0) url += `&forecast_days=${this.forecastDays}`;

        if (this.pastDays > 0) url += `&past_days=${this.pastDays}`;

        return url;
    }
}