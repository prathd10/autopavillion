import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const GOOGLE_REVIEWS = [
  {
    name: "Shailesh Tyagi",
    rating: 5,
    time: "a month ago",
    review: "Best place to buy a car; I found them to be highly knowledgeable about various makes and models, trustworthy in their dealings, and highly professional in their approach."
  },
  {
    name: "Prasuryya Priyadarshan",
    rating: 5,
    time: "6 months ago",
    review: "Amazing deals and all-round assistance with premium car purchases. Had a very nice experience."
  },
  {
    name: "Irshad Khan",
    rating: 5,
    time: "6 months ago",
    review: "Best service, very helpful, very professional in dealing with, and best after sales service, really feel good dealing with them"
  },
  {
    name: "PRATIK SHAH",
    rating: 5,
    time: "10 months ago",
    review: "Has a good experience of selling the car via Cars 24"
  },
  {
    name: "Rahul Choudhary",
    rating: 5,
    time: "6 months ago",
    review: "Shashank 👌🏼"
  },
  {
    name: "Parag Sule",
    rating: 5,
    time: "a month ago",
    review: "Great collection of luxury cars. Abbas bhai is very nice to explain abt the car U looking at. They understand a genuine buyer and seller. Atiq bhai is owner and nice to spk with. Overall a nice experience till date."
  },
  {
    name: "Anil vishwakarma",
    rating: 5,
    time: "3 months ago",
    review: ""
  },
  {
    name: "Teerthraj Kale",
    rating: 5,
    time: "5 months ago",
    review: ""
  },
  {
    name: "Ganga Choudhary",
    rating: 5,
    time: "8 months ago",
    review: ""
  }
];

async function seedGoogleReviews() {
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);

  // Fetch existing testimonials
  const { data: existing, error: fetchErr } = await supabase
    .from('testimonials')
    .select('name, company');

  if (fetchErr) {
    console.error('Failed to fetch existing testimonials:', fetchErr.message);
    process.exit(1);
  }

  const existingNames = new Set(
    (existing || []).map(r => r.name.toLowerCase().trim())
  );

  const toInsert = [];

  for (const item of GOOGLE_REVIEWS) {
    if (existingNames.has(item.name.toLowerCase().trim())) {
      console.log(`Skipping existing review: ${item.name}`);
      continue;
    }

    toInsert.push({
      name: item.name,
      role: item.time ? `Google Review • ${item.time}` : 'Google Review',
      comment: item.review && item.review.trim() !== '' ? item.review.trim() : 'Verified 5-Star Rating on Google Reviews',
      car: '',
      company: 'Google',
      status: 'active',
      photo: null
    });
  }

  if (toInsert.length === 0) {
    console.log('All Google reviews already exist in database.');
    return;
  }

  console.log(`Inserting ${toInsert.length} new Google reviews...`);
  const { data, error: insertErr } = await supabase
    .from('testimonials')
    .insert(toInsert)
    .select();

  if (insertErr) {
    console.error('Insert error:', insertErr);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data.length} Google reviews:`);
  data.forEach(r => console.log(` - [${r.id}] ${r.name}: "${r.comment.slice(0, 40)}..."`));
}

seedGoogleReviews().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
