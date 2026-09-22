import { ChecklistItem } from '../types';

export const DEFAULT_CHECKLIST_TEMPLATES: ChecklistItem[] = [
  // เดินป่า / แคมป์ปิ้ง (Hiking & Camping Essentials)
  { id: 'chk-1', text: 'เต็นท์ & กราวด์ชีท (Tent & Groundsheet)', completed: true, category: 'hiking' },
  { id: 'chk-2', text: 'ถุงนอน & แผ่นรองนอน (Sleeping bag & mat)', completed: true, category: 'hiking' },
  { id: 'chk-3', text: 'ไฟฉายคาดหัว + แบตสำรอง (Headlamp)', completed: true, category: 'hiking' },
  { id: 'chk-4', text: 'ไม้เท้าเดินป่า (Trekking poles)', completed: false, category: 'hiking' },
  { id: 'chk-5', text: 'รองเท้าเดินป่ากริปดี + ถุงเท้าหนา (Hiking boots)', completed: true, category: 'hiking' },
  { id: 'chk-6', text: 'เสื้อกันลม / เสื้อกันหนาวฟลีซ (Warm layers)', completed: true, category: 'hiking' },
  { id: 'chk-7', text: 'ชุดปฐมพยาบาล ยาพารา ยาคลายกล้ามเนื้อ สเปรย์กันทาก', completed: false, category: 'hiking' },
  { id: 'chk-8', text: 'กระบอกน้ำเก็บความเย็น + เครื่องกรองน้ำพกพา', completed: false, category: 'hiking' },
  { id: 'chk-9', text: 'มีดพกอเนกประสงค์ & ไฟแช็ก', completed: false, category: 'hiking' },
  { id: 'chk-10', text: 'ถุงขยะส่วนตัว (Leave No Trace)', completed: true, category: 'hiking' },

  // ท่องเที่ยวทั่วไป / ต่างประเทศ (Travel & Documents)
  { id: 'chk-11', text: 'พาสปอร์ต (Passport) อายุเหลือมากกว่า 6 เดือน', completed: true, category: 'document' },
  { id: 'chk-12', text: 'ตั๋วเครื่องบิน & ใบจองโรงแรม / ที่พัก', completed: true, category: 'document' },
  { id: 'chk-13', text: 'ประกันการเดินทาง (Travel Insurance)', completed: false, category: 'document' },
  { id: 'chk-14', text: 'บัตรเครดิต Travel Card & เงินสดสกุลท้องถิ่น', completed: true, category: 'document' },
  { id: 'chk-15', text: 'หัวแปลงปลั๊กไฟ Universal Adapter + ปลั๊กพ่วง', completed: false, category: 'travel' },
  { id: 'chk-16', text: 'Power Bank ขนาดตามระเบียบสายการบิน', completed: true, category: 'travel' },
  { id: 'chk-17', text: 'ซิมการ์ดเน็ตต่างประเทศ (eSIM / Roaming)', completed: false, category: 'travel' },
  { id: 'chk-18', text: 'กล้องถ่ายรูป & เมมโมรี่การ์ดสำรอง', completed: true, category: 'travel' },
];
