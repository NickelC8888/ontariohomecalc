import { useState, useRef } from 'react';
import { MapPin, Dog, Users, Sun, Leaf } from 'lucide-react';
import { TRIPS, SEASONS } from '@/data/roadTripData';
import TripCard from '@/components/roadtrip/TripCard';
import TripDetail from '@/components/roadtrip/TripDetail';

export default function RoadTripPlanner() {
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeSeason, setActiveSeason] = useState('all');
  const detailRef = useRef(null);

  const filteredTrips = activeSeason === 'all'
    ? TRIPS
    : TRIPS.filter(t => t.seasons.includes(activeSeason));

  const selectedTrip = TRIPS.find(t => t.id === selectedTripId);

  function handleSelectTrip(id) {
    const opening = id !== selectedTripId;
    setSelectedTripId(prev => (prev === id ? null : id));
    if (opening) {
      // Give React one frame to render the detail section before scrolling
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 p-8 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] bg-repeat" />
        <div className="relative">
          <div className="flex flex-wrap gap-3 mb-4">
            <Chip icon={<Users className="w-3.5 h-3.5" />} label="Family of 4" />
            <Chip icon={<Dog className="w-3.5 h-3.5" />} label="Dog-friendly" />
            <Chip icon={<MapPin className="w-3.5 h-3.5" />} label="Ontario & Québec" />
            <Chip icon={<Sun className="w-3.5 h-3.5" />} label="Summer / Fall" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Ontario Family Road Trip Planner
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed">
            Curated 3–7 day round trips from Toronto for families with kids and a dog.
            Every route includes dog-friendly trails, family activities, top restaurants, and
            vetted pet-friendly accommodation — mapped and ready to go.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-full" />5 curated routes</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-sky-400 rounded-full" />Interactive maps</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-400 rounded-full" />Beginner–intermediate trails</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-pink-400 rounded-full" />Dog & kid POI ratings</span>
          </div>
        </div>
      </div>

      {/* Season filter */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Filter by travel season</p>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSeason(s.id);
                setSelectedTripId(null);
              }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${activeSeason === s.id
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600'}
              `}
            >
              {s.id === 'june' && '☀️ '}
              {s.id === 'late-august' && '🌻 '}
              {s.id === 'early-september' && '🍂 '}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trip grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Leaf className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No trips available for this season.</p>
          <p className="text-sm mt-1">Try a different season filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              isSelected={selectedTripId === trip.id}
              onSelect={handleSelectTrip}
            />
          ))}
        </div>
      )}

      {/* Trip detail */}
      {selectedTrip && (
        <div ref={detailRef} className="border-t border-slate-200 pt-8 scroll-mt-20">
          <TripDetail trip={selectedTrip} activeSeason={activeSeason} />
        </div>
      )}

      {/* Empty state prompt */}
      {!selectedTrip && filteredTrips.length > 0 && (
        <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium text-slate-500">Select a trip above to see the full plan</p>
          <p className="text-sm mt-1">Maps, trails, restaurants, lodging, and day-by-day itinerary</p>
        </div>
      )}
    </div>
  );
}

function Chip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
      {icon}{label}
    </span>
  );
}
