import type { Volunteer } from "@/components/resqnet/widgets";

export const VOLUNTEERS: Volunteer[] = [
  {
    name: "Arjun Mehta",
    distance: "0.4 km",
    rating: 4.9,
    eta: "2 min",
    skill: "Paramedic",
  },
  {
    name: "Priya Nair",
    distance: "0.7 km",
    rating: 4.8,
    eta: "3 min",
    skill: "Nurse, CPR certified",
  },
  {
    name: "Rahul Verma",
    distance: "1.1 km",
    rating: 4.7,
    eta: "5 min",
    skill: "First-aid trained",
  },
  {
    name: "Sara Khan",
    distance: "1.4 km",
    rating: 4.9,
    eta: "6 min",
    skill: "Doctor",
  },
];

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

export const HOSPITALS = [
  {
    name: "Apollo Emergency Care",
    distance: "1.2 km",
    beds: "ICU available",
    phone: "108",
  },
  {
    name: "City General Hospital",
    distance: "2.6 km",
    beds: "Trauma center",
    phone: "108",
  },
  {
    name: "Sunrise Multispeciality",
    distance: "3.8 km",
    beds: "Cardiac unit",
    phone: "108",
  },
];

export const RESOURCES = [
  { name: "Central Police Station", type: "Police", distance: "0.9 km" },
  { name: "Apollo Emergency Care", type: "Hospital", distance: "1.2 km" },
  { name: "MedPlus Pharmacy", type: "Pharmacy", distance: "0.5 km" },
  { name: "Fire & Rescue Dept.", type: "Fire Station", distance: "2.1 km" },
];

export const NOTIFICATIONS = [
  {
    title: "Volunteer assigned",
    body: "Arjun Mehta is on the way • ETA 2 min",
    tone: "red",
    time: "now",
  },
  {
    title: "SOS sent",
    body: "Your emergency alert was broadcast to 12 volunteers",
    tone: "orange",
    time: "1m",
  },
  {
    title: "Help completed",
    body: "Your last emergency was resolved successfully",
    tone: "green",
    time: "2d",
  },
  {
    title: "Community alert",
    body: "Accident reported near MG Road — can you help?",
    tone: "blue",
    time: "3d",
  },
];

export const FIRST_AID = [
  {
    key: "cpr",
    title: "CPR Guide",
    desc: "Restart breathing & heartbeat",
    to: "/cpr",
  },
  {
    key: "bleed",
    title: "Bleeding Control",
    desc: "Stop severe bleeding fast",
    to: "/bleeding",
  },
  {
    key: "fracture",
    title: "Fracture Support",
    desc: "Immobilize & support limb",
    to: "/ai-guidance-active",
  },
  {
    key: "burn",
    title: "Burn Treatment",
    desc: "Cool, cover & protect",
    to: "/ai-guidance-active",
  },
  {
    key: "other",
    title: "Other Emergency",
    desc: "Ask the AI assistant",
    to: "/chatbot",
  },
];

export const CPR_STEPS = [
  {
    t: "Check responsiveness",
    d: "Tap the shoulders and shout. If no response, call for help and prepare CPR.",
  },
  {
    t: "Open the airway",
    d: "Tilt the head back gently and lift the chin to open the airway.",
  },
  {
    t: "Start chest compressions",
    d: "Push hard and fast in the center of the chest — 100–120 compressions/min, 5–6 cm deep.",
  },
  {
    t: "Give rescue breaths",
    d: "After 30 compressions, give 2 rescue breaths. Continue 30:2 until help arrives.",
  },
];

export const BLEED_STEPS = [
  {
    t: "Apply firm pressure",
    d: "Use a clean cloth and press firmly on the wound to slow the bleeding.",
  },
  {
    t: "Elevate the wound",
    d: "Raise the injured area above heart level if possible.",
  },
  {
    t: "Add more layers",
    d: "Do not remove soaked cloth — add more on top and keep pressing.",
  },
  {
    t: "Secure a bandage",
    d: "Wrap snugly to maintain pressure and keep the victim calm and warm.",
  },
];

