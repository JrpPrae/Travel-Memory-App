import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  Mountain, 
  Globe2, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TripPlan, PinCategory } from '../types';

interface MyPlanViewProps {
  plans: TripPlan[];
  onAddPlan: (plan: Omit<TripPlan, 'id' | 'createdAt'>) => void;
  onDeletePlan: (id: string) => void;
  onConvertToPin: (plan: TripPlan) => void;
}

export const MyPlanView: React.FC<MyPlanViewProps> = ({
  plans,
  onAddPlan,
  onDeletePlan,
  onConvertToPin,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PinCategory>('hiking');
  const [targetDate, setTargetDate] = useState('');
  const [targetSeason, setTargetSeason] = useState('หน้าหนาว');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddPlan({
      title: title.trim(),
      category,
      targetDate: targetDate || undefined,
      targetSeason,
      estimatedBudget: estimatedBudget ? `${estimatedBudget} บาท` : undefined,
      notes: notes.trim() || undefined,
      priority,
    });

    setShowAddModal(false);
    setTitle('');
    setTargetDate('');
    setEstimatedBudget('');
    setNotes('');
  };

  const getCategoryBadge = (cat: PinCategory) => {
    switch (cat) {
      case 'province':
        return { label: '🇹🇭 จังหวัด', bg: 'bg-[#EAD3BB] text-[#874F41] border-[#E4CAB3]', icon: MapPin };
      case 'hiking':
        return { label: '⛰️ สายเดินป่า', bg: 'bg-[#EEF4F3] text-[#4A6C74] border-[#BCCECE]', icon: Mountain };
      case 'country':
        return { label: '🌍 ต่างประเทศ', bg: 'bg-[#FBD9C7] text-[#E64833] border-[#F4B199]', icon: Globe2 };
    }
  };

  const getPriorityBadge = (p: TripPlan['priority']) => {
    switch (p) {
      case 'high':
        return 'bg-[#FBE8E8] text-[#B82525] border-[#F5C2C2]';
      case 'medium':
        return 'bg-[#FFF8E7] text-[#9E6900] border-[#FCE8B3]';
      case 'low':
        return 'bg-[#FDF4E7] text-[#874F41] border-[#EFDAC1]';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#FDF4E7] via-[#FFFFFF] to-[#FDF4E7] rounded-3xl p-6 sm:p-8 border border-[#E4CAB3] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAD3BB] text-[#7B483B] text-xs font-semibold">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Feature • My Plan & Wishlist</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#244855]">
              แผนการเดินทาง & สถานที่ในฝัน
            </h2>
            <p className="text-xs sm:text-sm text-[#9C6B58] max-w-xl">
              จดบันทึกยอดดอย จังหวัด หรือประเทศที่ตั้งเป้าหมายจะไปในอนาคต พร้อมกำหนดการและงบประมาณ เมื่อไปถึงแล้วสามารถกดแปลงเป็น "หมุดความทรงจำ" ได้ทันที!
            </p>
          </div>

          <button
            id="create-new-plan-btn"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#874F41] hover:bg-[#6C3F34] text-[#FBE9D0] font-semibold text-sm shadow-xs flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>เพิ่มเป้าหมายทริปใหม่</span>
          </button>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full bg-[#FFFFFF] p-12 rounded-3xl border border-[#E4CAB3] text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EAD3BB] text-[#874F41] flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#244855] mb-1">
              ยังไม่มีแผนการเดินทางในลิสต์
            </h3>
            <p className="text-xs sm:text-sm text-[#9C6B58] mb-4">
              เพิ่มสถานที่ที่คุณใฝ่ฝันอยากไป ไม่ว่าจะเป็นยอดดอยสูง จังหวัดที่ยังไม่เคยไป หรือทริปต่างประเทศ
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-[#874F41] text-white text-xs sm:text-sm font-medium"
            >
              เพิ่มทริปแรก
            </button>
          </div>
        ) : (
          plans.map((plan) => {
            const badge = getCategoryBadge(plan.category);
            const Icon = badge.icon;

            return (
              <div
                key={plan.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E4CAB3] hover:border-[#874F41]/40 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${badge.bg} flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />
                      {badge.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(plan.priority)}`}>
                        {plan.priority === 'high' ? 'ด่วน / อยากไปมาก' : plan.priority === 'medium' ? 'ปานกลาง' : 'เรื่อยๆ'}
                      </span>
                      <button
                        onClick={() => onDeletePlan(plan.id)}
                        className="text-[#B98D79] hover:text-[#B84E25] p-1 rounded-md transition-colors"
                        title="ลบแผน"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#244855] leading-snug">
                      {plan.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#9C6B58] bg-[#FBE9D0] p-3 rounded-xl border border-[#EFDAC1]">
                    {plan.targetDate && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#874F41]" />
                        <span>ช่วงเวลา: {plan.targetDate} ({plan.targetSeason})</span>
                      </div>
                    )}
                    {plan.estimatedBudget && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#4A6C74]" />
                        <span>งบประมาณประมาณการ: {plan.estimatedBudget}</span>
                      </div>
                    )}
                    {plan.notes && (
                      <p className="pt-1 text-[#7B483B] italic border-t border-[#E4CAB3] mt-1">
                        "{plan.notes}"
                      </p>
                    )}
                  </div>

                  {plan.checklist && plan.checklist.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-semibold text-[#9C6B58]">สิ่งที่ต้องเตรียม:</span>
                      <ul className="text-xs text-[#874F41] space-y-0.5 pl-3 list-disc">
                        {plan.checklist.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Convert to Pin Button */}
                <div className="mt-5 pt-3 border-t border-[#EFDAC1]">
                  <button
                    onClick={() => onConvertToPin(plan)}
                    className="w-full py-2 px-3 rounded-xl bg-[#FBE9D0] hover:bg-[#874F41] hover:text-white text-[#874F41] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#E4CAB3] group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#874F41] group-hover:text-white transition-colors" />
                    <span>ไปมาแล้ว! แปลงเป็นหมุดความทรงจำ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#244855]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full p-6 border border-[#E4CAB3] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-xl font-bold text-[#244855] mb-1">
              เพิ่มเป้าหมาย / แผนการเดินทางใหม่
            </h3>
            <p className="text-xs text-[#9C6B58] mb-5">
              วางแผนทริปที่อยากไป เพื่อเตรียมตัวและนับถอยหลังสู่วันเดินทาง
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                  หมวดหมู่สถานที่ *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('hiking')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      category === 'hiking'
                        ? 'bg-[#4A6C74] text-white border-[#4A6C74]'
                        : 'bg-[#FBE9D0] text-[#874F41] border-[#E4CAB3]'
                    }`}
                  >
                    ⛰️ สายเดินป่า
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('province')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      category === 'province'
                        ? 'bg-[#874F41] text-white border-[#874F41]'
                        : 'bg-[#FBE9D0] text-[#874F41] border-[#E4CAB3]'
                    }`}
                  >
                    🇹🇭 จังหวัด
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('country')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      category === 'country'
                        ? 'bg-[#E64833] text-white border-[#E64833]'
                        : 'bg-[#FBE9D0] text-[#874F41] border-[#E4CAB3]'
                    }`}
                  >
                    🌍 ต่างประเทศ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                  ชื่อสถานที่หรือทริปที่อยากไป *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ยอดเขาโมโกจู, โรดทริปน่าน-พะเยา, แสงเหนือไอซ์แลนด์"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    วันที่คาดว่าจะไป
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    ฤดูกาลที่เหมาะสม
                  </label>
                  <select
                    value={targetSeason}
                    onChange={(e) => setTargetSeason(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                  >
                    <option value="หน้าหนาว">หน้าหนาว (ต.ค. - ก.พ.)</option>
                    <option value="หน้าฝน">หน้าฝน (ก.ค. - ต.ค.)</option>
                    <option value="หน้าร้อน">หน้าร้อน (มี.ค. - พ.ค.)</option>
                    <option value="ช่วงใบไม้เปลี่ยนสี">ช่วงใบไม้เปลี่ยนสี</option>
                    <option value="ช่วงซากุระ / ดอกไม้บาน">ช่วงซากุระ / ดอกไม้บาน</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    ประมาณการงบ (บาท)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 5,000 หรือ 25,000"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    ความอยากไป (Priority)
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                  >
                    <option value="high">🔥 อยากไปมาก / ต้องไปให้ได้</option>
                    <option value="medium">⭐ ปานกลาง / รอจังหวะ</option>
                    <option value="low">🌱 อยากไปในอนาคต</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                  โน้ตรายละเอียดการเตรียมตัว
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น ต้องจองคิวอุทยานล่วงหน้า, ซ้อมวิ่งสัปดาห์ละ 3 วัน, ชวนเพื่อนอีก 2 คน"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[#9C6B58] hover:bg-[#FBE9D0]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#874F41] hover:bg-[#6C3F34] text-white text-sm font-semibold shadow-xs"
                >
                  บันทึกเป้าหมาย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
