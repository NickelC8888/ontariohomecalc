import { useState } from 'react';
import {
  MapPin, Clock, Calendar, Dog, Users, Car, ExternalLink,
  Star, Utensils, BedDouble, TreePine, XCircle,
  ChevronDown, ChevronUp, Footprints, Sun, Printer, ShoppingBag,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TripRouteMap from './TripRouteMap';
import TripPackingList from './TripPackingList';

// ─── helpers ────────────────────────────────────────
function DogBadge({ friendly }) {
  return friendly ? (
    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
      <Dog className="w-3 h-3" /> Dog OK
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
      <XCircle className="w-3 h-3" /> No dogs
    </span>
  );
}

function KidBadge({ friendly }) {
  return friendly ? (
    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
      <Users className="w-3 h-3" /> Kid-friendly
    </span>
  ) : null;
}

function PriceRange({ range }) {
  const labels = { '$': 'Budget', '$$': 'Moderate', '$$$': 'Upscale', '$$$$': 'Luxury' };
  const colors = {
    '$': 'bg-green-50 text-green-700 border-green-200',
    '$$': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    '$$$': 'bg-orange-50 text-orange-700 border-orange-200',
    '$$$$': 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center text-xs border px-2 py-0.5 rounded-full ${colors[range] || ''}`}>
      {range} · {labels[range]}
    </span>
  );
}

function DifficultyBadge({ difficulty }) {
  const map = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'easy-moderate': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    moderate: 'bg-orange-50 text-orange-700 border-orange-200',
    intermediate: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <span className={`inline-flex items-center text-xs border px-2 py-0.5 rounded-full capitalize ${map[difficulty] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {difficulty}
    </span>
  );
}

// ─── sub-sections ────────────────────────────────────

function ItineraryDay({ day }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {day.day}
          </span>
          <span className="font-medium text-slate-800 text-sm">{day.title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 py-3 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100">
          {day.desc}
        </div>
      )}
    </div>
  );
}

