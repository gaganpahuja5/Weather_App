import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  ThermometerSun,
  Umbrella,
  type LucideIcon,
  Wind
} from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WeatherData, AirQualityData, Location, Theme } from './types';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const themes: Record<string, Theme> = {
  blue: {
    name: 'blue',
    hex: '#2563eb',
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    bgLight: 'bg-blue-50',
    textLight: 'text-blue-400',
    hover: 'hover:bg-blue-500',
    bgDark: 'bg-blue-800'
  },
  rose: {
    name: 'rose',
    hex: '#e11d48',
    bg: 'bg-rose-600',
    text: 'text-rose-600',
    border: 'border-rose-600',
    bgLight: 'bg-rose-50',
    textLight: 'text-rose-400',
    hover: 'hover:bg-rose-500',
    bgDark: 'bg-rose-800'
  },
  orange: {
    name: 'orange',
    hex: '#ea580c',
    bg: 'bg-orange-600',
    text: 'text-orange-600',
    border: 'border-orange-600',
    bgLight: 'bg-orange-50',
    textLight: 'text-orange-400',
    hover: 'hover:bg-orange-500',
    bgDark: 'bg-orange-800'
  },
  cyan: {
    name: 'cyan',
    hex: '#0891b2',
    bg: 'bg-cyan-600',
    text: 'text-cyan-600',
    border: 'border-cyan-600',
    bgLight: 'bg-cyan-50',
    textLight: 'text-cyan-400',
    hover: 'hover:bg-cyan-500',
    bgDark: 'bg-cyan-800'
  }
};

export function getThemeForTemp(temp: number): Theme {
  if (temp >= 28) return themes.rose;
  if (temp >= 18) return themes.orange;
  if (temp <= 5) return themes.cyan;
  return themes.blue;
}

