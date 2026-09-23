import React, { useState, useMemo } from 'react';
import { 
  Mountain, 
  Search, 
  Plus, 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Clock, 
  Footprints, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Camera,
  Compass
} from 'lucide-react';
import { HikingTrail, TravelPin } from '../types';

interface HikingTrailsViewProps {
  trails: HikingTrail[];
  pins: TravelPin[];
  onOpenPinDetail: (pin: TravelPin) => void;
  onOpenNewPinModalWithTrail: (trail: HikingTrail) => void;
  onAddNewCustomTrail: (trail: HikingTrail) => void;
}

export const HikingTrailsView: React.FC<HikingTrailsViewProps> = ({
  trails,
  pins,
  onOpenPinDetail,
  onOpenNewPinModalWithTrail,
  onAddNewCustomTrail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'conquered' | 'unconquered'>('all');
  const [showAddTrailModal, setShowAddTrailModal] = useState(false);

  // New custom trail form state
  const [newTrailName, setNewTrailName] = useState('');
  const [newTrailPark, setNewTrailPark] = useState('');
  const [newTrailProvince, setNewTrailProvince] = useState('');
  const [newTrailElevation, setNewTrailElevation] = useState('');
  const [newTrailDistance, setNewTrailDistance] = useState('');
  const [newTrailDifficulty, setNewTrailDifficulty] = useState<'ง่าย' | 'ปานกลาง' | 'ท้าทาย' | 'แอดวานซ์'>('ปานกลาง');
  const [newTrailDuration, setNewTrailDuration] = useState('2 วัน 1 คืน');
  const [newTrailHighlight, setNewTrailHighlight] = useState('');

  // Map trail ID to visited pin
  const trailPinMap = useMemo(() => {
    const map = new Map<string, TravelPin>();
    pins
      .filter((p) => p.category === 'hiking')
      .forEach((pin) => {
        if (pin.locationCode) {
          map.set(pin.locationCode, pin);
        } else {
          // match by name
          const trail = trails.find((t) => pin.title.includes(t.name) || t.name.includes(pin.title));
          if (trail) map.set(trail.id, pin);
        }
      });
    return map;
  }, [pins, trails]);

  const conqueredCount = trailPinMap.size;
  const totalElevation = useMemo(() => {
    let sum = 0;
    trailPinMap.forEach((pin) => {
      if (pin.elevation) sum += pin.elevation;
    });
    return sum;
  }, [trailPinMap]);

  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      if (filterDifficulty !== 'all' && trail.difficulty !== filterDifficulty) return false;
      const isConquered = trailPinMap.has(trail.id);
      if (filterStatus === 'conquered' && !isConquered) return false;
      if (filterStatus === 'unconquered' && isConquered) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          trail.name.toLowerCase().includes(q) ||
          trail.parkName.toLowerCase().includes(q) ||
          trail.province.toLowerCase().includes(q) ||
          trail.highlight.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [trails, filterDifficulty, filterStatus, searchQuery, trailPinMap]);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'ง่าย':
        return 'bg-[#EBF5EE] text-[#2E6F40] border-[#D0EADB]';
      case 'ปานกลาง':
        return 'bg-[#FFF8E7] text-[#9E6900] border-[#FCE8B3]';
      case 'ท้าทาย':
        return 'bg-[#FDF0EB] text-[#B84E25] border-[#F9D8CB]';
      case 'แอดวานซ์':
        return 'bg-[#FBE8E8] text-[#A62626] border-[#F5C2C2]';
      default:
        return 'bg-[#FDF4E7] text-[#874F41] border-[#EFDAC1]';
    }
  };

  const handleCreateTrail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrailName.trim() || !newTrailProvince.trim()) return;

    const newTrail: HikingTrail = {
      id: `custom-trail-${Date.now()}`,
      name: newTrailName.trim(),
      parkName: newTrailPark.trim() || 'อุทยานแห่งชาติ',
      province: newTrailProvince.trim(),
      elevation: Number(newTrailElevation) || 1000,
      distanceKm: Number(newTrailDistance) || undefined,
      difficulty: newTrailDifficulty,
      durationDays: newTrailDuration,
      highlight: newTrailHighlight.trim() || 'เส้นทางเดินป่าธรรมชาติ',
    };

    onAddNewCustomTrail(newTrail);
    setShowAddTrailModal(false);
    // Reset
    setNewTrailName('');
    setNewTrailPark('');
    setNewTrailProvince('');
    setNewTrailElevation('');
    setNewTrailDistance('');
    setNewTrailHighlight('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner for Hikers */}
      <div className="bg-gradient-to-r from-[#EEF4F3] via-[#FFFFFF] to-[#EEF4F3] rounded-3xl p-6 sm:p-8 border border-[#BCCECE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF4F3] text-[#4A6C74] text-xs font-semibold">
              <Mountain className="w-3.5 h-3.5" />
              <span>ส่วนที่ 2 • สำหรับสายเดินป่า & ปีนเขา</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A5C67]">
              ป่าและอุทยาน ยอดเขาในตำนาน
            </h2>
            <p className="text-xs sm:text-sm text-[#4A6C74] max-w-xl">
              บันทึกสถิติพิชิตยอดดอย อุทยานแห่งชาติ และเส้นทางเดินป่าทั่วไทย พร้อมระดับความสูง ระยะทาง และภาพความทรงจำเมื่อก้าวไปถึงจุดสูงสุด
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#BCCECE] shadow-xs flex items-center gap-6 min-w-[260px]">
            <div>
              <span className="text-xs text-[#5F8085] font-medium block">ยอดดอยที่พิชิตแล้ว</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-serif font-bold text-[#4A6C74]">{conqueredCount}</span>
                <span className="text-sm text-[#5F8085]">/ {trails.length} เส้นทาง</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#4A6C74] font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>ความสูงสะสม: {totalElevation.toLocaleString()} ม.</span>
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#EEF4F3] flex items-center justify-center text-[#4A6C74]">
              <Footprints className="w-7 h-7 stroke-[1.8]" />
            </div>
          </div>
        </div>

        {/* Quick Elevation Ladder Teaser */}
        <div className="mt-6 pt-4 border-t border-[#EEF4F3] flex items-center justify-between text-xs text-[#4A6C74]">
          <span className="font-medium">🏔️ ยอดเขาแนะนำสูงสุด: กิ่วแม่ปาน (2,565 ม.) • ดอยผ้าห่มปก (2,285 ม.) • ดอยหลวงเชียงดาว (2,225 ม.) • ภูสอยดาว (2,102 ม.) • โมโกจู (1,964 ม.)</span>
          <button
            onClick={() => setShowAddTrailModal(true)}
            className="hidden sm:flex items-center gap-1 font-semibold text-[#4A6C74] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มเส้นทางใหม่</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E4CAB3] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#B98D79] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="hiking-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อยอดดอย, อุทยาน, จังหวัด..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-1 focus:ring-[#4A6C74]"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {['all', 'ง่าย', 'ปานกลาง', 'ท้าทาย', 'แอดวานซ์'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterDifficulty === diff
                  ? 'bg-[#4A6C74] text-[#FBE9D0]'
                  : 'bg-[#FBE9D0] text-[#5F8085] hover:bg-[#EEF4F3]'
              }`}
            >
              {diff === 'all' ? 'ทุกระดับความยาก' : diff}
            </button>
          ))}
        </div>

        {/* Status Filter & Add trail button */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex bg-[#FBE9D0] p-1 rounded-xl border border-[#E4CAB3] text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterStatus === 'all' ? 'bg-[#FFFFFF] font-bold text-[#4A6C74] shadow-xs' : 'text-[#9C6B58]'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterStatus('conquered')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterStatus === 'conquered' ? 'bg-[#FFFFFF] font-bold text-[#4A6C74] shadow-xs' : 'text-[#9C6B58]'
              }`}
            >
              พิชิตแล้ว ({conqueredCount})
            </button>
            <button
              onClick={() => setFilterStatus('unconquered')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterStatus === 'unconquered' ? 'bg-[#FFFFFF] font-bold text-[#4A6C74] shadow-xs' : 'text-[#9C6B58]'
              }`}
            >
              ยังไม่ได้ไป ({trails.length - conqueredCount})
            </button>
          </div>

          <button
            id="add-custom-trail-btn"
            onClick={() => setShowAddTrailModal(true)}
            className="p-2 rounded-xl bg-[#4A6C74] hover:bg-[#3A5C67] text-[#FBE9D0] transition-colors"
            title="เพิ่มยอดเขา/ป่าอุทยานใหม่"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Trails Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrails.map((trail) => {
          const pin = trailPinMap.get(trail.id);
          const isConquered = !!pin;

          return (
            <div
              key={trail.id}
              id={`trail-card-${trail.id}`}
              className={`group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isConquered
                  ? 'bg-[#FFFFFF] border-[#BCCECE] shadow-sm hover:border-[#4A6C74] hover:shadow-md'
                  : 'bg-[#FFFFFF] border-[#E4CAB3] hover:border-[#BCCECE] hover:shadow-xs'
              }`}
            >
              <div>
                {/* Image header with elevation & difficulty */}
                <div className="relative aspect-[16/10] bg-[#EEF4F3] overflow-hidden">
                  {(isConquered && pin?.photos?.[0]) || trail.coverImage ? (
                    <img
                      src={isConquered && pin?.photos?.[0] ? pin.photos[0] : trail.coverImage}
                      alt={trail.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#5F8085]">
                      <Mountain className="w-8 h-8 mb-1 stroke-[1.5]" />
                      <span className="text-xs">ไม่มีรูปภาพ</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Elevation & Difficulty Pills */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#244855]/80 backdrop-blur-xs text-[#FBE9D0] text-xs font-bold flex items-center gap-1">
                      <Mountain className="w-3.5 h-3.5 text-[#90AEAD]" />
                      {trail.elevation.toLocaleString()} ม.
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border backdrop-blur-xs ${getDifficultyBadge(trail.difficulty)}`}>
                      {trail.difficulty}
                    </span>
                  </div>

                  {/* Conquered Stamp */}
                  <div className="absolute top-3 right-3">
                    {isConquered ? (
                      <span className="px-2.5 py-1 rounded-lg bg-[#4A6C74] text-[#FBE9D0] text-xs font-bold flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        พิชิตแล้ว
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-xs text-white/80 text-[11px]">
                        รอไปพิชิต
                      </span>
                    )}
                  </div>

                  {/* Bottom title inside image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-white/80 block">{trail.parkName}</span>
                    <h3 className="font-serif font-bold text-lg text-white drop-shadow-sm leading-snug">
                      {trail.name}
                    </h3>
                  </div>
                </div>

                {/* Body info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#5F8085] pb-2 border-b border-[#EFDAC1]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#4A6C74]" />
                      {trail.province}
                    </span>
                    {trail.durationDays && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#4A6C74]" />
                        {trail.durationDays}
                      </span>
                    )}
                    {trail.distanceKm && (
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3.5 h-3.5 text-[#4A6C74]" />
                        {trail.distanceKm} กม.
                      </span>
                    )}
                  </div>

                  {/* Highlight */}
                  <p className="text-xs text-[#7B483B] line-clamp-2 leading-relaxed">
                    <span className="font-semibold text-[#244855]">ไฮไลต์:</span> {trail.highlight}
                  </p>

                  {/* Visited Note preview if conquered */}
                  {isConquered && pin && (
                    <div 
                      onClick={() => onOpenPinDetail(pin)}
                      className="bg-[#EEF4F3] p-2.5 rounded-xl border border-[#BCCECE] cursor-pointer hover:bg-[#EEF4F3] transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#4A6C74] mb-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3" />
                          วันที่ไป: {pin.dateVisited}
                        </span>
                        {pin.photos && (
                          <span className="text-[10px] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#BCCECE]">
                            📷 {pin.photos.length} รูป
                          </span>
                        )}
                      </div>
                      {pin.note && (
                        <p className="text-xs text-[#4A6C74] italic line-clamp-2">
                          "{pin.note}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                {isConquered && pin ? (
                  <button
                    onClick={() => onOpenPinDetail(pin)}
                    className="w-full py-2 rounded-xl bg-[#EEF4F3] hover:bg-[#4A6C74] hover:text-white text-[#4A6C74] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#BCCECE]"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>เปิดดูรูปและบันทึกความทรงจำ</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenNewPinModalWithTrail(trail)}
                    className="w-full py-2 rounded-xl bg-[#FBE9D0] hover:bg-[#4A6C74] hover:text-white text-[#4A6C74] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#BCCECE]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ปักหมุดว่าเคยไปยอดนี้แล้ว</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add custom trail */}
      {showAddTrailModal && (
        <div className="fixed inset-0 z-50 bg-[#244855]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full p-6 border border-[#E4CAB3] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-xl font-bold text-[#244855] mb-1">
              เพิ่มยอดเขา / ป่าอุทยานใหม่
            </h3>
            <p className="text-xs text-[#9C6B58] mb-5">
              เพิ่มเส้นทางเดินป่าหรือยอดเขาที่น่าสนใจเพื่อนำไปปักหมุดและนับสถิติ
            </p>

            <form onSubmit={handleCreateTrail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                  ชื่อยอดเขา / ป่าอุทยาน *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ดอยม่อนจอง, เขาหลวงประจวบฯ"
                  value={newTrailName}
                  onChange={(e) => setNewTrailName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    อุทยานฯ / เขตรักษาพันธุ์
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น อช.ทองผาภูมิ"
                    value={newTrailPark}
                    onChange={(e) => setNewTrailPark(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    จังหวัด *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น เชียงใหม่, กาญจนบุรี"
                    value={newTrailProvince}
                    onChange={(e) => setNewTrailProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    ความสูง (ม.)
                  </label>
                  <input
                    type="number"
                    placeholder="เช่น 1800"
                    value={newTrailElevation}
                    onChange={(e) => setNewTrailElevation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    ระยะทาง (กม.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="เช่น 8.5"
                    value={newTrailDistance}
                    onChange={(e) => setNewTrailDistance(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                    ความยาก
                  </label>
                  <select
                    value={newTrailDifficulty}
                    onChange={(e) => setNewTrailDifficulty(e.target.value as any)}
                    className="w-full px-2 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                  >
                    <option value="ง่าย">ง่าย</option>
                    <option value="ปานกลาง">ปานกลาง</option>
                    <option value="ท้าทาย">ท้าทาย</option>
                    <option value="แอดวานซ์">แอดวานซ์</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                  ไฮไลต์จุดประทับใจ
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น ชมทะเลหมอก 360 องศา, ทุ่งดอกไม้ป่า, ผาชมพระอาทิตย์ขึ้น"
                  value={newTrailHighlight}
                  onChange={(e) => setNewTrailHighlight(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrailModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[#9C6B58] hover:bg-[#FBE9D0]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4A6C74] hover:bg-[#3A5C67] text-white text-sm font-semibold shadow-xs"
                >
                  บันทึกเส้นทาง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
