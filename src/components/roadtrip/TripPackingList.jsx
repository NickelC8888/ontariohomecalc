import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckSquare, Square, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'essentials',
    label: '📋 Trip Essentials',
    items: [
      'Valid ID / passports (needed crossing into Québec — good habit)',
      'Health cards (OHIP) for all family members',
      'Pet vaccination records + vet contact info',
      'Car insurance + roadside assistance info',
      'Phone chargers + portable power bank',
      'Cash (small towns / markets may be cash-only)',
      'Reusable water bottles (one per person)',
      'First aid kit',
      'Sunscreen SPF 50+',
      'Bug spray (DEET or natural) — especially for Muskoka in June',
      'Printed or downloaded offline maps (no cell signal in parks)',
      'Snack bag: granola bars, nuts, fruit, crackers for the road',
    ],
  },
  {
    id: 'dog',
    label: '🐾 Dog Gear',
    items: [
      'Collapsible water bowl (pack 2)',
      'Enough food for the full trip + 1 extra day',
      'Water — carry 2 L dedicated to the dog on hike days',
      'Leash (6 ft standard) + backup leash',
      'Harness (easier for longer hikes than collar)',
      'Dog waste bags (100+)',
      'Dog first aid kit: antiseptic, gauze, tweezers for ticks',
      'Flea, tick & heartworm prevention (up to date)',
      'Cooling mat for the van',
      'Towel for wet / muddy paws',
      'Dog bed or familiar blanket (reduces hotel anxiety)',
      'Calming treats / anxiety vest if your dog is car-nervous',
      'Vet records + proof of rabies vaccination',
      'Recent photo of your dog (in case of separation)',
      'Paw wax / boots for hot pavement days',
    ],
  },
  {
    id: 'kids',
    label: '👧 Kids Gear',
    items: [
      'Sunhats for each child',
      'Swimsuits + rash guards',
      'Change of clothes per day + 2 extras',
      'Rain jacket (always)',
      'Closed-toe shoes for hiking',
      'Sandals for beach days',
      'Small backpack each child can carry (snacks + water)',
      'Favourite stuffed animal / comfort item',
      'Audiobooks / podcasts downloaded for long drives',
      'Tablet or device + headphones (fully charged)',
      'Car sickness medication if needed',
      'Sunscreen stick (kids will actually use it)',
      'Allergy medication + EpiPen if applicable',
    ],
  },
  {
    id: 'hiking',
    label: '🥾 Hiking & Outdoors',
    items: [
      'Daypack (20–30L) with hip belt for weight distribution',
      'Trail snacks: energy bars, dried fruit, nuts',
      'Water filter or purification tablets (backcountry)',
      'Trekking poles (optional — great on rocky Bruce Peninsula trails)',
      'Tick removal tool',
      'Whistle + small flashlight per person',
      'Dry bags for electronics and snacks',
      'Microfibre towels (quick-dry, pack small)',
      'Insect head nets (early June in Muskoka)',
      'Bear spray (Gatineau Park / Algonquin area)',
      'Trail map downloaded offline (AllTrails or Gaia GPS)',
    ],
  },
  {
    id: 'van',
    label: '🚐 Van & Road Gear',
    items: [
      'Full tank of gas before leaving Toronto',
      'Tire pressure checked (including spare)',
      'Roof rack load secured and locked',
      'Car vacuum or brush (dog hair is relentless)',
      'Seat cover / cargo liner for dog area',
      'Portable cooler for food and dog water',
      'Paper towels + all-purpose cleaning spray',
      'Zip-lock bags (various sizes — endlessly useful)',
      'Bungee cords + cargo net for roof rack',
      'Jumper cables or jump starter pack',
      'Small toolkit (screwdrivers, duct tape, zip ties)',
      'Parking coins / Honk app loaded for Ontario meters',
      'Campsite or trail parking day-pass printed if required',
    ],
  },
  {
    id: 'overnight',
    label: '🛏️ Hotel & Overnight',
    items: [
      'All lodging confirmation numbers saved offline',
      'Portable door alarm (peace of mind in unfamiliar rooms)',
      'White noise app or small fan (kids sleep better)',
      'Night light (plug-in, kids in unfamiliar bathrooms)',
      'Laundry pods + dryer sheets (1 load mid-trip)',
      'Foldable luggage scale if flying home',
      'Extension cord / power bar (hotel outlets are never where you need them)',
      'Dog-specific: bring dog bed, put towel on hotel bedding, tip housekeeping extra',
    ],
  },
];

export default function TripPackingList() {
  const totalItems = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  // checked state: Set of "categoryId::item" strings
  const [checked, setChecked] = useState(new Set());

  function toggle(key) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function reset() {
    setChecked(new Set());
  }

  const checkedCount = checked.size;
  const pct = Math.round((checkedCount / totalItems) * 100);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">
            {checkedCount} of {totalItems} items packed
          </p>
          <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      {CATEGORIES.map(cat => (
        <CategorySection
          key={cat.id}
          category={cat}
          checked={checked}
          onToggle={toggle}
        />
      ))}

      {pct === 100 && (
        <div className="text-center py-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-medium text-sm">
          ✅ All packed — have an amazing trip!
        </div>
      )}
    </div>
  );
}

function CategorySection({ category, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  const catChecked = category.items.filter(item => checked.has(`${category.id}::${item}`)).length;
  const allDone = catChecked === category.items.length;

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${allDone ? 'border-emerald-200' : 'border-slate-200'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${allDone ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-slate-50 hover:bg-slate-100'}`}
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-800 text-sm">{category.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${allDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
            {catChecked}/{category.items.length}
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>

      {open && (
        <ul className="divide-y divide-slate-100 bg-white">
          {category.items.map(item => {
            const key = `${category.id}::${item}`;
            const isChecked = checked.has(key);
            return (
              <li key={item}>
                <button
                  onClick={() => onToggle(key)}
                  className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  {isChecked
                    ? <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <Square className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />}
                  <span className={`text-sm leading-snug ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
