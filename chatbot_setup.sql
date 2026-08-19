-- ============================================================
--  AUTO PAVILION — Chatbot Database Setup
--  File: chatbot_setup.sql
--
--  Run this in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ── 1. CHATBOT FAQS TABLE ──────────────────────────────────
create table if not exists public.chatbot_faqs (
  id          uuid        primary key default gen_random_uuid(),
  question    text        not null,
  answer      text        not null,
  category    text        default 'General',
  keywords    text[]      default '{}',
  priority    int         default 0,
  is_active   boolean     default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── 2. ROW LEVEL SECURITY (RLS) ───────────────────────────
alter table public.chatbot_faqs enable row level security;

-- Public read access to active FAQs
create policy "Public can read active faqs"
  on public.chatbot_faqs
  for select
  using (is_active = true);

-- Admin full access to FAQs (all operations)
create policy "Authenticated admin has full access to faqs"
  on public.chatbot_faqs
  for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── 3. AUTO-UPDATE TRIGGER ───────────────────────────────
create trigger chatbot_faqs_set_updated_at
  before update on public.chatbot_faqs
  for each row execute procedure public.set_updated_at();

-- ── 4. INDEXES ───────────────────────────────────────────
-- Fast filtering by active and priority
create index if not exists chatbot_faqs_active_priority_idx
  on public.chatbot_faqs (is_active, priority desc);

-- Index for searching keywords array (GIN index)
create index if not exists chatbot_faqs_keywords_idx
  on public.chatbot_faqs using gin (keywords);

-- GIN index for full-text search on question and answer
create index if not exists chatbot_faqs_search_idx
  on public.chatbot_faqs using gin (to_tsvector('english', question || ' ' || answer));

-- ── 5. SEED DATA ─────────────────────────────────────────
insert into public.chatbot_faqs (question, answer, category, keywords, priority) values
('What is Auto Pavilion?', 'Auto Pavilion is Mumbai''s premier pre-owned luxury vehicle dealership. We are dedicated to procuring fully certified premium vehicles for discerning buyers across India.', 'General', array['who are you', 'what is auto pavilion', 'about you', 'what do you do', 'company profile', 'your brand', 'who runs'], 10),
('Why should I choose Auto Pavilion over other dealers?', 'We offer an uncompromised comprehensive quality check, 100% non-accident guarantees, transparent legal paperwork, and access to an exclusive ''Recently Sold'' premium collection. Our sourcing service ensures a seamless, premium buying experience.', 'General', array['why choose', 'why you', 'special', 'different', 'best dealer', 'trust', 'reliability'], 9),
('Where is your showroom located?', 'Our flagship showroom is located at Office No. 25, Tirupati Shopping Center (Tirupati Plaza), S.V. Road, Santacruz (West), Mumbai - 400054, Maharashtra, India. We operate Monday to Saturday, from 10:00 AM to 8:00 PM.', 'General', array['where are you located', 'location', 'address', 'visit you', 'showroom', 'mumbai', 'where is', 'map', 'directions'], 8),
('How does the Bespoke Sourcing service work?', 'If you want a specific premium vehicle not in our public inventory, our Vehicle Sourcing team will source it from our private network. We find the exact model and spec, handle negotiations, perform our rigorous inspection, and deliver it to your door.', 'Sourcing', array['bespoke', 'sourcing', 'source a car', 'find a car', 'custom order', 'import', 'how does sourcing work', 'looking for a specific'], 5),
('Can you import cars from outside India?', 'While we primarily source from India''s elite domestic collections, our concierge team can assist with the legal and logistical framework for importing specific hypercars via the Carnet scheme or direct import, subject to government regulations.', 'Sourcing', array['import', 'outside india', 'foreign', 'dubai', 'uk', 'bring a car', 'customs'], 4),
('What is ''The Vault''?', '''The Premium Collection'' (or Recently Sold) is our gallery of sold vehicles. It showcases the caliber of luxury cars we have successfully curated and delivered to our valued clients across India.', 'General', array['vault', 'the vault', 'sold cars', 'private collection', 'off market', 'secret inventory'], 3),
('Are your cars verified and inspected?', 'Absolutely. Every vehicle undergoes a rigorous comprehensive quality check. This covers mechanical integrity, electrical systems, and complete provenance verification.', 'Vehicle Inspection', array['verified', 'inspected', 'accident', 'checked', 'diagnostic', 'warranty', 'guarantee', 'quality', '251 point', 'condition'], 6),
('Do you sell cars that have been in accidents?', 'No. We have a strict zero-tolerance policy for structural damage. We guarantee a 100% non-accident history for every vehicle we sell, backed by legal certification.', 'Vehicle Inspection', array['accident', 'crashed', 'damaged', 'structural', 'totaled', 'rebuilt'], 6),
('Do you provide warranties on pre-owned supercars?', 'Many of our late-model cars still carry active manufacturer warranties. For others, we offer comprehensive extended warranty packages through our premium insurance partners, covering major mechanical and electrical components.', 'Warranty', array['warranty', 'guarantee', 'repair', 'breakdown', 'cover', 'insurance'], 5),
('Can I get the car inspected by my own mechanic?', 'Yes, we welcome third-party inspections from authorized brand service centers (e.g., Porsche Centre, Ferrari Mumbai) prior to purchase to ensure your complete peace of mind.', 'Vehicle Inspection', array['own mechanic', 'third party inspection', 'take to dealer', 'check up', 'authorized service'], 5),
('Do you offer trade-ins or exchanges?', 'Yes, we accept trade-ins for luxury vehicles. You can use our online Trade-In Calculator for an estimate, or schedule a viewing appointment for a precise physical valuation.', 'Exchange', array['trade in', 'sell my car', 'exchange', 'trade', 'calculator', 'value my car', 'upgrade'], 4),
('How do I schedule a VIP viewing?', 'You can schedule a viewing by clicking ''Schedule a Viewing'' on our website, calling +91 82 9191 9393, or emailing info@autopavilion.in. This ensures a dedicated experience with our team.', 'Viewing', array['vip', 'appointment', 'schedule', 'viewing', 'see a car', 'book', 'contact', 'visit'], 7),
('Do you provide financing or EMI options?', 'Yes, we work with India''s leading private banks and NBFCs to offer tailored luxury car financing and EMI solutions for our clients at highly competitive interest rates.', 'Financing', array['finance', 'loan', 'emi', 'financing', 'bank', 'interest', 'monthly', 'credit'], 6),
('What is the booking amount required to reserve a car?', 'The token booking amount typically ranges from ₹5 Lakhs to ₹25 Lakhs depending on the vehicle''s value. This reserves the car exclusively for you while finance and paperwork are processed.', 'Buying', array['booking amount', 'token', 'reserve', 'hold', 'deposit', 'advance'], 5),
('Do you accept cryptocurrency?', 'Currently, we only accept payments via RTGS, NEFT, and Demand Drafts from verified Indian bank accounts to ensure complete compliance with Indian financial regulations.', 'Buying', array['crypto', 'bitcoin', 'usdt', 'cash', 'payment methods', 'pay'], 4),
('Do you deliver cars across India?', 'Yes! We offer secure, fully-insured flatbed transport delivery of our premium vehicles to clients anywhere in India, from Delhi to Bangalore to Hyderabad.', 'Delivery', array['delivery', 'shipping', 'transport', 'across india', 'deliver to my city', 'delhi', 'bangalore', 'transportation'], 5),
('Do you handle the RTO transfer paperwork?', 'Yes, our dedicated RTO team handles the complete transfer of ownership, state NOCs, and re-registration processes across all Indian states on your behalf.', 'Documentation', array['rto', 'transfer', 'paperwork', 'registration', 'name change', 'noc', 'documents'], 6),
('Do you provide after-sales service or maintenance?', 'While we do not have an in-house service center, we have strong tie-ups with authorized OEM workshops and elite independent luxury garages across Mumbai to assist our clients with priority servicing.', 'General', array['service', 'maintenance', 'repair', 'after sales', 'workshop', 'fix', 'servicing'], 5)
on conflict do nothing;