export function exportBriefing(location: Location, weather: WeatherData, aqi: AirQualityData | null, recommendations: Recommendation[]) {
  const current = weather.current;
  const dateStr = format(new Date(), 'yyyy-MM-dd HH:mm');
  
  let content = `ATMOS INTEL - STRATEGIC WEATHER BRIEFING\n`;
  content += `========================================\n\n`;
  content += `TARGET LOCATION: ${location.name}, ${location.admin1 ? location.admin1 + ', ' : ''}${location.country}\n`;
  content += `GENERATED: ${dateStr}\n\n`;
  
  content += `[ CURRENT CONDITIONS ]\n`;
  content += `- Temperature: ${Math.round(current.temperature_2m)}°C (Feels like ${Math.round(current.apparent_temperature)}°C)\n`;
  content += `- Wind Speed: ${current.wind_speed_10m} km/h\n`;
  content += `- Humidity: ${current.relative_humidity_2m}%\n`;
  
  if (aqi) {
    content += `\n[ ENVIRONMENTAL METRICS ]\n`;
    content += `- European AQI: ${aqi.current.european_aqi}\n`;
    content += `- PM10: ${aqi.current.pm10} µg/m³\n`;
    content += `- PM2.5: ${aqi.current.pm2_5} µg/m³\n`;
    content += `- Ozone: ${aqi.current.ozone} µg/m³\n`;
  }
  
  content += `\n[ PLANNING RECOMMENDATIONS ]\n`;
  recommendations.forEach(rec => {
    content += `- ${rec.title.toUpperCase()}: ${rec.description}\n`;
  });
  
  content += `\n[ 7-DAY FORECAST OUTLOOK ]\n`;
  weather.daily.time.forEach((dayTime, index) => {
    const d = format(parseISO(dayTime), 'EEE, MMM d');
    const max = Math.round(weather.daily.temperature_2m_max[index]);
    const min = Math.round(weather.daily.temperature_2m_min[index]);
    const precip = weather.daily.precipitation_sum[index];
    content += `${d}: ${max}°C / ${min}°C, Precip: ${precip}mm\n`;
  });
  
  content += `\n========================================\n`;
  content += `Data provided by Open-Meteo Intelligence Network.\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AtmosIntel_${location.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface WeatherInfo {
  label: string;
  icon: LucideIcon;
  colors: string;
}

export function getWeatherInfo(code: number, isDay: boolean = true): WeatherInfo {
  // WMO Weather interpretation codes (WW)
  switch (true) {
    case code === 0:
      return {
        label: 'Clear sky',
        icon: isDay ? Sun : Sun, // You could use a Moon icon for night if desired
        colors: 'text-yellow-500 bg-yellow-50',
      };
    case code === 1 || code === 2 || code === 3:
      return {
        label: code === 1 ? 'Mainly clear' : code === 2 ? 'Partly cloudy' : 'Overcast',
        icon: code === 3 ? Cloud : CloudSun,
        colors: code === 3 ? 'text-gray-500 bg-gray-100' : 'text-blue-500 bg-blue-50',
      };
    case code === 45 || code === 48:
      return {
        label: 'Fog',
        icon: CloudFog,
        colors: 'text-slate-500 bg-slate-100',
      };
    case code >= 51 && code <= 57:
      return {
        label: 'Drizzle',
        icon: CloudDrizzle,
        colors: 'text-blue-400 bg-blue-50',
      };
    case code >= 61 && code <= 67:
      return {
        label: 'Rain',
        icon: CloudRain,
        colors: 'text-blue-600 bg-blue-100',
      };
    case code >= 71 && code <= 77:
      return {
        label: 'Snow',
        icon: CloudSnow,
        colors: 'text-sky-300 bg-sky-50',
      };
    case code >= 80 && code <= 82:
      return {
        label: 'Rain Showers',
        icon: CloudRain,
        colors: 'text-blue-700 bg-blue-100',
      };
    case code >= 85 && code <= 86:
      return {
        label: 'Snow Showers',
        icon: CloudSnow,
        colors: 'text-sky-400 bg-sky-100',
      };
    case code >= 95 && code <= 99:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        colors: 'text-purple-600 bg-purple-100',
      };
    default:
      return {
        label: 'Unknown',
        icon: Cloud,
        colors: 'text-gray-400 bg-gray-50',
      };
  }
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  type: 'alert' | 'info' | 'positive';
}

export function getPlanningRecommendations(
  weatherCode: number,
  tempMax: number,
  uvIndexMax: number,
  windSpeed: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Temperature based
  if (tempMax > 30) {
    recommendations.push({
      id: 'heat',
      title: 'High Heat Alert',
      description: 'Temperatures are very high. Stay hydrated and avoid strenuous outdoor activities during mid-day.',
      icon: ThermometerSun,
      type: 'alert'
    });
  } else if (tempMax < 5) {
    recommendations.push({
      id: 'cold',
      title: 'Freezing Conditions',
      description: 'Dress in heavy layers to prevent frostbite and stay warm.',
      icon: ThermometerSun,
      type: 'info'
    });
  } else if (tempMax >= 18 && tempMax <= 26 && weatherCode <= 3) {
    recommendations.push({
      id: 'perfect',
      title: 'Perfect Outdoor Weather',
      description: 'Excellent conditions for a walk, picnic, or outdoor sports!',
      icon: Sun,
      type: 'positive'
    });
  }

  // UV based
  if (uvIndexMax >= 6) {
    recommendations.push({
      id: 'uv',
      title: 'High UV Index',
      description: 'Sun protection is essential. Wear SPF 30+ sunscreen, a hat, and sunglasses.',
      icon: Sun,
      type: 'alert'
    });
  }

  // Precipitation based
  if (weatherCode >= 51 && weatherCode <= 67) {
    recommendations.push({
      id: 'rain',
      title: 'Rain Expected',
      description: 'Don\'t forget your umbrella or raincoat before heading out.',
      icon: Umbrella,
      type: 'info'
    });
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    recommendations.push({
      id: 'snow',
      title: 'Snowfall Expected',
      description: 'Roads may be slippery. Drive carefully and wear appropriate winter footwear.',
      icon: CloudSnow,
      type: 'alert'
    });
  }

  // Wind based
  if (windSpeed > 35) {
    recommendations.push({
      id: 'wind',
      title: 'Strong Winds',
      description: 'Secure loose outdoor items. Exercise caution if driving high-profile vehicles.',
      icon: Wind,
      type: 'alert'
    });
  }

  // Fallback
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'general',
      title: 'Typical Conditions',
      description: 'No major weather hazards expected today. Have a great day!',
      icon: CloudSun,
      type: 'positive'
    });
  }

  return recommendations;
}
