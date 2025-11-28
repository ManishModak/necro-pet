// Summoning the elemental forces of weather from the ethereal realm...

// The four elemental states of the necromantic atmosphere
export const WeatherState = {
  CLEAR: 'CLEAR',
  RAIN: 'RAIN',
  SNOW: 'SNOW',
  STORM: 'STORM'
} as const;
export type WeatherState = typeof WeatherState[keyof typeof WeatherState];

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Default coordinates - London, the fog-shrouded city
export const DEFAULT_COORDINATES: Coordinates = {
  latitude: 51.5074,
  longitude: -0.1278
};

// WMO Weather interpretation codes (WMO 4677) - The ancient weather omens
const WMO_MAPPING: Record<number, WeatherState> = {
  // Clear sky - The spirits rest
  0: 'CLEAR',
  // Mainly clear, partly cloudy, overcast
  1: 'CLEAR', 2: 'CLEAR', 3: 'CLEAR',
  // Fog variants - The mist descends
  45: 'CLEAR', 48: 'CLEAR',
  // Drizzle variants - Light tears from the sky
  51: 'RAIN', 53: 'RAIN', 55: 'RAIN',
  56: 'RAIN', 57: 'RAIN',
  // Rain variants - The heavens weep
  61: 'RAIN', 63: 'RAIN', 65: 'RAIN',
  66: 'RAIN', 67: 'RAIN',
  // Snow variants - Frozen souls falling
  71: 'SNOW', 73: 'SNOW', 75: 'SNOW',
  77: 'SNOW',
  // Rain showers - Sudden downpours
  80: 'RAIN', 81: 'RAIN', 82: 'RAIN',
  // Snow showers - Blizzard spirits
  85: 'SNOW', 86: 'SNOW',
  // Thunderstorm variants - The storm gods rage
  95: 'STORM', 96: 'STORM', 99: 'STORM'
};

// Spooky error messages for when the spirits refuse to speak
const WEATHER_ERROR_MESSAGES = {
  FETCH_FAILURE: "The weather spirits refuse to speak...",
  TIMEOUT: "The ethereal connection has withered...",
  INVALID_RESPONSE: "The omens are unreadable...",
  LOCATION_UNKNOWN: "The compass spins wildly, defaulting to London's fog..."
} as const;

// Pure function: Divine the weather state from WMO codes
// Maps WMO codes (0-99) to WeatherState, defaulting unmapped codes to 'CLEAR'
export const mapWMOCodeToWeather = (wmoCode: number): WeatherState => {
  return WMO_MAPPING[wmoCode] ?? 'CLEAR';
};

// Interface for the Open-Meteo API response structure
interface OpenMeteoResponse {
  current_weather: {
    weathercode: number;
    temperature: number;
    windspeed: number;
  };
}

// Fetch current weather from the ethereal Open-Meteo API
// Returns 'CLEAR' on any error (network, timeout, invalid response)
export const fetchWeather = async (coords: Coordinates = DEFAULT_COORDINATES): Promise<WeatherState> => {
  try {
    // Constructing the mystical URL to commune with the weather spirits
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`;
    
    // Summoning the weather data with a 5-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(WEATHER_ERROR_MESSAGES.FETCH_FAILURE);
      return 'CLEAR';
    }
    
    const data: OpenMeteoResponse = await response.json();
    
    // Extracting the WMO code from the ethereal response
    const weathercode = data?.current_weather?.weathercode;
    
    if (typeof weathercode !== 'number') {
      console.warn(WEATHER_ERROR_MESSAGES.INVALID_RESPONSE);
      return 'CLEAR';
    }
    
    // Divining the weather state from the WMO code
    return mapWMOCodeToWeather(weathercode);
    
  } catch (error) {
    // The spirits have failed us - defaulting to clear skies
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(WEATHER_ERROR_MESSAGES.TIMEOUT);
    } else {
      console.warn(WEATHER_ERROR_MESSAGES.FETCH_FAILURE);
    }
    return 'CLEAR';
  }
};
