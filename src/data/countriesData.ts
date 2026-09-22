import { WorldCountry } from '../types';

export const CONTINENTS_META = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'Asia', label: 'เอเชีย (Asia)' },
  { id: 'Europe', label: 'ยุโรป (Europe)' },
  { id: 'Americas', label: 'อเมริกา (Americas)' },
  { id: 'Oceania', label: 'โอเชียเนีย (Oceania)' },
  { id: 'Africa', label: 'แอฟริกา (Africa)' },
] as const;

export const WORLD_COUNTRIES: WorldCountry[] = [
  // Asia
  { code: 'JP', nameTh: 'ญี่ปุ่น', nameEn: 'Japan', flag: '🇯🇵', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'KR', nameTh: 'เกาหลีใต้', nameEn: 'South Korea', flag: '🇰🇷', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'TW', nameTh: 'ไต้หวัน', nameEn: 'Taiwan', flag: '🇹🇼', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'SG', nameTh: 'สิงคโปร์', nameEn: 'Singapore', flag: '🇸🇬', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'VN', nameTh: 'เวียดนาม', nameEn: 'Vietnam', flag: '🇻🇳', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'LA', nameTh: 'ลาว', nameEn: 'Laos', flag: '🇱🇦', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'MY', nameTh: 'มาเลเซีย', nameEn: 'Malaysia', flag: '🇲🇾', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'ID', nameTh: 'อินโดนีเซีย', nameEn: 'Indonesia', flag: '🇮🇩', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'CN', nameTh: 'จีน', nameEn: 'China', flag: '🇨🇳', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'HK', nameTh: 'ฮ่องกอก', nameEn: 'Hong Kong', flag: '🇭🇰', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'MO', nameTh: 'มาเก๊า', nameEn: 'Macau', flag: '🇲🇴', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'NP', nameTh: 'เนปาล', nameEn: 'Nepal', flag: '🇳🇵', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'IN', nameTh: 'อินเดีย', nameEn: 'India', flag: '🇮🇳', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'MV', nameTh: 'มัลดีฟส์', nameEn: 'Maldives', flag: '🇲🇻', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'GE', nameTh: 'จอร์เจีย', nameEn: 'Georgia', flag: '🇬🇪', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'AE', nameTh: 'สหรัฐอาหรับเอมิเรตส์', nameEn: 'United Arab Emirates', flag: '🇦🇪', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'TR', nameTh: 'ตุรกี', nameEn: 'Turkey', flag: '🇹🇷', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'PH', nameTh: 'ฟิลิปปินส์', nameEn: 'Philippines', flag: '🇵🇭', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'KH', nameTh: 'กัมพูชา', nameEn: 'Cambodia', flag: '🇰🇭', continent: 'Asia', continentTh: 'เอเชีย' },
  { code: 'MM', nameTh: 'พม่า', nameEn: 'Myanmar', flag: '🇲🇲', continent: 'Asia', continentTh: 'เอเชีย' },

  // Europe
  { code: 'CH', nameTh: 'สวิตเซอร์แลนด์', nameEn: 'Switzerland', flag: '🇨🇭', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'FR', nameTh: 'ฝรั่งเศส', nameEn: 'France', flag: '🇫🇷', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'IT', nameTh: 'อิตาลี', nameEn: 'Italy', flag: '🇮🇹', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'GB', nameTh: 'สหราชอาณาจักร', nameEn: 'United Kingdom', flag: '🇬🇧', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'DE', nameTh: 'เยอรมนี', nameEn: 'Germany', flag: '🇩🇪', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'IS', nameTh: 'ไอซ์แลนด์', nameEn: 'Iceland', flag: '🇮🇸', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'NO', nameTh: 'นอร์เวย์', nameEn: 'Norway', flag: '🇳🇴', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'AT', nameTh: 'ออสเตรีย', nameEn: 'Austria', flag: '🇦🇹', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'NL', nameTh: 'เนเธอร์แลนด์', nameEn: 'Netherlands', flag: '🇳🇱', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'ES', nameTh: 'สเปน', nameEn: 'Spain', flag: '🇪🇸', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'CZ', nameTh: 'เช็กเกีย', nameEn: 'Czech Republic', flag: '🇨🇿', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'SE', nameTh: 'สวีเดน', nameEn: 'Sweden', flag: '🇸🇪', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'FI', nameTh: 'ฟินแลนด์', nameEn: 'Finland', flag: '🇫🇮', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'GR', nameTh: 'กรีซ', nameEn: 'Greece', flag: '🇬🇷', continent: 'Europe', continentTh: 'ยุโรป' },
  { code: 'PT', nameTh: 'โปรตุเกส', nameEn: 'Portugal', flag: '🇵🇹', continent: 'Europe', continentTh: 'ยุโรป' },

  // Americas
  { code: 'US', nameTh: 'สหรัฐอเมริกา', nameEn: 'United States', flag: '🇺🇸', continent: 'Americas', continentTh: 'อเมริกา' },
  { code: 'CA', nameTh: 'แคนาดา', nameEn: 'Canada', flag: '🇨🇦', continent: 'Americas', continentTh: 'อเมริกา' },
  { code: 'PE', nameTh: 'เปรู', nameEn: 'Peru', flag: '🇵🇪', continent: 'Americas', continentTh: 'อเมริกา' },
  { code: 'BR', nameTh: 'บราซิล', nameEn: 'Brazil', flag: '🇧🇷', continent: 'Americas', continentTh: 'อเมริกา' },
  { code: 'AR', nameTh: 'อาร์เจนตินา', nameEn: 'Argentina', flag: '🇦🇷', continent: 'Americas', continentTh: 'อเมริกา' },
  { code: 'MX', nameTh: 'เม็กซิโก', nameEn: 'Mexico', flag: '🇲🇽', continent: 'Americas', continentTh: 'อเมริกา' },
  { code: 'CL', nameTh: 'ชิลี', nameEn: 'Chile', flag: '🇨🇱', continent: 'Americas', continentTh: 'อเมริกา' },

  // Oceania
  { code: 'AU', nameTh: 'ออสเตรเลีย', nameEn: 'Australia', flag: '🇦🇺', continent: 'Oceania', continentTh: 'โอเชียเนีย' },
  { code: 'NZ', nameTh: 'นิวซีแลนด์', nameEn: 'New Zealand', flag: '🇳🇿', continent: 'Oceania', continentTh: 'โอเชียเนีย' },
  { code: 'FJ', nameTh: 'ฟิจิ', nameEn: 'Fiji', flag: '🇫🇯', continent: 'Oceania', continentTh: 'โอเชียเนีย' },

  // Africa
  { code: 'EG', nameTh: 'อียิปต์', nameEn: 'Egypt', flag: '🇪🇬', continent: 'Africa', continentTh: 'แอฟริกา' },
  { code: 'MA', nameTh: 'โมร็อกโก', nameEn: 'Morocco', flag: '🇲🇦', continent: 'Africa', continentTh: 'แอฟริกา' },
  { code: 'ZA', nameTh: 'แอฟริกาใต้', nameEn: 'South Africa', flag: '🇿🇦', continent: 'Africa', continentTh: 'แอฟริกา' },
  { code: 'KE', nameTh: 'เคนยา', nameEn: 'Kenya', flag: '🇰🇪', continent: 'Africa', continentTh: 'แอฟริกา' },
  { code: 'TZ', nameTh: 'แทนซาเนีย', nameEn: 'Tanzania', flag: '🇹🇿', continent: 'Africa', continentTh: 'แอฟริกา' },
];
