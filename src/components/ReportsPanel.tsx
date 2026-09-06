import React, { useRef, useState } from 'react';
import { WeatherData, AirQualityData, Location } from '../types';
import { getPlanningRecommendations } from '../utils';
import { Download, FileText, Wind, Droplets, Thermometer, AlertCircle, Info, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportsPanelProps {
  location: Location;
  weather: WeatherData;
  aqi: AirQualityData | null;
}

export function ReportsPanel({ location, weather, aqi }: ReportsPanelProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const recommendations = React.useMemo(() => {
    return getPlanningRecommendations(
      weather.current.weather_code,
      weather.daily.temperature_2m_max[0],
      weather.daily.uv_index_max[0],
      weather.current.wind_speed_10m
    );
  }, [weather]);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`AtmosINTEL_Report_${location.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Strategic Briefing
          </h2>
          <p className="text-xs text-slate-500">Offline intelligence report generation</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {isExporting ? 'GENERATING...' : 'DOWNLOAD PDF'}
        </button>
      </div>

      <div className="p-6 md:p-12 flex-1 bg-slate-50">
        <div ref={reportRef} className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-8 md:p-10 border-b-[6px] border-blue-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-mono text-blue-400 mb-2 tracking-widest">OFFICIAL REPORT // ATMOSINTEL</p>
              <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">Strategic Weather Briefing</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-300">
                <span className="font-mono">
                  TARGET: <span className="text-white font-semibold">{location.name}, {location.admin1 ? location.admin1 + ', ' : ''}{location.country}</span>
                </span>
                <span className="font-mono hidden sm:inline">|</span>
                <span className="font-mono">
                  DATE: <span className="text-white font-semibold">{format(new Date(), 'MMM d, yyyy - HH:mm')}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-12">
            
            {/* Current Conditions */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5">Current Conditions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-sm flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-sm">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Temperature</p>
                    <p className="text-2xl font-light text-blue-900">{Math.round(weather.current.temperature_2m)}°C</p>
                    <p className="text-xs text-blue-600/80">Feels {Math.round(weather.current.apparent_temperature)}°C</p>
                  </div>
                </div>
                <div className="bg-cyan-50/50 border border-cyan-100 p-4 rounded-sm flex items-start gap-3">
                  <div className="p-2 bg-cyan-100 text-cyan-600 rounded-sm">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-cyan-500 tracking-wider">Wind Speed</p>
                    <p className="text-2xl font-light text-cyan-900">{weather.current.wind_speed_10m}</p>
                    <p className="text-xs text-cyan-600/80">km/h</p>
                  </div>
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-sm flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-sm">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Humidity</p>
                    <p className="text-2xl font-light text-indigo-900">{weather.current.relative_humidity_2m}</p>
                    <p className="text-xs text-indigo-600/80">Percent</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Environmental Metrics (if AQI exists) */}
            {aqi && (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5">Environmental Metrics</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-sm overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    <div className="p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">European AQI</p>
                      <p className="text-xl font-medium text-slate-900">{aqi.current.european_aqi}</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">PM10 (µg/m³)</p>
                      <p className="text-xl font-medium text-slate-900">{aqi.current.pm10}</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">PM2.5 (µg/m³)</p>
                      <p className="text-xl font-medium text-slate-900">{aqi.current.pm2_5}</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Ozone (µg/m³)</p>
                      <p className="text-xl font-medium text-slate-900">{aqi.current.ozone}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Planning Recommendations */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5">Planning Recommendations</h3>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-slate-100 bg-white rounded-sm shadow-sm items-start">
                    <div className="mt-0.5 text-blue-500">
                      {rec.type === 'alert' ? <AlertCircle className="w-5 h-5 text-rose-500" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${rec.type === 'alert' ? 'text-rose-700' : 'text-slate-900'}`}>{rec.title}</p>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7-Day Forecast */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5">7-Day Outlook</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-sm">
                {weather.daily.time.slice(0, 7).map((t, i) => (
                  <div key={t} className={`flex items-center justify-between p-3 text-sm ${i !== 6 ? 'border-b border-slate-200' : ''}`}>
                    <span className="font-semibold text-slate-700 w-24">{i === 0 ? 'Today' : format(parseISO(t), 'EEE, MMM d')}</span>
                    <div className="flex-1 text-center text-slate-500 text-xs">
                       Precip: {weather.daily.precipitation_sum[i]}mm
                    </div>
                    <div className="w-24 text-right">
                       <span className="font-bold text-slate-900">{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                       <span className="text-slate-400 ml-2">{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
