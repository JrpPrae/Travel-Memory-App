import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Plus,
  Route,
  Compass,
  Maximize2,
  Heart,
  ChevronRight,
  MapPin,
  Mountain,
  Globe,
} from 'lucide-react';
import { TravelPin, PinCategory, TravelStats } from '../types';
import { ActiveTab } from './Header';
import { getPinCoordinates, formatDisplayDate } from '../utils/coordinatesHelper';

interface InteractiveMapViewProps {
  pins: TravelPin[];
  stats: TravelStats;
  onOpenPinDetail: (pin: TravelPin) => void;
  onOpenNewPinModal: (category?: PinCategory, initialCoords?: { lat: number; lng: number }) => void;
  onSelectCategory: (tab: ActiveTab) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  pins,
  stats,
  onOpenPinDetail,
  onOpenNewPinModal,
  onSelectCategory,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineLayerRef = useRef<L.Polyline | null>(null);

  // Active selected pin (defaults to the last pin or first pin)
  const [selectedPinId, setSelectedPinId] = useState<string | null>(() => {
    // Default to pin-5 like in the reference image if exists, or last pin
    const p5 = pins.find(p => p.id === 'pin-5');
    if (p5) return p5.id;
    return pins.length > 0 ? pins[pins.length - 1].id : null;
  });

  const [filterCategory, setFilterCategory] = useState<'all' | 'province' | 'hiking' | 'country'>('all');
  const [showRouteLine, setShowRouteLine] = useState(true);

  // Filtered pins
  const filteredPins = useMemo(() => {
    if (filterCategory === 'all') return pins;
    return pins.filter(p => p.category === filterCategory);
  }, [pins, filterCategory]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default view centered on Thailand
      const map = L.map(mapContainerRef.current, {
        center: [13.2, 100.8],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Map click handler to easily add a new memory at clicked position
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        // Prompt or pass to new pin
        onOpenNewPinModal(undefined, { lat, lng });
      });

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Route Lines whenever pins or selectedPinId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    if (routeLineLayerRef.current) {
      routeLineLayerRef.current.remove();
      routeLineLayerRef.current = null;
    }

    if (filteredPins.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];
    const markerMap: Record<string, L.Marker> = {};

    filteredPins.forEach((pin, index) => {
      const coords = getPinCoordinates(pin);
      const isSelected = pin.id === selectedPinId;
      const markerNumber = index + 1;

      latLngs.push([coords.lat, coords.lng]);

      // Marker content: numbered circle for all pins
      const markerInner = String(markerNumber);
      const markerFontSize = 'text-xs';

      // Pin color by category: province = brown, hiking = teal, country = coral
      const categoryColor = pin.category === 'hiking'
        ? { base: '#477a48', selected: '#548d56', shadow: '#548d56' }
        : pin.category === 'country'
        ? { base: '#4da9d4', selected: '#36b3ed', shadow: '#37b2ec' }
        : { base: '#f17354', selected: '#f17354', shadow: '#f17354' };

      // Custom HTML Marker matching the screenshot:
      // Category-colored circle with white content, white border and soft drop shadow
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 36px; height: 36px;">
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold ${markerFontSize} text-white transition-transform duration-200 ${
            isSelected ? 'scale-115 shadow-lg' : 'hover:scale-110 shadow-md'
          }" style="border: 2px solid #FFFFFF; background-color: ${
            isSelected ? categoryColor.selected : categoryColor.base
          }; box-shadow: 0 4px 10px ${categoryColor.shadow};">
            ${markerInner}
          </div>
          ${
            isSelected
              ? `<span class="absolute -bottom-1 w-2 h-2 rounded-full" style="background-color: ${categoryColor.selected};"></span>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-numbered-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon });

      // Custom Popup matching the screenshot:
      // Photo on top with close button, title below, and date in soft pink/red italic
      const coverPhoto = (pin.photos && pin.photos.length > 0)
        ? pin.photos[0]
        : 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80';

      const displayDate = formatDisplayDate(pin.dateVisited);

      const popupContent = document.createElement('div');
      popupContent.className = 'w-[220px] sm:w-[240px] bg-white rounded-2xl overflow-hidden shadow-xl text-center relative select-none';
      popupContent.innerHTML = `
        <div class="relative w-full aspect-[4/3] bg-[#FDF4E7] overflow-hidden group">
          <img src="${coverPhoto}" alt="${pin.title}" class="w-full h-full object-cover" />
          <button id="popup-close-${pin.id}" class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs transition-colors z-10 cursor-pointer">
            ✕
          </button>
        </div>
        <div class="p-3.5 bg-white">
          <h4 class="font-serif font-bold text-sm text-[#244855] leading-snug line-clamp-2">
            ${pin.title}
          </h4>
          <p class="text-xs text-[#E64833] italic font-medium mt-1">
            ${displayDate}
          </p>
        </div>
      `;

      // Attach click on close button inside popup
      const closeBtn = popupContent.querySelector(`#popup-close-${pin.id}`);
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          map.closePopup();
        });
      }

