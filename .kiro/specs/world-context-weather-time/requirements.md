# Requirements Document

## Introduction

The World Context feature extends the Necro-Pet with environmental awareness by integrating weather data and time-of-day context. The pet's world will react to real-world conditions fetched from the Open-Meteo API and the user's local system time. This creates an immersive atmosphere where the pet exists within a dynamic environment featuring weather overlays (rain, snow, storms) and day/night cycles that affect the visual presentation of the application.

## Glossary

- **Weather_Service**: A modular service that queries the Open-Meteo API to fetch current weather conditions
- **Weather_State**: One of four simplified weather conditions: 'CLEAR', 'RAIN', 'SNOW', or 'STORM'
- **WMO_Code**: World Meteorological Organization weather condition codes returned by Open-Meteo API
- **Time_Context**: A boolean flag indicating whether it is currently night time based on local system time
- **Night_Mode**: Visual state active between 6 PM and 6 AM local time
- **World_Context_Hook**: A React hook that fetches weather data and time context once on application mount
- **Weather_Overlay**: A visual component rendering weather effects (rain droplets, etc.) over the pet display
- **Pet_Store**: The existing Zustand store extended to include weather and time context state

## Requirements

### Requirement 1

**User Story:** As a developer, I want the application to fetch current weather conditions, so that my pet's environment reflects the real world.

#### Acceptance Criteria

1. WHEN the Weather_Service is invoked THEN the Weather_Service SHALL query the Open-Meteo API for current weather data
2. WHEN the Open-Meteo API returns a response THEN the Weather_Service SHALL extract the WMO_Code from the response
3. WHEN the Weather_Service receives a WMO_Code THEN the Weather_Service SHALL map the code to one of four Weather_States: 'CLEAR', 'RAIN', 'SNOW', or 'STORM'
4. WHEN the Open-Meteo API is unreachable THEN the Weather_Service SHALL return 'CLEAR' as the default Weather_State
5. WHEN no location is available THEN the Weather_Service SHALL use London coordinates (51.5074, -0.1278) as the fallback location

### Requirement 2

**User Story:** As a developer, I want the application to determine day or night based on my local time, so that the pet's world matches my current time of day.

#### Acceptance Criteria

1. WHEN determining Time_Context THEN the system SHALL read the user's local system time
2. WHEN the local time is between 6:00 AM and 5:59 PM inclusive THEN the system SHALL set isNight to false
3. WHEN the local time is between 6:00 PM and 5:59 AM inclusive THEN the system SHALL set isNight to true

### Requirement 3

**User Story:** As a developer, I want the pet store to include weather and time context, so that the entire application can react to environmental conditions.

#### Acceptance Criteria

1. WHEN the Pet_Store initializes THEN the Pet_Store SHALL include a weather property defaulting to 'CLEAR'
2. WHEN the Pet_Store initializes THEN the Pet_Store SHALL include an isNight property defaulting to false
3. WHEN the World_Context_Hook updates weather THEN the Pet_Store SHALL store the new Weather_State
4. WHEN the World_Context_Hook updates isNight THEN the Pet_Store SHALL store the new boolean value

### Requirement 4

**User Story:** As a developer, I want a hook that initializes world context on app mount, so that weather and time data are fetched automatically when the application starts.

#### Acceptance Criteria

1. WHEN the application mounts THEN the World_Context_Hook SHALL execute exactly once
2. WHEN the World_Context_Hook executes THEN the hook SHALL invoke the Weather_Service to fetch current weather
3. WHEN the World_Context_Hook executes THEN the hook SHALL determine the current Time_Context
4. WHEN weather and time data are retrieved THEN the World_Context_Hook SHALL update the Pet_Store with both values

### Requirement 5

**User Story:** As a developer, I want visual weather effects overlaid on the pet display, so that I can see the current weather conditions affecting my pet's world.

#### Acceptance Criteria

1. WHEN Weather_State is 'RAIN' THEN the Weather_Overlay SHALL render animated rain droplet effects using CSS animations
2. WHEN Weather_State is 'CLEAR' THEN the Weather_Overlay SHALL render no weather effects
3. WHEN Weather_State is 'SNOW' THEN the Weather_Overlay SHALL render animated snowfall effects
4. WHEN Weather_State is 'STORM' THEN the Weather_Overlay SHALL render intensified rain effects with visual lightning flashes

### Requirement 6

**User Story:** As a developer, I want the application to display a night mode overlay, so that the pet's world visually reflects nighttime hours.

#### Acceptance Criteria

1. WHEN isNight is true THEN the application container SHALL apply a dark overlay effect
2. WHEN isNight is false THEN the application container SHALL display without the dark overlay effect
3. WHEN Night_Mode is active THEN the overlay SHALL use CSS backdrop-filter or equivalent to create a darkened atmosphere
4. WHEN Night_Mode transitions THEN the visual change SHALL apply immediately without animation delay
