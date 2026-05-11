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

    seasonTips: {
      june:
        "Ottawa in June is spectacular — the world-famous Canadian Tulip Festival may still be winding down, Parliament tours are fully running, and Gatineau Park trails are lush and green. Warm days and cool evenings.",
      'late-august':
        'Hot and busy. ByWard Market is at its most vibrant. Rideau Canal pathway is stunning at sunset. Book hotels 2+ months ahead — Ottawa is a busy summer destination.',
      'early-september':
        "Early fall colours begin in Gatineau Park — the maples turn gold and red starting in the hills. Crowds thin dramatically after Labour Day. Cooler temps make hiking far more comfortable for dogs and kids alike. Ottawa's best-kept seasonal secret.",
    },
  },
];
