import { useState, useEffect, useCallback } from "react";
import MapView from "./components/MapView";
import WeatherCard from "./components/WeatherCard";
import ForecastChart from "./components/ForecastChart";
import CityList from "./components/CityList";

const API_KEY = "fc471001e538a1d0ffc3af0986a4d080";
const BASE = "https://api.openweathermap.org/data/2.5";

export default function App() {
  const [cityInput, setCityInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addCity = useCallback((data) => {
    if (!data?.coord || !data?.name) return;
    setCities((prev) => {
      if (prev.find((c) => c.name === data.name)) return prev;
      return [
        ...prev,
        {
          name: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          temp: Math.round(data.main.temp),
        },
      ];
    });
  }, []);

  /* ── Auto-detect location on mount ── */
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setLoading(true);
          const res = await fetch(
            `${BASE}/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${API_KEY}`
          );
          if (!res.ok) throw new Error("Location weather fetch failed");
          const data = await res.json();
          setWeather(data);
          addCity(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      },
      (e) => console.warn("Geolocation denied:", e.message)
    );
  }, [addCity]);

  /* ── Search by city name ── */
  const fetchWeather = useCallback(async () => {
    const q = cityInput.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${encodeURIComponent(q)}&units=metric&appid=${API_KEY}`),
        fetch(`${BASE}/forecast?q=${encodeURIComponent(q)}&units=metric&appid=${API_KEY}`),
      ]);
      const w = await wRes.json();
      const f = await fRes.json();

      if (w.cod !== 200) {
        setError(`"${q}" not found. Check the city name.`);
        return;
      }

      setWeather(w);
      setForecast(f?.list?.slice(0, 8) ?? null);
      addCity(w);
      setCityInput("");
    } catch (e) {
      setError("Network error. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [cityInput, addCity]);

  /* ── Dynamic background based on weather ── */
  const getBg = () => {
    if (!weather) return "from-indigo-600 via-purple-600 to-blue-600";
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes("cloud")) return "from-gray-600 via-gray-700 to-gray-900";
    if (main.includes("rain") || main.includes("drizzle"))
      return "from-blue-800 via-indigo-900 to-black";
    if (main.includes("clear")) return "from-blue-400 via-sky-500 to-indigo-600";
    if (main.includes("snow")) return "from-slate-300 via-blue-200 to-slate-400";
    if (main.includes("thunder")) return "from-gray-900 via-purple-900 to-black";
    return "from-indigo-600 via-purple-600 to-blue-600";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBg()} app-bg`}>
      <div className="min-h-screen bg-black/30">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-white text-2xl font-semibold tracking-wide">
              🌤 Weather App
            </h1>
            <div className="flex gap-3 items-center">
              <input
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                placeholder="Search city..."
                className="px-5 py-3 rounded-2xl w-64 bg-white/20 text-white
                           placeholder-white/60 border border-white/20 outline-none
                           focus:border-white/50 transition-colors"
              />
              <button
                onClick={fetchWeather}
                disabled={loading}
                className="bg-white text-black px-6 py-3 rounded-2xl font-semibold
                           hover:scale-105 active:scale-95 transition-transform shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Search"}
              </button>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <p className="text-red-300 bg-red-900/30 border border-red-400/30
                          px-4 py-2 rounded-xl text-sm">
              ⚠ {error}
            </p>
          )}

          {/* ── Saved Cities ── */}
          <CityList cities={cities} />

          {/* ── Weather Card + Forecast Chart ── */}
          <div className="flex flex-wrap gap-8 items-start">
            <WeatherCard weather={weather} />
            <ForecastChart data={forecast} />
          </div>

          {/* ── Map ── */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <MapView cities={cities} />
          </div>

        </div>
      </div>
    </div>
  );
}
