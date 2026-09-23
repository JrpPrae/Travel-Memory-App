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

// Popup content is built as a raw HTML string for Leaflet, so any pin data
// injected into it (title, note, date) must be escaped to avoid HTML/script
// from a saved memory being interpreted as markup.
function escapeHtml(value: string): string {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

// Small inline SVG icons + Thai label for the map popup's category row,
// since Leaflet popups are built as raw HTML and can't render lucide-react
// components directly.
const POPUP_ICON = {
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  image: '<path d="M20.4 14.5 16 10 4 20"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/>',
};

function getCategoryMeta(category: PinCategory): { label: string; icon: string } {
  if (category === 'hiking') return { label: 'ป่า & อุทยาน', icon: POPUP_ICON.mountain };
  if (category === 'country') return { label: 'ประเทศที่เคยไป', icon: POPUP_ICON.globe };
  return { label: 'จังหวัดที่เคยไป', icon: POPUP_ICON.pin };
}

function popupSvg(pathContent: string, extraClass = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${extraClass}">${pathContent}</svg>`;
}

// Turns a sequence of straight waypoints into a smooth curved path by
// bowing each segment out through a quadratic-bezier control point and
// sampling it, so the route reads as a gentle arc instead of straight legs.
function buildCurvedPath(points: [number, number][], bend = 0.18): L.LatLngExpression[] {
  if (points.length < 2) return points;
  const curved: L.LatLngExpression[] = [];
  const segments = 24;

  for (let i = 0; i < points.length - 1; i++) {
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[i + 1];
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;
    // Perpendicular offset from the midpoint, alternating sides per segment
    // so a multi-stop route doesn't bow uniformly in one direction.
    const direction = i % 2 === 0 ? 1 : -1;
    const controlLat = midLat + -dLng * bend * direction;
    const controlLng = midLng + dLat * bend * direction;

    const startT = i === 0 ? 0 : 1;
    for (let t = startT; t <= segments; t++) {
      const tt = t / segments;
      const lat = (1 - tt) ** 2 * lat1 + 2 * (1 - tt) * tt * controlLat + tt ** 2 * lat2;
      const lng = (1 - tt) ** 2 * lng1 + 2 * (1 - tt) * tt * controlLng + tt ** 2 * lng2;
      curved.push([lat, lng]);
    }
  }

  return curved;
}

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
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest');

  // Filtered pins, sorted chronologically so pin numbers and the timeline
  // sidebar always follow the actual travel date order (earliest first by
  // default, or most-recent-first when the visitor flips the sort order)
  const filteredPins = useMemo(() => {
    const base = filterCategory === 'all' ? pins : pins.filter(p => p.category === filterCategory);
    const sorted = [...base].sort((a, b) => new Date(a.dateVisited).getTime() - new Date(b.dateVisited).getTime());
    return sortOrder === 'newest' ? sorted.reverse() : sorted;
  }, [pins, filterCategory, sortOrder]);

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

    filteredPins.forEach((pin) => {
      const coords = getPinCoordinates(pin);
      const isSelected = pin.id === selectedPinId;

      latLngs.push([coords.lat, coords.lng]);

      // Pin color by category: province = brown, hiking = teal, country = coral
      const categoryColor = pin.category === 'hiking'
        ? { base: '#477a48', selected: '#548d56', shadow: '#548d56' }
        : pin.category === 'country'
        ? { base: '#4da9d4', selected: '#36b3ed', shadow: '#37b2ec' }
        : { base: '#f17354', selected: '#f17354', shadow: '#f17354' };

      const pinColor = isSelected ? categoryColor.selected : categoryColor.base;
      const coverThumb = (pin.photos && pin.photos.length > 0) ? pin.photos[0] : null;

      // Custom HTML Marker: a teardrop pin shape with the pin's cover photo
      // inset in a circular window.
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 46px;">
          <div class="absolute top-0 left-1/2 transition-transform duration-200 ${
            isSelected ? 'scale-110' : 'group-hover:scale-105'
          }" style="width: 38px; height: 38px; margin-left: -19px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background-color: ${pinColor}; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px ${categoryColor.shadow}80, 0 2px 4px rgba(0,0,0,0.15);">
            <div class="absolute" style="top: 50%; left: 50%; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; transform: rotate(45deg); overflow: hidden; background-color: rgba(255,255,255,0.35);">
              ${
                coverThumb
                  ? `<img src="${coverThumb}" alt="" class="w-full h-full object-cover" />`
                  : `<div class="w-full h-full flex items-center justify-center" style="background-color: ${pinColor};"></div>`
              }
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-photo-pin',
        iconSize: [38, 46],
        iconAnchor: [19, 42],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon });

      // Custom Popup matching the screenshot:
      // Photo on top with close button, title below, and date in soft pink/red italic
      const coverPhoto = (pin.photos && pin.photos.length > 0) ? pin.photos[0] : null;

      const displayDate = formatDisplayDate(pin.dateVisited);
      const categoryMeta = getCategoryMeta(pin.category);

      const popupContent = document.createElement('div');
      popupContent.className = 'w-[220px] sm:w-[240px] bg-white rounded-2xl overflow-hidden shadow-xl text-left relative select-none';
      popupContent.innerHTML = `
        <div class="relative w-full aspect-[4/3] bg-[#FDF4E7] overflow-hidden group">
          ${
            coverPhoto
              ? `<img src="${coverPhoto}" alt="${pin.title}" class="w-full h-full object-cover" />`
              : `<div class="w-full h-full flex flex-col items-center justify-center text-[#B98D79]">
                   ${popupSvg(POPUP_ICON.image, 'w-8 h-8 mb-1')}
                   <span class="text-xs">ไม่มีรูปภาพ</span>
                 </div>`
          }
          <button id="popup-close-${pin.id}" class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs transition-colors z-10 cursor-pointer">
            ✕
          </button>
        </div>
        <div class="p-3.5 bg-white">
          <div class="flex items-center gap-1 text-[10px] font-semibold text-[#9C6B58] uppercase tracking-wide">
            ${popupSvg(categoryMeta.icon, 'w-3 h-3 shrink-0')}
            <span>${categoryMeta.label}</span>
          </div>
          <h4 class="font-serif font-bold text-sm text-[#244855] leading-snug line-clamp-2 mt-1">
            ${escapeHtml(pin.title)}
          </h4>
          <div class="flex items-center gap-1 text-xs text-[#7B483B] font-medium mt-1.5">
            ${popupSvg(POPUP_ICON.calendar, 'w-3.5 h-3.5 shrink-0 text-[#B98D79]')}
            <span>${escapeHtml(displayDate)}</span>
          </div>
          ${
            pin.note
              ? `<p class="text-[11px] text-[#7B483B] leading-snug line-clamp-2 mt-1.5">
                   ${escapeHtml(pin.note)}
                 </p>`
              : ''
          }
          ${
            pin.subtitle
              ? `<div class="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#FBE9D0] text-[#7A4A3A] border border-[#E4CAB3] mt-2 max-w-full">
                   ${popupSvg(POPUP_ICON.mountain, 'w-3 h-3 shrink-0')}
                   <span class="truncate">${escapeHtml(pin.subtitle)}</span>
                 </div>`
              : ''
          }
          <button id="popup-view-more-${pin.id}" class="w-full mt-2.5 py-2 rounded-xl bg-[#E64833] hover:bg-[#C63A28] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            ${popupSvg(POPUP_ICON.image, 'w-3.5 h-3.5')}
            <span>ดูภาพเพิ่มเติม</span>
            ${popupSvg(POPUP_ICON.chevronRight, 'w-3.5 h-3.5')}
          </button>
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

    // Draw a smooth curved, animated route line connecting pins in sequence
    if (showRouteLine && latLngs.length > 1) {
      const curvedPath = buildCurvedPath(latLngs as [number, number][]);
      const polyline = L.polyline(curvedPath, {
        color: '#E64833',
        weight: 3,
        opacity: 0.7,
        dashArray: '1, 10',
        lineCap: 'round',
        className: 'route-line-animated',
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

      {/* 1. Top Stat Cards (province / hiking / country counters) — stay in a
          row on phones too, shrinking padding/text instead of stacking */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 pt-1 pb-1">

        {/* Provinces stat card */}
        <button
          onClick={() => onSelectCategory('provinces')}
          className="flex items-center gap-1.5 sm:gap-3 bg-white rounded-xl sm:rounded-2xl border border-[#E4CAB3] shadow-xs px-2 py-2 sm:px-4 sm:py-3.5 hover:shadow-sm hover:border-[#3F7D52]/50 transition-all group text-left min-w-0"
        >
          <span className="w-7 h-7 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#3F7D52] text-white shrink-0">
            <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[9px] sm:text-xs text-[#9C6B58] leading-tight mb-0.5 sm:mb-1 truncate">จังหวัดที่เคยไป</span>
            <span className="inline-block text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#E4CAB3] text-[#7A4A3A] whitespace-nowrap">
              {stats.provincesVisitedCount}/77
            </span>
          </span>
          <ChevronRight className="hidden sm:block w-4 h-4 text-[#B98D79] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* Hiking / parks stat card */}
        <button
          onClick={() => onSelectCategory('hiking')}
          className="flex items-center gap-1.5 sm:gap-3 bg-white rounded-xl sm:rounded-2xl border border-[#E4CAB3] shadow-xs px-2 py-2 sm:px-4 sm:py-3.5 hover:shadow-sm hover:border-[#B5622F]/50 transition-all group text-left min-w-0"
        >
          <span className="w-7 h-7 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#B5622F] text-white shrink-0">
            <Mountain className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[9px] sm:text-xs text-[#9C6B58] leading-tight mb-0.5 sm:mb-1 truncate">ป่า & อุทยาน</span>
            <span className="inline-block text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#E4CAB3] text-[#7A4A3A] whitespace-nowrap">
              {stats.hikingTrailsVisitedCount} แห่ง
            </span>
          </span>
          <ChevronRight className="hidden sm:block w-4 h-4 text-[#B98D79] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* Countries stat card */}
        <button
          onClick={() => onSelectCategory('countries')}
          className="flex items-center gap-1.5 sm:gap-3 bg-white rounded-xl sm:rounded-2xl border border-[#E4CAB3] shadow-xs px-2 py-2 sm:px-4 sm:py-3.5 hover:shadow-sm hover:border-[#2F6F76]/50 transition-all group text-left min-w-0"
        >
          <span className="w-7 h-7 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#2F6F76] text-white shrink-0">
            <Globe className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[9px] sm:text-xs text-[#9C6B58] leading-tight mb-0.5 sm:mb-1 truncate">ประเทศที่เคยไป</span>
            <span className="inline-block text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#E4CAB3] text-[#7A4A3A] whitespace-nowrap">
              {stats.countriesVisitedCount} ปท.
            </span>
          </span>
          <ChevronRight className="hidden sm:block w-4 h-4 text-[#B98D79] group-hover:translate-x-0.5 transition-transform shrink-0" />
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

          {/* Sort Order */}
          <div className="px-2.5 py-2 bg-[#FFFFFF] border-b border-[#EFDAC1] flex items-center justify-end gap-1.5">
            <span className="text-[11px] text-[#9C6B58]">เรียงลำดับ:</span>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sortOrder === 'oldest'
                  ? 'bg-[#E4CAB3] text-[#244855] font-semibold'
                  : 'text-[#874F41] hover:bg-[#FBE9D0]'
              }`}
            >
              สถานที่แรกสุด
            </button>
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sortOrder === 'newest'
                  ? 'bg-[#E4CAB3] text-[#244855] font-semibold'
                  : 'text-[#874F41] hover:bg-[#FBE9D0]'
              }`}
            >
              สถานที่ล่าสุด
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
