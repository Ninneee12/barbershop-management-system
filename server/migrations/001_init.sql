CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  duration INTEGER NOT NULL CHECK (duration > 0),
  desc TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  service_price NUMERIC(10,2) NOT NULL CHECK (service_price >= 0),
  barber_id TEXT NOT NULL,
  barber_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO services (id, name, price, duration, desc)
VALUES
  ('s1', 'Precision Haircut', 35, 30, 'Tailored consultation followed by a luxury cleanse, customized clipper/scissor work, and custom styling.'),
  ('s2', 'The Sculpted Beard', 25, 25, 'Detailed beard detailing, hot towels, razor profile outlining, and specialized beard oils.'),
  ('s3', 'The Grooming Special', 55, 60, 'Our signature package. Combining our precision haircut with executive hot-lather beard sculpting.'),
  ('s4', 'Traditional Razor Shave', 40, 40, 'Indulge in classic pre-shave treatments, hot-towels, warm lather creams, and close blade grooming.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO appointments (
  id,
  client_name,
  client_phone,
  client_email,
  service_id,
  service_name,
  service_price,
  barber_id,
  barber_name,
  appointment_date,
  appointment_time,
  notes,
  status
)
VALUES
  ('a1', 'Liam Miller', '(555) 019-2831', 'liam@domain.com', 's1', 'Precision Haircut', 35, 'b1', 'Alex Harris', CURRENT_DATE, '10:00 AM', 'Prefers side taper.', 'Completed'),
  ('a2', 'Sebastian Brooks', '(555) 014-9922', 'seb@domain.com', 's3', 'The Grooming Special', 55, 'b2', 'Jordan Vance', CURRENT_DATE + INTERVAL '1 day', '12:30 PM', 'First time visiting.', 'Pending'),
  ('a3', 'Noah Sterling', '(555) 018-7711', 'noah@domain.com', 's2', 'The Sculpted Beard', 25, 'b3', 'Taylor Cross', CURRENT_DATE + INTERVAL '2 days', '02:00 PM', '', 'Pending')
ON CONFLICT (id) DO NOTHING;
