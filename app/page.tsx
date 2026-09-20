'use client';

import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface HourlyWeather {
  time: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
}

interface DayWeather {
  hours: HourlyWeather[];
}

export default function WeatherSlide() {
  const [date, setDate] = useState<Date>(new Date());
  const [weather, setWeather] = useState<DayWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('Glenridge, New Jersey');
  const [inputLocation, setInputLocation] = useState('Glenridge, New Jersey');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const weatherRef = useRef<HTMLDivElement>(null);

  const fetchWeather = async (dateToFetch: Date, loc: string) => {
    setLoading(true);
    try {
      const dateStr = dateToFetch.toISOString().split('T')[0];
      const response = await fetch(
        `/api/weather?location=${encodeURIComponent(loc)}&date=${dateStr}`
      );
      const data = await response.json();
      if (data.success) {
        setWeather(data.weather);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(date, location);
  }, [date, location]);

  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const handleLocationChange = () => {
    setLocation(inputLocation);
    setShowLocationInput(false);
  };

  const downloadImage = async () => {
    if (!weatherRef.current) return;

    try {
      const canvas = await html2canvas(weatherRef.current, {
        backgroundColor: '#1e40af',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `weather-${date.toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const getWeatherEmoji = (condition: string): string => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return '☀️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return '🌧️';
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return '⛈️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️';
    if (lowerCondition.includes('wind')) return '💨';
    return '🌤️';
  };

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Controls - Hidden in export */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 no-export">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousDay}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                ← Previous
              </button>
              <span className="text-gray-700 font-semibold min-w-48">{dateStr}</span>
              <button
                onClick={handleNextDay}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Next →
              </button>
            </div>

            <div className="flex items-center gap-2">
              {showLocationInput ? (
                <>
                  <input
                    type="text"
                    value={inputLocation}
                    onChange={(e) => setInputLocation(e.target.value)}
                    placeholder="Enter location"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleLocationChange}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => {
                      setShowLocationInput(false);
                      setInputLocation(location);
                    }}
                    className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-700">📍 {location}</span>
                  <button
                    onClick={() => setShowLocationInput(true)}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            <button
              onClick={downloadImage}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400"
            >
              📥 Download Image
            </button>
          </div>
        </div>

        {/* Weather Display - This is what gets exported */}
        <div
          ref={weatherRef}
          style={{ aspectRatio: '16/9' }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 flex flex-col justify-between"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white text-3xl">Loading weather...</p>
            </div>
          ) : weather ? (
            <>
              <div className="text-white">
                <h2 className="text-5xl font-bold">{dateStr}</h2>
              </div>

              <div className="flex-1 flex gap-3 items-center justify-between overflow-hidden">
                {weather.hours.map((hour, index) => {
                  const hourNum = 9 + index;
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-white/15 rounded-lg p-4 flex flex-col items-center justify-center text-white backdrop-blur-sm h-full"
                    >
                      <div className="text-2xl font-semibold mb-3">
                        {hourNum}:00
                      </div>
                      <div className="text-6xl mb-3">
                        {getWeatherEmoji(hour.condition.text)}
                      </div>
                      <div className="text-5xl font-bold mb-2">
                        {Math.round(hour.temp_c)}°
                      </div>
                      <div className="text-sm text-white/90 text-center leading-tight">
                        {hour.condition.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white text-3xl">Unable to load weather</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-export {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
