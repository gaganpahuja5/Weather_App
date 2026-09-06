import React, { useMemo } from 'react';
import { WeatherData, Theme } from '../types';
import { getPlanningRecommendations } from '../utils';

interface PlanningRecommendationsProps {
  weather: WeatherData;
  theme: Theme;
  onExport: () => void;
}

export function PlanningRecommendations({ weather, theme, onExport }: PlanningRecommendationsProps) {
  const recommendations = useMemo(() => {
    if (!weather) return [];
    
    // Base recommendations on today's weather
    const currentCode = weather.current.weather_code;
    const todayMaxTemp = weather.daily.temperature_2m_max[0];
    const todayUV = weather.daily.uv_index_max[0];
    const currentWind = weather.current.wind_speed_10m;
    
    return getPlanningRecommendations(currentCode, todayMaxTemp, todayUV, currentWind);
  }, [weather]);

  return (
    <div className={`p-6 ${theme.bgDark} text-white shrink-0`}>
      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">Planning Recommendation</p>
      <div className="space-y-4 mb-4">
        {recommendations.map((rec) => {
          return (
            <div key={rec.id} className="text-sm leading-relaxed">
              <span className="font-bold">{rec.title}: </span>
              <span className="text-slate-100 opacity-90">{rec.description}</span>
            </div>
          );
        })}
      </div>
      <button 
        onClick={onExport}
        className={`w-full py-2 ${theme.bg} ${theme.hover} text-xs font-bold uppercase rounded-sm transition-colors text-white`}
      >
        Export Briefing
      </button>
    </div>
  );
}
