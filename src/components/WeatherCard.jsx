export default function WeatherCard({ weather }) {
  if (!weather?.main) return null;

  const { name, main, wind, weather: w } = weather;

  return (
    <div className="weather-card bg-white/20 border border-white/20 p-8 rounded-3xl
                    text-white shadow-2xl w-80 shrink-0">
      <h2 className="text-lg font-medium opacity-80">{name}</h2>

      <img
        src={`https://openweathermap.org/img/wn/${w[0].icon}@2x.png`}
        alt={w[0].description}
        width={80}
        height={80}
        className="mx-auto"
      />

      <p className="text-7xl font-light">{Math.round(main.temp)}°C</p>

      <p className="capitalize text-gray-200 mt-1">{w[0].description}</p>

      <div className="grid grid-cols-3 gap-2 mt-5 text-sm text-white/70 border-t border-white/20 pt-4">
        <div>
          <p className="text-white/40 text-xs">Feels like</p>
          <p>{Math.round(main.feels_like)}°</p>
        </div>
        <div>
          <p className="text-white/40 text-xs">Humidity</p>
          <p>{main.humidity}%</p>
        </div>
        <div>
          <p className="text-white/40 text-xs">Wind</p>
          <p>{wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
}
