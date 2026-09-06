# Weather Intelligence App

A Weather Intelligence web application generated in Google AI Studio App Build and deployed to Cloudflare Pages[cite: 1, 2].

## Features
* City search using Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`).
* Current weather and 7-day forecast using Open-Meteo Forecast API (`https://api.open-meteo.com/v1/forecast`)[cite: 1].
* Weather visualization charts and dynamic planning recommendations[cite: 1].
* Graceful error handling for missing locations or API exceptions[cite: 1].

## Workflow & Deployment Steps
1. **AI Studio Prototype**: Generated application structure in Google AI Studio App Build using Open-Meteo endpoints[cite: 1, 2].
2. **GitHub Sync**: Synced code directly to this GitHub repository via Google AI Studio direct connection[cite: 1, 2].
3. **Cloudflare Pages Deployment**:
   * Connected repository to Cloudflare Pages[cite: 1, 2].
   * **Build Command**: `npm run build`[cite: 1, 2]
   * **Build Output Directory**: `dist`[cite: 1, 2]
   * Deployed live app to `.pages.dev` domain[cite: 1, 2].
