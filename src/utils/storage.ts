import { TravelPin, ChecklistItem, TripPlan, HikingTrail, TravelStats } from '../types';
import { DEFAULT_CHECKLIST_TEMPLATES } from '../data/checklistTemplates';
import { HIKING_TRAILS_PRESET } from '../data/trailsData';
import { THAI_PROVINCES } from '../data/provincesData';
import { WORLD_COUNTRIES } from '../data/countriesData';

const PINS_KEY = 'travel_pinboard_pins_v1';
const CHECKLIST_KEY = 'travel_pinboard_checklist_v1';
const PLANS_KEY = 'travel_pinboard_plans_v1';
const CUSTOM_TRAILS_KEY = 'travel_pinboard_custom_trails_v1';

// Data is namespaced per logged-in user so each account only ever sees its
// own memories. Call setStorageNamespace(username) right after login.
let namespace = 'guest';

export function setStorageNamespace(username: string): void {
  namespace = username || 'guest';
}

function nsKey(base: string): string {
  return `${base}::${namespace}`;
}

export function getSavedPins(): TravelPin[] {
  try {
    const raw = localStorage.getItem(nsKey(PINS_KEY));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading pins:', e);
    return [];
  }
}

export function savePins(pins: TravelPin[]): void {
  try {
    localStorage.setItem(nsKey(PINS_KEY), JSON.stringify(pins));
  } catch (e) {
    console.error('Error saving pins:', e);
  }
}

export function getSavedChecklist(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(nsKey(CHECKLIST_KEY));
    if (!raw) return DEFAULT_CHECKLIST_TEMPLATES;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading checklist:', e);
    return DEFAULT_CHECKLIST_TEMPLATES;
  }
}

export function saveChecklist(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(nsKey(CHECKLIST_KEY), JSON.stringify(items));
  } catch (e) {
    console.error('Error saving checklist:', e);
  }
}

export function getSavedPlans(): TripPlan[] {
  try {
    const raw = localStorage.getItem(nsKey(PLANS_KEY));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading plans:', e);
    return [];
  }
}

export function savePlans(plans: TripPlan[]): void {
  try {
    localStorage.setItem(nsKey(PLANS_KEY), JSON.stringify(plans));
  } catch (e) {
    console.error('Error saving plans:', e);
  }
}

export function getSavedTrails(): HikingTrail[] {
  try {
    const raw = localStorage.getItem(nsKey(CUSTOM_TRAILS_KEY));
    if (!raw) return HIKING_TRAILS_PRESET;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading trails:', e);
    return HIKING_TRAILS_PRESET;
  }
}

export function saveTrails(trails: HikingTrail[]): void {
  try {
    localStorage.setItem(nsKey(CUSTOM_TRAILS_KEY), JSON.stringify(trails));
  } catch (e) {
    console.error('Error saving trails:', e);
  }
}

export function calculateTravelStats(pins: TravelPin[], trails: HikingTrail[] = []): TravelStats {
  // Provinces
  const visitedProvinceCodes = new Set<string>();
  pins.filter(p => p.category === 'province').forEach(p => {
    if (p.locationCode) {
      visitedProvinceCodes.add(p.locationCode);
    } else {
      // Find matching province by title
      const found = THAI_PROVINCES.find(prov => p.title.includes(prov.nameTh) || p.title.includes(prov.nameEn));
      if (found) visitedProvinceCodes.add(found.id);
      else visitedProvinceCodes.add(p.title);
    }
  });

  // A hiking trail sits inside a real Thai province, so visiting it also
  // counts that province as visited (e.g. Phu Kradueng => Loei).
  pins.filter(p => p.category === 'hiking').forEach(p => {
    const trail = trails.find(t => t.id === p.locationCode) ||
      trails.find(t => p.title.includes(t.name) || t.name.includes(p.title));
    if (!trail) return;
    trail.province.split('/').forEach((rawName) => {
      const name = rawName.trim();
      const found = THAI_PROVINCES.find(prov => name.includes(prov.nameTh) || prov.nameTh.includes(name));
      if (found) visitedProvinceCodes.add(found.id);
    });
  });

  // Hiking Trails
  const visitedHikingCodes = new Set<string>();
  let hikingElevation = 0;
  pins.filter(p => p.category === 'hiking').forEach(p => {
    if (p.locationCode) visitedHikingCodes.add(p.locationCode);
    else visitedHikingCodes.add(p.title);
    if (p.elevation) hikingElevation += p.elevation;
  });

  // Countries
  const visitedCountryCodes = new Set<string>();
  pins.filter(p => p.category === 'country').forEach(p => {
    if (p.locationCode) visitedCountryCodes.add(p.locationCode);
    else {
      const found = WORLD_COUNTRIES.find(c => p.title.includes(c.nameTh) || p.title.includes(c.nameEn));
      if (found) visitedCountryCodes.add(found.code);
      else visitedCountryCodes.add(p.title);
    }
  });

  // Photos
  const totalPhotos = pins.reduce((sum, p) => sum + (p.photos ? p.photos.length : 0), 0);

  return {
    provincesVisitedCount: visitedProvinceCodes.size,
    provincesTotal: THAI_PROVINCES.length, // 77
    hikingTrailsVisitedCount: visitedHikingCodes.size,
    hikingTotalElevationMeters: hikingElevation,
    countriesVisitedCount: visitedCountryCodes.size,
    countriesTotal: WORLD_COUNTRIES.length,
    totalPhotosCount: totalPhotos,
  };
}

export function exportBackupJSON(pins: TravelPin[], checklist: ChecklistItem[], plans: TripPlan[], trails: HikingTrail[]): void {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    pins,
    checklist,
    plans,
    trails,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `travel-pinboard-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetToSampleData(): void {
  localStorage.removeItem(nsKey(PINS_KEY));
  localStorage.removeItem(nsKey(CHECKLIST_KEY));
  localStorage.removeItem(nsKey(PLANS_KEY));
  localStorage.removeItem(nsKey(CUSTOM_TRAILS_KEY));
  window.location.reload();
}
