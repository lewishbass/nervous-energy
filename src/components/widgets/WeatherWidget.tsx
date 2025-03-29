"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import {
  WiDaySunny, WiDayCloudy, WiCloudy, WiShowers,
  WiDayRain, WiNightClear, WiNightCloudy, WiNightRain,
  WiThunderstorm, WiSnow, WiDayThunderstorm
} from 'react-icons/wi';

// TypeScript interfaces
interface Location {
  lat: number;
  lon: number;
}

interface WeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    windspeed_10m: number[];
    cloudcover: number[];
    uv_index: number[];
  };
  hourly_units?: {
    temperature_2m: string;
    apparent_temperature: string;
    precipitation: string;
    windspeed_10m: string;
    cloudcover: string;
    uv_index: string;
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface ChartDataPoint {
  time: number;
  temperature: number;
}

// Add a helper function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9 / 5) + 32;
};

// Define interface for tooltip props
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload?: {
      time: number;
      temperature: number;
    };
  }>;
  label?: number;
}

// Add a custom tooltip formatter
// @ts-expect-error jsx usage
const CustomTooltip = ({ active, payload, label }: TooltipProps): JSX.Element | null => {
  if (active && payload && payload.length && label) {
    const tempCelsius = payload[0].value;
    const tempFahrenheit = celsiusToFahrenheit(tempCelsius);
    const labelTime = (label % 12 === 0 ? 12 : label % 12).toString(); // Convert to 12-hour format as string
    return (
      <div className="bg1 p-2 rounded-md shadow">
        <p className="tc1 text-sm font-semibold">
          {Math.round(tempFahrenheit)}°F <span className="ml-2">{labelTime + ((label > 12) ? "PM" : "AM")}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Function to determine gradient based on current time relative to sunrise/sunset
const getDayCycleGradient = (sunrise: string, sunset: string): string => {
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);

  const sunriseFrac = (sunriseTime.getHours() + (sunriseTime.getMinutes() / 60.0)) / 24.0;
  const sunsetFrac = (sunsetTime.getHours() + (sunsetTime.getMinutes() / 60.0)) / 24.0;

  let gradient = "linear-gradient(to right, ";

  const opacity = "c0";

  // Night (midnight to pre-dawn)
  gradient += "#0c1445" + opacity + " 0%, "; // Deep blue at midnight
  gradient += "#1a2259" + opacity + " " + (sunriseFrac * 100 - 10) + "%, "; // Lighter blue before dawn

  // Sunrise transition
  gradient += "#614080" + opacity + " " + (sunriseFrac * 100 - 5) + "%, "; // Purple pre-sunrise
  gradient += "#d77a61" + opacity + " " + (sunriseFrac * 100 - 2) + "%, "; // Orange-pink early sunrise
  gradient += "#ffb56b" + opacity + " " + (sunriseFrac * 100) + "%, "; // Golden sunrise

  // Morning transition
  gradient += "#82c4e2" + opacity + " " + (sunriseFrac * 100 + 5) + "%, "; // Morning blue

  // Midday
  gradient += "#4a9eda" + opacity + " " + (sunriseFrac * 100 + 15) + "%, "; // Midday blue
  gradient += "#79bce2" + opacity + " " + ((sunriseFrac + sunsetFrac) * 50) + "%, "; // Mid-day lighter blue

  // Afternoon
  gradient += "#7ab5e2" + opacity + " " + (sunsetFrac * 100 - 15) + "%, "; // Afternoon blue

  // Sunset transition
  gradient += "#ffb56b" + opacity + " " + (sunsetFrac * 100 - 5) + "%, "; // Golden sunset
  gradient += "#e66857" + opacity + " " + (sunsetFrac * 100 - 2) + "%, "; // Red-orange sunset
  gradient += "#8d3b72" + opacity + " " + (sunsetFrac * 100) + "%, "; // Purple post-sunset

  // Night again
  gradient += "#3f2f6a" + opacity + " " + (sunsetFrac * 100 + 5) + "%, "; // Evening purple-blue  
  gradient += "#0c1445" + opacity + " " + (sunsetFrac * 100 + 10) + "%, "; // Deep blue at night
  gradient += "#0c1445" + opacity + " 100%, "; // Deep blue at midnight

  gradient = gradient.slice(0, -2) + ")"; // Remove last comma and space and close the gradient

  return gradient;
};

// Helper function to determine which weather icon to display
// @ts-expect-error jsx usage
const getWeatherIcon = (hour: number, temperature: number, precipitation: number, cloudcover: number, sunriseHour: number, sunsetHour: number): JSX.Element => {
  const isDay = hour >= sunriseHour && hour < sunsetHour;
  const size = 30; // Icon size

  // Heavy precipitation - rain or thunderstorm
  if (precipitation > 5) {
    return isDay ? <WiDayThunderstorm size={size} /> : <WiThunderstorm size={size} />;
  }

  // Medium precipitation - rain
  if (precipitation > 1) {
    return isDay ? <WiDayRain size={size} /> : <WiNightRain size={size} />;
  }

  // Light precipitation - showers
  if (precipitation > 0.1) {
    return <WiShowers size={size} />;
  }

  // Cold and precipitation - snow
  if (temperature < 0 && precipitation > 0) {
    return <WiSnow size={size} />;
  }

  // Cloud cover levels
  if (cloudcover > 80) {
    return <WiCloudy size={size} />;
  }

  if (cloudcover > 30) {
    return isDay ? <WiDayCloudy size={size} /> : <WiNightCloudy size={size} />;
  }

  // Clear
  return isDay ? <WiDaySunny size={size} /> : <WiNightClear size={size} />;
};

// Custom label components for sunrise and sunset
// @ts-expect-error jsx usage
const SunriseLabel = ({ viewBox, value }) => {
  return (
    <g>
      <rect 
        x={viewBox.x + 5} 
        y={viewBox.y + 10} 
        width={115} 
        height={25} 
        rx={4} 
        fill="rgba(0, 0, 0, 0.75)" 
        className="dark:fill-black/40 fill-white/50"
      />
      <text 
        x={viewBox.x + 10}
        y={viewBox.y + 27}
        fill="#FFFFFF"
        fontSize={16}
        className="dark:fill-white fill-black"
      >
        {value}
      </text>
    </g>
  );
};

// @ts-expect-error jsx usage
const SunsetLabel = ({ viewBox, value }) => {
  return (
    <g>
      <rect 
        x={viewBox.x - 95} 
        y={viewBox.y + 10} 
        width={115} 
        height={25} 
        rx={4} 
				fill="rgba(0, 0, 0, 0.75)"
				className="dark:fill-black/40 fill-white/50"
      />
      <text 
        x={viewBox.x - 90}
        y={viewBox.y + 27}
        fill="#FFFFFF"
        fontSize={16}
        className="dark:fill-white fill-black"
      >
        {value}
      </text>
    </g>
  );
};

interface WeatherWidgetProps {
  className?: string;
}

// @ts-expect-error jsx usage
export default function WeatherWidget({ className = "" }: WeatherWidgetProps): JSX.Element {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location>({ lat: 51.5074, lon: -0.1278 }); // Default to London
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [dayCycleGradient, setDayCycleGradient] = useState<string>('linear-gradient(to right, #4ca1af, #c4e0e5)');
  // @ts-expect-error jsx usage
  const [weatherIcons, setWeatherIcons] = useState<JSX.Element[]>([]);
  const [highLowTemp, setHighLowTemp] = useState<{ high: number, low: number }>({ high: 0, low: 0 });
  const [dailyPrecipitation, setDailyPrecipitation] = useState<number>(0);
  const [currentUVIndex, setCurrentUVIndex] = useState<number>(0);
  
  useEffect(() => {
    const getUserLocation = (): void => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lon: longitude });
            fetchWeatherData(latitude, longitude);
          },
          (error: GeolocationPositionError) => {
            console.log("Location permission denied, using default location " + error.message);
            fetchWeatherData(location.lat, location.lon);
          }
        );
      } else {
        console.log("Geolocation not supported, using default location");
        fetchWeatherData(location.lat, location.lon);
      }
    };

    const fetchWeatherData = async (lat: number, lon: number): Promise<void> => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m,cloudcover,uv_index&daily=sunrise,sunset,precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data: WeatherData = await response.json();
        setWeatherData(data);

        // Set the day cycle gradient based on sunrise/sunset
        if (data.daily && data.daily.sunrise && data.daily.sunset) {
          const todaySunrise = data.daily.sunrise[0];
          const todaySunset = data.daily.sunset[0];
          const gradient = getDayCycleGradient(todaySunrise, todaySunset);
          setDayCycleGradient(gradient);
        }

        // Format data for the chart
        const formattedData: ChartDataPoint[] = data.hourly.time.slice(0, 24).map((time, index) => {
          const date = new Date(time);
          const hour = date.getHours();
          return {
            time: hour,
            temperature: data.hourly.temperature_2m[index],
          };
        });
        // Duplicate the last data point
        if (formattedData.length > 0) {
          const lastPoint = formattedData[formattedData.length - 1];
          formattedData.push({
            time: lastPoint.time + 1,
            temperature: lastPoint.temperature
          });
        }
        setChartData(formattedData);

        // Generate weather icons
        if (data.daily && data.daily.sunrise && data.daily.sunset) {
          const sunriseTime = new Date(data.daily.sunrise[0]);
          const sunsetTime = new Date(data.daily.sunset[0]);
          const sunriseHour = sunriseTime.getHours();
          const sunsetHour = sunsetTime.getHours();

          const timeStep = 2; // Every 2 hours
          // @ts-expect-error jsx usage
          const icons: JSX.Element[] = [];

          for (let i = 0; i < 24; i += timeStep) {
            if (icons.length >= 12) break; // Limit to 12 icons

            const icon = getWeatherIcon(
              i,
              data.hourly.temperature_2m[i],
              data.hourly.precipitation[i],
              data.hourly.cloudcover[i],
              sunriseHour,
              sunsetHour
            );

            icons.push(icon);
          }

          setWeatherIcons(icons);
        }

        // Calculate high and low apparent temperature
        if (data.hourly && data.hourly.apparent_temperature) {
          const todayApparentTemps = data.hourly.apparent_temperature.slice(0, 24);
          const high = Math.max(...todayApparentTemps);
          const low = Math.min(...todayApparentTemps);
          setHighLowTemp({ high, low });
        }

        // Get daily precipitation
        if (data.daily && data.daily.precipitation_sum) {
          setDailyPrecipitation(data.daily.precipitation_sum[0]);
        }

        // Get current UV index
        if (data.hourly && data.hourly.uv_index) {
          const currentHour = new Date().getHours();
          setCurrentUVIndex(data.hourly.uv_index[currentHour]);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch weather data " + err);
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  const getUVIndexDescription = (uvIndex: number): string => {
    if (uvIndex < 3) return "Low";
    if (uvIndex < 6) return "Moderate";
    if (uvIndex < 8) return "High";
    if (uvIndex < 11) return "Very High";
    return "Extreme";
  };

  return (
    <div
      className={`p-4 rounded-lg shadow relative overflow-hidden ${className}`}
      style={{
				background: `${dayCycleGradient}, linear-gradient( 45deg , var(--fallback-bg2, black), var(--fallback-bg, black))`,
        minHeight: 'fit-content',
				transition: 'background 0.5s ease-in-out',
      }}
    >
      {/* Add a CSS variable for the fallback background color that changes with dark mode */}
      <style jsx>{`
        :global(:root) {
          --fallback-bg: white;
          --fallback-bg2: #88f;
        }
        :global(.dark) {
          --fallback-bg: black;
          --fallback-bg2: #008;
        }
      `}</style>
      
      <h2 className="text-xl font-semibold mb-3 text-white relative z-10">Local Weather</h2>

      {loading ? (
        <p className="text-white relative z-10">Loading weather information...</p>
      ) : error ? (
        <p className="text-red-200 relative z-10">{error}</p>
      ) : (
        <>
          {/* Temperature Chart as Background */}
          <div className="absolute inset-0 opacity-60 z-5" style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="time"
                  domain={[0, 24]}
                  type="number"
                  hide={true}
                  axisLine={false}
                />
                <YAxis
                  hide={true}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#fff"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#fff' }}
                />
                {/* Current time reference line */}
                <ReferenceLine x={new Date().getHours() + (new Date().getMinutes() / 60.0)} stroke="#fff" strokeWidth={2} />
                <ReferenceLine x={4} stroke="#f0f" strokeWidth={2}
                  strokeDasharray="8 4" />
                {/* Sunrise reference line */}
                {weatherData && weatherData.daily && weatherData.daily.sunrise && (
                  <ReferenceLine
                    x={new Date(weatherData.daily.sunrise[0]).getHours() + (new Date(weatherData.daily.sunrise[0]).getMinutes() / 60.0)}
                    stroke="#FFDD00"
                    strokeWidth={2}
                    strokeDasharray="5 5"
										// @ts-expect-error view box supplied by recharts
                    label={<SunriseLabel value={`🌞 ${new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />}
                  />
                )}
                {/* Sunset reference line */}
                {weatherData && weatherData.daily && weatherData.daily.sunset && (
                  <ReferenceLine
                    x={new Date(weatherData.daily.sunset[0]).getHours() + (new Date(weatherData.daily.sunset[0]).getMinutes() / 60.0)}
                    stroke="#FF6B00"
                    strokeWidth={2}
                    strokeDasharray="5 5"
										// @ts-expect-error view box supplied by recharts
                    label={<SunsetLabel value={`🌙 ${new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weather Icons Row */}
              <div className="flex justify-between mb-4 mt-16 relative z-10 mt-30">
            {weatherIcons.map((icon, index) => (
              <div key={index} className="flex flex-col items-center text-white">
                <div className="text-black dark:text-white bg-white/40 dark:bg-black/20 rounded-full lg:p-1 sm:p-0">{icon}</div>
                <span className="text-xs mt-1">
                  {index * 2}:00
                </span>
              </div>
            ))}
          </div>

          {/* Weather Data Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 mt-3">
            {weatherData && (
              <>
                <div className="bg-white/20 dark:bg-black/30 bg-opacity-20 backdrop-blur-[2px] p-3 rounded">
                  <h3 className="tc2 text-sm font-medium text-white">Temperature</h3>
                  <p className="tc1 text-xl text-white">
                    H: {Math.round(celsiusToFahrenheit(highLowTemp.high))}° L: {Math.round(celsiusToFahrenheit(highLowTemp.low))}°
                  </p>
                </div>
                <div className="bg-white/20 dark:bg-black/30 bg-opacity-20 backdrop-blur-[2px] p-3 rounded">
                  <h3 className="tc2 text-sm font-medium text-white">Daily Precipitation</h3>
                  <p className="tc1 text-xl text-white">{dailyPrecipitation.toFixed(1)} mm</p>
                </div>
                <div className="bg-white/20 dark:bg-black/30 bg-opacity-20 backdrop-blur-[2px] p-3 rounded">
                  <h3 className="tc2 text-sm font-medium text-white">Wind Speed</h3>
                  <p className="tc1 text-xl text-white">{weatherData.hourly.windspeed_10m[new Date().getHours()]} km/h</p>
                </div>
                <div className="bg-white/20 dark:bg-black/30 bg-opacity-20 backdrop-blur-[2px] p-3 rounded">
                  <h3 className="tc2 text-sm font-medium text-white">UV Index</h3>
                  <p className="tc1 text-xl text-white">
                    {currentUVIndex.toFixed(1)} <span className="text-sm opacity-80">({getUVIndexDescription(currentUVIndex)})</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
