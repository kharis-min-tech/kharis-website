export interface ServiceTime {
  name: string;
  time: string;
  ampm: string;
  description: string;
  isHighlighted?: boolean;
}

export interface MidweekService {
  name: string;
  day: string;
  time: string;
  ampm: string;
  description?: string;
}

export interface BranchEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  location: string;
  description: string;
  image: string;
}

export interface BranchData {
  slug: string;
  name: string;
  city: string;
  region: 'UK South' | 'UK Midlands' | 'UK North' | 'Scotland' | 'International';
  heroImage: string;
  tagline: string;
  description: string;
  address: string;
  fullAddress: string;
  postcode: string;
  phone: string;
  email: string;
  mapImage: string;
  mapCoordinates: { lat: number; lng: number };
  leadPastor: {
    name: string;
    title: string;
    image: string;
    quote: string;
  };
  serviceTimes: ServiceTime[];
  /** Midweek gathering shown on branch cards and service sections. */
  midweek?: MidweekService;
  upcomingEvents: BranchEvent[];
  parkingInfo: string;
  transitInfo: string;
  facilities: string[];
  /** Optional welcome message paragraphs from the branch pastor. */
  welcomeParagraphs?: string[];
  /** Optional gallery images for the "Life at Kharis" carousel. */
  galleryImages?: string[];
  /** Optional YouTube video id for the featured branch message. */
  videoId?: string;
}

export const DEFAULT_GALLERY_IMAGES = [
  '/images/branch-slide-1.jpg',
  '/images/branch-slide-2.jpg',
  '/images/branch-slide-3.jpg',
  '/images/branch-slide-4.jpg',
  '/images/branch-slide-5.jpg',
  '/images/worship.jpg',
  '/images/community.jpg',
  '/images/young-adults.jpg',
];

