import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Phone,
  MessageSquare,
  Building,
  Navigation,
  Compass,
  Layers,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface CommitteeMember {
  id: string;
  name: string;
  malayalamName: string;
  role: string;
  place: string;
  portfolio: string;
  phone: string;
  whatsapp: string;
  term: string;
}

interface Landmark {
  id: string;
  name: string;
  malayalamName: string;
  category: 'masjid' | 'place' | 'mahall';
  typeLabel: string;
  description: string;
  locationDetails: string;
  x: number; // percentage in custom map 0-100
  y: number; // percentage in custom map 0-100
  highlight?: boolean;
  distanceFromCenter?: string;
  capacity?: string;
  established?: string;
}

export const AboutSection: React.FC = () => {
  // 6 Committee Members of Manoor Edappal Mahallu - Name and Place only (no photos)
  const committeeMembers: CommitteeMember[] = [
    {
      id: 'member-1',
      name: 'Al-Hajj V.P. Kunjumohammed Haji',
      malayalamName: 'വി.പി. കുഞ്ഞുമുഹമ്മദ് ഹാജി',
      role: 'President',
      place: 'Manoor Center, Edappal',
      portfolio: 'Executive Administration & Waqf Oversight',
      phone: '+91 98471 23450',
      whatsapp: '919847123450',
      term: '2023 - 2026',
    },
    {
      id: 'member-2',
      name: 'Usthad Abdul Rasheed Faizy',
      malayalamName: 'അബ്ദുൾ റഷീദ് ഫൈസി',
      role: 'Chief Imam & Qazi',
      place: 'Juma Masjid Qrts, Manoor',
      portfolio: 'Spiritual Leadership, Nikah & Fiqh Council',
      phone: '+91 94472 88901',
      whatsapp: '919447288901',
      term: 'Chief Qazi',
    },
    {
      id: 'member-3',
      name: 'K.V. Musthafa Master',
      malayalamName: 'കെ.വി. മുസ്തഫ മാസ്റ്റർ',
      role: 'General Secretary',
      place: 'Vadakkumuri, Manoor',
      portfolio: 'Mahallu Operations & Government Liaison',
      phone: '+91 97455 67890',
      whatsapp: '919745567890',
      term: '2023 - 2026',
    },
    {
      id: 'member-4',
      name: 'P.A. Basheer Haji',
      malayalamName: 'പി.എ. ബഷീർ ഹാജി',
      role: 'Treasurer',
      place: 'Kizhakkumuri, Manoor',
      portfolio: 'Finance, Baitul Mal & Zakat Fund Management',
      phone: '+91 94960 11223',
      whatsapp: '919496011223',
      term: '2023 - 2026',
    },
    {
      id: 'member-5',
      name: 'C.H. Hamzakkutty Master',
      malayalamName: 'സി.എച്ച്. ഹംസക്കുട്ടി മാസ്റ്റർ',
      role: 'Vice President',
      place: 'Thekkumuri, Manoor',
      portfolio: 'Darul Uloom Madrasa & Youth Education',
      phone: '+91 98462 33445',
      whatsapp: '919846233445',
      term: '2023 - 2026',
    },
    {
      id: 'member-6',
      name: 'M.V. Ashraf',
      malayalamName: 'എം.വി. അഷ്റഫ്',
      role: 'Joint Secretary',
      place: 'Padinjattumuri, Manoor',
      portfolio: 'Welfare Relief, Healthcare & Family Care',
      phone: '+91 97471 55667',
      whatsapp: '919747155667',
      term: '2023 - 2026',
    },
  ];

  // Landmarks, Masjids, Wards, and Neighboring Mahalls of Manoor Edappal
  const landmarks: Landmark[] = [
    // Central Manoor Mahallu Landmarks
    {
      id: 'lm-1',
      name: 'Manoor Central Juma Masjid & Qabarstan',
      malayalamName: 'മാനൂർ സെൻട്രൽ ജുമാ മസ്ജിദ് & ഖബർസ്ഥാൻ',
      category: 'masjid',
      typeLabel: 'Principal Juma Masjid',
      description: 'The historic central Friday congregation mosque of Manoor Mahallu with main prayer hall, ablution ponds, and official cemetery.',
      locationDetails: 'Manoor Center, Edappal Road',
      x: 50,
      y: 48,
      highlight: true,
      distanceFromCenter: 'Mahallu Center',
      capacity: '1,200 Musallees',
      established: 'Est. 1954',
    },
    {
      id: 'lm-2',
      name: 'Darul Uloom Madrasa Complex',
      malayalamName: 'ദാറുൽ ഉലൂം മദ്രസ കോംപ്ലക്സ്',
      category: 'place',
      typeLabel: 'Primary & Secondary Madrasa',
      description: 'Central Islamic education institution with 180+ enrolled students, smart classrooms, and Hifz academy.',
      locationDetails: 'Adjacent to Central Juma Masjid',
      x: 54,
      y: 45,
      highlight: true,
      distanceFromCenter: '50m from Central Masjid',
      capacity: '200+ Students',
      established: 'Est. 1972',
    },
    {
      id: 'lm-3',
      name: 'Manoor Thazhe Palli (Town Masjid)',
      malayalamName: 'മാനൂർ താഴെ പള്ളി',
      category: 'masjid',
      typeLabel: 'Daily Congregational Masjid',
      description: 'Convenient road-side prayer facility serving travelers and commuters for daily 5 waqt prayers and Ramzan taraweeh.',
      locationDetails: 'Manoor South Junction, Edappal Road',
      x: 48,
      y: 64,
      distanceFromCenter: '600m South',
      capacity: '250 Musallees',
    },
    {
      id: 'lm-4',
      name: 'Masjid Bilal (East Ward Musalla)',
      malayalamName: 'മസ്ജിദ് ബിലാൽ (കിഴക്കുമുറി)',
      category: 'masjid',
      typeLabel: 'Ward Musalla',
      description: 'Neighborhood congregation center providing five-time prayers and evening Quran tajweed coaching for children.',
      locationDetails: 'Kizhakkumuri Road, Ward 4',
      x: 68,
      y: 42,
      distanceFromCenter: '950m East',
      capacity: '180 Musallees',
    },
    {
      id: 'lm-5',
      name: 'Masjidul Taqwa (Thekkumuri South)',
      malayalamName: 'മസ്ജിദുൽ തഖ്‌വ (തെക്കുമുറി)',
      category: 'masjid',
      typeLabel: 'Ward Musalla',
      description: 'Sub-masjid catering to southern agrarian residences with daily prayers and weekly ladies study circle.',
      locationDetails: 'Thekkumuri Canal Road, Ward 2',
      x: 42,
      y: 72,
      distanceFromCenter: '1.2 km South',
      capacity: '150 Musallees',
    },
    {
      id: 'lm-6',
      name: 'Badr Juma Masjid (Vadakkumuri Border)',
      malayalamName: 'ബദർ ജുമാ മസ്ജിദ് (വടക്കുമുറി)',
      category: 'masjid',
      typeLabel: 'Branch Juma Masjid',
      description: 'Northern sector Juma masjid serving northern families and border quarters of Manoor.',
      locationDetails: 'Vadakkumuri Hill Top, Ward 1',
      x: 52,
      y: 24,
      distanceFromCenter: '1.1 km North',
      capacity: '400 Musallees',
    },
    // Wards & Places in Manoor
    {
      id: 'lm-7',
      name: 'Manoor Town Junction',
      malayalamName: 'മാനൂർ അങ്ങാടി / ജംഗ്ഷൻ',
      category: 'place',
      typeLabel: 'Commercial Hub',
      description: 'Core junction connecting Edappal-Kuttippuram corridor with local shops, bakery, and auto stand.',
      locationDetails: 'Main Junction',
      x: 46,
      y: 50,
      distanceFromCenter: 'Core Center',
    },
    {
      id: 'lm-8',
      name: 'Vadakkumuri Ward (Ward 1)',
      malayalamName: 'വടക്കുമുറി വാർഡ്',
      category: 'place',
      typeLabel: 'Mahallu Ward 1',
      description: 'Residential zone with 28 registered families, community library, and youth sports ground.',
      locationDetails: 'Northern Sector',
      x: 46,
      y: 20,
      distanceFromCenter: '1.0 km North',
    },
    {
      id: 'lm-9',
      name: 'Padinjattumuri Ward (Ward 3)',
      malayalamName: 'പടിഞ്ഞാറ്റുമുറി വാർഡ്',
      category: 'place',
      typeLabel: 'Mahallu Ward 3',
      description: 'Western residential cluster connecting towards Edappal Town bypass corridor.',
      locationDetails: 'Western Sector',
      x: 32,
      y: 46,
      distanceFromCenter: '800m West',
    },
    {
      id: 'lm-10',
      name: 'Kizhakkumuri Ward (Ward 4)',
      malayalamName: 'കിഴക്കുമുറി വാർഡ്',
      category: 'place',
      typeLabel: 'Mahallu Ward 4',
      description: 'Eastern elevated agricultural & residential sector comprising 24 families.',
      locationDetails: 'Eastern Sector',
      x: 74,
      y: 48,
      distanceFromCenter: '1.2 km East',
    },
    {
      id: 'lm-11',
      name: 'Thekkumuri Ward (Ward 2)',
      malayalamName: 'തെക്കുമുറി വാർഡ്',
      category: 'place',
      typeLabel: 'Mahallu Ward 2',
      description: 'Southern agricultural sector with heritage family homes and community water supply.',
      locationDetails: 'Southern Sector',
      x: 40,
      y: 78,
      distanceFromCenter: '1.4 km South',
    },
    // Surrounding Mahalls
    {
      id: 'lm-12',
      name: 'Edappal Town Mahallu',
      malayalamName: 'എടപ്പാൾ ടൗൺ മഹല്ല്',
      category: 'mahall',
      typeLabel: 'Neighboring Mahallu',
      description: 'Main commercial and administrative town center of Edappal block.',
      locationDetails: 'North-West Border (SH-69)',
      x: 20,
      y: 28,
      distanceFromCenter: '2.4 km North-West',
    },
    {
      id: 'lm-13',
      name: 'Kololamba Mahallu',
      malayalamName: 'കോളൊളമ്പ് മഹല്ല്',
      category: 'mahall',
      typeLabel: 'Neighboring Mahallu',
      description: 'Historic adjoining community to the north of Manoor boundary.',
      locationDetails: 'North Border',
      x: 58,
      y: 12,
      distanceFromCenter: '3.1 km North',
    },
    {
      id: 'lm-14',
      name: 'Vattamkulam Mahallu',
      malayalamName: 'വട്ടംകുളം മഹല്ല്',
      category: 'mahall',
      typeLabel: 'Neighboring Mahallu',
      description: 'Major neighboring panchayat center and sister Mahallu community.',
      locationDetails: 'East Border',
      x: 88,
      y: 46,
      distanceFromCenter: '3.8 km East',
    },
    {
      id: 'lm-15',
      name: 'Thuyyam Mahallu',
      malayalamName: 'തുയ്യ്യം മഹല്ല്',
      category: 'mahall',
      typeLabel: 'Neighboring Mahallu',
      description: 'South-western neighboring Mahallu community along the Ponnani link road.',
      locationDetails: 'South-West Border',
      x: 24,
      y: 76,
      distanceFromCenter: '2.8 km South-West',
    },
    {
      id: 'lm-16',
      name: 'Naduvattam Mahallu',
      malayalamName: 'നടുവട്ടം മഹല്ല്',
      category: 'mahall',
      typeLabel: 'Neighboring Mahallu',
      description: 'South-eastern neighboring rural Mahallu sector.',
      locationDetails: 'South-East Border',
      x: 76,
      y: 82,
      distanceFromCenter: '3.5 km South-East',
    },
  ];

  const [activeCategory, setActiveCategory] = useState<'all' | 'masjid' | 'place' | 'mahall'>('all');
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(landmarks[0]);
  const [mapMode, setMapMode] = useState<'cartographic' | 'satellite'>('cartographic');

  const filteredLandmarks = landmarks.filter((lm) => {
    if (activeCategory === 'all') return true;
    return lm.category === activeCategory;
  });

  return (
    <section id="about-section" className="py-20 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>About Manoor Edappal Mahallu</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Rooted in Faith, Unified in Community Service
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Located in Edappal, Malappuram district, Manoor Mahallu serves 140+ registered families across 6 administrative wards. Under the auspices of the Mahallu Working Committee, we oversee daily spiritual affairs, Darul Uloom Madrasa education, healthcare relief, and community welfare.
          </p>
        </div>

        {/* 1. COMMITTEE MEMBERS: 6 Round Columns with Photo, Names, and Contacts */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Mahallu Working Committee
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Elected administrative and spiritual officers of Manoor Edappal Mahallu (Term 2023 - 2026)
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-2xs">
                6 Office Bearers
              </span>
            </div>
          </div>

          {/* 6 Committee Members Grid - Name and Place only (no photos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
            {committeeMembers.map((member) => (
              <div
                key={member.id}
                id={`committee-${member.id}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between text-center group relative overflow-hidden"
              >
                {/* Top subtle highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-amber-500 opacity-80" />

                <div>
                  {/* Role Pill */}
                  <div className="mb-3">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {member.role}
                    </span>
                  </div>

                  {/* Name */}
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h4>

                  <span className="text-xs font-medium text-slate-400 mt-0.5 block">
                    {member.malayalamName}
                  </span>

                  {/* Place with MapPin badge */}
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-200 transition-colors text-slate-700 hover:text-amber-900 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{member.place}</span>
                  </div>

                  {/* Portfolio */}
                  <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed line-clamp-2">
                    {member.portfolio}
                  </p>
                </div>

                {/* Contact Controls */}
                <div className="w-full pt-3 mt-4 border-t border-slate-100 space-y-1.5">
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, '')}`}
                    className="w-full py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-100"
                    title={`Call ${member.name}`}
                  >
                    <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">{member.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${member.whatsapp}?text=Salam%20${encodeURIComponent(member.name)},%20regarding%20Manoor%20Mahallu...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2 rounded-lg text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. GEOGRAPHICAL MAP: Places, Masjids, and Mahalls of Manoor Edappal */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Geographical Map of Manoor Edappal Mahallu
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Interactive cartography featuring 6 Masjids, 6 Administrative Wards, Key Landmarks & 5 Adjoining Mahalls
              </p>
            </div>

            {/* Category Filter & View Mode Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    activeCategory === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({landmarks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('masjid')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    activeCategory === 'masjid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-3 h-3" />
                  <span>Masjids (6)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('place')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    activeCategory === 'place'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>Wards & Places</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('mahall')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    activeCategory === 'mahall'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Neighboring Mahalls</span>
                </button>
              </div>

              {/* Toggle Vector vs Live OpenStreetMap */}
              <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMapMode('cartographic')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    mapMode === 'cartographic' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Cartographic Plan
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('satellite')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    mapMode === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Satellite / Street Map
                </button>
              </div>
            </div>
          </div>

          {/* Map Layout Canvas & Inspector Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Map Canvas (2 Cols) */}
            <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-4 sm:p-6 text-white">
              
              {mapMode === 'cartographic' ? (
                <>
                  {/* Cartographic Visual Background */}
                  <div className="absolute inset-0 bg-[#0B1325] opacity-95">
                    {/* Stylized Contour Grid */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `radial-gradient(#3B82F6 1px, transparent 1px), linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)`,
                        backgroundSize: '40px 40px, 80px 80px, 80px 80px',
                      }}
                    />

                    {/* Stylized Mahallu Boundary Polygon */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Manoor Mahallu Territorial Boundary */}
                      <polygon
                        points="280,110 460,90 620,170 660,340 540,430 310,410 210,320 220,180"
                        fill="rgba(37, 99, 235, 0.08)"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      />
                      {/* Main Arterial Road (Edappal - Kuttippuram / Manoor Corridor) */}
                      <path
                        d="M 50,180 Q 240,240 470,250 T 800,260"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 50,180 Q 240,240 470,250 T 800,260"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                        strokeDasharray="8 6"
                      />

                      {/* North-South Ward Connector Road */}
                      <path
                        d="M 470,80 Q 480,240 430,480"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Canal / Water stream */}
                      <path
                        d="M 120,440 C 260,400 420,430 720,470"
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="2.5"
                        strokeOpacity="0.4"
                      />
                    </svg>
                  </div>

                  {/* Header overlay */}
                  <div className="relative z-10 flex items-center justify-between bg-slate-950/70 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold tracking-wide text-slate-200">
                        MANOOR EDAPPAL MAHALLU CARTOGRAPHY
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      10.7634° N, 75.9868° E • Edappal
                    </div>
                  </div>

                  {/* Interactive Map Pins */}
                  <div className="relative z-10 flex-1 my-4 min-h-[360px] relative">
                    {filteredLandmarks.map((lm) => {
                      const isSelected = selectedLandmark?.id === lm.id;
                      const isMasjid = lm.category === 'masjid';
                      const isMahall = lm.category === 'mahall';

                      return (
                        <div
                          key={lm.id}
                          onClick={() => setSelectedLandmark(lm)}
                          style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group select-none ${
                            isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-20'
                          }`}
                        >
                          {/* Pulse aura for Central Masjid */}
                          {lm.highlight && (
                            <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping" />
                          )}

                          {/* Marker badge */}
                          <div
                            className={`p-2 rounded-2xl shadow-lg border flex items-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black ring-4 ring-amber-400/30'
                                : isMasjid
                                ? 'bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-500'
                                : isMahall
                                ? 'bg-purple-700 text-white border-purple-400 hover:bg-purple-600'
                                : 'bg-blue-600 text-white border-blue-400 hover:bg-blue-500'
                            }`}
                          >
                            {isMasjid ? (
                              <Building className="w-3.5 h-3.5 shrink-0" />
                            ) : isMahall ? (
                              <Layers className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="text-[10px] font-bold whitespace-nowrap hidden sm:inline-block max-w-[120px] truncate">
                              {lm.name.replace('Manoor ', '')}
                            </span>
                          </div>

                          {/* Micro Tooltip */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded-lg border border-slate-700 shadow-xl pointer-events-none whitespace-nowrap z-40">
                            {lm.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Map Footer Legend */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        <span>Masjids & Musallas</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                        <span>Mahallu Wards / Places</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                        <span>Neighboring Mahalls</span>
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      Click any pin to inspect jurisdiction details
                    </span>
                  </div>
                </>
              ) : (
                /* Live Interactive OpenStreetMap View centered on Edappal / Manoor */
                <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden">
                  <iframe
                    title="Manoor Edappal Mahallu OpenStreetMap"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '460px' }}
                    loading="lazy"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=75.9600%2C10.7450%2C76.0100%2C10.7850&amp;layer=mapnik&amp;marker=10.7634%2C75.9868"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md border border-slate-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Manoor, Edappal, Malappuram (PIN: 679576)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Landmark Details Inspector (1 Col) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
              {selectedLandmark ? (
                <>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        selectedLandmark.category === 'masjid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : selectedLandmark.category === 'mahall'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {selectedLandmark.typeLabel}
                      </span>
                      <h4 className="font-display font-bold text-lg text-slate-900 mt-2">
                        {selectedLandmark.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedLandmark.malayalamName}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      {selectedLandmark.category === 'masjid' ? (
                        <Building className="w-5 h-5 text-emerald-600" />
                      ) : selectedLandmark.category === 'mahall' ? (
                        <Layers className="w-5 h-5 text-purple-600" />
                      ) : (
                        <MapPin className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedLandmark.description}
                  </p>

                  {/* Metadata Specs */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500 font-medium">Location / Route:</span>
                      <span className="font-semibold text-right">{selectedLandmark.locationDetails}</span>
                    </div>

                    {selectedLandmark.distanceFromCenter && (
                      <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">Distance from Center:</span>
                        <span className="font-mono font-bold text-blue-700">{selectedLandmark.distanceFromCenter}</span>
                      </div>
                    )}

                    {selectedLandmark.capacity && (
                      <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">Congregation Capacity:</span>
                        <span className="font-semibold text-slate-900">{selectedLandmark.capacity}</span>
                      </div>
                    )}

                    {selectedLandmark.established && (
                      <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">History:</span>
                        <span className="font-semibold text-slate-900">{selectedLandmark.established}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLandmark.name + ' Edappal Malappuram Kerala')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Directions via Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="text-[11px] text-slate-400 text-center">
                      Part of Manoor Mahallu Geographic Registry
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Select any landmark from the map above to view location details.
                </div>
              )}

              {/* Mahallu Quick Facts Box */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Manoor Edappal Mahallu Facts
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="text-[10px] text-slate-500 block">Total Area</span>
                    <span className="font-bold text-slate-900">4.2 sq. km</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block">Registered Families</span>
                    <span className="font-bold text-slate-900">142 Families</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                    <span className="text-[10px] text-slate-500 block">Wards</span>
                    <span className="font-bold text-slate-900">6 Zones</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[10px] text-slate-500 block">PIN Code</span>
                    <span className="font-bold text-slate-900 font-mono">679576</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
