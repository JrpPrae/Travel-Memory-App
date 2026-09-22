import { TravelPin, ChecklistItem, TripPlan, HikingTrail, TravelStats } from '../types';
import { SAMPLE_PINS, SAMPLE_PLANS } from '../data/samplePins';
import { DEFAULT_CHECKLIST_TEMPLATES } from '../data/checklistTemplates';
import { HIKING_TRAILS_PRESET } from '../data/trailsData';
import { THAI_PROVINCES } from '../data/provincesData';
import { WORLD_COUNTRIES } from '../data/countriesData';

const PINS_KEY = 'travel_pinboard_pins_v1';
const CHECKLIST_KEY = 'travel_pinboard_checklist_v1';
const PLANS_KEY = 'travel_pinboard_plans_v1';
const CUSTOM_TRAILS_KEY = 'travel_pinboard_custom_trails_v1';

export function getSavedPins(): TravelPin[] {
  try {
    const raw = localStorage.getItem(PINS_KEY);
    if (!raw) return SAMPLE_PINS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading pins:', e);
    return SAMPLE_PINS;
  }
}

export function savePins(pins: TravelPin[]): void {
  try {
    localStorage.setItem(PINS_KEY, JSON.stringify(pins));
  } catch (e) {
    console.error('Error saving pins:', e);
  }
}

export function getSavedChecklist(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return DEFAULT_CHECKLIST_TEMPLATES;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading checklist:', e);
    return DEFAULT_CHECKLIST_TEMPLATES;
  }
}

export function saveChecklist(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving checklist:', e);
  }
}

export function getSavedPlans(): TripPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) return SAMPLE_PLANS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading plans:', e);
    return SAMPLE_PLANS;
  }
}

export function savePlans(plans: TripPlan[]): void {
  try {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Error saving plans:', e);
  }
}

export function getSavedTrails(): HikingTrail[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TRAILS_KEY);
    if (!raw) return HIKING_TRAILS_PRESET;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading trails:', e);
    return HIKING_TRAILS_PRESET;
  }
}

export function saveTrails(trails: HikingTrail[]): void {
  try {
    localStorage.setItem(CUSTOM_TRAILS_KEY, JSON.stringify(trails));
  } catch (e) {
    console.error('Error saving trails:', e);
  }
}

export function calculateTravelStats(pins: TravelPin[]): TravelStats {
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
  localStorage.removeItem(PINS_KEY);
  localStorage.removeItem(CHECKLIST_KEY);
  localStorage.removeItem(PLANS_KEY);
  localStorage.removeItem(CUSTOM_TRAILS_KEY);
  window.location.reload();
}
