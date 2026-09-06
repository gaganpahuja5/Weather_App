import React from 'react';
import { AirQualityData } from '../types';

interface AnalyticsPanelProps {
  aqi: AirQualityData | null;
}

export function AnalyticsPanel({ aqi }: AnalyticsPanelProps) {
  if (!aqi) {
    return (
      <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Air Quality Unavailable</p>
      </div>
    );
  }

  const { current } = aqi;

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Atmospheric Analytics</h2>
          <p className="text-xs text-slate-500">Real-time European AQI & Particulate Data</p>
        </div>
      </div>

      <div className="p-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 border border-slate-100 rounded-sm flex flex-col">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">European AQI</p>
            <div className="flex items-end gap-2 mb-2">
              <h1 className="text-5xl font-light tracking-tighter">{current.european_aqi}</h1>
              <span className="text-sm text-slate-400 mb-1">Index</span>
            </div>
            <p className="text-xs text-slate-500 mt-auto">Standard composite index of overall air quality.</p>
          </div>
          
          <div className="bg-slate-50 p-6 border border-slate-100 rounded-sm flex flex-col">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Particulate Matter (PM10)</p>
            <div className="flex items-end gap-2 mb-2">
              <h1 className="text-5xl font-light tracking-tighter">{current.pm10}</h1>
              <span className="text-sm text-slate-400 mb-1">µg/m³</span>
            </div>
            <p className="text-xs text-slate-500 mt-auto">Inhalable particles, with diameters that are generally 10 micrometers and smaller.</p>
          </div>

          <div className="bg-slate-50 p-6 border border-slate-100 rounded-sm flex flex-col">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fine Particulate (PM2.5)</p>
            <div className="flex items-end gap-2 mb-2">
              <h1 className="text-5xl font-light tracking-tighter">{current.pm2_5}</h1>
              <span className="text-sm text-slate-400 mb-1">µg/m³</span>
            </div>
            <p className="text-xs text-slate-500 mt-auto">Fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller.</p>
          </div>

          <div className="bg-slate-50 p-6 border border-slate-100 rounded-sm flex flex-col">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ozone (O3)</p>
            <div className="flex items-end gap-2 mb-2">
              <h1 className="text-5xl font-light tracking-tighter">{current.ozone}</h1>
              <span className="text-sm text-slate-400 mb-1">µg/m³</span>
            </div>
            <p className="text-xs text-slate-500 mt-auto">Ground-level ozone metric.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
