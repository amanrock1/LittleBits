// LocalStorage Mock Database for LittleBits Chapters Website
const SIMULATED_USERS = [
  {
    name: "Shoubhik",
    email: "shoubhik@campus.edu",
    role: "admin",
    adminForClubId: null, // Super Admin
    streak: 20,
    badges: [{ id: "badge-god", name: "Director", icon: "🛡️", desc: "Global systems coordinator.", unlockedAt: "2025-01-01" }],
    certificates: [],
    registrations: [],
    joinedClubs: []
  },
  {
    name: "Aman",
    email: "aman@campus.edu",
    role: "admin",
    adminForClubId: "club-1", // Apex Coders Admin
    streak: 12,
    badges: [{ id: "badge-admin", name: "Chapter Leader", icon: "👑", desc: "Appointed as club admin.", unlockedAt: "2026-01-01" }],
    certificates: [],
    registrations: [],
    joinedClubs: ["club-1"]
  },
  {
    name: "Doei",
    email: "doei@campus.edu",
    role: "student",
    streak: 5,
    badges: [
      { id: "badge-1", name: "Community Starter", icon: "🌱", desc: "Joined your first club.", unlockedAt: "2026-06-01" },
      { id: "badge-2", name: "Steady Hacker", icon: "🔥", desc: "Maintained a 5-day activity streak.", unlockedAt: "2026-06-20" }
    ],
    certificates: [
      { id: "cert-1", eventTitle: "AI Dev BootCamp 2025", clubName: "Apex Coders", date: "2025-10-15", code: "CERT-APX-88219" }
    ],
    registrations: [
      { eventId: "event-2", regId: "REG-6617-N", qrCode: "REG-6617-N-OCTAVE", date: "2026-06-18" }
    ],
    joinedClubs: ["club-1", "club-2"]
  }
];

