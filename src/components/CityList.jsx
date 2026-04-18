export default function CityList({ cities }) {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {cities.map((c) => (
        <div
          key={c.name}
          className="city-chip bg-white/20 border border-white/20 px-5 py-4
                     rounded-2xl min-w-[130px] text-white shrink-0 cursor-default"
        >
          <p className="text-xs opacity-60 mb-1">{c.name}</p>
          <p className="text-xl font-semibold">{c.temp}°C</p>
        </div>
      ))}
    </div>
  );
}
