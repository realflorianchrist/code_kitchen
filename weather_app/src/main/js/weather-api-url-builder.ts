export default class WeatherApiUrlBuilder {
    BASE_API_URL = 'https://api.open-meteo.com/v1/forecast';

    constructor(
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly current: boolean = false,
        public readonly hourly: boolean = false,
        public readonly daily: boolean = false,
        public readonly pastDays: number = 0,
    ) {}

    buildURL(): string {
        let url = `${this.BASE_API_URL}?latitude=${this.latitude}&longitude=${this.longitude}`;

        if (this.current) url += `&current=temperature_2m`;

        if (this.hourly) url += `&hourly=temperature_2m`;

        if (this.daily) url += `&daily=sunrise,sunset`;

        if (this.pastDays > 0) url += `&past_days=${this.pastDays}`;

        return url;
    }
}