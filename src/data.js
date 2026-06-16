// --- Static reference data ---

export const BARBERS = [
  {
    id: "b1",
    name: "Alex Harris",
    specialty: "Classic Scissor Cuts & Fades",
    icon: "Scissors",
  },
  {
    id: "b2",
    name: "Jordan Vance",
    specialty: "Beard Artistry & Shaves",
    icon: "Brush",
  },
  {
    id: "b3",
    name: "Taylor Cross",
    specialty: "Modern Styling & Texturing",
    icon: "Sparkles",
  },
];

export const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

export function getFutureDate(daysInFuture) {
  const d = new Date();
  d.setDate(d.getDate() + daysInFuture);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export const INITIAL_SERVICES = [
  {
    id: "s1",
    name: "Precision Haircut",
    price: 35,
    duration: 30,
    desc: "Tailored consultation followed by a luxury cleanse, customized clipper/scissor work, and custom styling.",
  },
  {
    id: "s2",
    name: "The Sculpted Beard",
    price: 25,
    duration: 25,
    desc: "Detailed beard detailing, hot towels, razor profile outlining, and specialized beard oils.",
  },
  {
    id: "s3",
    name: "The Grooming Special",
    price: 55,
    duration: 60,
    desc: "Our signature package. Combining our precision haircut with executive hot-lather beard sculpting.",
  },
  {
    id: "s4",
    name: "Traditional Razor Shave",
    price: 40,
    duration: 40,
    desc: "Indulge in classic pre-shave treatments, hot-towels, warm lather creams, and close blade grooming.",
  },
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "a1",
    clientName: "Liam Miller",
    clientPhone: "(555) 019-2831",
    clientEmail: "liam@domain.com",
    serviceId: "s1",
    serviceName: "Precision Haircut",
    servicePrice: 35,
    barberId: "b1",
    barberName: "Alex Harris",
    date: getFutureDate(0),
    time: "10:00 AM",
    notes: "Prefers side taper.",
    status: "Completed",
  },
  {
    id: "a2",
    clientName: "Sebastian Brooks",
    clientPhone: "(555) 014-9922",
    clientEmail: "seb@domain.com",
    serviceId: "s3",
    serviceName: "The Grooming Special",
    servicePrice: 55,
    barberId: "b2",
    barberName: "Jordan Vance",
    date: getFutureDate(1),
    time: "12:30 PM",
    notes: "First time visiting.",
    status: "Pending",
  },
  {
    id: "a3",
    clientName: "Noah Sterling",
    clientPhone: "(555) 018-7711",
    clientEmail: "noah@domain.com",
    serviceId: "s2",
    serviceName: "The Sculpted Beard",
    servicePrice: 25,
    barberId: "b3",
    barberName: "Taylor Cross",
    date: getFutureDate(2),
    time: "02:00 PM",
    notes: "",
    status: "Pending",
  },
];

// --- localStorage helpers ---
export function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
