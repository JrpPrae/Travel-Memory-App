import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Mountain, 
  Globe2, 
  Calendar, 
  Star, 
  Tag, 
  Plus, 
  LayoutGrid, 
  Trello, 
  SlidersHorizontal,
  Heart,
  Users
} from 'lucide-react';
import { TravelPin, PinCategory } from '../types';

interface PinboardViewProps {
  pins: TravelPin[];
  onOpenPinDetail: (pin: TravelPin) => void;
  onOpenNewPinModal: (category?: PinCategory) => void;
}

export const PinboardView: React.FC<PinboardViewProps> = ({
  pins,
  onOpenPinDetail,
  onOpenNewPinModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | PinCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewStyle, setViewStyle] = useState<'polaroid' | 'grid'>('polaroid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  // Filter and sort pins
  const filteredPins = useMemo(() => {
    return pins
      .filter((pin) => {
        if (selectedCategory !== 'all' && pin.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = pin.title.toLowerCase().includes(q);
          const matchSubtitle = pin.subtitle?.toLowerCase().includes(q);
          const matchNote = pin.note.toLowerCase().includes(q);
          const matchTags = pin.tags?.some((t) => t.toLowerCase().includes(q));
          const matchDate = pin.dateVisited.includes(q);
          return matchTitle || matchSubtitle || matchNote || matchTags || matchDate;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.dateVisited || 0).getTime() - new Date(a.dateVisited || 0).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.dateVisited || 0).getTime() - new Date(b.dateVisited || 0).getTime();
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [pins, selectedCategory, searchQuery, sortBy]);

  const getCategoryBadge = (category: PinCategory) => {
    switch (category) {
      case 'province':
        return {
          label: '🇹🇭 จังหวัด',
          bg: 'bg-[#EAD3BB] text-[#874F41] border-[#E4CAB3]',
          pinColor: 'bg-[#E64833]',
        };
      case 'hiking':
        return {
          label: '⛰️ สายเดินป่า',
          bg: 'bg-[#EEF4F3] text-[#4A6C74] border-[#BCCECE]',
          pinColor: 'bg-[#4A6C74]',
        };
      case 'country':
        return {
          label: '🌍 ต่างประเทศ',
          bg: 'bg-[#FBD9C7] text-[#E64833] border-[#F4B199]',
          pinColor: 'bg-[#874F41]',
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Toolbar */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E4CAB3] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#B98D79] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="pinboard-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาความทรงจำ, จังหวัด, ยอดเขา, แท็ก..."
            className="w-full pl-10 pr-4 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-2 focus:ring-[#874F41]/30 focus:border-[#874F41]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B98D79] hover:text-[#244855]"
            >
              ล้าง
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <button
            id="filter-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#874F41] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#EFDAC1]'
            }`}
          >
            ทั้งหมด ({pins.length})
          </button>
          <button
            id="filter-provinces"
            onClick={() => setSelectedCategory('province')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === 'province'
                ? 'bg-[#874F41] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#EFDAC1]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>จังหวัด ({pins.filter((p) => p.category === 'province').length})</span>
          </button>
          <button
            id="filter-hiking"
            onClick={() => setSelectedCategory('hiking')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === 'hiking'
                ? 'bg-[#4A6C74] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#EFDAC1]'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>สายเดินป่า ({pins.filter((p) => p.category === 'hiking').length})</span>
          </button>
          <button
            id="filter-countries"
            onClick={() => setSelectedCategory('country')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === 'country'
                ? 'bg-[#E64833] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#EFDAC1]'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>ต่างประเทศ ({pins.filter((p) => p.category === 'country').length})</span>
          </button>
        </div>

        {/* View Switcher & Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            id="pinboard-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs text-[#7B483B] focus:outline-none focus:ring-1 focus:ring-[#874F41]"
          >
            <option value="newest">วันที่ไป (ล่าสุด)</option>
            <option value="oldest">วันที่ไป (แรกสุด)</option>
            <option value="rating">ความประทับใจ (สูงสุด)</option>
          </select>

          <div className="flex bg-[#FBE9D0] p-0.5 rounded-xl border border-[#E4CAB3]">
            <button
              id="view-polaroid-btn"
              onClick={() => setViewStyle('polaroid')}
              title="แบบบอร์ดโพลารอยด์ (Pinboard Polaroid)"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewStyle === 'polaroid'
                  ? 'bg-[#FFFFFF] text-[#874F41] shadow-xs'
                  : 'text-[#9C6B58] hover:text-[#244855]'
              }`}
            >
              <Trello className="w-4 h-4" />
            </button>
            <button
              id="view-grid-btn"
              onClick={() => setViewStyle('grid')}
              title="แบบการ์ดตาราง (Modern Grid)"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewStyle === 'grid'
                  ? 'bg-[#FFFFFF] text-[#874F41] shadow-xs'
                  : 'text-[#9C6B58] hover:text-[#244855]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Pinboard Canvas Surface */}
      <div className="relative rounded-3xl p-4 sm:p-8 bg-[#FDF4E7] border border-[#E4CAB3] shadow-inner min-h-[500px]">
        {/* Subtle corkboard / linen texture accent */}
        <div className="absolute inset-0 opacity-15 pointer-events-none rounded-3xl bg-[radial-gradient(#874F41_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Header inside canvas */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#E64833] shadow-xs inline-block" />
            <span className="font-serif italic text-base sm:text-lg text-[#5C3A2E]">
              {selectedCategory === 'all'
                ? 'กระดานปักหมุดความทรงจำทั้งหมด'
                : selectedCategory === 'province'
                ? 'หมุดบันทึกจังหวัดในไทย'
                : selectedCategory === 'hiking'
                ? 'หมุดยอดดอย & ป่าเขาสำหรับสายลุย'
                : 'หมุดบันทึกประเทศรอบโลก'}
            </span>
            <span className="text-xs text-[#9C6B58]">
              ({filteredPins.length} หมุด)
            </span>
          </div>

          <button
            id="pinboard-quick-add-btn"
            onClick={() => onOpenNewPinModal(selectedCategory === 'all' ? undefined : selectedCategory)}
            className="text-xs font-semibold text-[#874F41] hover:text-[#5C3A2E] flex items-center gap-1.5 bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] px-3 py-1.5 rounded-xl border border-[#E4CAB3] shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ปักหมุดเพิ่มในหมวดนี้</span>
          </button>
        </div>

        {/* Empty State */}
        {filteredPins.length === 0 && (
          <div className="relative z-10 text-center py-20 px-4 bg-[#FBE9D0]/80 backdrop-blur-xs rounded-2xl border border-dashed border-[#E4CAB3]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FDF4E7] flex items-center justify-center text-[#874F41] mb-3">
              <MapPin className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#244855] mb-1">
              ยังไม่มีหมุดความทรงจำในเงื่อนไขนี้
            </h3>
            <p className="text-xs sm:text-sm text-[#9C6B58] max-w-md mx-auto mb-5">
              เริ่มบันทึกรูปภาพ วันที่เดินทาง และโน๊ตความทรงจำของคุณเพื่อปักลงบนบอร์ดนี้ได้เลย
            </p>
            <button
              id="empty-state-add-pin-btn"
              onClick={() => onOpenNewPinModal(selectedCategory === 'all' ? undefined : selectedCategory)}
              className="px-4 py-2 rounded-xl bg-[#874F41] hover:bg-[#6C3F34] text-[#FBE9D0] text-xs sm:text-sm font-medium shadow-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างหมุดความทรงจำแรก</span>
            </button>
          </div>
        )}

        {/* Pins Grid - Polaroid Style */}
        {viewStyle === 'polaroid' && (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPins.map((pin, idx) => {
              const badge = getCategoryBadge(pin.category);
              const rotationDegree = (idx % 4 === 0 ? -1.5 : idx % 4 === 1 ? 1.2 : idx % 4 === 2 ? -0.8 : 1.5);

              return (
                <div
                  key={pin.id}
                  id={`pin-card-${pin.id}`}
                  onClick={() => onOpenPinDetail(pin)}
                  style={{ transform: `rotate(${rotationDegree}deg)` }}
                  className="group relative bg-[#FFFFFF] p-3.5 pb-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#E4CAB3] cursor-pointer flex flex-col justify-between"
                >
                  {/* Decorative Pin Tack (Wood / Brass push pin) */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="relative w-6 h-6 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#874F41] shadow-md border-2 border-[#FBE9D0] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FBE9D0]/80" />
                    </div>
                  </div>

                  {/* Photo area with Polaroid aesthetic */}
                  <div className="mt-2 relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FDF4E7] border border-[#E4CAB3]">
                    {pin.photos && pin.photos.length > 0 ? (
                      <img
                        src={pin.photos[0]}
                        alt={pin.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition: pin.photoFocus?.[0] || '50% 50%' }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#B98D79] p-4 text-center">
                        <MapPin className="w-8 h-8 mb-1 stroke-[1.5]" />
                        <span className="text-xs">ไม่มีรูปภาพ</span>
                      </div>
                    )}

                    {/* Category Stamp Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border shadow-2xs ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Photo count indicator */}
                    {pin.photos && pin.photos.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#244855]/75 backdrop-blur-xs text-[#FBE9D0] text-[10px] font-medium">
                        +{pin.photos.length} รูป
                      </div>
                    )}
                  </div>

                  {/* Polaroid Handwritten Caption / Details Area */}
                  <div className="mt-3.5 space-y-2 px-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#244855] group-hover:text-[#874F41] transition-colors leading-tight">
                          {pin.title}
                        </h4>
                        {pin.subtitle && (
                          <p className="text-[11px] text-[#9C6B58] mt-0.5 font-light line-clamp-1">
                            {pin.subtitle}
                          </p>
                        )}
                      </div>
                      
                      {/* Rating stars */}
                      {pin.rating && (
                        <div className="flex items-center gap-0.5 text-[#D4A373]">
                          <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                          <span className="text-xs font-bold text-[#5C3A2E]">{pin.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Memory Note snippet */}
                    {pin.note && (
                      <p className="text-xs text-[#7B483B] line-clamp-2 leading-relaxed italic bg-[#FBE9D0] p-2 rounded-lg border border-[#EFDAC1]">
                        "{pin.note}"
                      </p>
                    )}

                    {/* Meta info: Date, Companion, Elevation */}
                    <div className="pt-2 border-t border-[#EFDAC1] flex items-center justify-between text-[11px] text-[#9C6B58]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#B98D79]" />
                        <span>{pin.dateVisited || 'ไม่ระบุวันที่'}</span>
                      </div>

                      {pin.elevation ? (
                        <span className="px-1.5 py-0.5 rounded bg-[#EEF4F3] text-[#4A6C74] font-medium text-[10px]">
                          ⛰️ {pin.elevation.toLocaleString()} ม.
                        </span>
                      ) : pin.companion ? (
                        <span className="flex items-center gap-1 text-[#9C6B58]">
                          <Users className="w-3 h-3" />
                          <span className="line-clamp-1">{pin.companion}</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Tags */}
                    {pin.tags && pin.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {pin.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[#FDF4E7] text-[#874F41]"
                          >
                            #{tag.replace(/^#/, '')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pins Grid - Modern Clean Grid Style */}
        {viewStyle === 'grid' && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPins.map((pin) => {
              const badge = getCategoryBadge(pin.category);

              return (
                <div
                  key={pin.id}
                  id={`pin-card-grid-${pin.id}`}
                  onClick={() => onOpenPinDetail(pin)}
                  className="group bg-[#FFFFFF] rounded-2xl border border-[#E4CAB3] hover:border-[#874F41]/40 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-[#FDF4E7] overflow-hidden">
                    {pin.photos && pin.photos.length > 0 ? (
                      <img
                        src={pin.photos[0]}
                        alt={pin.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ objectPosition: pin.photoFocus?.[0] || '50% 50%' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#B98D79]">
                        <MapPin className="w-6 h-6" />
                      </div>
                    )}
                    <span className={`absolute top-2.5 left-2.5 text-[11px] font-medium px-2 py-0.5 rounded-md border shadow-2xs ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {pin.rating && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#244855]/75 backdrop-blur-xs text-[#FBE9D0] text-[11px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                        {pin.rating}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#244855] group-hover:text-[#874F41] transition-colors">
                        {pin.title}
                      </h4>
                      {pin.subtitle && (
                        <p className="text-xs text-[#9C6B58] line-clamp-1">{pin.subtitle}</p>
                      )}
                    </div>

                    {pin.note && (
                      <p className="text-xs text-[#7B483B] line-clamp-2 leading-relaxed">
                        {pin.note}
                      </p>
                    )}

                    <div className="pt-2 border-t border-[#EFDAC1] flex items-center justify-between text-xs text-[#9C6B58]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {pin.dateVisited}
                      </span>
                      {pin.elevation && (
                        <span className="text-[#4A6C74] font-semibold">
                          ⛰️ {pin.elevation.toLocaleString()} ม.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
