// Coordinates mapping for Thai provinces, hiking trails, and distance utilities

export const PROVINCE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // ภาคเหนือ
  'TH-50': { lat: 18.7883, lng: 98.9853 }, // เชียงใหม่
  'TH-57': { lat: 19.9072, lng: 99.8325 }, // เชียงราย
  'TH-52': { lat: 18.2888, lng: 99.4928 }, // ลำปาง
  'TH-51': { lat: 18.5745, lng: 99.0087 }, // ลำพูน
  'TH-58': { lat: 19.3021, lng: 97.9654 }, // แม่ฮ่องสอน
  'TH-55': { lat: 18.7834, lng: 100.7782 }, // น่าน
  'TH-56': { lat: 19.1664, lng: 99.9018 }, // พะเยา
  'TH-54': { lat: 18.1446, lng: 100.1413 }, // แพร่
  'TH-53': { lat: 17.6256, lng: 100.0993 }, // อุตรดิตถ์

  // ภาคกลาง
  'TH-10': { lat: 13.7563, lng: 100.5018 }, // กรุงเทพมหานคร
  'TH-14': { lat: 14.3532, lng: 100.5684 }, // อยุธยา
  'TH-12': { lat: 13.8621, lng: 100.5135 }, // นนทบุรี
  'TH-13': { lat: 14.0208, lng: 100.5250 }, // ปทุมธานี
  'TH-11': { lat: 13.5991, lng: 100.5998 }, // สมุทรปราการ
  'TH-74': { lat: 13.5475, lng: 100.2744 }, // สมุทรสาคร
  'TH-75': { lat: 13.4098, lng: 99.9994 }, // สมุทรสงคราม
  'TH-73': { lat: 13.8196, lng: 100.0601 }, // นครปฐม
  'TH-16': { lat: 14.7995, lng: 100.6534 }, // ลพบุรี
  'TH-19': { lat: 14.5289, lng: 100.9108 }, // สระบุรี
  'TH-17': { lat: 14.8878, lng: 100.4038 }, // สิงห์บุรี
  'TH-15': { lat: 14.5896, lng: 100.4550 }, // อ่างทอง
  'TH-18': { lat: 15.1852, lng: 100.1251 }, // ชัยนาท
  'TH-72': { lat: 14.4745, lng: 100.1177 }, // สุพรรณบุรี
  'TH-26': { lat: 14.2069, lng: 101.2131 }, // นครนายก
  'TH-60': { lat: 15.6987, lng: 100.1199 }, // นครสวรรค์
  'TH-61': { lat: 15.3837, lng: 100.0245 }, // อุทัยธานี
  'TH-62': { lat: 16.4828, lng: 99.5227 }, // กำแพงเพชร
  'TH-65': { lat: 16.8211, lng: 100.2659 }, // พิษณุโลก
  'TH-66': { lat: 16.4419, lng: 100.3488 }, // พิจิตร
  'TH-64': { lat: 17.0056, lng: 99.8264 }, // สุโขทัย
  'TH-67': { lat: 16.4190, lng: 101.1561 }, // เพชรบูรณ์

  // ภาคอีสาน
  'TH-30': { lat: 14.9799, lng: 102.0978 }, // นครราชสีมา
  'TH-40': { lat: 16.4322, lng: 102.8236 }, // ขอนแก่น
  'TH-41': { lat: 17.4157, lng: 102.7872 }, // อุดรธานี
  'TH-34': { lat: 15.2287, lng: 104.8564 }, // อุบลราชธานี
  'TH-31': { lat: 14.9930, lng: 103.1029 }, // บุรีรัมย์
  'TH-32': { lat: 14.8829, lng: 103.4936 }, // สุรินทร์
  'TH-33': { lat: 15.1186, lng: 104.3224 }, // ศรีสะเกษ
  'TH-36': { lat: 15.8105, lng: 102.0287 }, // ชัยภูมิ
  'TH-42': { lat: 17.4860, lng: 101.7223 }, // เลย
  'TH-43': { lat: 17.8783, lng: 102.7420 }, // หนองคาย
  'TH-38': { lat: 18.3615, lng: 103.6531 }, // บึงกาฬ
  'TH-39': { lat: 17.1542, lng: 102.4407 }, // หนองบัวลำภู
  'TH-47': { lat: 17.1664, lng: 104.1486 }, // สกลนคร
  'TH-48': { lat: 17.3999, lng: 104.7695 }, // นครพนม
  'TH-49': { lat: 16.5434, lng: 104.7235 }, // มุกดาหาร
  'TH-44': { lat: 16.1866, lng: 103.3007 }, // มหาสารคาม
  'TH-45': { lat: 16.0538, lng: 103.6520 }, // ร้อยเอ็ด
  'TH-46': { lat: 16.4347, lng: 103.5073 }, // กาฬสินธุ์
  'TH-35': { lat: 15.7924, lng: 104.1451 }, // ยโสธร
  'TH-37': { lat: 15.8604, lng: 104.6258 }, // อำนาจเจริญ

  // ภาคตะวันออก
  'TH-20': { lat: 13.3611, lng: 100.9847 }, // ชลบุรี (พัทยา)
  'TH-21': { lat: 12.6814, lng: 101.2816 }, // ระยอง
  'TH-22': { lat: 12.6114, lng: 102.1039 }, // จันทบุรี
  'TH-23': { lat: 12.2428, lng: 102.5175 }, // ตราด
  'TH-24': { lat: 13.6904, lng: 101.0780 }, // ฉะเชิงเทรา
  'TH-25': { lat: 14.0510, lng: 101.3734 }, // ปราจีนบุรี
  'TH-27': { lat: 13.8140, lng: 102.0728 }, // สระแก้ว

  // ภาคตะวันตก
  'TH-71': { lat: 14.0228, lng: 99.5328 }, // กาญจนบุรี
  'TH-63': { lat: 16.8840, lng: 99.1259 }, // ตาก
  'TH-70': { lat: 13.5376, lng: 99.8164 }, // ราชบุรี
  'TH-76': { lat: 13.1114, lng: 99.9398 }, // เพชรบุรี (ชะอำ)
  'TH-77': { lat: 11.8124, lng: 99.7972 }, // ประจวบคีรีขันธ์ (หัวหิน)

  // ภาคใต้
  'TH-83': { lat: 7.8804, lng: 98.3923 }, // ภูเก็ต
  'TH-81': { lat: 8.0863, lng: 98.9063 }, // กระบี่
  'TH-84': { lat: 9.1382, lng: 99.3215 }, // สุราษฎร์ธานี (สมุย)
  'TH-82': { lat: 8.4501, lng: 98.5309 }, // พังงา
  'TH-80': { lat: 8.4304, lng: 99.9631 }, // นครศรีธรรมราช
  'TH-90': { lat: 7.0087, lng: 100.4747 }, // สงขลา (หาดใหญ่)
  'TH-86': { lat: 10.4930, lng: 99.1800 }, // ชุมพร
  'TH-85': { lat: 9.9529, lng: 98.6348 }, // ระนอง
  'TH-92': { lat: 7.5593, lng: 99.6112 }, // ตรัง
  'TH-93': { lat: 7.6167, lng: 100.0740 }, // พัทลุง
  'TH-91': { lat: 6.6238, lng: 100.0674 }, // สตูล
  'TH-94': { lat: 6.8696, lng: 101.2501 }, // ปัตตานี
  'TH-95': { lat: 6.5411, lng: 101.2804 }, // ยะลา
  'TH-96': { lat: 6.4255, lng: 101.8253 }, // นราธิวาส
};

