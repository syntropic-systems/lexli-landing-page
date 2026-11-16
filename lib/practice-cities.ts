/**
 * The cities the waitlist's city picker offers, grouped under state headings. Copied from the
 * product app (ui/apps/web/src/lib/practice-cities.ts) so both ask in the same words; when the
 * app moves to a server-driven city list, this should follow. Anyone elsewhere types their own.
 */
export const PRACTICE_CITIES: { state: string; cities: string[] }[] = [
  { state: 'Delhi', cities: ['Delhi'] },
  { state: 'Gujarat', cities: ['Ahmedabad'] },
  { state: 'Karnataka', cities: ['Bengaluru'] },
  {
    state: 'Maharashtra',
    cities: ['Aurangabad', 'Kolhapur', 'Mumbai', 'Nagpur', 'Nashik', 'Pune', 'Thane'],
  },
  { state: 'Rajasthan', cities: ['Jaipur'] },
  { state: 'Tamil Nadu', cities: ['Chennai'] },
  { state: 'Telangana', cities: ['Hyderabad'] },
  { state: 'Uttar Pradesh', cities: ['Lucknow'] },
  { state: 'West Bengal', cities: ['Kolkata'] },
];
