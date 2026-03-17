# Pollution Control Hub

A React-based web app that monitors air pollution, explains health impacts, and helps users take action.

## Features Implemented

- Real-time AQI dashboard using Open-Meteo Air Quality API
- Pollutant metrics: PM2.5, PM10, CO, NO2, Ozone
- City-wise AQI comparison with charts
- Geolocation-based tracking of nearby pollution zones
- Leaflet map with hotspot view
- Pollution alerts with browser notifications
- Health advisory content and prevention tips
- Solutions and awareness section with policy references
- Community reporting with image upload + upvoting (stored in localStorage)
- Weekly/monthly insights + simple AQI prediction trend

## Run Locally

```bash
npm install
npm run dev
```

App URL (default): http://localhost:5173

## Tech Stack

- React + Vite
- Recharts (graphs)
- React Leaflet (maps)
- Open-Meteo Air Quality API

## Notes

- Location access improves relevance of tracking and map data.
- Browser notifications require permission from the user.
- Community reports are stored locally in the browser.