// Hiking trails coordinates
export const TRAILS_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'trail-kewmaepan': { lat: 18.5888, lng: 98.4870 }, // กิ่วแม่ปาน ดอยอินทนนท์
  'trail-fahompok': { lat: 20.0461, lng: 99.1627 }, // ดอยผ้าห่มปก
  'trail-chiangdao': { lat: 19.3986, lng: 98.8988 }, // ดอยหลวงเชียงดาว
  'trail-phukradueng': { lat: 16.8837, lng: 101.7646 }, // ภูกระดึง
  'trail-phulomlo': { lat: 16.9897, lng: 101.0772 }, // ภูลมโล
  'trail-phusoidao': { lat: 17.8308, lng: 100.9912 }, // ภูสอยดาว
  'trail-mokoju': { lat: 15.9189, lng: 99.1022 }, // โมโกจู
  'trail-khao-chang-phueak': { lat: 14.7175, lng: 98.3752 }, // เขาช้างเผือก
  'trail-khao-laem': { lat: 14.8872, lng: 98.6372 }, // สันหนอกวัว
  'trail-khao-luang-sukhothai': { lat: 16.8778, lng: 99.6897 }, // เขาหลวงสุโขทัย
  'trail-khao-luang-nakhon': { lat: 8.5444, lng: 99.7289 }, // เขาหลวงนครศรีธรรมราช
  'trail-phu-langka': { lat: 17.9622, lng: 104.1611 }, // ภูลังกา
};

// World country capitals/centers
export const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'JP': { lat: 35.6762, lng: 139.6503 }, // Japan
  'KR': { lat: 37.5665, lng: 126.9780 }, // South Korea
  'SG': { lat: 1.3521, lng: 103.8198 }, // Singapore
  'VN': { lat: 21.0285, lng: 105.8542 }, // Vietnam
  'LA': { lat: 17.9757, lng: 102.6331 }, // Laos
  'MY': { lat: 3.1390, lng: 101.6869 }, // Malaysia
  'TW': { lat: 25.0330, lng: 121.5654 }, // Taiwan
  'CN': { lat: 39.9042, lng: 116.4074 }, // China
  'CH': { lat: 46.8182, lng: 8.2275 }, // Switzerland
  'FR': { lat: 48.8566, lng: 2.3522 }, // France
  'IT': { lat: 41.9028, lng: 12.4964 }, // Italy
  'GB': { lat: 51.5074, lng: -0.1278 }, // UK
  'IS': { lat: 64.1466, lng: -21.9426 }, // Iceland
  'US': { lat: 37.7749, lng: -122.4194 }, // USA
};

// Haversine formula to compute geodesic distance between two points in km
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Compute cumulative route distance along a series of pins
export function calculateCumulativeDistanceKm(
  pinsWithCoords: { lat: number; lng: number }[]
): number {
  if (pinsWithCoords.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < pinsWithCoords.length - 1; i++) {
    const p1 = pinsWithCoords[i];
    const p2 = pinsWithCoords[i + 1];
    total += calculateHaversineDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng);
  }
  return Math.round(total);
}
