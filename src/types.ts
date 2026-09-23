export type PinCategory = 'province' | 'hiking' | 'country';

export interface TravelPin {
  id: string;
  category: PinCategory;
  title: string; // e.g. "เชียงใหม่" or "ภูกระดึง" or "Japan"
  subtitle?: string; // e.g. "ภาคเหนือ", "อุทยานแห่งชาติภูกระดึง (เลย)", "เอเชียตะวันออก"
  dateVisited: string; // YYYY-MM-DD or readable date
  endDate?: string;
  photos: string[]; // URLs or base64 data strings
  photoFocus?: string[]; // CSS object-position ("x% y%") per photo, same index as `photos` — lets a cropped/covered view (pin marker, detail viewer) keep the subject in frame instead of always centering
  note: string;
  rating?: number; // 1 to 5
  tags?: string[];
  locationCode?: string; // province code, trail id, or country code
  companion?: string; // e.g. "ไปคนเดียว", "กับเพื่อน", "กับครอบครัว", "กับแฟน"
  elevation?: number; // For hiking: meters above sea level
  difficulty?: 'ง่าย' | 'ปานกลาง' | 'ท้าทาย' | 'แอดวานซ์';
  weather?: 'แดดออก' | 'มีหมอก' | 'ฝนตกปรอยๆ' | 'หนาวเย็น' | 'หิมะ';
  highlight?: string; // จุดประทับใจ
  lat?: number;
  lng?: number;
  createdAt: number;
}

export interface ThaiProvince {
  id: string;
  nameTh: string;
  nameEn: string;
  region: 'north' | 'central' | 'northeast' | 'east' | 'west' | 'south';
  regionTh: string;
}

export interface HikingTrail {
  id: string;
  name: string;
  parkName: string;
  province: string;
  elevation: number; // meters
  distanceKm?: number;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ท้าทาย' | 'แอดวานซ์';
  durationDays?: string; // e.g. "3 วัน 2 คืน"
  highlight: string;
  coverImage?: string;
}

export interface WorldCountry {
  code: string; // ISO 2 letters
  nameTh: string;
  nameEn: string;
  flag: string; // Emoji
  continent: 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa';
  continentTh: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'hiking' | 'travel' | 'document' | 'general';
}

export interface TripPlan {
  id: string;
  title: string;
  category: PinCategory;
  targetDate?: string;
  targetSeason?: string;
  estimatedBudget?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  checklist?: string[];
  createdAt: number;
}

export interface TravelStats {
  provincesVisitedCount: number;
  provincesTotal: number;
  hikingTrailsVisitedCount: number;
  hikingTotalElevationMeters: number;
  countriesVisitedCount: number;
  countriesTotal: number;
  totalPhotosCount: number;
}
