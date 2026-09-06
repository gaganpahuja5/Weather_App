import React, { useMemo } from 'react';
import { WeatherData, Theme } from '../types';
import { format, parseISO } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart
} from 'recharts';

interface ForecastChartProps {
  weather: WeatherData;
  theme: Theme;
}

export function ForecastChart({ weather, theme }: ForecastChartProps) {
  // Extract next 24 hours of data
  const chartData = useMemo(() => {
    if (!weather || !weather.hourly) return [];
    
    // Find the current hour index
    const now = new Date();
    // Open-Meteo returns time in ISO format like "2023-10-25T14:00"
    const currentHourString = now.toISOString().slice(0, 14) + "00"; 
    
    let startIndex = weather.hourly.time.findIndex(t => t >= currentHourString);
    if (startIndex === -1) startIndex = 0;
    
    const endIndex = Math.min(startIndex + 24, weather.hourly.time.length);
    
    const data = [];
    for (let i = startIndex; i < endIndex; i++) {
      data.push({
        time: format(parseISO(weather.hourly.time[i]), 'ha'),
        temp: Math.round(weather.hourly.temperature_2m[i]),
        precip: weather.hourly.precipitation_probability[i]
      });
    }
    return data;
  }, [weather]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold">Temperature & Precipitation Trends</h2>
          <p className="text-xs text-slate-500">Next 24-hour predictive modeling</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold">
            <span className={`w-2 h-2 rounded-full ${theme.bg}`}></span> TEMP
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span> PRECIP
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative p-8 flex items-center justify-center bg-[#FCFDFF] min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.hex} stopOpacity={0.1}/>
                <stop offset="100%" stopColor={theme.hex} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
              dy={10}
            />
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
              tickFormatter={(value) => `${value}°`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '2px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Bar yAxisId="right" dataKey="precip" name="Precipitation %" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={20} />
            <Area yAxisId="left" type="monotone" dataKey="temp" name="Temperature" stroke={theme.hex} strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="h-24 grid grid-cols-4 border-t border-slate-100 bg-slate-50 shrink-0">
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Morning</span>
          <span className="text-lg font-semibold">{chartData[0]?.temp || '--'}°</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Afternoon</span>
          <span className="text-lg font-semibold">{chartData[6]?.temp || '--'}°</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Evening</span>
          <span className="text-lg font-semibold">{chartData[12]?.temp || '--'}°</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Overnight</span>
          <span className="text-lg font-semibold">{chartData[18]?.temp || '--'}°</span>
        </div>
      </div>
    </div>
  );
}
