import { MapPin, Clock, Calendar, ChevronRight } from 'lucide-react';

const SEASON_LABELS = {
  june: 'June',
  'late-august': 'Late Aug',
  'early-september': 'Early Sep',
};

export default function TripCard({ trip, isSelected, onSelect }) {
  const isFeatured = trip.id === 'eastern-circuit';

  return (
    <button
      onClick={() => onSelect(trip.id)}
      className={`
        w-full text-left rounded-xl border-2 overflow-hidden transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
        ${isSelected
          ? 'border-violet-500 shadow-lg -translate-y-0.5'
          : 'border-slate-200 shadow-sm hover:border-slate-300'}
      `}
    >
      {/* Gradient header */}
      <div
        className="relative p-4 text-white"
        style={{ background: `linear-gradient(135deg, ${trip.colorFrom}, ${trip.colorTo})` }}
      >
        {isFeatured && (
          <span className="absolute top-3 right-3 bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            7-DAY
          </span>
        )}
        <div className="text-3xl mb-1">{trip.emoji}</div>
        <h3 className="font-bold text-base leading-tight">{trip.name}</h3>
        <p className="text-white/80 text-xs mt-0.5 leading-snug line-clamp-2">{trip.tagline}</p>
      </div>

      {/* Stats */}
      <div className="bg-white px-4 py-3 space-y-2">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat icon={<MapPin className="w-3 h-3" />} label="Round trip" value={`${trip.distanceKm} km`} />
          <Stat icon={<Clock className="w-3 h-3" />} label="Drive" value={`${trip.driveHoursOneWay} hrs`} />
          <Stat icon={<Calendar className="w-3 h-3" />} label="Duration" value={trip.duration} />
        </div>

        {/* Season badges */}
        <div className="flex flex-wrap gap-1">
          {trip.seasons.map(s => (
            <span
              key={s}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {SEASON_LABELS[s]}
            </span>
          ))}
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1">
          {trip.highlights.slice(0, 3).map(h => (
            <span
              key={h}
              className="text-xs text-slate-500 before:content-['·'] before:mr-1"
            >
              {h}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div
          className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-medium"
          style={{ color: trip.colorFrom }}
        >
          <span>{isSelected ? 'Viewing details' : 'View full plan'}</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
        </div>
      </div>
    </button>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-0.5 text-slate-400">{icon}</div>
      <span className="text-slate-800 font-semibold text-xs">{value}</span>
      <span className="text-slate-400 text-xs">{label}</span>
    </div>
  );
}
