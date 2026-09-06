import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastChart } from './components/ForecastChart';
import { DailyForecast } from './components/DailyForecast';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ReportsPanel } from './components/ReportsPanel';
import { getWeather, getAirQuality } from './api';
import { WeatherData, AirQualityData, Location } from './types';
import { getThemeForTemp, exportBriefing, getPlanningRecommendations } from './utils';
import { Loader2, AlertCircle, CloudSun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'dashboard' | 'analytics' | 'reports';

export default function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AirQualityData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = async (loc: Location) => {
    setLocation(loc);
    setIsLoading(true);
    setError(null);
    try {
      const weatherData = await getWeather(loc.latitude, loc.longitude);
      setWeather(weatherData);
      try {
        const aqiData = await getAirQuality(loc.latitude, loc.longitude);
        setAqi(aqiData);
      } catch (e) {
        console.error("AQI unavailable", e);
        setAqi(null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve data for this location. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!weather || !location) return;
    const recommendations = getPlanningRecommendations(
      weather.current.weather_code,
      weather.daily.temperature_2m_max[0],
      weather.daily.uv_index_max[0],
      weather.current.wind_speed_10m
    );
    exportBriefing(location, weather, aqi, recommendations);
  };

  const currentTheme = weather 
    ? getThemeForTemp(weather.current.temperature_2m)
    : getThemeForTemp(20); // default fallback

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* Navigation Bar */}
      <nav className="relative z-50 h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${currentTheme.bg} flex items-center justify-center rounded-sm transition-colors duration-500`}>
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg tracking-tight">ATMOS<span className={`${currentTheme.text} transition-colors duration-500`}>INTEL</span></span>
            <span className="text-[11px] font-bold text-black tracking-widest hidden sm:inline">(by Gagan Pahuja)</span>
          </div>
        </div>
        
        <div className="flex items-center flex-1 max-w-md mx-12">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>

        <div className="flex gap-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:flex">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`pb-5 mt-5 border-b-2 transition-colors ${activeTab === 'dashboard' ? `border-current ${currentTheme.text}` : 'border-transparent hover:text-slate-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`pb-5 mt-5 border-b-2 transition-colors ${activeTab === 'analytics' ? `border-current ${currentTheme.text}` : 'border-transparent hover:text-slate-700'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`pb-5 mt-5 border-b-2 transition-colors ${activeTab === 'reports' ? `border-current ${currentTheme.text}` : 'border-transparent hover:text-slate-700'}`}
          >
            Reports
          </button>
        </div>
      </nav>

      {/* Main Intelligence Grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-px bg-slate-200 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex justify-center items-center bg-slate-200/50 backdrop-blur-sm"
            >
              <Loader2 className={`w-8 h-8 ${currentTheme.text} animate-spin`} />
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 flex justify-center items-center bg-slate-200/50"
            >
              <div className="bg-white p-6 rounded-sm flex items-center gap-3 text-red-700 shadow-xl border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {!weather && !isLoading && !error && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center text-slate-400 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-6 rounded-full border border-blue-500/30 flex items-center justify-center relative shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                  <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-20"></div>
                  <Globe className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
                </div>
                <p className="text-xl font-bold uppercase tracking-[0.2em] text-white mb-3">Atmospheric Intelligence</p>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                  Global telemetry network online.<br/>Enter a target coordinate or city name in the search matrix to initialize real-time atmospheric data stream.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {weather && location && !isLoading && !error && (
          <>
            {activeTab === 'dashboard' ? (
              <>
                {/* Left Panel: Real-time Stats */}
                <aside className="md:col-span-3 bg-white flex flex-col overflow-y-auto">
                  <CurrentWeather weather={weather} location={location} />
                </aside>

                {/* Middle Panel: Visualization */}
                <section className="md:col-span-6 bg-white flex flex-col overflow-y-auto">
                  <ForecastChart weather={weather} theme={currentTheme} />
                </section>

                {/* Right Panel: Forecast & Planning */}
                <aside className="md:col-span-3 bg-white flex flex-col border-l border-slate-100 overflow-y-auto">
                  <DailyForecast weather={weather} />
                  <PlanningRecommendations weather={weather} theme={currentTheme} onExport={handleExport} />
                </aside>
              </>
            ) : activeTab === 'analytics' ? (
              <section className="md:col-span-12 flex flex-col bg-white overflow-hidden">
                <AnalyticsPanel aqi={aqi} />
              </section>
            ) : (
              <section className="md:col-span-12 flex flex-col bg-white overflow-hidden">
                <ReportsPanel location={location} weather={weather} aqi={aqi} />
              </section>
            )}
          </>
        )}
      </main>

      {/* Status Bar / Feedback */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 uppercase">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${weather ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span> 
            {weather ? 'System Active' : 'System Standby'}
          </div>
          <span className="hidden sm:inline">Ref: OM-GEO-2204</span>
          {location && <span className="hidden md:inline">LAT: {location.latitude.toFixed(4)} LON: {location.longitude.toFixed(4)}</span>}
        </div>
        <div className="text-[10px] font-mono text-slate-400 uppercase">
          Data: Open-Meteo Intelligence Network
        </div>
      </footer>

    </div>
  );
}