export const BRANCHES_DATA: Record<string, BranchData> = {
  london: {
    slug: 'london',
    name: 'London Branch',
    city: 'London',
    region: 'UK South',
    heroImage: '/images/branch-slide-1.jpg',
    tagline: 'Christians boldly holding their Bible.',
    description: 'A thriving, multicultural congregation serving London. Experience uplifting worship, relevant biblical message, and deep kingdom connections.',
    address: 'Holborn, London',
    fullAddress: 'Holborn Viaduct, London, EC1A 2FD, United Kingdom',
    postcode: 'EC1A 2FD',
    phone: '+44 (0) 20 7946 0199',
    email: 'london@kharischurch.org',
    mapImage: '/images/branch-slide-1.jpg',
    mapCoordinates: { lat: 51.5175, lng: -0.1062 },
    leadPastor: {
      name: 'Pastor David Antwi',
      title: 'Lead Pastors, London Branch',
      image: '/images/branch-slide-2.jpg',
      quote: 'London is a global crossroads. We exist to build a home of faith, hope, and love for every soul.',
    },
    serviceTimes: [
      { name: 'Morning Celebration', time: '10:00', ampm: 'AM', description: 'Vibrant praise and apostolic doctrine.' },
      { name: 'Afternoon Empowerment', time: '1:00', ampm: 'PM', description: 'Focused service tailored for young professionals.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Public transit highly recommended.',
    transitInfo: 'Close to major underground and rail stations.',
    facilities: ['Kharis NextGen Rooms', 'Live Stream Suite', 'Café Central'],
  },

  birmingham: {
    slug: 'birmingham',
    name: 'Birmingham Branch',
    city: 'Birmingham',
    region: 'UK Midlands',
    heroImage: '/images/branch-slide-3.jpg',
    tagline: 'Heart for the Midlands & generational growth',
    description: 'Welcome to Kharis Birmingham! A passionate, multi-generational family devoted to spiritual growth and service.',
    address: 'Digbeth High Street, Birmingham',
    fullAddress: 'Digbeth High Street, Birmingham, B5 6DY, United Kingdom',
    postcode: 'B5 6DY',
    phone: '+44 (0) 121 496 0341',
    email: 'birmingham@kharischurch.org',
    mapImage: '/images/branch-slide-2.jpg',
    mapCoordinates: { lat: 52.4751, lng: -1.8882 },
    leadPastor: {
      name: 'Pastor Samuel & Sarah Adeleke',
      title: 'Lead Pastors, Birmingham Branch',
      image: '/images/branch-slide-3.jpg',
      quote: 'Equipping families to shine as beacons of hope in every neighborhood.',
    },
    serviceTimes: [
      { name: 'Sunday Family Worship', time: '10:30', ampm: 'AM', description: 'Glorious praise and anointed word.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Free secure parking on-site.',
    transitInfo: '10 minute walk from Birmingham New Street Station.',
    facilities: ['Kharis Kids Studio', 'Onsite Parking'],
  },

  brighton: {
    slug: 'brighton',
    name: 'Brighton Branch',
    city: 'Brighton',
    region: 'UK South',
    heroImage: '/images/branch-slide-4.jpg',
    tagline: 'Dynamic worship & warm community on the south coast',
    description: 'Experience dynamic worship, life-changing teaching, and a welcoming community on the south coast.',
    address: 'Sussex Road, Brighton',
    fullAddress: 'Sussex Road, Brighton, BN1 1AA, United Kingdom',
    postcode: 'BN1 1AA',
    phone: '+44 (0) 1273 555 123',
    email: 'brighton@kharischurch.org',
    mapImage: '/images/branch-slide-5.jpg',
    mapCoordinates: { lat: 50.8225, lng: -0.1372 },
    leadPastor: {
      name: 'Pastor David & Grace Miller',
      title: 'Lead Pastors, Brighton Branch',
      image: '/images/branch-slide-1.jpg',
      quote: 'We cannot wait to welcome you home.',
    },
    serviceTimes: [
      { name: 'First Service', time: '9:00', ampm: 'AM', description: 'Dynamic worship & impactful Word.' },
      { name: 'Second Service', time: '11:30', ampm: 'AM', description: 'Full family service.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Free dedicated visitor parking available on-site.',
    transitInfo: '5 minute walk from Brighton Central Train Station.',
    facilities: ['Kharis Kids Zone', 'Wheelchair Accessible', 'Café'],
  },

  bristol: {
    slug: 'bristol',
    name: 'Bristol Branch',
    city: 'Bristol',
    region: 'UK South',
    heroImage: '/images/branch-slide-2.jpg',
    tagline: 'Faith and community in the West Country',
    description: 'A vibrant home for believers in Bristol seeking authentic fellowship and spiritual growth.',
    address: 'Stokes Croft, Bristol',
    fullAddress: 'Stokes Croft, Bristol, BS1 3QP, United Kingdom',
    postcode: 'BS1 3QP',
    phone: '+44 (0) 117 900 1122',
    email: 'bristol@kharischurch.org',
    mapImage: '/images/branch-slide-3.jpg',
    mapCoordinates: { lat: 51.4601, lng: -2.5891 },
    leadPastor: {
      name: 'Pastor Nathan & Ruth Cole',
      title: 'Lead Pastors, Bristol Branch',
      image: '/images/branch-slide-4.jpg',
      quote: 'Building a community anchored in grace and purpose.',
    },
    serviceTimes: [
      { name: 'Sunday Celebration', time: '10:30', ampm: 'AM', description: 'Praise, Word & fellowship.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Local street parking available.',
    transitInfo: 'Near central bus lines.',
    facilities: ['Kids Ministry', 'Welcome Area'],
  },

  chatham: {
    slug: 'chatham',
    name: 'Chatham Branch',
    city: 'Chatham',
    region: 'UK South',
    heroImage: '/images/branch-slide-5.jpg',
    tagline: 'Spreading light across Medway',
    description: 'Serving Chatham and the Medway towns with dynamic services and community programs.',
    address: 'High Street, Chatham',
    fullAddress: 'High Street, Chatham, ME4 4BZ, United Kingdom',
    postcode: 'ME4 4BZ',
    phone: '+44 (0) 1634 888 333',
    email: 'chatham@kharischurch.org',
    mapImage: '/images/branch-slide-1.jpg',
    mapCoordinates: { lat: 51.3855, lng: 0.5252 },
    leadPastor: {
      name: 'Pastor Mark & Tina Johnson',
      title: 'Lead Pastors, Chatham Branch',
      image: '/images/branch-slide-2.jpg',
      quote: 'A church family ready to welcome you with open arms.',
    },
    serviceTimes: [
      { name: 'Sunday Service', time: '10:30', ampm: 'AM', description: 'Worship and interactive word.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Nearby town center parking.',
    transitInfo: 'Short walk from Chatham Station.',
    facilities: ['Kids Church', 'Accessibility Access'],
  },

  chelmsford: {
    slug: 'chelmsford',
    name: 'Chelmsford Branch',
    city: 'Chelmsford',
    region: 'UK South',
    heroImage: '/images/branch-slide-3.jpg',
    tagline: 'Growing in faith in Essex',
    description: 'A welcoming community in Chelmsford focused on raising strong families and disciples.',
    address: 'Duke Street, Chelmsford',
    fullAddress: 'Duke Street, Chelmsford, CM1 1HX, United Kingdom',
    postcode: 'CM1 1HX',
    phone: '+44 (0) 1245 333 444',
    email: 'chelmsford@kharischurch.org',
    mapImage: '/images/branch-slide-4.jpg',
    mapCoordinates: { lat: 51.7356, lng: 0.4685 },
    leadPastor: {
      name: 'Pastor Peter & Sarah Hughes',
      title: 'Lead Pastors, Chelmsford Branch',
      image: '/images/branch-slide-5.jpg',
      quote: 'Experiencing God’s grace together in Essex.',
    },
    serviceTimes: [
      { name: 'Sunday Worship', time: '10:00', ampm: 'AM', description: 'Engaging service for all ages.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Station parking available.',
    transitInfo: 'Minutes from Chelmsford railway station.',
    facilities: ['Childrens Area', 'Refreshments'],
  },

  coventry: {
    slug: 'coventry',
    name: 'Coventry Branch',
    city: 'Coventry',
    region: 'UK Midlands',
    heroImage: '/images/branch-slide-1.jpg',
    tagline: 'Igniting faith in the West Midlands',
    description: 'Serving students and families in Coventry with passionate worship and biblical teaching.',
    address: 'Warwick Road, Coventry',
    fullAddress: 'Warwick Road, Coventry, CV1 2LE, United Kingdom',
    postcode: 'CV1 2LE',
    phone: '+44 (0) 2476 555 666',
    email: 'coventry@kharischurch.org',
    mapImage: '/images/branch-slide-2.jpg',
    mapCoordinates: { lat: 52.4068, lng: -1.5197 },
    leadPastor: {
      name: 'Pastor Daniel & Rachel Okafor',
      title: 'Lead Pastors, Coventry Branch',
      image: '/images/branch-slide-3.jpg',
      quote: 'A place of purpose and power.',
    },
    serviceTimes: [
      { name: 'Sunday Celebration', time: '10:30', ampm: 'AM', description: 'Worship and Word.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'On-site parking.',
    transitInfo: 'Close to Coventry station.',
    facilities: ['Student Hub', 'Kids Ministry'],
  },

  croydon: {
    slug: 'croydon',
    name: 'Croydon Branch',
    city: 'Croydon',
    region: 'UK South',
    heroImage: '/images/branch-slide-4.jpg',
    tagline: 'Family-centered grace and youth empowerment',
    description: 'A thriving community hub offering rich family ministry and youth empowerment programs.',
    address: 'Wellesley Road, Croydon',
    fullAddress: '15 Wellesley Road, Croydon, CR0 2AG, United Kingdom',
    postcode: 'CR0 2AG',
    phone: '+44 (0) 20 8688 4422',
    email: 'croydon@kharischurch.org',
    mapImage: '/images/branch-slide-5.jpg',
    mapCoordinates: { lat: 51.3762, lng: -0.0982 },
    leadPastor: {
      name: 'Pastor Joshua & Brenda Mensah',
      title: 'Lead Pastors, Croydon Branch',
      image: '/images/branch-slide-1.jpg',
      quote: 'Serving our local schools, youth, and families every week.',
    },
    serviceTimes: [
      { name: 'First Service', time: '8:30', ampm: 'AM', description: 'Early morning worship.' },
      { name: 'Main Service', time: '11:00', ampm: 'AM', description: 'Contemporary praise.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Parking available behind Whitgift Center.',
    transitInfo: 'Walk from East Croydon Station.',
    facilities: ['Kids Palace', 'Youth Gym', 'Free WiFi'],
  },

  luton: {
    slug: 'luton',
    name: 'Luton Branch',
    city: 'Luton',
    region: 'UK South',
    heroImage: '/images/branch-slide-2.jpg',
    tagline: 'Dynamic fellowship in Bedfordshire',
    description: 'A passionate community bringing the message of grace and transformation to Luton.',
    address: 'George Street, Luton',
    fullAddress: 'George Street, Luton, LU1 2AT, United Kingdom',
    postcode: 'LU1 2AT',
    phone: '+44 (0) 1582 777 888',
    email: 'luton@kharischurch.org',
    mapImage: '/images/branch-slide-3.jpg',
    mapCoordinates: { lat: 51.8787, lng: -0.4150 },
    leadPastor: {
      name: 'Pastor Ben & Joy Akpan',
      title: 'Lead Pastors, Luton Branch',
      image: '/images/branch-slide-4.jpg',
      quote: 'Experiencing breakthrough and community together.',
    },
    serviceTimes: [
      { name: 'Sunday Celebration', time: '10:30', ampm: 'AM', description: 'Worship and Word.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Town center car parks nearby.',
    transitInfo: 'Close to Luton railway station.',
    facilities: ['Kids Church', 'Café'],
  },

  northampton: {
    slug: 'northampton',
    name: 'Northampton Branch',
    city: 'Northampton',
    region: 'UK Midlands',
    heroImage: '/images/branch-slide-5.jpg',
    tagline: 'Anchored in Christ, active in community',
    description: 'Serving Northampton with life-giving word and warm fellowship.',
    address: 'Abington Street, Northampton',
    fullAddress: 'Abington Street, Northampton, NN1 2BH, United Kingdom',
    postcode: 'NN1 2BH',
    phone: '+44 (0) 1604 444 555',
    email: 'northampton@kharischurch.org',
    mapImage: '/images/branch-slide-1.jpg',
    mapCoordinates: { lat: 52.2405, lng: -0.8900 },
    leadPastor: {
      name: 'Pastor Chris & Linda Vance',
      title: 'Lead Pastors, Northampton Branch',
      image: '/images/branch-slide-2.jpg',
      quote: 'A church where everyone is valued and empowered.',
    },
    serviceTimes: [
      { name: 'Sunday Service', time: '10:00', ampm: 'AM', description: 'Family worship.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Parking garages nearby.',
    transitInfo: 'Central bus station access.',
    facilities: ['Kids Zone', 'Accessibility'],
  },

  nottingham: {
    slug: 'nottingham',
    name: 'Nottingham Branch',
    city: 'Nottingham',
    region: 'UK Midlands',
    heroImage: '/images/branch-slide-3.jpg',
    tagline: 'Passionate worship in the East Midlands',
    description: 'A thriving spiritual home for students and families across Nottingham.',
    address: 'Hockley, Nottingham',
    fullAddress: 'Hockley, Nottingham, NG1 1FP, United Kingdom',
    postcode: 'NG1 1FP',
    phone: '+44 (0) 115 999 0000',
    email: 'nottingham@kharischurch.org',
    mapImage: '/images/branch-slide-4.jpg',
    mapCoordinates: { lat: 52.9548, lng: -1.1481 },
    leadPastor: {
      name: 'Pastor George & Miriam Smith',
      title: 'Lead Pastors, Nottingham Branch',
      image: '/images/branch-slide-5.jpg',
      quote: 'Bringing light and love to Nottingham.',
    },
    serviceTimes: [
      { name: 'Sunday Celebration', time: '10:30', ampm: 'AM', description: 'Contemporary worship.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Tram parking and city lots available.',
    transitInfo: 'Nottingham Express Transit (NET) nearby.',
    facilities: ['Student Ministry', 'Kids Church'],
  },

  orpington: {
    slug: 'orpington',
    name: 'Orpington Branch',
    city: 'Orpington',
    region: 'UK South',
    heroImage: '/images/branch-slide-1.jpg',
    tagline: 'Grace in the heart of Orpington',
    description: 'A welcoming fellowship centered on community, prayer, and spiritual growth.',
    address: 'High Street, Orpington',
    fullAddress: 'High Street, Orpington, BR6 0PG, United Kingdom',
    postcode: 'BR6 0PG',
    phone: '+44 (0) 1689 222 333',
    email: 'orpington@kharischurch.org',
    mapImage: '/images/branch-slide-2.jpg',
    mapCoordinates: { lat: 51.3734, lng: 0.0963 },
    leadPastor: {
      name: 'Pastor Martin & Claire Evans',
      title: 'Lead Pastors, Orpington Branch',
      image: '/images/branch-slide-3.jpg',
      quote: 'Growing together in faith and love.',
    },
    serviceTimes: [
      { name: 'Sunday Service', time: '10:00', ampm: 'AM', description: 'Worship and kids ministry.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'On-site spaces available.',
    transitInfo: 'Close to Orpington station.',
    facilities: ['Kids Ministry', 'Refreshment Lounge'],
  },

  reading: {
    slug: 'reading',
    name: 'Reading Branch',
    city: 'Reading',
    region: 'UK South',
    heroImage: '/images/branch-slide-4.jpg',
    tagline: 'Dynamic worship in Berkshire',
    description: 'Serving Reading and the Thames Valley with energetic worship and clear biblical teaching.',
    address: 'Friar Street, Reading',
    fullAddress: 'Friar Street, Reading, RG1 1DP, United Kingdom',
    postcode: 'RG1 1DP',
    phone: '+44 (0) 118 555 7788',
    email: 'reading@kharischurch.org',
    mapImage: '/images/branch-slide-5.jpg',
    mapCoordinates: { lat: 51.4556, lng: -0.9754 },
    leadPastor: {
      name: 'Pastor Kelvin & Sandra Aboagye',
      title: 'Lead Pastors, Reading Branch',
      image: '/images/branch-slide-1.jpg',
      quote: 'A vibrant family experience for everyone.',
    },
    serviceTimes: [
      { name: 'Sunday Worship', time: '10:30', ampm: 'AM', description: 'Praise and Word.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Reading town center parking.',
    transitInfo: 'Minutes from Reading Station.',
    facilities: ['NextGen Rooms', 'Café'],
  },

  accra: {
    slug: 'accra',
    name: 'Accra Branch',
    city: 'Accra',
    region: 'International',
    heroImage: '/images/branch-slide-2.jpg',
    tagline: 'Kharis International, West Africa hub',
    description: 'A powerhouse of prayer, dynamic praise, and community transformation in the heart of Accra.',
    address: 'Liberia Road, Accra',
    fullAddress: 'Liberia Road, Ridge, Accra, Ghana',
    postcode: 'GA-000',
    phone: '+233 (0) 30 222 4455',
    email: 'accra@kharischurch.org',
    mapImage: '/images/branch-slide-3.jpg',
    mapCoordinates: { lat: 5.5560, lng: -0.1969 },
    leadPastor: {
      name: 'Pastor Kofi & Akosua Mensah',
      title: 'Lead Pastors, Accra Branch',
      image: '/images/branch-slide-4.jpg',
      quote: 'Igniting revival and raising kingdom ambassadors across West Africa.',
    },
    serviceTimes: [
      { name: 'First Morning Glory', time: '8:00', ampm: 'AM', description: 'High-energy praise and prayer.' },
      { name: 'Second Celebration', time: '10:30', ampm: 'AM', description: 'Prophetic word and fellowship.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'Ample secure compound parking on-site.',
    transitInfo: 'Easily accessible via Ridge commercial district routes.',
    facilities: ['Kharis Kids Chapel', 'Prayer Mountain Suite', 'Media Broadcasting Center'],
  },

  freetown: {
    slug: 'freetown',
    name: 'Freetown Branch',
    city: 'Freetown',
    region: 'International',
    heroImage: '/images/branch-slide-5.jpg',
    tagline: 'Kharis International, Sierra Leone',
    description: 'Bringing hope, healing, and vibrant gospel community to Freetown.',
    address: 'Siaka Stevens Street, Freetown',
    fullAddress: 'Siaka Stevens Street, Freetown, Sierra Leone',
    postcode: 'FSU-001',
    phone: '+232 (0) 76 111 222',
    email: 'freetown@kharischurch.org',
    mapImage: '/images/branch-slide-1.jpg',
    mapCoordinates: { lat: 8.4840, lng: -13.2344 },
    leadPastor: {
      name: 'Pastor Fred & Laura Sesay',
      title: 'Lead Pastors, Freetown Branch',
      image: '/images/branch-slide-2.jpg',
      quote: 'A beacon of God’s grace and unending love in Freetown.',
    },
    serviceTimes: [
      { name: 'Sunday Worship Experience', time: '10:00', ampm: 'AM', description: 'Praise, breakthrough prayer, and Word.', isHighlighted: true },
    ],
    midweek: { name: 'Midweek Word & Prayer', day: 'Thursday', time: '7:00', ampm: 'PM', description: 'Teaching, prayer and encouragement midweek.' },
    upcomingEvents: [],
    parkingInfo: 'On-site dedicated parking.',
    transitInfo: 'Located centrally on Siaka Stevens Street.',
    facilities: ['Childrens Church', 'Community Hall'],
  },
};