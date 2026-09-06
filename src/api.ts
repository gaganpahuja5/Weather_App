import { Location, WeatherData, GeocodingResponse, AirQualityData } from './types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const AQI_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const url = new URL(AQI_API);
  url.searchParams.append('latitude', lat.toString());
  url.searchParams.append('longitude', lon.toString());
  url.searchParams.append('current', 'european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone');
  url.searchParams.append('timezone', 'auto');
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch air quality data');
  }
  return response.json();
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) return [];
  
  const url = new URL(GEOCODING_API);
  url.searchParams.append('name', query);
  url.searchParams.append('count', '5');
  url.searchParams.append('language', 'en');
  url.searchParams.append('format', 'json');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  const data: GeocodingResponse = await response.json();
  return data.results || [];
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = new URL(FORECAST_API);
  url.searchParams.append('latitude', lat.toString());
  url.searchParams.append('longitude', lon.toString());
  url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m');
  url.searchParams.append('hourly', 'temperature_2m,precipitation_probability,weather_code');
  url.searchParams.append('daily', 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum');
  url.searchParams.append('timezone', 'auto');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}
