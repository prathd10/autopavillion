import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const apiKey = process.env.VEHICLESDB_API_KEY;
const id = "car/bmw/3-series";
const fullUrl = `https://vehiclesdb.com/v1/vehicles/car/bmw/3-series/full`;
const res = await fetch(fullUrl, { headers: { 'Authorization': `Bearer ${apiKey}` }});
const data = await res.json();
console.log(JSON.stringify(data, null, 2).slice(0, 500));
