# OntarioHomeCalc — Claude Code Guide

## Project Overview
A React + Vite single-page application providing Ontario real-estate financial calculators **and** a Family Road Trip Planner feature. Hosted on base44 platform.

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Maps | react-leaflet v4 + Leaflet (already installed) |
| Routing | React Router DOM v6 |
| Data fetching | TanStack React Query v5 |
| Backend/Auth | base44 SDK (`@base44/sdk`) |
| Charts | Recharts |

## Repository Structure
```
src/
├── data/                        # Static JSON/JS data files
│   └── roadTripData.js          # All road trip static data (4 trips)
├── pages/                       # One file per route; auto-registered via pages.config.js
│   ├── Home.jsx
│   ├── RoadTripPlanner.jsx      # ← new feature (in progress)
│   └── ...
├── components/
│   ├── roadtrip/                # ← new components for road trip feature
│   │   ├── TripCard.jsx
│   │   ├── TripDetail.jsx
│   │   ├── TripRouteMap.jsx
│   │   ├── TripPOISection.jsx
│   │   ├── TripTrailsSection.jsx
│   │   └── TripLodgingSection.jsx
│   ├── calculator/
│   ├── comparison/
│   ├── wizard/
│   └── ui/                      # shadcn/ui primitives (do not edit)
├── pages.config.js              # Auto-generated page registry — only edit mainPage value
├── Layout.jsx                   # App shell: header nav, footer, AdSense slots
└── App.jsx
```

## Adding a New Page
1. Create `src/pages/MyPage.jsx` exporting a default React component.
2. Add an import and entry to `src/pages.config.js` `PAGES` object.
3. Add a nav link to the `NAV_PAGES` array in `src/Layout.jsx` if it should appear in the top nav.

## Active Feature Branch
`claude/family-road-trip-planner-0rykv`

All road trip planner work goes on this branch. Push with:
```bash
git push -u origin claude/family-road-trip-planner-0rykv
```

## Road Trip Planner — Feature Spec
Family road trip planner for Toronto-based families travelling with kids and a **senior dog**. 3–4 day round trips in June, Late August, or Early September.

### 5 Trips
| # | Destination | Round Trip | Drive | Days | Profile |
|---|---|---|---|---|---|
| 1 | Tobermory & Bruce Peninsula | ~620 km | ~3.5 hrs | 3 days | Family / senior dog |
| 2 | Muskoka Lakes & Arrowhead PP | ~400 km | ~2.5 hrs | 3–4 days | Family / senior dog |
| 3 | Prince Edward County | ~500 km | ~2.5 hrs | 3 days | Family / senior dog |
| 4 | Ottawa & Gatineau Park (QC) | ~900 km | ~4.5 hrs | 4 days | Family / senior dog |
| 5 | **Eastern Canada Grand Circuit** | ~1,200 km | full loop | **7 days** | **2 adults + 2 kids + Samoyed, van** |

### Trip 5 — Family Profile (Eastern Canada Circuit)
- **Passengers**: 2 adults, 2 children
- **Pet**: Samoyed, ~50 lbs (thick double coat — overheats in summer; all hikes before 10 am)
- **Vehicle**: Van with roof rack
- **Route**: Toronto → Kingston → Ottawa → Montréal → Prince Edward County → Toronto
- **Google Maps link**: included in `route.googleMapsUrl`

### Per-Trip Data Shape
Each trip in `roadTripData.js` contains:
- `route.waypoints` — `[lat, lng]` pairs for Leaflet polyline
- `route.googleMapsUrl` — multi-stop Google Maps directions link (Trip 5+)
- `route.stops` — named stops with overnight info
- `route.itinerary` — day-by-day plan
- `tripProfile` — passenger/vehicle/dog breed notes (Trip 5+)
- `poi[]` — points of interest with `dogFriendly`, `kidFriendly`, `dogNote`, `location`
- `trails[]` — beginner–intermediate trails with `seniorDogNote`, `samoyedNote`, `difficulty`, `lengthKm`
- `restaurants[]` — best places to eat with `dogFriendly`, `mustTry`, `tip` (Trip 5+; to be added to Trips 1–4 later)
- `lodging[]` — dog-friendly lodging with `petPolicy`, `priceRange`
- `seasonTips` — keyed by `june` | `late-august` | `early-september`

### Map Implementation Notes
- Use OpenStreetMap tiles (no API key needed)
- Use `L.divIcon` for markers (avoids default Leaflet image URL issues)
- Import `leaflet/dist/leaflet.css` in `TripRouteMap.jsx`
- Auto-fit bounds using `useMap()` + `map.fitBounds()`

### Dog Policy Flags (important accuracy notes)
- **Sandbanks PP beaches**: dogs NOT allowed on main beaches peak season — allowed on trails/dunes
- **Flowerpot Island boat tours**: dogs generally not permitted on boats
- **Santa's Village**: dogs not permitted inside the park
- **Canadian Museum of Nature**: dogs not permitted inside
- **Bruce Peninsula NP**: dogs allowed on leash on most trails including The Grotto trail

## Build Task Checklist
- [x] Task 1 — `src/data/roadTripData.js` (5 trips including 7-day Eastern Circuit)
- [x] Task 2 — `src/components/roadtrip/TripRouteMap.jsx` (Leaflet map)
- [ ] Task 3 — `src/components/roadtrip/TripCard.jsx`
- [ ] Task 4 — `src/components/roadtrip/TripDetail.jsx` (tabs: Overview · POI · Trails · Restaurants · Lodging · Tips)
- [ ] Task 5 — `src/pages/RoadTripPlanner.jsx`
- [ ] Task 6 — Wire up `pages.config.js` + `Layout.jsx`
- [ ] Task 7 — Commit & push to feature branch

## General Coding Conventions
- Functional components only, no class components
- Tailwind for all styling — no inline style objects except for Leaflet map container height
- shadcn/ui components preferred over custom UI primitives
- Keep page files thin — business logic and data in separate files
- No login required for the Road Trip Planner page (fully public)
- Do not edit files in `src/components/ui/` (shadcn auto-generated)
