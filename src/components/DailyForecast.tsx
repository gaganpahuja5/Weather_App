import React from 'react';
import { WeatherData } from '../types';
import { getWeatherInfo } from '../utils';
import { format, parseISO } from 'date-fns';
import { Droplets } from 'lucide-react';

interface DailyForecastProps {
  weather: WeatherData;
}

export function DailyForecast({ weather }: DailyForecastProps) {
  const daily = weather.daily;

  // Generate an array of days to render
  const days = daily.time.map((timeStr, index) => {
    return {
      time: timeStr,
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      weatherCode: daily.weather_code[index],
      precipSum: daily.precipitation_sum[index]
    };
  });

  return (
    <div className="p-6 flex-1 bg-white">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">7-Day Strategic Forecast</p>
      <div className="space-y-1">
        {days.map((day, i) => {
          const date = parseISO(day.time);
          const isToday = i === 0;
          const { icon: WeatherIcon, colors } = getWeatherInfo(day.weatherCode, true);
          const circleColor = colors.includes('yellow') ? 'bg-yellow-400' : 
                              colors.includes('blue') ? 'bg-blue-400' : 
                              colors.includes('sky') ? 'bg-sky-300' :
                              colors.includes('slate') ? 'bg-slate-300' : 'bg-slate-200';

          return (
            <div key={day.time} className="flex items-center justify-between py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <span className={`text-sm font-medium w-12 ${isToday ? 'text-blue-600' : 'text-slate-900'}`}>
                {format(date, 'EEE').toUpperCase()}
              </span>
              
              <div className="flex-1 flex justify-center items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${circleColor}`}>
                  <WeatherIcon className="w-3 h-3" />
                </div>
                {day.precipSum > 0 ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 w-12">
                    <Droplets className="w-3 h-3" />
                    {day.precipSum}mm
                  </div>
                ) : (
                  <div className="w-12"></div>
                )}
              </div>
              
              <div className="w-24 flex justify-end gap-2 text-sm">
                <span className="font-bold">{Math.round(day.maxTemp)}°</span>
                <span className="text-slate-400">{Math.round(day.minTemp)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