function POICard({ poi }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-2 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{poi.name}</h4>
          {poi.location && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{poi.location}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <DogBadge friendly={poi.dogFriendly} />
          <KidBadge friendly={poi.kidFriendly} />
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{poi.description}</p>
      {poi.dogNote && (
        <div className={`text-xs rounded-md px-3 py-2 flex gap-2 ${poi.dogFriendly ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
          <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{poi.dogNote}</span>
        </div>
      )}
      {poi.tags && (
        <div className="flex flex-wrap gap-1">
          {poi.tags.map(t => (
            <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function TrailCard({ trail }) {
  const note = trail.samoyedNote || trail.seniorDogNote;
  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-2 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{trail.name}</h4>
          {trail.location && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{trail.location}
            </p>
          )}
        </div>
        <DifficultyBadge difficulty={trail.difficulty} />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{trail.description}</p>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-slate-50 rounded-md py-1.5">
          <div className="font-semibold text-slate-700">{trail.lengthKm} km</div>
          <div className="text-slate-400">Distance</div>
        </div>
        <div className="bg-slate-50 rounded-md py-1.5">
          <div className="font-semibold text-slate-700 capitalize">{trail.surface}</div>
          <div className="text-slate-400">Surface</div>
        </div>
        <div className="bg-slate-50 rounded-md py-1.5">
          <div className="font-semibold text-slate-700">{trail.duration}</div>
          <div className="text-slate-400">Time</div>
        </div>
      </div>
      {note && (
        <div className="text-xs bg-amber-50 text-amber-800 border border-amber-100 rounded-md px-3 py-2 flex gap-2">
          <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{note}</span>
        </div>
      )}
      <div className="flex gap-2">
        {trail.dogFriendly && <DogBadge friendly={true} />}
        {trail.kidFriendly && <KidBadge friendly={true} />}
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-2 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{restaurant.name}</h4>
          {restaurant.location && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{restaurant.location}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-0.5">{restaurant.cuisine}</p>
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0 items-end">
          <DogBadge friendly={restaurant.dogFriendly} />
          <PriceRange range={restaurant.priceRange} />
        </div>
      </div>
      {restaurant.mustTry && (
        <div className="text-xs bg-violet-50 text-violet-800 border border-violet-100 rounded-md px-3 py-2 flex gap-2">
          <Star className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span><strong>Must try:</strong> {restaurant.mustTry}</span>
        </div>
      )}
      {restaurant.tip && (
        <p className="text-xs text-slate-500 italic leading-relaxed">{restaurant.tip}</p>
      )}
    </div>
  );
}

function LodgingCard({ lodging }) {
  const priceColors = {
    '$$': 'text-green-600',
    '$$$': 'text-amber-600',
    '$$$$': 'text-red-600',
  };
  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-2 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{lodging.name}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />{lodging.location}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{lodging.type} · {lodging.rooms}</p>
        </div>
        <span className={`text-sm font-bold flex-shrink-0 ${priceColors[lodging.priceRange] || 'text-slate-600'}`}>
          {lodging.priceRange}
        </span>
      </div>
      <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md px-3 py-2 flex gap-2">
        <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>{lodging.petPolicy}</span>
      </div>
      <p className="text-xs text-slate-500 italic">{lodging.bookingNote}</p>
    </div>
  );
}

// ─── main component ──────────────────────────────────

export default function TripDetail({ trip, activeSeason }) {
  const seasonTip = activeSeason !== 'all' ? trip.seasonTips?.[activeSeason] : null;
  const hasRestaurants = Array.isArray(trip.restaurants) && trip.restaurants.length > 0;
  const hasTripProfile = !!trip.tripProfile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${trip.colorFrom}, ${trip.colorTo})` }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="text-4xl mb-2">{trip.emoji}</div>
            <h2 className="text-2xl font-bold">{trip.name}</h2>
            <p className="text-white/80 mt-1 text-sm">{trip.tagline}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:text-right sm:grid-cols-1 shrink-0">
            <StatPill icon={<MapPin className="w-4 h-4" />} value={`${trip.distanceKm} km`} label="Round trip" />
            <StatPill icon={<Clock className="w-4 h-4" />} value={`${trip.driveHoursOneWay} hrs`} label="Total drive" />
            <StatPill icon={<Calendar className="w-4 h-4" />} value={trip.duration} label="Duration" />
          </div>
        </div>

        {/* Trip profile (Trip 5 only) */}
        {hasTripProfile && (
          <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-lg p-3 grid grid-cols-3 gap-3 text-sm text-white/90">
            <ProfilePill icon={<Users className="w-4 h-4" />} label={trip.tripProfile.passengers} />
            <ProfilePill icon={<Dog className="w-4 h-4" />} label={trip.tripProfile.pet} />
            <ProfilePill icon={<Car className="w-4 h-4" />} label={trip.tripProfile.vehicle} />
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          {trip.route.googleMapsUrl && (
            <a
              href={trip.route.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Google Maps
            </a>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Printer className="w-4 h-4" />
            Print trip plan
          </button>
        </div>
      </div>

      {/* Samoyed heat warning */}
      {hasTripProfile && (
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <Sun className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
          <p className="leading-relaxed">{trip.tripProfile.dogBreedNote}</p>
        </div>
      )}

      {/* Season tip */}
      {seasonTip && (
        <div className="flex gap-3 bg-sky-50 border border-sky-200 rounded-lg p-4 text-sm text-sky-900">
          <Calendar className="w-5 h-5 flex-shrink-0 text-sky-500 mt-0.5" />
          <p className="leading-relaxed"><strong>{activeSeason === 'june' ? 'June tip' : activeSeason === 'late-august' ? 'Late August tip' : 'Early September tip'}:</strong> {seasonTip}</p>
        </div>
      )}

      {/* Map + Tabs side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Route Map</h3>
          <TripRouteMap trip={trip} />
          {/* Route stops legend */}
          <div className="space-y-1">
            {trip.route.stops.filter((s, i, arr) => s.name !== arr[i - 1]?.name).map((stop, i) => (
              <div key={`${stop.name}-${i}`} className="flex gap-2 text-xs text-slate-600">
                <span className="font-bold text-slate-400 w-4 flex-shrink-0">{i === 0 ? '🏠' : i === trip.route.stops.filter((s, idx, arr) => s.name !== arr[idx-1]?.name).length - 1 ? '🏁' : `${i}.`}</span>
                <span className="font-medium">{stop.name}</span>
                {stop.night != null && <span className="text-slate-400">· Night {stop.night}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-day itinerary */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Day-by-Day Itinerary</h3>
          <div className="space-y-2">
            {trip.route.itinerary.map(day => (
              <ItineraryDay key={day.day} day={day} />
            ))}
          </div>
        </div>
      </div>

      {/* Detail tabs */}
      <Tabs defaultValue="poi">
        <TabsList className={`grid w-full ${hasRestaurants ? 'grid-cols-6' : 'grid-cols-5'}`}>
          <TabsTrigger value="poi" className="flex items-center gap-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Points of Interest</span>
            <span className="sm:hidden">POI</span>
          </TabsTrigger>
          <TabsTrigger value="trails" className="flex items-center gap-1.5 text-xs">
            <Footprints className="w-3.5 h-3.5" />
            Trails
          </TabsTrigger>
          {hasRestaurants && (
            <TabsTrigger value="restaurants" className="flex items-center gap-1.5 text-xs">
              <Utensils className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurants</span>
              <span className="sm:hidden">Eat</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="lodging" className="flex items-center gap-1.5 text-xs">
            <BedDouble className="w-3.5 h-3.5" />
            Lodging
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-1.5 text-xs">
            <TreePine className="w-3.5 h-3.5" />
            Tips
          </TabsTrigger>
          <TabsTrigger value="packing" className="flex items-center gap-1.5 text-xs">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pack List</span>
            <span className="sm:hidden">Pack</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="poi" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trip.poi.map(p => <POICard key={p.name} poi={p} />)}
          </div>
        </TabsContent>

        <TabsContent value="trails" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trip.trails.map(t => <TrailCard key={t.name} trail={t} />)}
          </div>
        </TabsContent>

        {hasRestaurants && (
          <TabsContent value="restaurants" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trip.restaurants.map(r => <RestaurantCard key={r.name} restaurant={r} />)}
            </div>
          </TabsContent>
        )}

        <TabsContent value="lodging" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trip.lodging.map(l => <LodgingCard key={l.name} lodging={l} />)}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(trip.seasonTips).map(([season, tip]) => (
              <div key={season} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                <h4 className="font-semibold text-slate-700 text-sm capitalize">
                  {season === 'june' ? '☀️ June' : season === 'late-august' ? '🌻 Late August' : '🍂 Early September'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
          {hasTripProfile && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                <Dog className="w-4 h-4" /> Samoyed Travel Tips
              </h4>
              <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Hike before 10 am or after 6 pm to avoid peak heat</li>
                <li>Carry at least 2 litres of fresh water specifically for the dog</li>
                <li>Test pavement temperature with your palm — hot enough to burn your hand means it burns paw pads</li>
                <li>Keep a cooling mat or wet towel in the van for rest breaks</li>
                <li>A Samoyed's coat actually insulates against heat — never shave it</li>
                <li>Watch for excessive panting, drooling, or stumbling — signs of heat stress</li>
                <li>Many hotels want proof of vaccinations — bring a vet record printout</li>
              </ul>
            </div>
          )}
        </TabsContent>
        <TabsContent value="packing" className="mt-4">
          <TripPackingList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 text-center sm:text-left">
      <div className="flex items-center justify-center sm:justify-start gap-1 text-white/70 mb-0.5">{icon}</div>
      <div className="text-white font-bold text-base">{value}</div>
      <div className="text-white/60 text-xs">{label}</div>
    </div>
  );
}

function ProfilePill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="opacity-80">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
