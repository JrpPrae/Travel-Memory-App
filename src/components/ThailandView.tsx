import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Image as ImageIcon,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ThaiProvince, TravelPin } from '../types';
import { THAI_PROVINCES, REGIONS_META } from '../data/provincesData';

interface ThailandViewProps {
  pins: TravelPin[];
  onOpenPinDetail: (pin: TravelPin) => void;
  onOpenNewPinModalWithProvince: (prov: ThaiProvince) => void;
}

export const ThailandView: React.FC<ThailandViewProps> = ({
  pins,
  onOpenPinDetail,
  onOpenNewPinModalWithProvince,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visited' | 'unvisited'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map province ID to associated pin
  const provincePinMap = useMemo(() => {
    const map = new Map<string, TravelPin>();
    pins
      .filter((p) => p.category === 'province')
      .forEach((pin) => {
        if (pin.locationCode) {
          map.set(pin.locationCode, pin);
        } else {
          // match by name
          const prov = THAI_PROVINCES.find(
            (p) => pin.title.includes(p.nameTh) || pin.title.includes(p.nameEn)
          );
          if (prov) map.set(prov.id, pin);
        }
      });
    return map;
  }, [pins]);

  // Calculate visited count per region
  const regionStats = useMemo(() => {
    const stats: Record<string, { total: number; visited: number }> = {};
    THAI_PROVINCES.forEach((p) => {
      if (!stats[p.region]) {
        stats[p.region] = { total: 0, visited: 0 };
      }
      stats[p.region].total += 1;
      if (provincePinMap.has(p.id)) {
        stats[p.region].visited += 1;
      }
    });
    return stats;
  }, [provincePinMap]);

  const visitedTotal = provincePinMap.size;
  const percentageTotal = Math.round((visitedTotal / 77) * 100);

  // Filtered provinces
  const filteredProvinces = useMemo(() => {
    return THAI_PROVINCES.filter((prov) => {
      // Region filter
      if (selectedRegion !== 'all' && prov.region !== selectedRegion) {
        return false;
      }
      // Status filter
      const isVisited = provincePinMap.has(prov.id);
      if (filterStatus === 'visited' && !isVisited) return false;
      if (filterStatus === 'unvisited' && isVisited) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          prov.nameTh.toLowerCase().includes(q) ||
          prov.nameEn.toLowerCase().includes(q) ||
          prov.regionTh.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedRegion, filterStatus, searchQuery, provincePinMap]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Progress overview */}
      <div className="bg-gradient-to-r from-[#FDF4E7] via-[#FFFFFF] to-[#FDF4E7] rounded-3xl p-6 sm:p-8 border border-[#E4CAB3] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAD3BB] text-[#7B483B] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>ส่วนที่ 1 • สำรวจ 77 จังหวัดทั่วไทย</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#244855]">
              ปักหมุดความทรงจำ 77 จังหวัด
            </h2>
            <p className="text-xs sm:text-sm text-[#9C6B58] max-w-xl">
              บันทึกทุกเรื่องราว รูปภาพสวยๆ และสถานที่ประทับใจในแต่ละจังหวัดของประเทศไทย นับสถิติว่าคุณเดินทางไปครบกี่จังหวัดแล้ว
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E4CAB3] shadow-xs flex items-center gap-6 min-w-[240px]">
            <div>
              <span className="text-xs text-[#9C6B58] font-medium block">จังหวัดที่ไปแล้ว</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-serif font-bold text-[#874F41]">{visitedTotal}</span>
                <span className="text-sm text-[#9C6B58]">/ 77</span>
              </div>
              <span className="text-[11px] text-[#B98D79]">คิดเป็น {percentageTotal}% ทั่วประเทศ</span>
            </div>

            {/* Circular or Radial Progress */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#FDF4E7]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#874F41] transition-all duration-700 ease-out"
                  strokeDasharray={`${percentageTotal}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-xs text-[#244855]">{percentageTotal}%</span>
            </div>
          </div>
        </div>

        {/* Region Progress Pills */}
        <div className="mt-6 pt-5 border-t border-[#FDF4E7] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {REGIONS_META.filter((r) => r.id !== 'all').map((reg) => {
            const st = regionStats[reg.id] || { total: 0, visited: 0 };
            const isFull = st.visited === st.total && st.total > 0;
            return (
              <div
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-[#E4CAB3] border-[#874F41] text-[#244855] font-medium'
                    : 'bg-[#FBE9D0] border-[#E4CAB3] text-[#874F41] hover:bg-[#FDF4E7]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[11px]">{reg.label.split(' ')[0]}</span>
                  <span className="text-[10px] text-[#9C6B58]">{st.visited}/{st.total}</span>
                </div>
                <div className="w-full bg-[#E4CAB3] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isFull ? 'bg-[#4A6C74]' : 'bg-[#874F41]'}`}
                    style={{ width: `${st.total ? (st.visited / st.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E4CAB3] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#B98D79] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="province-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อจังหวัด (เช่น น่าน, กระบี่)..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-1 focus:ring-[#874F41]"
          />
        </div>

        {/* Region selector pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {REGIONS_META.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRegion === r.id
                  ? 'bg-[#874F41] text-[#FBE9D0]'
                  : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#EFDAC1]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Status filter: All / Visited / Unvisited */}
        <div className="flex bg-[#FBE9D0] p-1 rounded-xl border border-[#E4CAB3] text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'all' ? 'bg-[#FFFFFF] font-bold text-[#874F41] shadow-xs' : 'text-[#9C6B58]'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setFilterStatus('visited')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'visited' ? 'bg-[#FFFFFF] font-bold text-[#874F41] shadow-xs' : 'text-[#9C6B58]'
            }`}
          >
            ไปแล้ว ({visitedTotal})
          </button>
          <button
            onClick={() => setFilterStatus('unvisited')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'unvisited' ? 'bg-[#FFFFFF] font-bold text-[#874F41] shadow-xs' : 'text-[#9C6B58]'
            }`}
          >
            ยังไม่เคยไป ({77 - visitedTotal})
          </button>
        </div>

      </div>

      {/* Provinces Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProvinces.map((prov) => {
          const pin = provincePinMap.get(prov.id);
          const isVisited = !!pin;

          return (
            <div
              key={prov.id}
              id={`province-card-${prov.id}`}
              className={`group relative rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isVisited
                  ? 'bg-[#FFFFFF] border-[#E4CAB3] shadow-xs hover:border-[#874F41] hover:shadow-md'
                  : 'bg-[#FBE9D0]/60 border-[#E4CAB3] hover:bg-[#FFFFFF] hover:border-[#E4CAB3]'
              }`}
            >
              {/* Card top */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-medium text-[#9C6B58] tracking-wider uppercase">
                      {prov.regionTh}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#244855] group-hover:text-[#874F41] transition-colors">
                      {prov.nameTh}
                    </h3>
                    <p className="text-xs text-[#B98D79]">{prov.nameEn}</p>
                  </div>

                  {/* Stamp badge */}
                  {isVisited ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF4F3] text-[#4A6C74] border border-[#BCCECE] text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ไปแล้ว</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAD3BB] text-[#B98D79] text-[11px]">
                      <Circle className="w-3 h-3" />
                      <span>ยังไม่เคยไป</span>
                    </div>
                  )}
                </div>

                {/* If visited, show thumbnail and snippet */}
                {isVisited && pin && (
                  <div 
                    onClick={() => onOpenPinDetail(pin)} 
                    className="mt-3 cursor-pointer group/thumb"
                  >
                    {pin.photos && pin.photos.length > 0 ? (
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#FDF4E7] mb-2 border border-[#E4CAB3]">
                        <img
                          src={pin.photos[0]}
                          alt={pin.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {pin.dateVisited}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1 text-xs text-[#9C6B58] flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>{pin.dateVisited}</span>
                      </div>
                    )}

                    {pin.note && (
                      <p className="text-xs text-[#874F41] line-clamp-2 italic bg-[#FBE9D0] p-2 rounded-lg border border-[#EFDAC1]">
                        "{pin.note}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons at bottom */}
              <div className="mt-4 pt-3 border-t border-[#EFDAC1] flex items-center justify-between">
                {isVisited && pin ? (
                  <button
                    onClick={() => onOpenPinDetail(pin)}
                    className="w-full py-1.5 rounded-xl bg-[#FBE9D0] hover:bg-[#874F41] hover:text-[#FBE9D0] text-[#874F41] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-[#E4CAB3]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>เปิดดูบันทึกความทรงจำ</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenNewPinModalWithProvince(prov)}
                    className="w-full py-1.5 rounded-xl bg-[#FBE9D0] hover:bg-[#874F41] hover:text-[#FBE9D0] text-[#874F41] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-[#E4CAB3]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ปักหมุดจังหวัดนี้</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
