import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, History } from 'lucide-react';
import { Location } from '../types';
import { searchLocations } from '../api';
import { cn } from '../utils';

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    
    // Load recent locations from localStorage
    const saved = localStorage.getItem('recentLocations');
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent locations', e);
      }
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const data = await searchLocations(query);
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (location: Location) => {
    setQuery('');
    setIsOpen(false);
    onLocationSelect(location);
    
    // Save to recent locations
    const updatedRecents = [location, ...recentLocations.filter(r => r.id !== location.id)].slice(0, 5);
    setRecentLocations(updatedRecents);
    localStorage.setItem('recentLocations', JSON.stringify(updatedRecents));
  };

  const showRecents = query.trim().length < 2 && recentLocations.length > 0;
  const showResults = query.trim().length >= 2 && results.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-slate-100 border-none pl-4 pr-10 py-2 text-sm focus:ring-1 focus:ring-blue-500 rounded-sm outline-none transition-shadow placeholder-slate-400"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading ? (
          <div className="absolute right-3 top-2 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="absolute right-3 top-2 opacity-40 pointer-events-none">
            <Search className="h-4 w-4" />
          </div>
        )}
      </div>

      {isOpen && (showResults || showRecents) && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-sm py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {showRecents && !showResults && (
            <li className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              Recent Locations
            </li>
          )}
          
          {(showResults ? results : recentLocations).map((location) => (
            <li
              key={location.id}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-50 transition-colors flex items-start gap-2"
              onClick={() => handleSelect(location)}
            >
              {showRecents && !showResults ? (
                <History className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">{location.name}</span>
                <span className="text-slate-500 text-xs">
                  {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
