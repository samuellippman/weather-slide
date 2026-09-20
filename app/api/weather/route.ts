import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location') || 'Glenridge, New Jersey';
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&dt=${date}&aqi=no`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch weather data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const hours = data.forecast.forecastday[0].hour
      .slice(9, 18)
      .map((hour: any) => ({
        time: hour.time,
        temp_c: hour.temp_c,
        condition: {
          text: hour.condition.text,
          icon: hour.condition.icon,
        },
      }));

    return NextResponse.json({
      success: true,
      weather: { hours },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
