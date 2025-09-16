# Weather Frontend (React)

A lightweight React app that lets users enter a city and fetches the current weather via a public weather API (Open‑Meteo). The app demonstrates:
- City input field
- Fetch on button click
- Loading and error states
- Display of current weather data
- Theme toggle (light/dark)

## Getting Started

In the project directory, run:

### `npm start`
Runs the app in development mode.  
Open http://localhost:3000 to view it in the browser.

### `npm test`
Launches the test runner.

### `npm run build`
Builds the app for production to the `build` folder.

## How it works

The app uses two HTTP requests:
1. Geocoding: resolve city name to latitude/longitude using Open‑Meteo Geocoding API.
2. Weather: fetch current weather using latitude/longitude from Open‑Meteo Forecast API.

No API key is required for these endpoints.

## Environment variables

No environment variables are required. If you later switch to a provider that requires an API key, configure it using a `.env` file (do not hardcode secrets) and update the fetch logic accordingly.

## Files of interest

- `src/App.js`: Main UI and fetch logic (functional component + hooks)
- `src/App.css`: Theme variables and basic styles

## Accessibility

- Keyboard-friendly form (submit via Enter)
- Clear loading and error feedback
- Color contrast friendly themes

## Attribution

Weather data provided by Open‑Meteo (https://open-meteo.com/).
