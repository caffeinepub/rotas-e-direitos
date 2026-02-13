import { WeatherCondition } from '../backend';

interface WeatherData {
  condition: WeatherCondition;
  temperatureC: number;
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    const apiKey = 'demo';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},BR&appid=${apiKey}&units=metric&lang=pt_br`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    let condition: WeatherCondition = WeatherCondition.clear;
    const weatherMain = data.weather?.[0]?.main?.toLowerCase() || '';

    if (weatherMain.includes('rain')) {
      condition = WeatherCondition.rainy;
    } else if (weatherMain.includes('cloud')) {
      condition = WeatherCondition.cloudy;
    } else if (weatherMain.includes('clear')) {
      condition = WeatherCondition.clear;
    } else if (weatherMain.includes('wind')) {
      condition = WeatherCondition.windy;
    }

    return {
      condition,
      temperatureC: data.main?.temp || 25,
    };
  } catch (error) {
    console.error('Weather fetch failed:', error);
    return {
      condition: WeatherCondition.clear,
      temperatureC: 25,
    };
  }
}
