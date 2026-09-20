# Weather Slide for Google Slides

A weather display webpage designed for embedding in Google Slides. Shows hourly weather (9am-5pm) in a beautiful 16:9 format with day navigation and downloadable images.

## Setup

### 1. Get a Weather API Key

1. Go to [weatherapi.com](https://www.weatherapi.com/)
2. Sign up for a free account (free tier includes forecast data)
3. Copy your API key

### 2. Configure the Environment

1. Copy `.env.local.example` to `.env.local`
2. Paste your API key into the `WEATHER_API_KEY` variable

```bash
cp .env.local.example .env.local
# Edit .env.local and add your API key
```

### 3. Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the weather slide.

## Features

- **Hourly Timeline**: Shows weather for 9am-5pm in a clean grid
- **Day Navigation**: Previous/Next buttons to view different days
- **Location Selector**: Change location (hidden when exporting)
- **Download Image**: Export as a 16:9 PNG image (perfect for Google Slides)
- **Weather Icons**: Emoji indicators for weather conditions

## Deployment to Vercel

1. Push to GitHub
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Add `WEATHER_API_KEY` environment variable in Vercel settings
5. Deploy!

## Usage

- Use **Previous/Next buttons** to navigate dates
- Click **Edit** next to the location to change the city
- Click **Download Image** to get a PNG for Google Slides
- The downloaded image shows only the weather, no buttons

## How to Use in Google Slides

1. Download a weather image from the webpage
2. In Google Slides, click **Insert → Image**
3. Upload or paste the image
4. Set it as the background or add it to a slide

You can manually update the image daily, or set a recurring reminder to refresh it.
