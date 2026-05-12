export const SEASONS = [
  { id: 'all', label: 'All Seasons' },
  { id: 'june', label: 'June' },
  { id: 'late-august', label: 'Late August' },
  { id: 'early-september', label: 'Early September' },
];

export const TRIPS = [
  // ─────────────────────────────────────────────
  // TRIP 1 — Tobermory & Bruce Peninsula
  // ─────────────────────────────────────────────
  {
    id: 'tobermory',
    name: 'Tobermory & Bruce Peninsula',
    tagline: 'Turquoise caves, ancient cliffs, and the very tip of the Bruce',
    duration: '3 days',
    distanceKm: 620,
    driveHoursOneWay: 3.5,
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#0d9488',
    colorTo: '#0891b2',
    emoji: '🏔️',
    highlights: ['The Grotto', 'Singing Sands Beach', 'Flowerpot Island', 'Tobermory Harbour'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.3894, -79.6903],
        [44.5670, -80.9430],
        [45.2533, -81.6640],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Departure point. Leave early to beat Hwy 400 traffic heading north.',
        },
        {
          name: 'Barrie',
          coords: [44.3894, -79.6903],
          night: null,
          description: 'Rest stop ~1 hr from Toronto. Grab a coffee and stretch before joining Hwy 26 West.',
        },
        {
          name: 'Owen Sound',
          coords: [44.5670, -80.9430],
          night: 1,
          description: 'Lunch stop and optional overnight. Harrison Park offers beautiful flat riverside trails — perfect for a senior dog.',
        },
        {
          name: 'Tobermory',
          coords: [45.2533, -81.6640],
          night: 2,
          description: 'Your destination. Explore the harbour village, take a glass-bottom boat, and hike to The Grotto.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Owen Sound',
          desc: 'Drive ~2.5 hrs via Hwy 400 N then Hwy 26 W. Rest stop in Barrie. Arrive Owen Sound for lunch. Afternoon walk at Harrison Park along the Sydenham River — shaded, flat, and dog-friendly. Overnight Owen Sound.',
        },
        {
          day: 2,
          title: 'Owen Sound → Tobermory',
          desc: 'Drive ~1.5 hrs along the scenic Bruce Peninsula. Arrive Tobermory and check in. Afternoon Singing Sands Beach walk (dog-friendly). Explore Little Tub Harbour for dinner.',
        },
        {
          day: 3,
          title: 'The Grotto → Home',
          desc: 'Early morning hike to The Grotto (dogs on leash, rocky but manageable for a fit senior dog). Fish & chips at the harbour. Drive home ~3.5 hrs.',
        },
      ],
    },

    poi: [
      {
        name: 'The Grotto',
        description:
          'A stunning sea cave carved into limestone cliffs at Cyprus Lake. Brilliant turquoise water inside. The full loop is 9 km — for a senior dog, the cliff-top lookout is ~2 km return and equally spectacular.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['scenic', 'cave', 'swimming', 'photography'],
        dogNote:
          'Dogs allowed on leash throughout Bruce Peninsula NP trails including The Grotto. Trail is rocky in sections — bring water and take breaks. Not suitable for dogs with mobility issues.',
      },
      {
        name: 'Singing Sands Beach',
        description:
          'A gorgeous, shallow sandy beach on the south shore of the Bruce Peninsula. The fine quartz sand "sings" as you walk on it. Very accessible, calm water, ideal for kids.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['beach', 'swimming', 'accessible', 'flat'],
        dogNote:
          'Dogs allowed on leash. Completely flat sandy surface — ideal for a senior dog. Shallow warm water to wade in. Bring a collapsible bowl.',
      },
      {
        name: 'Tobermory Harbour (Little Tub)',
        description:
          'The heart of Tobermory village. Colourful fishing boats, shipwreck viewing docks, ice cream stands, fish & chip shops, and local galleries. Very walkable.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'dining', 'waterfront', 'shipwrecks'],
        dogNote:
          'Extremely dog-friendly village. Most outdoor patios welcome leashed dogs. Water bowls often left out by shopkeepers.',
      },
      {
        name: 'Flowerpot Island Boat Tour',
        description:
          'Glass-bottom boat tour to Flowerpot Island — iconic rock stack formations, a lighthouse, and sea caves. Bruce Anchor Cruises runs regular departures from Little Tub Harbour.',
        dogFriendly: false,
        kidFriendly: true,
        tags: ['boat', 'island', 'views', 'sea caves'],
        dogNote:
          'Dogs not permitted on tour boats. Plan for one adult to remain at the harbour with the dog — Little Tub is a lovely spot to wait.',
      },
      {
        name: 'Harrison Park, Owen Sound',
        description:
          'A beautiful free park in Owen Sound with shaded trails along the Sydenham River, a small animal zoo kids love, picnic areas, and a seasonal swimming hole.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['park', 'river', 'trails', 'picnic', 'zoo'],
        dogNote:
          'Mostly flat, shaded riverside paths — excellent for a senior dog. Dogs must be on leash. Drinking water at the river edge.',
      },
    ],

    trails: [
      {
        name: 'Singing Sands Beach Walk',
        lengthKm: 1.0,
        difficulty: 'easy',
        surface: 'Boardwalk + sand',
        dogFriendly: true,
        kidFriendly: true,
        duration: '20–30 min',
        seniorDogNote:
          'Flat and gentle — the perfect senior dog trail. Short enough to leave everyone energised. Cool water to wade in at the end.',
        description:
          'A leisurely stroll along the boardwalk and sandy shoreline at Singing Sands. Shallow calm water safe for kids and dogs to splash in.',
      },
      {
        name: 'Cyprus Lake Campground Loop',
        lengthKm: 2.5,
        difficulty: 'easy',
        surface: 'Gravel path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote:
          'Mostly flat loop around the lake. Several benches and shaded rest spots. Bring water — no fountains on trail.',
        description:
          'A peaceful loop around Cyprus Lake inside Bruce Peninsula National Park. Forest canopy, lake views, and occasional wildlife sightings.',
      },
      {
        name: 'Harrison Park River Trail',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Paved & packed gravel',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–70 min',
        seniorDogNote:
          'Completely flat riverside path with benches every few hundred metres. Perfect for a morning walk before the drive to Tobermory.',
        description:
          'Follows the Sydenham River through Harrison Park in Owen Sound. Shaded, flat, and beautifully maintained. Great for an evening stroll.',
      },
    ],

    lodging: [
      {
        name: 'Blue Bay Motel',
        type: 'Motel',
        location: 'Tobermory',
        petPolicy: 'Pet-friendly rooms available — confirm at booking',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Standard rooms and self-contained cottages',
        bookingNote: 'Book well in advance for July/August. Spring and September bookings are much easier to get.',
      },
      {
        name: 'Little Tub Harbour Suite Hotel',
        type: 'Hotel',
        location: 'Tobermory village',
        petPolicy: 'Select pet-friendly rooms (verify when booking)',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Harbour view suites',
        bookingNote: 'Right in the village — walk to everything. Great base for exploring.',
      },
      {
        name: 'Tobermory Cottage Rentals (VRBO / Airbnb)',
        type: 'Cottage',
        location: 'Tobermory area',
        petPolicy: 'Many listings explicitly dog-friendly — filter by "pets allowed"',
        familySuitable: true,
        priceRange: '$$$',
        rooms: '2–4 bedroom cottages, most with private yards',
        bookingNote:
          'Best option for a family of 4 + dog. Private yard for the dog, full kitchen, and the full cottage country experience.',
      },
      {
        name: 'Holiday Inn Express Owen Sound',
        type: 'Hotel',
        location: 'Owen Sound (Day 1 overnight)',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Family rooms with pull-out sofa',
        bookingNote: 'Reliable Day 1 overnight option before continuing to Tobermory.',
      },
    ],

    restaurants: [
      {
        name: 'The Fish & Chip Place',
        location: 'Tobermory',
        cuisine: 'Seafood / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Freshly battered whitefish & chips',
        tip: 'Order at the window and eat on the harbour dock — the dog can join you outside. A Tobermory rite of passage.',
      },
      {
        name: 'Crowsnest Pub & Restaurant',
        location: 'Tobermory',
        cuisine: 'Pub / Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Georgian Bay whitefish sandwich, local craft beer',
        tip: 'Dog-friendly patio steps from the harbour. Good kids menu and reliable home-cooked pub food.',
      },
      {
        name: 'Serenity Now Café',
        location: 'Tobermory',
        cuisine: 'Café / Breakfast / Lunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Breakfast wraps, house-baked muffins, smoothies',
        tip: 'Best morning fuel before a hike to The Grotto. Outdoor seating welcomes dogs.',
      },
      {
        name: 'Inglis Falls Restaurant (Owen Sound)',
        location: 'Owen Sound',
        cuisine: 'Canadian / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Seasonal fish dishes, local produce',
        tip: 'Great lunch stop in Owen Sound on Day 1. Patio seating near the falls area is dog-friendly.',
      },
    ],

    seasonTips: {
      june: 'June in Bruce Peninsula is magical — rare orchids and wildflowers bloom, water is refreshing without peak crowds. Book lodging early as it fills fast by late June.',
      'late-august':
        'Water is warmest for swimming — ideal for kids. This is peak tourist season; book everything 2–3 months in advance and target weekdays for a quieter experience.',
      'early-september':
        "The best-kept secret. Kids back in school means dramatically fewer crowds, lodging is 20–30% cheaper, and hiking weather is perfect. Water still warm enough for swimming. The dog gets the whole beach to themselves.",
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 2 — Muskoka Lakes & Arrowhead
  // ─────────────────────────────────────────────
  {
    id: 'muskoka',
    name: 'Muskoka Lakes & Arrowhead',
    tagline: 'Cottage country classics, thundering waterfalls, and glittering lakes',
    duration: '3–4 days',
    distanceKm: 400,
    driveHoursOneWay: 2.5,
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#059669',
    colorTo: '#16a34a',
    emoji: '🌲',
    highlights: ["Santa's Village", 'Bracebridge Falls', 'Muskoka Lakes', 'Arrowhead PP'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.3894, -79.6903],
        [44.9195, -79.3703],
        [44.9726, -79.3039],
        [45.3275, -79.2196],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Depart via Hwy 400 North.',
        },
        {
          name: 'Barrie',
          coords: [44.3894, -79.6903],
          night: null,
          description: 'Rest break ~1 hr from Toronto. Join Hwy 11 northbound toward Muskoka.',
        },
        {
          name: 'Gravenhurst',
          coords: [44.9195, -79.3703],
          night: 1,
          description: 'Gateway to Muskoka. Muskoka Wharf and the RMS Segwun steamship — great for kids. Stroll the harbour with the dog.',
        },
        {
          name: 'Bracebridge',
          coords: [44.9726, -79.3039],
          night: 2,
          description: "Bracebridge Falls is steps from downtown. Santa's Village nearby — a must for families with young kids.",
        },
        {
          name: 'Huntsville',
          coords: [45.3275, -79.2196],
          night: 3,
          description: "Base for Arrowhead Provincial Park. Stubb's Falls trail is an easy family favourite with a spectacular waterfall payoff.",
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Gravenhurst',
          desc: "Drive ~1.5 hrs via Hwy 400/11. Explore Muskoka Wharf and tour the kids aboard the historic RMS Segwun steamship. Stroll the harbour docks with the dog. Overnight Gravenhurst.",
        },
        {
          day: 2,
          title: 'Gravenhurst → Bracebridge',
          desc: "20 min drive. Morning at Bracebridge Falls (free, dog-friendly). Afternoon at Santa's Village — summer rides, waterslides, and the kids' favourite. Dog stays comfortably in a cool shaded car during rides.",
        },
        {
          day: 3,
          title: 'Bracebridge → Huntsville → Arrowhead',
          desc: "Drive 30 min north to Huntsville. Morning hike to Stubb's Falls in Arrowhead Provincial Park — spectacular and easy. Afternoon swim at the park beach.",
        },
        {
          day: 4,
          title: 'Huntsville → Toronto',
          desc: 'Optional morning paddle or Island Lake loop trail. Drive home ~2.5 hrs via Hwy 11/400. Stop in Barrie if needed.',
        },
      ],
    },

    poi: [
      {
        name: 'Muskoka Wharf & RMS Segwun',
        description:
          "Gravenhurst's beautiful waterfront with a historic 1887 steamship you can tour. Boutique shops, restaurants, and a stunning harbour promenade on Lake Muskoka. Kids adore the steamship.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['waterfront', 'historic', 'steamship', 'dining'],
        dogNote:
          'Outdoor wharf areas are dog-friendly. The promenade is a gentle, flat stroll — perfect for a senior dog with views of the lake.',
      },
      {
        name: "Santa's Village",
        description:
          "A classic Ontario family amusement park in Bracebridge with rides, waterslides, Santa's house, and summer activities. Open mid-June through Labour Day.",
        dogFriendly: false,
        kidFriendly: true,
        tags: ['amusement park', 'rides', 'waterslides', 'kids'],
        dogNote:
          'Dogs not permitted inside the park. One adult can walk the dog in the shaded parking area or along a nearby trail while the rest of the family enjoys the park.',
      },
      {
        name: 'Bracebridge Falls',
        description:
          'A beautiful urban waterfall right in downtown Bracebridge — accessible via a short paved path from the town centre. Free to visit, spectacular, and excellent for photos.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['waterfall', 'scenic', 'free', 'photography', 'downtown'],
        dogNote:
          'Very short walk from parking — flat and accessible. An easy win for the whole family including the senior dog.',
      },
      {
        name: 'Arrowhead Provincial Park',
        description:
          "A stunning park near Huntsville featuring the iconic Stubb's Falls, clear-water lakes with sandy beaches, and excellent beginner trails through mixed Muskoka forest.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['provincial park', 'waterfall', 'swimming', 'trails', 'beach'],
        dogNote:
          'Dogs allowed on leash throughout the park including trails and campground. The beach area and trail edges offer cool water for dogs to drink and wade.',
      },
      {
        name: 'Port Carling & the Muskoka Locks',
        description:
          "The 'hub of the lakes' — a charming village at the junction of Lakes Muskoka, Rosseau, and Joseph. Watch boats lock through the canal, browse boutiques, and grab a waterfront lunch.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'locks', 'waterfront', 'lunch', 'boats'],
        dogNote:
          'Dog-friendly patios at several restaurants. Kids love watching the boats navigate the lock — a great free activity.',
      },
    ],

    trails: [
      {
        name: "Stubb's Falls Trail",
        lengthKm: 1.6,
        difficulty: 'easy',
        surface: 'Packed gravel with some flat rock',
        dogFriendly: true,
        kidFriendly: true,
        duration: '30–45 min',
        seniorDogNote:
          'Short, rewarding, and mostly flat with a gentle slope near the falls. Take it slowly and enjoy. A few flat rocks near the waterfall base to rest on.',
        description:
          "Arrowhead Provincial Park's signature trail leads to a gorgeous multi-tiered waterfall on the Big East River. One of the most rewarding short hikes in Muskoka for any age.",
      },
      {
        name: 'Island Lake Loop (Arrowhead PP)',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Forested path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote:
          'Mostly flat with gentle undulation through the forest. Shaded and cool even in August. Multiple rest spots by the lakeside.',
        description:
          'A peaceful loop around Island Lake inside Arrowhead Provincial Park. Lovely birdwatching, wildflower meadows in early season, and calm lake reflections.',
      },
      {
        name: 'Muskoka River Trail, Bracebridge',
        lengthKm: 4.0,
        difficulty: 'easy',
        surface: 'Paved + packed gravel',
        dogFriendly: true,
        kidFriendly: true,
        duration: '60–80 min',
        seniorDogNote:
          'Completely flat riverside trail with benches throughout. Ideal for a senior dog at any pace — go as far as comfortable and turn back.',
        description:
          'A lovely flat trail following the Muskoka River through Bracebridge. Passes the falls, parkland, and scenic river bends. Good for bikes too if you have them.',
      },
    ],

    lodging: [
      {
        name: 'Deerhurst Resort',
        type: 'Resort',
        location: 'Huntsville',
        petPolicy: 'Pet-friendly rooms and cottages available (fee applies)',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Hotel rooms, suites, and private lakeside cottages',
        bookingNote:
          'Excellent family resort — pools, beach, children\'s activities, and Arrowhead Park minutes away. Book pet-friendly cottages for the best dog experience.',
      },
      {
        name: 'Muskoka Cottage Rentals (VRBO / Airbnb)',
        type: 'Cottage',
        location: 'Throughout Muskoka',
        petPolicy: 'Many dog-friendly listings — filter by "pets allowed"',
        familySuitable: true,
        priceRange: '$$$',
        rooms: '2–4 bedroom lakefront cottages with private docks',
        bookingNote:
          'The quintessential Muskoka experience. Private dock, canoe, fire pit. Book 3–6 months ahead for summer weekends.',
      },
      {
        name: 'Comfort Inn / Holiday Inn Huntsville',
        type: 'Hotel',
        location: 'Huntsville',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Family rooms available',
        bookingNote: 'Budget-friendly base close to Arrowhead Park. Good pool for the kids.',
      },
      {
        name: 'Taboo Muskoka Resort',
        type: 'Resort',
        location: 'Gravenhurst',
        petPolicy: 'Select pet-friendly accommodations available',
        familySuitable: true,
        priceRange: '$$$$',
        rooms: 'Lakefront cottages and resort suites',
        bookingNote: 'Upscale option with stunning Lake Muskoka views. Excellent restaurant and spa.',
      },
    ],

    restaurants: [
      {
        name: 'ReBar Modern Food',
        location: 'Huntsville',
        cuisine: 'Contemporary Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Local fish tacos, seasonal grain bowls',
        tip: 'Dog-friendly patio on Main Street Huntsville. One of the best kitchens in cottage country.',
      },
      {
        name: 'Hunter & Pepper Eatery',
        location: 'Huntsville',
        cuisine: 'Café / Brunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Eggs Benedict, house-roasted coffee',
        tip: 'Perfect morning fuel before Arrowhead. Small outdoor patio welcomes leashed dogs.',
      },
      {
        name: "Muskoka Brewery Taproom",
        location: 'Bracebridge',
        cuisine: 'Brewery / Pub',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Muskoka Detour IPA, brewery nachos',
        tip: "Outdoor patio at the original Bracebridge taproom is dog-friendly. Kids love watching the waterfall next door.",
      },
      {
        name: 'Turtle Jack\'s Muskoka Grill',
        location: 'Gravenhurst',
        cuisine: 'Canadian / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Muskoka whitefish, ribs, kids menu',
        tip: 'Waterfront patio on the Muskoka Wharf welcomes dogs. Great first-night dinner with lake views.',
      },
    ],

    seasonTips: {
      june:
        "Early summer in Muskoka is stunning but blackflies can be fierce the first two weeks of June — pack bug spray. After mid-June it's glorious. Santa's Village opens mid-June.",
      'late-august':
        'Peak cottage season — lakes are warm, everything is open, and the evenings are magical. Book 3+ months in advance. Weekdays are far more relaxed than weekends.',
      'early-september':
        'Arguably the best time to visit Muskoka. School is back, resorts quiet right down, prices drop noticeably, and the first hints of fall colour appear in the maples. Arrowhead Park is stunning.',
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 3 — Prince Edward County
  // ─────────────────────────────────────────────
  {
    id: 'pec',
    name: 'Prince Edward County',
    tagline: 'Windswept dunes, farm-to-table wineries, and small-town charm',
    duration: '3 days',
    distanceKm: 500,
    driveHoursOneWay: 2.5,
    seasons: ['late-august', 'early-september'],
    colorFrom: '#d97706',
    colorTo: '#ea580c',
    emoji: '🍷',
    highlights: ['Sandbanks Provincial Park', 'Kingston Waterfront', 'Picton Village', 'County Wineries'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.1623, -77.3832],
        [44.2312, -76.4860],
        [44.0082, -77.1386],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Depart via Hwy 401 East.',
        },
        {
          name: 'Belleville',
          coords: [44.1623, -77.3832],
          night: null,
          description: 'Rest stop ~2 hrs from Toronto. Lunch option before crossing into the County.',
        },
        {
          name: 'Kingston',
          coords: [44.2312, -76.4860],
          night: 1,
          description: "Historic limestone city at Lake Ontario's eastern end. Fort Henry, waterfront, and excellent dining.",
        },
        {
          name: 'Picton (The County)',
          coords: [44.0082, -77.1386],
          night: 2,
          description: 'Hub of Prince Edward County. Sandbanks dunes, local wineries, farm markets, and charming main street.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Kingston',
          desc: 'Drive ~2.5 hrs via Hwy 401 E. Afternoon at Kingston waterfront — Fort Henry National Historic Site for the kids (outdoor grounds are dog-friendly). Evening stroll along the Lake Ontario waterfront path.',
        },
        {
          day: 2,
          title: 'Kingston → Prince Edward County',
          desc: 'Cross the Bay of Quinte bridge (30 min). Morning in Picton village. Afternoon at Sandbanks — dunes walk with the dog, beach swim for the kids (note dog restrictions on main beaches). Winery patio in the evening.',
        },
        {
          day: 3,
          title: 'County → Toronto',
          desc: 'Morning at Macaulay Mountain Conservation Area or a farm market run. Drive home via Hwy 401 W, ~2.5 hrs.',
        },
      ],
    },

    poi: [
      {
        name: 'Sandbanks Provincial Park',
        description:
          "Home to the world's largest freshwater sand bar dune system. Three beaches: Outlet, West Lake, and Sandbanks Beach. Extraordinary swimming and dune walking.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['beach', 'dunes', 'swimming', 'provincial park'],
        dogNote:
          'IMPORTANT: Dogs NOT allowed on the main beaches (Outlet, West Lake, Sandbanks Beach) during peak season (late June – Labour Day). Dogs ARE allowed in the dune area trails and campground loops. Plan for one adult to walk the dog on the dunes trail while others swim.',
      },
      {
        name: 'Fort Henry National Historic Site',
        description:
          "A beautifully restored 1832 British fort overlooking Kingston Harbour. Guided tours, cannon firings, costumed interpreters, and stunning views across the water. Kids absolutely love it.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['historic', 'fort', 'museum', 'views', 'cannons'],
        dogNote:
          'Outdoor grounds and ramparts are dog-friendly on leash. Check with staff about interior access when you arrive.',
      },
      {
        name: 'Picton Village & Main Street',
        description:
          "A charming small town with artisan shops, the beloved Books & Company bookstore, bakeries, and the County's best brunch restaurants. Very walkable.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'dining', 'shopping', 'artisan', 'brunch'],
        dogNote:
          'One of the most dog-friendly towns in Ontario. Water bowls outside shops, pet welcome signs everywhere, and outdoor patios that genuinely welcome dogs.',
      },
      {
        name: 'County Wineries (Norman Hardie, Hinterland)',
        description:
          "Prince Edward County is Ontario's most exciting emerging wine region. Many wineries have beautiful outdoor patios, farm animals for kids to see, and tasting experiences.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['wine', 'farm', 'patio', 'tasting', 'outdoors'],
        dogNote:
          'Most winery outdoor patios welcome leashed dogs. Norman Hardie Winery is particularly welcoming — large gravel yard, farm setting, and very dog-friendly staff.',
      },
      {
        name: 'Lake on the Mountain Provincial Park',
        description:
          'A fascinating natural mystery — a lake perched high above the Bay of Quinte with no visible water source. A short walk reveals spectacular panoramic views. Free to visit.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['scenic', 'views', 'geological', 'free', 'quick stop'],
        dogNote:
          'Very short flat walk from the parking area. Ideal for a senior dog — essentially just a stroll to an extraordinary viewpoint.',
      },
    ],

    trails: [
      {
        name: 'Lake on the Mountain Lookout Walk',
        lengthKm: 0.5,
        difficulty: 'easy',
        surface: 'Paved path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '10–15 min',
        seniorDogNote:
          'Barely a walk — completely flat and paved. Perfect for any dog. Just a short stroll to a remarkable viewpoint over the Bay of Quinte.',
        description:
          'A very short accessible walk to the incredible Lake on the Mountain overlook. Panoramic views of the Bay of Quinte, Adolphus Reach, and the surrounding countryside.',
      },
      {
        name: 'Macaulay Mountain Conservation Area',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Forested trail with some gentle slopes',
        dogFriendly: true,
        kidFriendly: true,
        duration: '50–70 min',
        seniorDogNote:
          'Gentle slopes but mostly well-maintained forested trail. Shaded and cool. Benches near the hilltop lookout. Take it slow — the payoff view is worth it.',
        description:
          'A lovely network of trails through hardwood forest just outside Picton, featuring a hilltop lookout tower with sweeping views over Prince Edward County.',
      },
      {
        name: 'Sandbanks Dunes Trail',
        lengthKm: 1.5,
        difficulty: 'easy',
        surface: 'Sand (soft)',
        dogFriendly: true,
        kidFriendly: true,
        duration: '30–45 min',
        seniorDogNote:
          'Soft sand is tiring for senior dogs. Bring plenty of water and do this in the cooler morning. The dune scenery is unlike anything else in Ontario.',
        description:
          "Walk through Sandbanks' remarkable dune ecosystem — towering sand formations, unique dune grasses, and sweeping lake vistas. Dogs allowed here (not on the adjacent beach).",
      },
    ],

    lodging: [
      {
        name: 'The Drake Devonshire',
        type: 'Boutique Hotel',
        location: 'Wellington, PEC',
        petPolicy: 'Dogs warmly welcomed — pet-friendly throughout',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Boutique rooms, some with lake views; family-suitable rooms available',
        bookingNote:
          "One of Ontario's best boutique hotels. Great restaurant, waterfront location, and genuinely dog-friendly. Book 2–3 months ahead for summer.",
      },
      {
        name: "Angeline's Inn & Spa",
        type: 'Inn / B&B',
        location: 'Bloomfield, PEC',
        petPolicy: 'Pet-friendly rooms available — confirm at booking',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Rooms and suites in a restored Victorian inn',
        bookingNote: 'Beautiful property in the heart of Bloomfield village. Excellent breakfast.',
      },
      {
        name: 'Prince Edward County Cottage Rentals',
        type: 'Cottage / Farmstay',
        location: 'Throughout The County',
        petPolicy: 'Many dog-friendly options — search "pets allowed" on VRBO / Airbnb',
        familySuitable: true,
        priceRange: '$$$',
        rooms: '2–4 bedroom farm or lakefront cottages',
        bookingNote:
          'Best for families — open rural space for the dog to roam, privacy, and full kitchen. Many farm properties welcome dogs enthusiastically.',
      },
      {
        name: 'Holiday Inn Express Belleville',
        type: 'Hotel',
        location: 'Belleville (en route)',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Family rooms available',
        bookingNote: 'Budget-friendly overnight option if you want to break up the drive from Toronto.',
      },
    ],

    restaurants: [
      {
        name: 'The Drake Devonshire Restaurant',
        location: 'Wellington, PEC',
        cuisine: 'Contemporary Canadian / Farm-to-Table',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Lake Ontario pickerel, County vegetable dishes, Ontario wine list',
        tip: "The flagship County dining experience. Waterfront patio is dog-friendly. Book ahead for dinner — this is the trip's best meal.",
      },
      {
        name: 'Parsons Brewing Company',
        location: 'Picton, PEC',
        cuisine: 'Brewery / Pub',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Local craft ales, wood-fired flatbreads',
        tip: 'Large dog-friendly patio in Picton. Relaxed family atmosphere with a great kids menu.',
      },
      {
        name: 'Agrarian Market & Café',
        location: 'Picton, PEC',
        cuisine: 'Local Café / Farm Market',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'House-roasted coffee, County honey, fresh pastries',
        tip: 'Perfect morning stop in Picton. Outdoor seating welcomes dogs. Pick up local provisions for the drive home.',
      },
      {
        name: 'Norman Hardie Winery & Restaurant',
        location: 'Prince Edward County',
        cuisine: 'Winery / Farm Lunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Wood-fired pizza, County charcuterie, Pinot Noir',
        tip: 'Among the most dog-friendly wineries in Ontario. Large gravel yard with farm animals kids love. Arrive before noon on weekends.',
      },
    ],

    seasonTips: {
      june:
        "June is lovely and uncrowded in the County. Water isn't quite warm enough for swimming but wineries are open and the countryside is lush green. Sandbanks dunes are uncrowded.",
      'late-august':
        "Peak season — everything is open and buzzing. Wineries are busy with harvest prep. Sandbanks beaches are at their best but very busy. Book 2–3 months in advance.",
      'early-september':
        'The absolute best time to visit the County. Harvest season begins — farm markets overflow with corn, tomatoes, peaches, and wine grapes. Winery harvest events, fewer tourists, golden light, and cooler temps. Worth every km of the drive.',
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 4 — Ottawa & Gatineau Park
  // ─────────────────────────────────────────────
  {
    id: 'ottawa',
    name: 'Ottawa & Gatineau Park, QC',
    tagline: "Canada's capital, world-class museums, and Québec fall colours",
    duration: '4 days',
    distanceKm: 900,
    driveHoursOneWay: 4.5,
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#dc2626',
    colorTo: '#e11d48',
    emoji: '🍁',
    highlights: ['Parliament Hill', 'ByWard Market', 'Gatineau Park', 'Rideau Canal'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.2312, -76.4860],
        [45.4215, -75.6972],
        [45.4765, -75.7013],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Depart via Hwy 401 East. Leave by 7 am to arrive Kingston for a late lunch.',
        },
        {
          name: 'Kingston',
          coords: [44.2312, -76.4860],
          night: 1,
          description: "Historic limestone city. Break up the drive with a night here. 1000 Islands boat cruise is a highlight for families.",
        },
        {
          name: 'Ottawa',
          coords: [45.4215, -75.6972],
          night: 2,
          description: "Canada's capital. Parliament, ByWard Market, Rideau Canal, world-class museums. Two nights here gives you enough time.",
        },
        {
          name: 'Gatineau, QC',
          coords: [45.4765, -75.7013],
          night: 3,
          description: 'Cross the bridge into Québec. Gatineau Park offers gorgeous trails and Pink Lake. Day trip, then back through Ottawa to start the drive home.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Kingston',
          desc: 'Drive 2.5 hrs via Hwy 401 E. Afternoon at Kingston Waterfront — Fort Henry National Historic Site for the kids (outdoor grounds dog-friendly). Evening stroll along the Lake Ontario waterfront.',
        },
        {
          day: 2,
          title: 'Kingston → Ottawa',
          desc: 'Drive 2 hrs via Hwy 401/416. Check in and explore Parliament Hill, walk to ByWard Market (incredible for foodies!), and evening stroll along the Rideau Canal pathway with the dog.',
        },
        {
          day: 3,
          title: 'Ottawa Museums + Gatineau Park',
          desc: 'Morning at Canadian Museum of Nature (kids\' favourite — plan for one adult with dog at nearby Dundonald Park). Afternoon drive to Gatineau Park, QC — Pink Lake lookout trail and a picnic.',
        },
        {
          day: 4,
          title: 'Ottawa → Kingston → Toronto',
          desc: 'Morning stroll along Ottawa River Pathway. Drive home ~4.5 hrs via Hwy 416/401. Optional stop in Kingston for coffee.',
        },
      ],
    },

    poi: [
      {
        name: 'Parliament Hill',
        description:
          "Canada's iconic Gothic Revival government buildings overlooking the Ottawa River. Free guided tours of Centre Block (when available), plus the colourful Changing of the Guard ceremony on the lawn every summer morning.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['landmark', 'history', 'free', 'photography', 'ceremony'],
        dogNote:
          'The outdoor grounds and viewing lawn are dog-friendly on leash. The Changing of the Guard ceremony is excellent for the whole family — dogs welcome on the grassy viewing areas.',
      },
      {
        name: 'ByWard Market',
        description:
          "Ottawa's famous outdoor market neighbourhood. Fresh produce, artisan baked goods, BeaverTails pastry stands, great restaurants, and a lively street atmosphere perfect for a family breakfast or lunch.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['market', 'food', 'outdoor', 'BeaverTails', 'lively'],
        dogNote:
          'Outdoor market areas are very dog-friendly. BeaverTails stand is a must — dogs get pets from every passerby. Most patios welcome leashed dogs.',
      },
      {
        name: 'Canadian Museum of Nature',
        description:
          "One of Canada's finest natural history museums. Incredible dinosaur fossil gallery, gem and mineral hall, Arctic exhibit, and hands-on children's discovery zone. A full half-day for families.",
        dogFriendly: false,
        kidFriendly: true,
        tags: ['museum', 'dinosaurs', 'science', 'kids', 'gems'],
        dogNote:
          'Dogs not permitted inside. Plan for one adult to stay with dog at nearby Dundonald Park (an excellent off-leash park just 3 min walk away) while others visit the museum.',
      },
      {
        name: 'Gatineau Park, Québec',
        description:
          "A 361 km² national park just across the Ottawa River in Québec. Pink Lake is a meromictic lake with stunning turquoise colour. Lookout trails, swimming lakes, and the earliest fall colours in the region starting in early September.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['national park', 'lake', 'trails', 'Quebec', 'scenic', 'fall colours'],
        dogNote:
          'Dogs allowed on leash on most Gatineau Park trails. Pink Lake lookout trail is easy and spectacular. Bring water — trails can be warm in August.',
      },
      {
        name: 'Rideau Canal Pathway',
        description:
          'A flat, paved multi-use pathway running 7.8 km along the Rideau Canal through the heart of Ottawa. Cyclists, joggers, families, and dogs at all hours. Beautiful at golden hour.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['pathway', 'canal', 'cycling', 'flat', 'sunset', 'UNESCO'],
        dogNote:
          "One of the best dog walks in Canada. Completely flat and paved, with water fountains and benches throughout. Perfect for a senior dog at whatever pace works.",
      },
    ],

    trails: [
      {
        name: 'Pink Lake Lookout Trail (Gatineau Park)',
        lengthKm: 2.8,
        difficulty: 'easy',
        surface: 'Gravel path with some stone steps',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote:
          "Mostly gentle with a few short stone steps near the main overlook. The stunning view of Pink Lake's extraordinary turquoise colour is worth every step. Bring water.",
        description:
          'A beloved short loop in Gatineau Park overlooking Pink Lake — a meromictic lake whose layers never mix, producing a striking blue-green colour. One of the most photographed spots in the National Capital Region.',
      },
      {
        name: 'Ottawa River Pathway',
        lengthKm: 7.8,
        difficulty: 'easy',
        surface: 'Paved',
        dogFriendly: true,
        kidFriendly: true,
        duration: 'Walk as much or as little as you like',
        seniorDogNote:
          "Completely flat and paved with benches and water fountains the entire length. Do 1 km or 5 km — there's no wrong answer for a senior dog.",
        description:
          'A scenic flat pathway along the Ottawa River with views of Parliament Hill, Gatineau Hills, and the wide river. Walk or bike. The finest riverside path in the National Capital Region.',
      },
      {
        name: 'Sugarbush Trail (Gatineau Park)',
        lengthKm: 2.0,
        difficulty: 'easy',
        surface: 'Forested path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '30–45 min',
        seniorDogNote:
          'Gentle rolling forest trail through maple trees. Beautiful green canopy in summer, exceptional gold and red in early September. Cool and shaded.',
        description:
          'A pleasant loop through a classic hardwood sugar maple forest in Gatineau Park. Interpretive signs explain the maple syrup production cycle. Early September brings spectacular colour.',
      },
    ],

    lodging: [
      {
        name: 'Fairmont Château Laurier',
        type: 'Luxury Hotel',
        location: 'Downtown Ottawa (next to Parliament)',
        petPolicy: 'Pet-friendly — dogs receive a welcome amenity package',
        familySuitable: true,
        priceRange: '$$$$',
        rooms: 'Classic rooms, suites, and family configurations',
        bookingNote:
          "An iconic Canadian experience beside Parliament Hill. The splurge is absolutely worth it for a special family trip. Dogs treated like royalty.",
      },
      {
        name: 'Alt Hotel Ottawa',
        type: 'Boutique Hotel',
        location: 'Downtown Ottawa',
        petPolicy: 'Pet-friendly',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Modern rooms, good family layout options',
        bookingNote: 'Stylish, well-located, and genuinely dog-friendly. Walking distance to Parliament and ByWard Market.',
      },
      {
        name: 'Homewood Suites Ottawa',
        type: 'Extended Stay Hotel',
        location: 'Ottawa',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Suite-style rooms with full kitchenette and separate living area',
        bookingNote:
          'Best value for families — full kitchen, separate living space, and free breakfast. More room for kids and the dog to spread out.',
      },
      {
        name: 'Delta Hotels Kingston Waterfront',
        type: 'Hotel',
        location: 'Kingston (Day 1 overnight)',
        petPolicy: 'Pet-friendly',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Waterfront rooms with harbour views',
        bookingNote: 'Superb location right on Kingston Harbour. Kids love watching the boats and ferries from the room.',
      },
    ],

    restaurants: [
      {
        name: "Zak's Diner",
        location: 'Ottawa (ByWard Market)',
        cuisine: 'Classic Canadian Diner',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Poutine, all-day breakfast, milkshakes',
        tip: "A ByWard Market institution. Kids love the diner vibe. Get takeout and eat at Major's Hill Park with the dog — 3 min walk away.",
      },
      {
        name: 'The Manx Pub',
        location: 'Ottawa',
        cuisine: 'Pub / Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Burgers, local craft beer, nachos',
        tip: "One of Ottawa's most dog-friendly patios. Laid-back and welcoming for families.",
      },
      {
        name: 'Pure Kitchen',
        location: 'Ottawa',
        cuisine: 'Healthy / Plant-forward',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Buddha bowls, smoothies, grain salads',
        tip: 'Great healthy option mid-trip. Outdoor seating welcomes dogs. Good for refuelling after a big Gatineau hike.',
      },
      {
        name: 'Beckta Dining & Wine',
        location: 'Ottawa',
        cuisine: 'Contemporary Canadian / Fine Dining',
        dogFriendly: false,
        kidFriendly: false,
        priceRange: '$$$$',
        mustTry: 'Chef\'s tasting menu, Ontario wine pairings',
        tip: "Ottawa's best special-occasion restaurant. Adults-only dinner while kids are settled for the night. Book weeks ahead.",
      },
    ],

    seasonTips: {
      june:
        "Ottawa in June is spectacular — the world-famous Canadian Tulip Festival may still be winding down, Parliament tours are fully running, and Gatineau Park trails are lush and green. Warm days and cool evenings.",
      'late-august':
        'Hot and busy. ByWard Market is at its most vibrant. Rideau Canal pathway is stunning at sunset. Book hotels 2+ months ahead — Ottawa is a busy summer destination.',
      'early-september':
        "Early fall colours begin in Gatineau Park — the maples turn gold and red starting in the hills. Crowds thin dramatically after Labour Day. Cooler temps make hiking far more comfortable for dogs and kids alike. Ottawa's best-kept seasonal secret.",
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 5 — Eastern Canada Grand Circuit (7 days)
  // Toronto → Kingston → Ottawa → Montréal → PEC → Toronto
  // ─────────────────────────────────────────────
  {
    id: 'eastern-circuit',
    name: 'Eastern Canada Grand Circuit',
    tagline: 'Kingston · Ottawa · Montréal · Prince Edward County — the ultimate eastern loop',
    duration: '7 days',
    distanceKm: 1200,
    driveHoursOneWay: 10.5, // total driving across full loop
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#7c3aed',
    colorTo: '#4f46e5',
    emoji: '🗺️',

    tripProfile: {
      passengers: '2 adults, 2 children',
      pet: 'Samoyed, ~50 lbs',
      vehicle: 'Van with roof rack',
      dogBreedNote:
        'Samoyeds have a thick double coat built for Arctic conditions — they overheat quickly in summer. Schedule all hikes for early morning (before 10 am) or evening. Bring a collapsible bowl and extra water at all times. Avoid hot pavement (burns paw pads — use the back of your hand to test). Never leave in a parked car. A cooling mat in the van is a great investment.',
    },

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.2312, -76.4860],
        [45.4215, -75.6972],
        [45.5017, -73.5673],
        [44.0082, -77.1386],
        [43.6532, -79.3832],
      ],
      googleMapsUrl:
        'https://www.google.com/maps/dir/Toronto,+Ontario/Kingston,+Ontario/Ottawa,+Ontario/Montreal,+Quebec/Prince+Edward+County,+Ontario/Toronto,+Ontario',
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Departure. Pack the van the evening before. Leave by 7:30 am to beat 401 traffic.',
        },
        {
          name: 'Kingston',
          coords: [44.2312, -76.4860],
          night: 1,
          description: "Canada's first capital. Historic limestone city on Lake Ontario. Fort Henry, waterfront, and great restaurants.",
        },
        {
          name: 'Ottawa',
          coords: [45.4215, -75.6972],
          night: 2,
          description: "Canada's capital for two nights. Parliament Hill, ByWard Market, Rideau Canal, and Gatineau Park.",
        },
        {
          name: 'Ottawa (Night 2)',
          coords: [45.4265, -75.6872],
          night: 3,
          description: 'Second Ottawa night — day trip to Gatineau Park, QC.',
        },
        {
          name: 'Montréal',
          coords: [45.5017, -73.5673],
          night: 4,
          description: "Canada's cultural capital for two nights. Old Montréal, Mount Royal, Lachine Canal, and legendary food.",
        },
        {
          name: 'Montréal (Night 2)',
          coords: [45.5067, -73.5623],
          night: 5,
          description: 'Second Montréal night — full city exploration day.',
        },
        {
          name: 'Prince Edward County',
          coords: [44.0082, -77.1386],
          night: 6,
          description: 'The County — wineries, Sandbanks, Picton village. Last overnight before heading home.',
        },
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Home. 2.5 hr drive west via Hwy 401. Back by early afternoon.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Kingston  |  263 km · 2.5 hrs',
          desc: "Easy first driving day. Arrive Kingston by late morning. Grab lunch at Pan Chancho Bakery. Afternoon at Fort Henry National Historic Site with the kids — outdoor ramparts and cannon firings. Evening waterfront walk with the dog along Lake Ontario. Early dinner at The Merchant Taphouse.",
        },
        {
          day: 2,
          title: 'Kingston → Ottawa  |  195 km · 2 hrs',
          desc: "Morning drive along the 401/416. Check in and drop bags. Afternoon: Parliament Hill and the Changing of the Guard ceremony (dog welcome on the lawn). Walk the Rideau Canal Pathway. ByWard Market for a late lunch — BeaverTails are mandatory. Evening at Major's Hill Park with great views of the Château Laurier.",
        },
        {
          day: 3,
          title: 'Ottawa + Gatineau Park  |  No driving (day trips only)',
          desc: "Full Ottawa day. Morning: Canadian Museum of Nature for kids — one adult takes the dog to nearby Dundonald Park (excellent off-leash area). Afternoon: drive 15 min to Gatineau Park, QC for the Pink Lake lookout trail (bring lots of water for the Samoyed). Evening: Ottawa River Pathway sunset walk.",
        },
        {
          day: 4,
          title: 'Ottawa → Montréal  |  200 km · 2 hrs',
          desc: "Morning drive via Hwy 417 E. Arrive Montréal early afternoon. Check in near Old Montréal. Afternoon walk through Vieux-Montréal cobblestone streets and the Vieux-Port waterfront — both excellent with dogs. Kids love the old fortification walls. Dinner on a Old Montréal terrasse.",
        },
        {
          day: 5,
          title: 'Montréal — full day  |  No driving',
          desc: "BIG day. Early morning (7 am): Mount Royal Park hike via Chemin Olmsted before the heat — essential for the Samoyed. Back down by 10 am. Late morning: Atwater Market for provisions. Afternoon: Lachine Canal linear path (flat, paved, shaded sections). Late afternoon: the famous Schwartz's smoked meat sandwiches on Saint-Laurent. Dog waits outside and gets all the attention from the queue.",
        },
        {
          day: 6,
          title: 'Montréal → Prince Edward County  |  280 km · 3 hrs',
          desc: "Morning drive back through Kingston and across to The County. Arrive for lunch in Picton. Afternoon: Macaulay Mountain Conservation Area trail or a winery patio (Norman Hardie is very dog-friendly). Lake on the Mountain sunset lookout. Overnight in the County.",
        },
        {
          day: 7,
          title: 'Prince Edward County → Toronto  |  225 km · 2.5 hrs',
          desc: "Relaxed final morning. Farm market run in Picton for local honey and preserves. Optional 30-min Lake on the Mountain walk with the dog. Easy drive home via Hwy 401 W. Back in Toronto by early afternoon — everyone, including the Samoyed, earns a long nap.",
        },
      ],
    },

    poi: [
      // Kingston
      {
        name: 'Fort Henry National Historic Site',
        location: 'Kingston',
        description:
          "A beautifully restored 1832 British fortification on a hill above Kingston Harbour. Guided tours, costumed soldiers, live cannon and musket firings, and stunning views across to the Thousand Islands. Kids are completely captivated.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['history', 'fort', 'cannon', 'views', 'UNESCO'],
        dogNote:
          'Outdoor grounds, ramparts, and grassy areas are dog-friendly on leash. The elevated position catches a breeze — good for a Samoyed on a warm day. Confirm interior dog access on arrival.',
      },
      {
        name: 'Kingston Waterfront & Confederation Park',
        location: 'Kingston',
        description:
          'A beautiful flat waterfront promenade along Lake Ontario with splash pads for kids, a bandshell, picnic areas, and views across to Wolfe Island. The ferry to Wolfe Island is free.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['waterfront', 'splash pad', 'flat', 'ferry', 'picnic'],
        dogNote:
          'Excellent for a Samoyed — flat grassy areas, shade trees, and cool lake breezes. The dog will get enormous attention from other visitors.',
      },
      // Ottawa
      {
        name: 'Parliament Hill & Changing of the Guard',
        location: 'Ottawa',
        description:
          "Canada's iconic Gothic Revival Parliament Buildings. The free Changing of the Guard ceremony happens on the lawn every summer morning at 10 am — colourful, musical, and very photogenic.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['landmark', 'ceremony', 'free', 'photography', 'history'],
        dogNote:
          'Outdoor grounds and viewing lawn are dog-friendly on leash. The wide open grass gives the Samoyed room to stretch. Arrive early for good viewing spots.',
      },
      {
        name: 'ByWard Market',
        location: 'Ottawa',
        description:
          "Ottawa's famous outdoor market neighbourhood. Fresh produce, artisan baked goods, BeaverTails pastry stands, dozens of restaurants, and a lively street atmosphere. Best visited for breakfast or lunch.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['market', 'food', 'outdoor', 'BeaverTails', 'breakfast'],
        dogNote:
          "One of the most dog-welcoming places in Canada. Water bowls everywhere, outdoor terrasses that actively invite dogs, and the Samoyed's fluffy white coat will make you a local celebrity.",
      },
      {
        name: 'Canadian Museum of Nature',
        location: 'Ottawa',
        description:
          "World-class natural history museum with spectacular dinosaur fossil halls, a gem and mineral gallery, Arctic exhibit, and hands-on children's discovery zone. Easily a half-day.",
        dogFriendly: false,
        kidFriendly: true,
        tags: ['museum', 'dinosaurs', 'science', 'gems', 'kids'],
        dogNote:
          'Dogs not permitted inside. Plan for one adult to visit Dundonald Park (3 min walk — has an excellent off-leash area) with the dog while others enjoy the museum. Switch halfway.',
      },
      {
        name: 'Gatineau Park, Québec',
        location: 'Gatineau, QC (15 min from Ottawa)',
        description:
          "A 361 km² national park just across the river in Québec. Pink Lake's extraordinary turquoise colour is unforgettable. Multiple trail options from easy to moderate. Early September brings the first stunning fall colours.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['national park', 'lake', 'trails', 'fall colours', 'Québec'],
        dogNote:
          'Dogs on leash on all marked trails. DO THIS EARLY (before 9 am in summer) — the park heats up quickly and a Samoyed in full sun on a warm August afternoon is not a good situation. Bring 2 litres of water for the dog.',
      },
      // Montréal
      {
        name: 'Old Montréal (Vieux-Montréal)',
        location: 'Montréal',
        description:
          "North America's largest intact historic district. Cobblestone streets, 17th-century stone buildings, the stunning Notre-Dame Basilica exterior, the Vieux-Port waterfront, and countless café terrasses. Magical at any time of day.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['historic', 'cobblestones', 'architecture', 'waterfront', 'terrasses'],
        dogNote:
          'Montréal is famously dog-friendly — terrasses openly welcome dogs, locals stop to admire a Samoyed, and the cobblestone streets are shaded by old buildings. Morning or evening best for heat.',
      },
      {
        name: 'Mount Royal Park (Parc du Mont-Royal)',
        location: 'Montréal',
        description:
          "Frederick Law Olmsted's masterpiece — the same designer as Central Park, NYC. A forested mountain in the heart of the city with panoramic views of Montréal, a large lake (Lac aux Castors), and excellent hiking trails.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['park', 'hiking', 'views', 'lake', 'city forest'],
        dogNote:
          'DO THIS HIKE EARLY — start by 7 am to beat the heat for the Samoyed. The Chemin Olmsted trail is shaded by tall trees for most of its length. The summit viewpoint is worth every step. The lake area has flat paths great for cooling down afterward.',
      },
      {
        name: 'Lachine Canal Linear Park',
        location: 'Montréal',
        description:
          "A beautiful flat multi-use path running 14 km along the historic Lachine Canal through Montréal's trendiest neighbourhoods. Pass cafés, public art, old industrial buildings, and families on bikes.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['canal', 'flat', 'cycling', 'pathway', 'neighbourhoods'],
        dogNote:
          'Completely flat, largely shaded, and with canal water to cool paws in. A perfect afternoon walk for a Samoyed after the morning mountain hike. Do a 3–4 km section and grab a patio lunch mid-way.',
      },
      // PEC
      {
        name: 'Picton Village & Main Street',
        location: 'Prince Edward County',
        description:
          "One of Ontario's most charming small towns. Artisan shops, the beloved Books & Company bookstore, excellent bakeries, local art galleries, and the County's best brunch restaurants all on one walkable street.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'shopping', 'brunch', 'artisan', 'walkable'],
        dogNote:
          'Picton is one of the most dog-friendly towns in Ontario — water bowls outside shops, pet welcome signs, and outdoor patios that genuinely welcome dogs of all sizes.',
      },
      {
        name: 'Norman Hardie Winery',
        location: 'Prince Edward County',
        description:
          "One of the County's most celebrated wineries with a beautiful outdoor patio, farm animals, a wood-fired pizza oven, and relaxed family-friendly atmosphere. The pinot noir is exceptional.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['winery', 'patio', 'farm', 'pizza', 'relaxed'],
        dogNote:
          'Among the most dog-friendly wineries in Ontario. Large gravel yard, open farm setting, and staff who love dogs. The Samoyed will be a star here.',
      },
    ],

    trails: [
      {
        name: 'Fort Henry Ridge Walk',
        location: 'Kingston',
        lengthKm: 1.5,
        difficulty: 'easy',
        surface: 'Paved + packed earth',
        dogFriendly: true,
        kidFriendly: true,
        duration: '25–35 min',
        seniorDogNote: null,
        samoyedNote:
          'Short and breezy on the ridge. Elevated position catches wind — good for a Samoyed. Morning or evening only in summer.',
        description:
          "A short walk along the ridge above Fort Henry with panoramic views of Kingston Harbour, the Rideau Canal entrance, and the Thousand Islands. Easy and very rewarding.",
      },
      {
        name: 'Rideau Canal Pathway',
        location: 'Ottawa',
        lengthKm: 7.8,
        difficulty: 'easy',
        surface: 'Paved',
        dogFriendly: true,
        kidFriendly: true,
        duration: 'Do 2–4 km at your pace',
        seniorDogNote: 'Completely flat and paved. Perfect for any dog.',
        samoyedNote:
          'Flat and largely shaded in sections with canal breezes. Morning or evening walk. Water fountains every kilometre.',
        description:
          "The finest urban dog walk in Canada. A flat paved pathway along the Rideau Canal through Ottawa's heart with Parliament Hill views, lock stations, and beautiful evening light.",
      },
      {
        name: 'Pink Lake Lookout Trail',
        location: 'Gatineau Park, QC',
        lengthKm: 2.8,
        difficulty: 'easy-moderate',
        surface: 'Gravel with stone steps',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote: null,
        samoyedNote:
          'DO EARLY (before 9 am). The trail is exposed in sections. Bring 2 L of water for the dog. The lookout over the turquoise lake is spectacular and worth the effort.',
        description:
          "A beautiful loop in Gatineau Park to a lookout over Pink Lake — a meromictic lake whose layers never mix, producing an extraordinary blue-green colour. One of the most photographed spots in the National Capital Region.",
      },
      {
        name: 'Gatineau Skyline Trail',
        location: 'Gatineau Park, QC',
        lengthKm: 6.0,
        difficulty: 'intermediate',
        surface: 'Rocky forest trail',
        dogFriendly: true,
        kidFriendly: true,
        duration: '2–2.5 hrs',
        seniorDogNote: null,
        samoyedNote:
          'Intermediate difficulty — only do this if temperature is below 20°C. Early morning start essential. Bring extra water. The Samoyed will love the rocky forest terrain.',
        description:
          'A classic Gatineau Park ridge trail with sweeping views of the Ottawa Valley from multiple lookout points. More elevation than Pink Lake but still very accessible for fit families.',
      },
      {
        name: 'Chemin Olmsted — Mount Royal',
        location: 'Montréal',
        lengthKm: 5.0,
        difficulty: 'moderate',
        surface: 'Gravel carriage road (wide, well-graded)',
        dogFriendly: true,
        kidFriendly: true,
        duration: '1.5–2 hrs round trip',
        seniorDogNote: null,
        samoyedNote:
          'START BY 7 AM in summer. The Chemin Olmsted is a wide gravel carriage road, well-shaded by mature forest for most of its length. Moderate uphill but never steep. The most Samoyed-friendly route up the mountain.',
        description:
          "Frederick Law Olmsted's original carriage road spirals gently up Mont-Royal through beautiful mature forest. The main route to the summit viewpoint over Montréal. Dogs love it and the shaded trail keeps the heat manageable.",
      },
      {
        name: 'Lachine Canal Section Walk',
        location: 'Montréal',
        lengthKm: 4.0,
        difficulty: 'easy',
        surface: 'Paved',
        dogFriendly: true,
        kidFriendly: true,
        duration: '60–75 min',
        seniorDogNote: 'Completely flat. Ideal for any dog.',
        samoyedNote:
          'Do the afternoon section (after the morning mountain hike). The canal provides breeze and shade. Cafés with dog-friendly terrasses every kilometre.',
        description:
          "A flat 14 km canal-side pathway through Montréal's hippest neighbourhoods. Walk the 4 km section between Atwater Market and Old Montréal for the best mix of scenery, café stops, and people-watching.",
      },
      {
        name: 'Macaulay Mountain Conservation Area',
        location: 'Prince Edward County',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Forested trail',
        dogFriendly: true,
        kidFriendly: true,
        duration: '50–70 min',
        seniorDogNote: 'Some gentle slopes but well-maintained. Shaded and cool.',
        samoyedNote:
          'Lovely shaded forest trail — good for the Samoyed on a warm day. The hilltop lookout has a cooling breeze.',
        description:
          'A network of easy-moderate trails through hardwood forest just outside Picton with a hilltop lookout tower and views over Prince Edward County.',
      },
    ],

    restaurants: [
      // Kingston
      {
        name: 'Pan Chancho Bakery & Café',
        location: 'Kingston',
        cuisine: 'Bakery / Café / Light Meals',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Croissants, house-made bread, daily soup',
        tip: 'No outdoor seating — get takeout and eat at the nearby waterfront park with the dog.',
      },
      {
        name: 'The Merchant Taphouse & Oyster Bar',
        location: 'Kingston',
        cuisine: 'Canadian / Pub',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Fish & chips, local craft beers',
        tip: 'Dog-friendly patio out front. Kids menu available. Great for an easy first-night dinner.',
      },
      {
        name: 'Tango Nuevo',
        location: 'Kingston',
        cuisine: 'Latin American / Fusion',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Empanadas, grilled mains',
        tip: 'Excellent outdoor patio. One of Kingston\'s best-regarded dining spots.',
      },
      // Ottawa
      {
        name: "Zak's Diner",
        location: 'Ottawa (ByWard Market)',
        cuisine: 'Classic Canadian Diner',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Poutine, all-day breakfast, milkshakes',
        tip: 'A ByWard Market institution. Kids love the diner vibe. Get takeout and eat at Major\'s Hill Park with the dog.',
      },
      {
        name: 'The Manx Pub',
        location: 'Ottawa',
        cuisine: 'Pub / Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Burgers, local craft beer',
        tip: 'One of Ottawa\'s most dog-friendly patios. Laid-back atmosphere perfect for families.',
      },
      {
        name: 'Pure Kitchen',
        location: 'Ottawa',
        cuisine: 'Healthy / Plant-forward',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Buddha bowls, smoothies, grain salads',
        tip: 'Great healthy option mid-trip. Outdoor seating welcomes dogs. Good for energy-conscious road-trippers.',
      },
      // Montréal
      {
        name: "Schwartz's Hebrew Delicatessen",
        location: 'Montréal',
        cuisine: 'Montreal Smoked Meat Deli',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Medium-fat smoked meat sandwich on rye with mustard — no substitutions',
        tip: "No outdoor seating, but get takeout and eat on the Saint-Laurent sidewalk. The Samoyed waits outside and gets more attention than the sandwich. An unmissable Montréal experience.",
      },
      {
        name: 'Olive + Gourmando',
        location: 'Montréal (Old Montréal)',
        cuisine: 'Café / Sandwiches / Brunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Cubano sandwich, homemade granola bowls, house pastries',
        tip: 'Old Montréal institution with outdoor seating that welcomes dogs. Arrive early — lines form quickly on weekends.',
      },
      {
        name: 'Marché Atwater',
        location: 'Montréal',
        cuisine: 'Market / Artisan Food Hall',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$–$$$',
        mustTry: 'Quebec cheese, charcuterie, fresh produce, local pastries',
        tip: "Outdoor market fully dog-friendly. Assemble an incredible picnic for Mount Royal or the Lachine Canal. One of Canada's great food markets.",
      },
      {
        name: "L'Express",
        location: 'Montréal',
        cuisine: 'Classic French Bistro',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Steak tartare, moules frites, crème brûlée',
        tip: "A Montréal institution since 1980. Indoor only but unmissable for a special dinner. Book ahead. Get a babysitter if kids are young — this is the adults' splurge meal.",
      },
      // PEC
      {
        name: 'The Drake Devonshire',
        location: 'Wellington, Prince Edward County',
        cuisine: 'Contemporary Canadian / Farm-to-Table',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Local Lake Ontario fish, County vegetable dishes, Ontario wine list',
        tip: 'The flagship County dining experience. Waterfront patio is dog-friendly. Book for dinner — this is the trip\'s best meal.',
      },
      {
        name: 'Agrarian Market & Café',
        location: 'Picton, Prince Edward County',
        cuisine: 'Local Café / Farm Market',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'House-roasted coffee, County honey, fresh baked goods',
        tip: 'Perfect morning stop in Picton. Outdoor seating welcomes dogs. Pick up local provisions for the drive home.',
      },
    ],

    lodging: [
      {
        name: 'Delta Hotels Kingston Waterfront',
        type: 'Hotel',
        location: 'Kingston (Night 1)',
        petPolicy: 'Pet-friendly — confirm weight limit at booking',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Waterfront rooms with Lake Ontario views; family configurations available',
        bookingNote:
          'Superb location on the harbour. Kids love watching the ferries. Close to Fort Henry and waterfront.',
      },
      {
        name: 'Homewood Suites by Hilton Ottawa',
        type: 'Extended Stay Hotel',
        location: 'Ottawa (Nights 2–3)',
        petPolicy: 'Pet-friendly with fee — good for larger dogs',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Full suites with kitchenette, separate living area, pull-out sofa',
        bookingNote:
          'Best family value in Ottawa — room for kids and the Samoyed to spread out. Free breakfast included.',
      },
      {
        name: 'Alt Hotel Ottawa',
        type: 'Boutique Hotel',
        location: 'Ottawa (Nights 2–3 — upgrade option)',
        petPolicy: 'Pet-friendly',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Modern rooms; larger rooms suit a family of 4',
        bookingNote:
          'Stylish and genuinely dog-friendly. Walking distance to Parliament and ByWard Market.',
      },
      {
        name: 'Hôtel Le Saint-Sulpice',
        type: 'Boutique Hotel',
        location: 'Montréal — Old Montréal (Nights 4–5)',
        petPolicy: 'Pet-friendly — dogs welcome',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Suite-style rooms with kitchenette; excellent for families',
        bookingNote:
          "Right in Vieux-Montréal — walk everywhere. Suites give the family real space. One of Old Montréal's best pet-friendly properties.",
      },
      {
        name: 'Le Centre Sheraton Montréal',
        type: 'Hotel',
        location: 'Montréal (Nights 4–5 — central option)',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Family rooms and connecting rooms available',
        bookingNote:
          'Central location close to everything. Large rooms for a family. Good pool — the kids will insist.',
      },
      {
        name: 'The Drake Devonshire',
        type: 'Boutique Hotel',
        location: 'Wellington, Prince Edward County (Night 6)',
        petPolicy: 'Dogs warmly welcomed throughout the property',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Boutique rooms; family-suitable rooms available',
        bookingNote:
          "Ontario's best boutique hotel night. Waterfront, world-class restaurant on-site, and the Samoyed gets a hero's welcome.",
      },
    ],

    seasonTips: {
      june:
        'June is ideal for the Eastern Circuit — Parliament tulip festival winding down in Ottawa, Montréal Jazz Festival in late June, and PEC starting to buzz. Weather is warm but not oppressively hot, making it the most Samoyed-friendly month for this trip. Book everything 2+ months ahead.',
      'late-august':
        'Everything is open and at peak vibrancy — Montréal festivals, full restaurant/winery season in PEC. The hardest month for the Samoyed (heat). Schedule all hikes before 9 am, bring a cooling mat for the van, and do not skip the early morning Mount Royal start. Book 3+ months ahead.',
      'early-september':
        'The sweet spot for this circuit. Cooler temperatures (15–22°C) make hiking genuinely enjoyable for the Samoyed without the extreme heat precautions. Gatineau Park shows the first fall colour. PEC harvest season is extraordinary. Crowds thin, prices drop after Labour Day. The best overall choice for this trip.',
    },
  },
];
