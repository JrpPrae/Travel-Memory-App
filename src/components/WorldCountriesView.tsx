import React, { useState, useMemo } from 'react';
import { 
  Globe2, 
  Search, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Image as ImageIcon,
  Calendar,
  Compass,
  Plane
} from 'lucide-react';
import { WorldCountry, TravelPin } from '../types';
import { WORLD_COUNTRIES, CONTINENTS_META } from '../data/countriesData';

interface WorldCountriesViewProps {
  pins: TravelPin[];
  onOpenPinDetail: (pin: TravelPin) => void;
  onOpenNewPinModalWithCountry: (country: WorldCountry) => void;
}

export const WorldCountriesView: React.FC<WorldCountriesViewProps> = ({
  pins,
  onOpenPinDetail,
  onOpenNewPinModalWithCountry,
}) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visited' | 'unvisited'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map country code to pin
  const countryPinMap = useMemo(() => {
    const map = new Map<string, TravelPin>();
    pins
      .filter((p) => p.category === 'country')
      .forEach((pin) => {
        if (pin.locationCode) {
          map.set(pin.locationCode, pin);
        } else {
          // match by name
          const country = WORLD_COUNTRIES.find(
            (c) => pin.title.includes(c.nameTh) || pin.title.includes(c.nameEn)
          );
          if (country) map.set(country.code, pin);
        }
      });
    return map;
  }, [pins]);

  const visitedCount = countryPinMap.size;
  const totalCountries = WORLD_COUNTRIES.length;

  // Filtered countries
  const filteredCountries = useMemo(() => {
    return WORLD_COUNTRIES.filter((country) => {
      if (selectedContinent !== 'all' && country.continent !== selectedContinent) {
        return false;
      }
      const isVisited = countryPinMap.has(country.code);
      if (filterStatus === 'visited' && !isVisited) return false;
      if (filterStatus === 'unvisited' && isVisited) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          country.nameTh.toLowerCase().includes(q) ||
          country.nameEn.toLowerCase().includes(q) ||
          country.continentTh.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedContinent, filterStatus, searchQuery, countryPinMap]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FBD9C7] via-[#FFFFFF] to-[#FBD9C7] rounded-3xl p-6 sm:p-8 border border-[#F4B199] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBD9C7] text-[#E64833] text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>ส่วนที่ 3 • พาสปอร์ต & ประเทศรอบโลก</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#244855]">
              ปักหมุดประเทศที่เคยไปเยือน
            </h2>
            <p className="text-xs sm:text-sm text-[#9C6B58] max-w-xl">
              เก็บบันทึกประทับตราพาสปอร์ตดิจิทัล ทุกทริปต่างแดน วัฒนธรรมแปลกใหม่ อาหารพื้นเมือง และมิตรภาพข้ามทวีป
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#F4B199] shadow-xs flex items-center gap-6 min-w-[240px]">
            <div>
              <span className="text-xs text-[#E64833] font-medium block">ประเทศที่เคยไป</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-serif font-bold text-[#E64833]">{visitedCount}</span>
                <span className="text-sm text-[#9C6B58]">ประเทศ</span>
              </div>
              <span className="text-[11px] text-[#B98D79]">ใน {CONTINENTS_META.length - 1} ทวีปทั่วโลก</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#FBD9C7] flex items-center justify-center text-[#E64833]">
              <Plane className="w-7 h-7 stroke-[1.8]" />
            </div>
          </div>
        </div>

        {/* Continent Pills */}
        <div className="mt-6 pt-5 border-t border-[#F4B199] flex flex-wrap gap-2">
          {CONTINENTS_META.map((cont) => (
            <button
              key={cont.id}
              onClick={() => setSelectedContinent(cont.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedContinent === cont.id
                  ? 'bg-[#E64833] text-[#FBE9D0] shadow-xs'
                  : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FBD9C7]'
              }`}
            >
              {cont.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E4CAB3] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#B98D79] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="countries-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อประเทศ (เช่น ญี่ปุ่น, ฝรั่งเศส)..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-1 focus:ring-[#E64833]"
          />
        </div>

        {/* Status filter: All / Visited / Unvisited */}
        <div className="flex bg-[#FBE9D0] p-1 rounded-xl border border-[#E4CAB3] text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'all' ? 'bg-[#FFFFFF] font-bold text-[#E64833] shadow-xs' : 'text-[#9C6B58]'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setFilterStatus('visited')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'visited' ? 'bg-[#FFFFFF] font-bold text-[#E64833] shadow-xs' : 'text-[#9C6B58]'
            }`}
          >
            ไปแล้ว ({visitedCount})
          </button>
          <button
            onClick={() => setFilterStatus('unvisited')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'unvisited' ? 'bg-[#FFFFFF] font-bold text-[#E64833] shadow-xs' : 'text-[#9C6B58]'
            }`}
          >
            ยังไม่ได้ไป ({totalCountries - visitedCount})
          </button>
        </div>

      </div>

      {/* Countries Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCountries.map((country) => {
          const pin = countryPinMap.get(country.code);
          const isVisited = !!pin;

          return (
            <div
              key={country.code}
              id={`country-card-${country.code}`}
              className={`group rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isVisited
                  ? 'bg-[#FFFFFF] border-[#F4B199] shadow-xs hover:border-[#E64833] hover:shadow-md'
                  : 'bg-[#FBE9D0]/60 border-[#E4CAB3] hover:bg-[#FFFFFF] hover:border-[#F4B199]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl select-none">{country.flag}</span>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#244855] group-hover:text-[#E64833] transition-colors leading-tight">
                        {country.nameTh}
                      </h3>
                      <p className="text-xs text-[#B98D79]">{country.nameEn}</p>
                    </div>
                  </div>

                  {/* Stamp Badge */}
                  {isVisited ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FBD9C7] text-[#E64833] border border-[#F4B199] text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ไปแล้ว</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAD3BB] text-[#B98D79] text-[11px]">
                      <Circle className="w-3 h-3" />
                      <span>ยังไม่ได้ไป</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-[11px] text-[#B98D79]">
                  ทวีป: <span className="text-[#874F41] font-medium">{country.continentTh}</span>
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
                          style={{ objectPosition: pin.photoFocus?.[0] || '50% 50%' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2">
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

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#EFDAC1]">
                {isVisited && pin ? (
                  <button
                    onClick={() => onOpenPinDetail(pin)}
                    className="w-full py-1.5 rounded-xl bg-[#FBE9D0] hover:bg-[#E64833] hover:text-[#FBE9D0] text-[#E64833] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-[#E4CAB3]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>เปิดดูบันทึกความทรงจำ</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenNewPinModalWithCountry(country)}
                    className="w-full py-1.5 rounded-xl bg-[#FBE9D0] hover:bg-[#E64833] hover:text-[#FBE9D0] text-[#874F41] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-[#E4CAB3]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ปักหมุดประเทศนี้</span>
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