export const EMERGENCY_TYPES = [
  { key: "accident", label: "Accident", emoji: "🚗", tone: "red" },
  { key: "heart", label: "Heart Attack", emoji: "❤️", tone: "red" },
  { key: "fire", label: "Fire", emoji: "🔥", tone: "orange" },
  { key: "crime", label: "Crime", emoji: "🚨", tone: "blue" },
  { key: "other", label: "Other Emergency", emoji: "⚠️", tone: "orange" },
] as const;

export const HISTORY = [
  {
    type: "Heart Attack",
    date: "12 May 2026, 09:24",
    status: "Completed",
    tone: "green",
  },
  {
    type: "Road Accident",
    date: "28 Apr 2026, 18:10",
    status: "Completed",
    tone: "green",
  },
  {
    type: "Fall Detected",
    date: "03 Apr 2026, 07:45",
    status: "Cancelled",
    tone: "orange",
  },
];

export const FAMILY = [
  {
    name: "Meera Singh",
    relation: "Mother",
    status: "Safe • Home",
    distance: "0 km",
  },
  {
    name: "Karan Singh",
    relation: "Brother",
    status: "Moving • MG Road",
    distance: "4.2 km",
  },
  {
    name: "Dad",
    relation: "Father",
    status: "Safe • Office",
    distance: "7.8 km",
  },
];

export const BADGES = [
  { name: "Life Saver", desc: "Saved a life in a critical SOS", emoji: "🏅" },
  { name: "Quick Responder", desc: "Accepted within 30 seconds", emoji: "⚡" },
  { name: "Top Helper", desc: "Top 1% volunteers this month", emoji: "👑" },
];

export const FAQ = [
  {
    q: "How does the SOS button work?",
    a: "Tap SOS, confirm the emergency type, and we instantly alert nearby trained volunteers and your emergency contacts.",
  },
  {
    q: "What if no volunteer is available?",
    a: "ResQNet automatically expands the search radius and escalates to ambulance booking and your emergency contacts.",
  },
  {
    q: "Is my location shared safely?",
    a: "Your live location is only shared during an active emergency with assigned responders and chosen family members.",
  },
];

export const SAFETY_TIPS = [
  {
    t: "Drive safely",
    d: "Avoid distractions, follow speed limits and always wear a seatbelt.",
  },
  {
    t: "Call emergency services",
    d: "Dial 108 for ambulance and keep emergency numbers handy.",
  },
  {
    t: "Do basic first aid",
    d: "Learn CPR and bleeding control — early action saves lives.",
  },
  {
    t: "Stay calm",
    d: "Take a breath, assess the scene and avoid further danger before helping.",
  },
];

export const SETTINGS_TOGGLES = [
  {
    key: "dark",
    label: "Dark mode",
    desc: "Always-on emergency dark theme",
    on: true,
  },
  {
    key: "notif",
    label: "Notifications",
    desc: "Alerts, updates & volunteer status",
    on: true,
  },
  {
    key: "voice",
    label: "Voice SOS",
    desc: "Trigger SOS by voice command",
    on: true,
  },
  {
    key: "fall",
    label: "Fall detection",
    desc: "Auto-detect falls & crashes",
    on: true,
  },
  {
    key: "power",
    label: "Power button SOS",
    desc: "Press power 3× to trigger SOS",
    on: false,
  },
];

export const ALERTS_FEED = [
  {
    type: "Heart Attack",
    area: "MG Road, 1.2 km",
    time: "2 min ago",
    tone: "red",
  },
  {
    type: "Road Accident",
    area: "Ring Road, 3.4 km",
    time: "20 min ago",
    tone: "orange",
  },
  {
    type: "Fire reported",
    area: "Sector 9, 5.1 km",
    time: "1 hr ago",
    tone: "orange",
  },
];