      // Attach click on popup card body to view full details
      popupContent.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).id !== `popup-close-${pin.id}`) {
          onOpenPinDetail(pin);
        }
      });

      marker.bindPopup(popupContent, {
        maxWidth: 260,
        closeButton: false,
        autoPan: true,
        autoPanPadding: [40, 40],
      });

      marker.on('click', () => {
        setSelectedPinId(pin.id);
      });

      marker.addTo(markersLayerRef.current!);
      markerMap[pin.id] = marker;
    });

    // Draw route line connecting pins in sequence
    if (showRouteLine && latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#E64833',
        weight: 2.5,
        opacity: 0.65,
        dashArray: '6, 8',
      }).addTo(map);
      routeLineLayerRef.current = polyline;
    }

    // If an active pin is selected, fly to it and open popup
    if (selectedPinId && markerMap[selectedPinId]) {
      const activeMarker = markerMap[selectedPinId];
      const targetCoords = getPinCoordinates(
        filteredPins.find(p => p.id === selectedPinId)!
      );
      
      // Delay slightly for smooth open
      setTimeout(() => {
        if (mapInstanceRef.current) {
          activeMarker.openPopup();
        }
      }, 100);
    }

  }, [filteredPins, selectedPinId, showRouteLine]);

  // Handle clicking a pin item from the right-hand sidebar list
  const handleSelectPinFromList = (pin: TravelPin) => {
    setSelectedPinId(pin.id);
    const map = mapInstanceRef.current;
    if (map) {
      const coords = getPinCoordinates(pin);
      map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 8), {
        duration: 0.8,
      });
    }
  };

  // Center entire map to fit all pins
  const handleFitAllPins = () => {
    const map = mapInstanceRef.current;
    if (!map || filteredPins.length === 0) return;
    const bounds = L.latLngBounds(
      filteredPins.map(p => {
        const c = getPinCoordinates(p);
        return [c.lat, c.lng];
      })
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* 1. Top Badges (collapsed from header category tabs, styled to match the header nav) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-1 pb-1">

        {/* Provinces pill */}
        <button
          onClick={() => onSelectCategory('provinces')}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap bg-[white] text-[#874F41] border border-[#E4CAB3] shadow-xs hover:bg-[#F3E4CE] transition-colors"
        >
          <MapPin className="w-4 h-4 shrink-0" />
          <span>จังหวัดที่เคยไป</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E4CAB3] text-[#7A4A3A]">
            {stats.provincesVisitedCount}/77
          </span>
        </button>

        {/* Hiking / parks pill */}
        <button
          onClick={() => onSelectCategory('hiking')}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap bg-[white] text-[#7A4A3A] border border-[#E4CAB3] shadow-xs hover:bg-[#F3E4CE] transition-colors"
        >
          <Mountain className="w-4 h-4 shrink-0" />
          <span>ป่า & อุทยาน</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E4CAB3] text-[#7A4A3A]">
            {stats.hikingTrailsVisitedCount} แห่ง
          </span>
        </button>

        {/* Countries pill */}
        <button
          onClick={() => onSelectCategory('countries')}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap bg-[white] text-[#7A4A3A] border border-[#E4CAB3] shadow-xs hover:bg-[#F3E4CE] transition-colors"
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>ประเทศที่เคยไป</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E4CAB3] text-[#7A4A3A]">
            {stats.countriesVisitedCount} ปท.
          </span>
        </button>

      </div>

      {/* 2. Main Map View Layout (Left: Map, Right: Numbered Memory List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Map Container (lg: 8 columns) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] rounded-3xl p-3 sm:p-4 border border-[#E4CAB3] shadow-xs relative flex flex-col overflow-hidden">
          
          {/* Map Top Bar Controls */}
          <div className="flex items-center justify-between gap-2 pb-3 px-1 text-xs text-[#9C6B58]">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#244855] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#874F41]" />
                ปักหมุดบนแผนที่
              </span>
              {/* <span className="hidden sm:inline text-[#B98D79]">• คลิกบนแผนที่เพื่อปักหมุดตรงจุดนั้น</span> */}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#874F41] hover:text-[#244855] bg-[#FBE9D0] px-2.5 py-1 rounded-xl border border-[#E4CAB3]">
                <input
                  type="checkbox"
                  checked={showRouteLine}
                  onChange={(e) => setShowRouteLine(e.target.checked)}
                  className="rounded text-[#E64833] focus:ring-0 w-3.5 h-3.5"
                />
                <Route className="w-3.5 h-3.5 text-[#E64833]" />
                <span>เส้นทางเชื่อมทริป</span>
              </label>

              <button
                onClick={handleFitAllPins}
                title="ขยายมุมมองให้เห็นทุกหมุด"
                className="px-2.5 py-1 rounded-xl bg-[#FBE9D0] hover:bg-[#FDF4E7] text-[#874F41] border border-[#E4CAB3] flex items-center gap-1 text-[11px] transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">ทั้งประเทศ</span>
              </button>
            </div>
          </div>

          {/* Leaflet Map Stage */}
          <div
            ref={mapContainerRef}
            className="w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden border border-[#E4CAB3] relative z-10"
          />

          {/* Quick Helper under map */}
          <div className="pt-3 px-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9C6B58] gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E64833]"></span>
              <span>ตัวเลขบนหมุดจะตรงกับลำดับความทรงจำในแถบขวามือ</span>
            </div>
            <button
              onClick={() => onOpenNewPinModal()}
              className="text-[#874F41] hover:text-[#5C3A2E] font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ปักหมุดสถานที่ใหม่</span>
            </button>
          </div>

        </div>

        {/* Right Memory List Sidebar (lg: 4 columns) */}
        <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#E4CAB3] shadow-xs overflow-hidden flex flex-col">
          
          {/* Sidebar Header */}
          <div className="p-4 sm:p-5 border-b border-[#EFDAC1] flex items-center justify-between bg-[#FBE9D0]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#244855] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#E64833] fill-[#E64833]" />
                <span>ไทม์ไลน์ความทรงจำ</span>
              </h3>
              <p className="text-[11px] text-[#9C6B58] mt-0.5">
                คลิกรายการเพื่อเลื่อนแผนที่ไปยังหมุดนั้น
              </p>
            </div>

            <button
              id="sidebar-add-pin-btn"
              onClick={() => onOpenNewPinModal()}
              className="p-2 rounded-xl bg-[#E64833] hover:bg-[#C63A28] text-white transition-all shadow-xs"
              title="เพิ่มหมุดใหม่"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Filter Chips */}
          <div className="p-2.5 bg-[#FFFFFF] border-b border-[#EFDAC1] flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'all'
                  ? 'bg-[#E64833] text-white shadow-2xs'
                  : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
              }`}
            >
              ทั้งหมด ({pins.length})
            </button>
            <button
              onClick={() => setFilterCategory('province')}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'province'
                  ? 'bg-[#874F41] text-white shadow-2xs'
                  : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
              }`}
            >
              🇹🇭 จังหวัด
            </button>
            <button
              onClick={() => setFilterCategory('hiking')}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'hiking'
                  ? 'bg-[#4A6C74] text-white shadow-2xs'
                  : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
              }`}
            >
              ⛰️ เดินป่า
            </button>
            <button
              onClick={() => setFilterCategory('country')}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === 'country'
                  ? 'bg-[#E64833] text-white shadow-2xs'
                  : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
              }`}
            >
              🌍 ต่างประเทศ
            </button>
          </div>

          {/* List items (Matches screenshot design) */}
          <div className="divide-y divide-[#EFDAC1] max-h-[500px] overflow-y-auto">
            {filteredPins.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#B98D79]">
                ยังไม่มีหมุดในหมวดนี้ คลิกปุ่ม + เพื่อปักหมุด
              </div>
            ) : (
              filteredPins.map((pin, index) => {
                const isSelected = pin.id === selectedPinId;
                const markerNumber = index + 1;
                const displayDate = formatDisplayDate(pin.dateVisited);

                return (
                  <div
                    key={pin.id}
                    id={`memory-item-${pin.id}`}
                    onClick={() => handleSelectPinFromList(pin)}
                    className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FFFFFF] via-[#FBD9C7] to-[#FBD9C7] border-l-4 border-l-[#E64833] shadow-xs'
                        : 'hover:bg-[#FBE9D0]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      
                      {/* Number circle badge (identical to screenshot item numbers) */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-transform ${
                          isSelected
                            ? 'bg-[#E64833] text-white shadow-sm shadow-[#E64833]/40 scale-105 ring-2 ring-white'
                            : 'bg-[#FBD9C7] text-[#C63A28] group-hover:bg-[#F4B199]'
                        }`}
                      >
                        {markerNumber}
                      </div>

                      {/* Title & Date */}
                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-medium leading-snug truncate transition-colors ${
                            isSelected
                              ? 'text-[#244855] font-bold'
                              : 'text-[#244855] group-hover:text-[#244855]'
                          }`}
                        >
                          {pin.title}
                        </h4>
                        <p
                          className={`text-xs italic mt-0.5 ${
                            isSelected
                              ? 'text-[#E64833] font-medium'
                              : 'text-[#B98D79]'
                          }`}
                        >
                          {displayDate}
                        </p>
                      </div>

                    </div>

                    {/* Actions on hover */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPinDetail(pin);
                        }}
                        title="ดูรายละเอียด"
                        className="p-1.5 rounded-lg text-[#B98D79] hover:text-[#E64833] hover:bg-white/80 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 bg-[#FBE9D0] border-t border-[#EFDAC1]">
            <button
              onClick={() => onOpenNewPinModal()}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#E64833] hover:bg-[#C63A28] text-white font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ปักหมุดความทรงจำบนแผนที่</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
