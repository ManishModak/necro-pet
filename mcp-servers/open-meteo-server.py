#!/usr/bin/env python3
"""
// Summoning the weather spirits from the Open-Meteo realm...
// This MCP server channels atmospheric data for our undead companion.
"""

import json
import urllib.request
import urllib.parse
from mcp.server.fastmcp import FastMCP

# // Awakening the server from its eternal slumber...
mcp = FastMCP("open-meteo")


@mcp.tool()
def get_current_weather(latitude: float, longitude: float) -> str:
    """
    // Peer into the sky and divine the current weather conditions.
    Fetches current weather data from Open-Meteo API.
    
    Args:
        latitude: The latitude coordinate (e.g., 40.7128 for New York)
        longitude: The longitude coordinate (e.g., -74.0060 for New York)
    
    Returns:
        Current weather data including temperature, wind, and conditions.
    """
    # // Crafting the summoning circle (URL parameters)...
    params = urllib.parse.urlencode({
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m",
        "timezone": "auto"
    })
    
    url = f"https://api.open-meteo.com/v1/forecast?{params}"
    
    try:
        # // Reaching through the veil to fetch weather data...
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        current = data.get("current", {})
        units = data.get("current_units", {})
        
        # // Translating the weather codes from the ancient meteorological texts...
        weather_codes = {
            0: "Clear sky",
            1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Foggy", 48: "Depositing rime fog",
            51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
            61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
            71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
            80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
            95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
        }
        
        weather_description = weather_codes.get(current.get("weather_code", 0), "Unknown")
        
        return json.dumps({
            "location": {"latitude": latitude, "longitude": longitude},
            "timezone": data.get("timezone"),
            "current": {
                "temperature": f"{current.get('temperature_2m')} {units.get('temperature_2m', '°C')}",
                "feels_like": f"{current.get('apparent_temperature')} {units.get('apparent_temperature', '°C')}",
                "humidity": f"{current.get('relative_humidity_2m')} {units.get('relative_humidity_2m', '%')}",
                "precipitation": f"{current.get('precipitation')} {units.get('precipitation', 'mm')}",
                "cloud_cover": f"{current.get('cloud_cover')} {units.get('cloud_cover', '%')}",
                "wind_speed": f"{current.get('wind_speed_10m')} {units.get('wind_speed_10m', 'km/h')}",
                "wind_direction": f"{current.get('wind_direction_10m')} {units.get('wind_direction_10m', '°')}",
                "weather_code": current.get("weather_code"),
                "weather_description": weather_description
            }
        }, indent=2)
        
    except Exception as e:
        # // The spirits have rejected our plea...
        return json.dumps({"error": str(e)})


@mcp.tool()
def get_weather_forecast(latitude: float, longitude: float, days: int = 3) -> str:
    """
    // Gaze into the future and predict the weather for days to come.
    Fetches weather forecast from Open-Meteo API.
    
    Args:
        latitude: The latitude coordinate
        longitude: The longitude coordinate  
        days: Number of forecast days (1-16, default 3)
    
    Returns:
        Daily weather forecast data.
    """
    # // Binding the forecast days to mortal limits...
    days = max(1, min(16, days))
    
    params = urllib.parse.urlencode({
        "latitude": latitude,
        "longitude": longitude,
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
        "timezone": "auto",
        "forecast_days": days
    })
    
    url = f"https://api.open-meteo.com/v1/forecast?{params}"
    
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        return json.dumps(data, indent=2)
        
    except Exception as e:
        return json.dumps({"error": str(e)})


if __name__ == "__main__":
    # // The ritual begins... awakening the MCP server...
    mcp.run()