const DEFAULT_CLUBS = [
  {
    id: "club-1",
    name: "Apex Coders",
    category: "Coding",
    logo: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Building next-generation applications, hackathons, and algorithm mastery.",
    description: "Apex Coders is the premier coding community on campus. We focus on fullstack web development, algorithmic challenges, building real-world open-source software, and participating in national hackathons.",
    memberCount: 242,
    featured: true,
    adminUsername: "Aman",
    achievements: [
      { date: "May 2026", title: "National Hackathon Winners", desc: "Won 1st prize at Inter-University CodeFest." }
    ],
    activities: [
      { title: "Weekly Coding Sprints", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop", description: "Focused coworking and problem-solving session." }
    ],
    members: [{ name: "Aman", role: "President / Lead Developer", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Aman" }]
  },
  {
    id: "club-2",
    name: "Octave Beats",
    category: "Music",
    logo: "https://cdn-icons-png.flaticon.com/512/3844/3844724.png",
    banner: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "A collaborative safe haven for musicians, vocalists, and sound designers.",
    description: "From jazz ensembles to electronic synthesizers, Octave Beats brings together music creators and lovers across campus. We host acoustic nights, open mics, and music theory workshops.",
    memberCount: 184,
    featured: true,
    adminUsername: "Shoubhik",
    achievements: [
      { date: "Apr 2026", title: "Spring Festival Headliners", desc: "Composed and performed the official theme music for the Spring Fest." }
    ],
    activities: [
      { title: "Acoustic Jam Sessions", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop", description: "Unplugged jam sessions under the courtyard trees." }
    ],
    members: [{ name: "Shoubhik", role: "Director / Pianist", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shoubhik" }]
  },
  {
    id: "club-3",
    name: "Vanguard Robotics",
    category: "Robotics",
    logo: "https://cdn-icons-png.flaticon.com/512/2040/2040523.png",
    banner: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Designing autonomous machines, IoT systems, and smart campus hardware.",
    description: "Vanguard Robotics is a hands-on club building quadcopters, combat robots, and IoT microcontrollers. We bridge the gap between computer science, electrical, and mechanical engineering.",
    memberCount: 145,
    featured: true,
    adminUsername: "Shoubhik",
    achievements: [
      { date: "Jun 2026", title: "RoboCup Semi-Finalists", desc: "Placed top 4 in the autonomous soccer bot league." }
    ],
    activities: [
      { title: "Soldering & Microcontrollers", image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop", description: "Intro to ESP32 and sensor integration workshops." }
    ],
    members: [{ name: "Shoubhik", role: "Hardware Lead", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shoubhik" }]
  },
  {
    id: "club-4",
    name: "Shutter Guild",
    category: "Photography",
    logo: "https://cdn-icons-png.flaticon.com/512/685/685655.png",
    banner: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Exploring visual stories, photojournalism, and post-processing aesthetics.",
    description: "Shutter Guild is for everyone from phone-camera enthusiasts to professional DSLR shooters.",
    memberCount: 98,
    featured: true,
    adminUsername: "Shoubhik",
    achievements: [{ date: "Mar 2026", title: "Campus Exhibition", desc: "Hosted 'Faces of Campus' gallery." }],
    activities: [],
    members: []
  },
  {
    id: "club-5",
    name: "Titan Athletics",
    category: "Sports",
    logo: "https://cdn-icons-png.flaticon.com/512/889/889617.png",
    banner: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Uniting campus athletes in soccer tournaments, fitness routines, and e-sports.",
    description: "Titan Athletics promotes physical fitness, teamwork, and healthy campus sports rivalries.",
    memberCount: 310,
    featured: true,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  },
  {
    id: "club-6",
    name: "LaunchPad VC",
    category: "Entrepreneurship",
    logo: "https://cdn-icons-png.flaticon.com/512/1356/1356479.png",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
    shortDescription: "Nurturing startup founders, pitch competitions, and angel network connections.",
    description: "LaunchPad VC acts as the campus incubator. We host founder roundtables, pitch clinics, and venture matches.",
    memberCount: 165,
    featured: true,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  },
  {
    id: "club-7",
    name: "Quantum Quest",
    category: "Science",
    logo: "https://cdn-icons-png.flaticon.com/512/1043/1043428.png",
    banner: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Exploring astrophysics, quantum mechanics, and deep science experiments.",
    description: "Quantum Quest brings science enthusiasts together to discuss cosmic mysteries, quantum computations, and conduct experimental designs.",
    memberCount: 82,
    featured: false,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  },
  {
    id: "club-8",
    name: "Alpha Debaters",
    category: "Literary",
    logo: "https://cdn-icons-png.flaticon.com/512/2983/2983780.png",
    banner: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Mastering public speaking, formal debates, and political/philosophical discourses.",
    description: "Alpha Debaters is the campus hub for rhetorical excellence. We host weekly mock parliaments and debating tournaments.",
    memberCount: 110,
    featured: false,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  },
  {
    id: "club-9",
    name: "Eco Warriors",
    category: "Environment",
    logo: "https://cdn-icons-png.flaticon.com/512/188/188333.png",
    banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Driving zero-waste campaigns, tree plantations, and local climate solutions.",
    description: "Eco Warriors is dedicated to preserving nature. We organize campus clean-ups, recycling drives, and sustainability advocacy panels.",
    memberCount: 195,
    featured: false,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  },
  {
    id: "club-10",
    name: "Canvas Crew",
    category: "Fine Arts",
    logo: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
    banner: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Painting, sketching, digital illustration, and organizing art exhibitions.",
    description: "Canvas Crew is a sanctuary for visual artists. Whether you work with oil paints, water colors, or digital tablets, express yourself here.",
    memberCount: 120,
    featured: false,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  },
  {
    id: "club-11",
    name: "Zenith Chess",
    category: "Gaming",
    logo: "https://cdn-icons-png.flaticon.com/512/3011/3011247.png",
    banner: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Sharpening tactical skills, positional play, and organizing chess leagues.",
    description: "Zenith Chess hosts regular bullet, blitz, and classical tournaments, welcoming beginners and grandmasters alike.",
    memberCount: 75,
    featured: false,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  },
  {
    id: "club-12",
    name: "Stagecraft Society",
    category: "Theatre",
    logo: "https://cdn-icons-png.flaticon.com/512/860/860321.png",
    banner: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop",
    shortDescription: "Dramatics, street plays (Nukkad Natak), scriptwriting, and stage designs.",
    description: "Stagecraft Society brings stories to life. We perform seasonal plays, direct theatrical scripts, and engage in street performance campaigns.",
    memberCount: 104,
    featured: false,
    adminUsername: "Shoubhik",
    achievements: [],
    activities: [],
    members: []
  }
];

const DEFAULT_EVENTS = [
  {
    id: "event-1",
    clubId: "club-1",
    clubName: "Apex Coders",
    title: "Quantum Code Hackathon 2026",
    description: "A thrilling 36-hour sprint solving complex logical problems, scaling AI models, and prototyping futuristic dApps. Compete in teams of 1-4. Sponsored by industry titans with cash prizes, hardware giveaways, and exclusive developer schwag.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    venue: "Main Engineering Block Auditorium & Discord",
    totalSeats: 250,
    registeredSeats: 198,
    speakers: [
      { name: "Dr. Amanda Ross", role: "Quantum Research Lead", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Amanda" },
      { name: "Vikram Mehta", role: "Principal Engineer at Stripe", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Vikram" }
    ],
    agenda: [
      { time: "09:00 AM", title: "Registration & Schwag Collection", desc: "Get checked-in, grab coffee, and collect your custom hacker badges." },
      { time: "10:30 AM", title: "Opening Ceremony", desc: "Revealing the secret theme and sponsor challenges." },
      { time: "12:00 PM", title: "Hacking Begins", desc: "Start building! Mentors will be circulating round the clock." }
    ]
  },
  {
    id: "event-2",
    clubId: "club-2",
    clubName: "Octave Beats",
    title: "Neon Echoes Acoustic Night",
    description: "An intimate, candle-lit evening showcasing acoustic guitar compositions, indie vocalists, and ambient electronic synthesizer layers under the stars. Free mocktails, cozy rugs, and premium acoustic bliss.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    venue: "Lakeview Amphitheatre",
    totalSeats: 150,
    registeredSeats: 135,
    speakers: [
      { name: "Clara Vance", role: "Singer-Songwriter", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Clara" }
    ],
    agenda: [
      { time: "06:00 PM", title: "Seating & Mocktails", desc: "Find your spot, grab a drink, and enjoy the ambient background tracks." },
      { time: "06:30 PM", title: "Opening Acts", desc: "Performances by new club recruits." },
      { time: "08:00 PM", title: "Acoustic Jam Finale", desc: "Collective jam session with all artists on stage." }
    ]
  },
  {
    id: "event-3",
    clubId: "club-6",
    clubName: "LaunchPad VC",
    title: "Venture Ignite 2026: Pitch Battle",
    description: "Ten student teams face real venture capitalists in a high-stakes 5-minute pitch showdown. Winner walks away with $10,000 in equity-free launch grants, custom legal assistance package, and immediate mentor matches.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    venue: "School of Management Seminar Hall",
    totalSeats: 100,
    registeredSeats: 48,
    speakers: [
      { name: "Naval K.", role: "Angel Investor", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Naval" },
      { name: "Sarah Jenkins", role: "Partner at Sequoia", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Sarah" }
    ],
    agenda: [
      { time: "02:00 PM", title: "Keynote Address", desc: "Building from dorm room to series A." },
      { time: "02:45 PM", title: "Pitch Round 1", desc: "First 5 teams present." },
      { time: "04:00 PM", title: "Pitch Round 2 & Awards", desc: "Final 5 presentations and judge deliberations." }
    ]
  },
  {
    id: "event-4",
    clubId: "club-4",
    clubName: "Shutter Guild",
    title: "Golden Hour Visual Photowalk",
    description: "Capture the campus at sunset! We will cover exposure control, manual focusing, framing constraints, and visual storytelling under natural lighting.",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=800&auto=format&fit=crop",
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    venue: "Central Courtyard & Fountains",
    totalSeats: 40,
    registeredSeats: 12,
    speakers: [
      { name: "Elena Rostova", role: "Vocalist & Photographer", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Elena" }
    ],
    agenda: [
      { time: "05:00 PM", title: "Introduction & Gear Check", desc: "Brief talk on settings, framing, and walk route." },
      { time: "05:30 PM", title: "Photowalk Session", desc: "Coaching while taking pictures across campus sites." }
    ]
  },
  {
    id: "event-5",
    clubId: "club-3",
    clubName: "Vanguard Robotics",
    title: "Autonomous Drone Expo 2026",
    description: "Witness autonomous flight navigation, obstacle detection algorithms, and custom built quadcopters soaring through the campus drone cage.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    venue: "Campus Indoor Sports Arena",
    totalSeats: 120,
    registeredSeats: 65,
    speakers: [
      { name: "Marcus Brody", role: "Hardware Lead", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Marcus" }
    ],
    agenda: [
      { time: "11:00 AM", title: "Opening Flight Show", desc: "Opening sequence with synchronized drone patterns." },
      { time: "11:30 AM", title: "Q&A and Tech Stack", desc: "Reviewing flight computer firmware and sensor integration." }
    ]
  }
];

// Force reset simulated users and clubs in localStorage for demo purposes
(function () {
  const localUsers = localStorage.getItem("simulatedUsers");
  let needsReset = false;
  if (localUsers) {
    try {
      const parsed = JSON.parse(localUsers);
      const hasShoubhik = parsed.some(u => u.email === "shoubhik@campus.edu");
      const hasAman = parsed.some(u => u.email === "aman@campus.edu");
      const hasDoei = parsed.some(u => u.email === "doei@campus.edu");
      if (!hasShoubhik || !hasAman || !hasDoei) {
        needsReset = true;
      }
    } catch (e) {
      needsReset = true;
    }
  } else {
    needsReset = true;
  }

  if (needsReset) {
    localStorage.setItem("simulatedUsers", JSON.stringify(SIMULATED_USERS));
    // Default logged-in user to Doei for student demo
    localStorage.setItem("userProfile", JSON.stringify(SIMULATED_USERS[2]));
    localStorage.removeItem("notifications");
  }

  // Force reset clubs to use high-quality Flat Icon URLs instead of raw emojis
  const localClubs = localStorage.getItem("clubs");
  let needsClubsReset = false;
  if (!localClubs) {
    needsClubsReset = true;
  }

  if (needsClubsReset) {
    localStorage.setItem("clubs", JSON.stringify(DEFAULT_CLUBS));
    localStorage.removeItem("events"); // Reset events to prevent name sync issues
  }
})();
