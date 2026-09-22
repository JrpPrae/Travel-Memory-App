import { TravelPin } from '../types';
import { 
  PROVINCE_COORDINATES, 
  TRAILS_COORDINATES, 
  COUNTRY_COORDINATES,
  calculateCumulativeDistanceKm 
} from '../data/coordinates';
import { THAI_PROVINCES } from '../data/provincesData';
import { HIKING_TRAILS_PRESET } from '../data/trailsData';
import { WORLD_COUNTRIES } from '../data/countriesData';

export function getPinCoordinates(pin: TravelPin): { lat: number; lng: number } {
  // If pin already has explicit coordinates
  if (typeof pin.lat === 'number' && typeof pin.lng === 'number' && !isNaN(pin.lat) && !isNaN(pin.lng)) {
    return { lat: pin.lat, lng: pin.lng };
  }

  // Check locationCode
  if (pin.locationCode) {
    if (PROVINCE_COORDINATES[pin.locationCode]) {
      return PROVINCE_COORDINATES[pin.locationCode];
    }
    if (TRAILS_COORDINATES[pin.locationCode]) {
      return TRAILS_COORDINATES[pin.locationCode];
    }
    if (COUNTRY_COORDINATES[pin.locationCode]) {
      return COUNTRY_COORDINATES[pin.locationCode];
    }
  }

  // Check title matching provinces
  const matchedProv = THAI_PROVINCES.find(
    (p) => pin.title.includes(p.nameTh) || pin.title.includes(p.nameEn) || (pin.subtitle && pin.subtitle.includes(p.nameTh))
  );
  if (matchedProv && PROVINCE_COORDINATES[matchedProv.id]) {
    return PROVINCE_COORDINATES[matchedProv.id];
  }

  // Check title matching trails
  const matchedTrail = HIKING_TRAILS_PRESET.find(
    (t) => pin.title.includes(t.name) || (pin.subtitle && pin.subtitle.includes(t.name))
  );
  if (matchedTrail && TRAILS_COORDINATES[matchedTrail.id]) {
    return TRAILS_COORDINATES[matchedTrail.id];
  }

  // Check country matching
  const matchedCountry = WORLD_COUNTRIES.find(
    (c) => pin.title.includes(c.nameTh) || pin.title.includes(c.nameEn)
  );
  if (matchedCountry && COUNTRY_COORDINATES[matchedCountry.code]) {
    return COUNTRY_COORDINATES[matchedCountry.code];
  }

  // Default coordinate (Bangkok center)
  return { lat: 13.7563, lng: 100.5018 };
}

// Format date to DD/MM/YYYY (e.g. 14/02/2025) like the reference image
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  // Check if already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  // If YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  }
  return dateStr;
}

// Compute total route distance for pins ordered chronologically
export function computePinsRouteDistanceKm(pins: TravelPin[]): number {
  if (pins.length < 2) return 0;

  // Order pins by date or index
  const sortedPins = [...pins].sort((a, b) => {
    return (a.dateVisited || '').localeCompare(b.dateVisited || '');
  });

  const coords = sortedPins.map((p) => getPinCoordinates(p));
  return calculateCumulativeDistanceKm(coords);
}
