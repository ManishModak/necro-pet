# Implementation Plan

- [x] 1. Create Weather Service with WMO code mapping





  - [x] 1.1 Create weatherService.ts with types and constants


    - Create `src/renderer/services/weatherService.ts`
    - Define WeatherState enum ('CLEAR', 'RAIN', 'SNOW', 'STORM')
    - Define Coordinates interface and DEFAULT_COORDINATES (London)
    - Implement WMO code mapping object
    - _Requirements: 1.3, 1.5_

  - [x] 1.2 Implement mapWMOCodeToWeather pure function

    - Create pure function that maps WMO codes (0-99) to WeatherState
    - Default unmapped codes to 'CLEAR'
    - _Requirements: 1.3_

  - [x] 1.3 Write property test for WMO code mapping

    - **Property 1: WMO Code Mapping Completeness**
    - **Validates: Requirements 1.3**
  - [x] 1.4 Implement fetchWeather async function


    - Build Open-Meteo API URL with coordinates
    - Fetch current_weather and extract weathercode
    - Map weathercode to WeatherState using mapWMOCodeToWeather
    - Return 'CLEAR' on any error (network, timeout, invalid response)
    - _Requirements: 1.1, 1.2, 1.4_

- [x] 2. Create Time Context utility




  - [x] 2.1 Create timeContext.ts with isNightTime function

    - Create `src/renderer/services/timeContext.ts`
    - Implement isNightTime pure function (hour < 6 OR hour >= 18)
    - Implement getCurrentTimeContext that reads system time
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 2.2 Write property test for time context calculation


    - **Property 2: Time Context Calculation**
    - **Validates: Requirements 2.2, 2.3**

- [x] 3. Extend Pet Store with world context state



  - [x] 3.1 Add weather and isNight to petStore.ts


    - Add weather property (default: 'CLEAR')
    - Add isNight property (default: false)
    - Add setWeather action
    - Add setIsNight action
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 3.2 Write property tests for store world context updates


    - **Property 3: Store Weather Update Consistency**
    - **Property 4: Store Night Update Consistency**
    - **Validates: Requirements 3.3, 3.4**

- [x] 4. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create World Context Hook






  - [x] 5.1 Create useWorldContext.ts hook

    - Create `src/renderer/hooks/useWorldContext.ts`
    - Use useEffect with empty dependency array (run once on mount)
    - Call fetchWeather and update store with result
    - Call getCurrentTimeContext and update store with result
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 5.2 Write unit test for useWorldContext hook


    - Test hook executes once on mount
    - Test hook updates store with weather and isNight values
    - _Requirements: 4.1, 4.4_
-

- [x] 6. Create Weather Overlay component



  - [x] 6.1 Create WeatherOverlay.tsx component


    - Create `src/renderer/features/weather/WeatherOverlay.tsx`
    - Subscribe to weather and isNight from usePetStore
    - Render rain droplets when weather is 'RAIN'
    - Render snowflakes when weather is 'SNOW'
    - Render storm effects (rain + lightning) when weather is 'STORM'
    - Render nothing when weather is 'CLEAR'
    - Apply dark overlay when isNight is true
    - Use CSS animations for weather effects
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_
  - [x] 6.2 Write property test for Weather Overlay rendering


    - **Property 5: Weather Overlay Rendering Consistency**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**


- [x] 7. Integrate into App component



  - [x] 7.1 Update App.tsx to use world context


    - Import and call useWorldContext hook
    - Import and render WeatherOverlay component
    - Position WeatherOverlay as overlay on top of PetDisplay
    - _Requirements: 4.1, 5.1, 6.1_



- [x] 8. Final Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
