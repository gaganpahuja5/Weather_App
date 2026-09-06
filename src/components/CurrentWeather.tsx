import React from 'react';
import { WeatherData, Location } from '../types';
import { getWeatherInfo } from '../utils';
import { Droplets, Wind, Thermometer } from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherData;
  location: Location;
}

export function CurrentWeather({ weather, location }: CurrentWeatherProps) {
  const current = weather.current;
  const isDay = current.is_day === 1;
  const { label, icon: WeatherIcon, colors } = getWeatherInfo(current.weather_code, isDay);

  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Conditions</p>
        <div className="flex items-end gap-2">
          <h1 className="text-6xl font-light tracking-tighter">{Math.round(current.temperature_2m)}°</h1>
          <span className="text-xl text-slate-400 mb-2">C</span>
        </div>
        <p className="text-lg font-medium mt-2">{label}</p>
        <p className="text-sm text-slate-500">
          Humidity: {current.relative_humidity_2m}% • Wind: {current.wind_speed_10m} km/h
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Environmental Metrics</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm">
            <p className="text-[10px] text-slate-400 uppercase">Feels Like</p>
            <p className="text-xl font-semibold">{Math.round(current.apparent_temperature)}°</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm">
            <p className="text-[10px] text-slate-400 uppercase">Precipitation</p>
            <p className="text-xl font-semibold">{current.precipitation} mm</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm">
            <p className="text-[10px] text-slate-400 uppercase">UV Index</p>
            <p className="text-xl font-semibold">{weather.daily.uv_index_max[0]}</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm">
            <p className="text-[10px] text-slate-400 uppercase">Location</p>
            <p className="text-base font-semibold truncate">{location.name}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 bg-blue-50 border-l-4 border-blue-600">
        <p className="text-xs font-bold text-blue-800 uppercase mb-1">Intelligence Note</p>
        <p className="text-xs text-blue-700 leading-relaxed">
          {label} conditions. High of {Math.round(weather.daily.temperature_2m_max[0])}°C expected today.
        </p>
      </div>
    </div>
  );
}
