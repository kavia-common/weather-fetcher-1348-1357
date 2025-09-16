import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * A tiny service function to fetch weather data from a provider.
 * This uses a public demo endpoint pattern for illustration.
 * Replace the base URL and API key usage as needed.
 */
// PUBLIC_INTERFACE
export async function fetchWeatherByCity(city) {
  /** Fetch current weather data for a given city using a REST API. */
  // Example with Open-Meteo geocoding + current weather:
  // 1) Geocode city to get lat/lon
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1`;
  const geoResp = await fetch(geoUrl);
  if (!geoResp.ok) {
    throw new Error(`Geocoding failed with status ${geoResp.status}`);
  }
  const geoData = await geoResp.json();
  if (!geoData?.results?.length) {
    throw new Error('City not found. Please check the spelling and try again.');
  }
  const { latitude, longitude, name, country } = geoData.results[0];

  // 2) Fetch current weather using coordinates
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const weatherResp = await fetch(weatherUrl);
  if (!weatherResp.ok) {
    throw new Error(`Weather fetch failed with status ${weatherResp.status}`);
  }
  const weatherData = await weatherResp.json();
  const cw = weatherData?.current_weather;

  if (!cw) {
    throw new Error('No current weather data available for the selected location.');
  }

  // Return normalized payload for UI
  return {
    city: name,
    country: country,
    temperatureC: cw.temperature,
    windspeedKmh: cw.windspeed,
    windDirectionDeg: cw.winddirection,
    weatherCode: cw.weathercode,
    time: cw.time,
  };
}

// PUBLIC_INTERFACE
function App() {
  /** Main application for fetching and displaying current weather by city. */
  const [theme, setTheme] = useState('light');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark themes. */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isFetchDisabled = useMemo(() => {
    return !city.trim() || status === 'loading';
  }, [city, status]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!city.trim()) return;

    setStatus('loading');
    setError('');
    setResult(null);

    try {
      const data = await fetchWeatherByCity(city.trim());
      setResult(data);
      setStatus('success');
    } catch (err) {
      setError(err?.message || 'Something went wrong while fetching weather.');
      setStatus('error');
    }
  };

  // Simple helper for weather code description (subset)
  const describeWeatherCode = (code) => {
    const map = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Rain showers: slight',
      81: 'Rain showers: moderate',
      82: 'Rain showers: violent',
    };
    return map[code] || `Code ${code}`;
  };

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: '100vh', padding: '2rem' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <h1 style={{ marginTop: '2rem' }}>Weather Fetcher</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Enter a city name and get the current weather powered by an AI-friendly API integration.
        </p>

        <form onSubmit={handleSubmit} className="input-row">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., London"
            aria-label="City name"
          />
          <button
            type="submit"
            className="primary-btn"
            disabled={isFetchDisabled}
            style={{ opacity: isFetchDisabled ? 0.7 : 1 }}
          >
            {status === 'loading' ? 'Fetching...' : 'Get Weather'}
          </button>
        </form>

        {/* Status and messages */}
        <div style={{ marginTop: '1rem', minHeight: 24 }}>
          {status === 'error' && (
            <span style={{ color: '#dc3545', fontWeight: 600 }} role="alert">
              {error}
            </span>
          )}
          {status === 'success' && !result && (
            <span style={{ color: 'var(--text-secondary)' }}>No result.</span>
          )}
        </div>

        {/* Result card */}
        {result && status === 'success' && (
          <section
            aria-live="polite"
            style={{
              marginTop: '1.5rem',
              background: 'var(--bg-secondary)',
              padding: '1.25rem 1.5rem',
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              maxWidth: 520,
              width: '90%',
              textAlign: 'left',
            }}
          >
            <h2 style={{ margin: '0 0 0.25rem 0' }}>
              {result.city}, {result.country}
            </h2>
            <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)' }}>
              As of {new Date(result.time).toLocaleString()}
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 48, fontWeight: 700 }}>
                {Math.round(result.temperatureC)}°C
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{describeWeatherCode(result.weatherCode)}</div>
                <div style={{ marginTop: 4 }}>
                  Wind: {Math.round(result.windspeedKmh)} km/h ({Math.round(result.windDirectionDeg)}°)
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Helper text */}
        <div style={{ marginTop: '2rem' }}>
          <a
            className="App-link"
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
          >
            Weather data by Open‑Meteo
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
