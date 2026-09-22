import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  Mountain, 
  Globe2, 
  Calendar, 
  Star, 
  Tag, 
  Image as ImageIcon, 
  Users, 
  CloudSun,
  Sparkles,
  Link,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TravelPin, PinCategory, ThaiProvince, HikingTrail, WorldCountry } from '../types';
import { THAI_PROVINCES } from '../data/provincesData';
import { HIKING_TRAILS_PRESET } from '../data/trailsData';
import { WORLD_COUNTRIES } from '../data/countriesData';
import { PROVINCE_COORDINATES, TRAILS_COORDINATES, COUNTRY_COORDINATES } from '../data/coordinates';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePin: (pin: TravelPin) => void;
  initialCategory?: PinCategory;
  initialLocationCode?: string;
  initialTitle?: string;
  initialSubtitle?: string;
  initialCoords?: { lat: number; lng: number };
  editingPin?: TravelPin | null;
  customTrails: HikingTrail[];
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSavePin,
  initialCategory = 'province',
  initialLocationCode,
  initialTitle,
  initialSubtitle,
  initialCoords,
  editingPin,
  customTrails,
}) => {
  const [category, setCategory] = useState<PinCategory>(initialCategory);
  const [title, setTitle] = useState(initialTitle || '');
  const [subtitle, setSubtitle] = useState(initialSubtitle || '');
  const [locationCode, setLocationCode] = useState(initialLocationCode || '');
  const [lat, setLat] = useState<number | undefined>(initialCoords?.lat);
  const [lng, setLng] = useState<number | undefined>(initialCoords?.lng);
  const [dateVisited, setDateVisited] = useState(new Date().toISOString().slice(0, 10));
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [companion, setCompanion] = useState('กับเพื่อน');
  const [weather, setWeather] = useState<'แดดออก' | 'มีหมอก' | 'ฝนตกปรอยๆ' | 'หนาวเย็น' | 'หิมะ'>('หนาวเย็น');
  const [elevation, setElevation] = useState<string>('');
  const [highlight, setHighlight] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with editingPin or initials
  useEffect(() => {
    if (editingPin) {
      setCategory(editingPin.category);
      setTitle(editingPin.title);
      setSubtitle(editingPin.subtitle || '');
      setLocationCode(editingPin.locationCode || '');
      setLat(editingPin.lat);
      setLng(editingPin.lng);
      setDateVisited(editingPin.dateVisited);
      setPhotos(editingPin.photos || []);
      setNote(editingPin.note);
      setRating(editingPin.rating || 5);
      setTags(editingPin.tags || []);
      setCompanion(editingPin.companion || 'กับเพื่อน');
      setWeather(editingPin.weather || 'หนาวเย็น');
      setElevation(editingPin.elevation ? editingPin.elevation.toString() : '');
      setHighlight(editingPin.highlight || '');
    } else {
      setCategory(initialCategory || 'province');
      setTitle(initialTitle || '');
      setSubtitle(initialSubtitle || '');
      setLocationCode(initialLocationCode || '');
      setLat(initialCoords?.lat);
      setLng(initialCoords?.lng);
      setDateVisited(new Date().toISOString().slice(0, 10));
      setPhotos([]);
      setNote('');
      setRating(5);
      setTags([]);
      setElevation('');
      setHighlight('');
    }
  }, [editingPin, initialCategory, initialTitle, initialSubtitle, initialLocationCode, initialCoords, isOpen]);

  if (!isOpen) return null;

  // Handle Preset Selectors
  const handleSelectProvince = (provId: string) => {
    const prov = THAI_PROVINCES.find((p) => p.id === provId);
    if (prov) {
      setLocationCode(prov.id);
      setTitle(`${prov.nameTh} (${prov.nameEn})`);
      setSubtitle(`${prov.regionTh} • ประเทศไทย`);
      if (PROVINCE_COORDINATES[prov.id]) {
        setLat(PROVINCE_COORDINATES[prov.id].lat);
        setLng(PROVINCE_COORDINATES[prov.id].lng);
      }
    }
  };

  const handleSelectTrail = (trailId: string) => {
    const allTrails = [...HIKING_TRAILS_PRESET, ...customTrails];
    const trail = allTrails.find((t) => t.id === trailId);
    if (trail) {
      setLocationCode(trail.id);
      setTitle(trail.name);
      setSubtitle(`${trail.parkName} จ.${trail.province}`);
      setElevation(trail.elevation.toString());
      if (TRAILS_COORDINATES[trail.id]) {
        setLat(TRAILS_COORDINATES[trail.id].lat);
        setLng(TRAILS_COORDINATES[trail.id].lng);
      }
      if (trail.coverImage && photos.length === 0) {
        setPhotos([trail.coverImage]);
      }
      if (trail.highlight && !highlight) {
        setHighlight(trail.highlight);
      }
    }
  };

  const handleSelectCountry = (countryCode: string) => {
    const country = WORLD_COUNTRIES.find((c) => c.code === countryCode);
    if (country) {
      setLocationCode(country.code);
      setTitle(`${country.nameTh} (${country.nameEn} ${country.flag})`);
      setSubtitle(`ทวีป${country.continentTh}`);
      if (COUNTRY_COORDINATES[country.code]) {
        setLat(COUNTRY_COORDINATES[country.code].lat);
        setLng(COUNTRY_COORDINATES[country.code].lng);
      }
    }
  };

  // Photo file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setPhotos((prev) => [...prev, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Trigger celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#874F41', '#4A6C74', '#D4AF37', '#FBE9D0'],
      });
    } catch (err) {
      // Ignore in environments where canvas may not be available
    }

    const newPin: TravelPin = {
      id: editingPin ? editingPin.id : `pin-${Date.now()}`,
      category,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      locationCode: locationCode || undefined,
      dateVisited: dateVisited || new Date().toISOString().slice(0, 10),
      photos,
      note: note.trim(),
      rating,
      tags: tags.length > 0 ? tags : undefined,
      companion: companion || undefined,
      weather,
      elevation: elevation ? Number(elevation) : undefined,
      highlight: highlight.trim() || undefined,
      lat,
      lng,
      createdAt: editingPin ? editingPin.createdAt : Date.now(),
    };

    onSavePin(newPin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#244855]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full p-5 sm:p-7 border border-[#E4CAB3] shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFDAC1] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF4E7] text-[#874F41] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#244855]">
                {editingPin ? 'แก้ไขหมุดความทรงจำ' : 'ปักหมุดความทรงจำใหม่'}
              </h3>
              <p className="text-xs text-[#9C6B58]">
                บันทึกภาพถ่าย วันที่เดินทาง และเรื่องราวที่น่าจดจำ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#B98D79] hover:text-[#244855] hover:bg-[#FBE9D0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Category Switcher */}
          <div>
            <label className="block text-xs font-semibold text-[#7B483B] mb-1.5">
              1. เลือกหมวดหมู่การเดินทาง *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('province')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  category === 'province'
                    ? 'bg-[#874F41] text-[#FBE9D0] border-[#874F41] shadow-xs'
                    : 'bg-[#FBE9D0] text-[#874F41] border-[#E4CAB3] hover:bg-[#FDF4E7]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>🇹🇭 จังหวัดในไทย</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('hiking')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  category === 'hiking'
                    ? 'bg-[#4A6C74] text-[#FBE9D0] border-[#4A6C74] shadow-xs'
                    : 'bg-[#FBE9D0] text-[#874F41] border-[#E4CAB3] hover:bg-[#FDF4E7]'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>⛰️ สายเดินป่า / อุทยาน</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('country')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  category === 'country'
                    ? 'bg-[#E64833] text-[#FBE9D0] border-[#E64833] shadow-xs'
                    : 'bg-[#FBE9D0] text-[#874F41] border-[#E4CAB3] hover:bg-[#FDF4E7]'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>🌍 ประเทศทั่วโลก</span>
              </button>
            </div>
          </div>

          {/* Quick Select or Custom Place */}
          <div className="bg-[#FBE9D0] p-3.5 rounded-2xl border border-[#E4CAB3] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#9C6B58]">
              <span className="font-semibold text-[#7B483B]">
                {category === 'province'
                  ? 'เลือกจังหวัดจากรายชื่อ 77 จังหวัด'
                  : category === 'hiking'
                  ? 'เลือกยอดดอย/อุทยานยอดนิยม'
                  : 'เลือกประเทศจากรายชื่อ'}
              </span>
              <span className="text-[11px] text-[#B98D79]">หรือพิมพ์ชื่อเองด้านล่าง</span>
            </div>

            {category === 'province' && (
              <select
                value={locationCode}
                onChange={(e) => handleSelectProvince(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm text-[#244855] focus:outline-none focus:ring-1 focus:ring-[#874F41]"
              >
                <option value="">-- เลือกจังหวัด --</option>
                {THAI_PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameTh} ({p.nameEn}) - {p.regionTh}
                  </option>
                ))}
              </select>
            )}

            {category === 'hiking' && (
              <select
                value={locationCode}
                onChange={(e) => handleSelectTrail(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm text-[#244855] focus:outline-none focus:ring-1 focus:ring-[#4A6C74]"
              >
                <option value="">-- เลือกยอดเขา / เส้นทางเดินป่า --</option>
                {[...HIKING_TRAILS_PRESET, ...customTrails].map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.elevation} ม.) - {t.province}
                  </option>
                ))}
              </select>
            )}

            {category === 'country' && (
              <select
                value={locationCode}
                onChange={(e) => handleSelectCountry(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm text-[#244855] focus:outline-none focus:ring-1 focus:ring-[#E64833]"
              >
                <option value="">-- เลือกประเทศ --</option>
                {WORLD_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.nameTh} ({c.nameEn}) - {c.continentTh}
                  </option>
                ))}
              </select>
            )}

            {/* Title & Subtitle inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-[#7B483B] mb-1">
                  ชื่อสถานที่บนหมุด *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เชียงใหม่, ภูกระดึง, ญี่ปุ่น"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#7B483B] mb-1">
                  คำอธิบายเสริม / โลเคชันย่อย
                </label>
                <input
                  type="text"
                  placeholder="เช่น แม่กำปอง, ผาหล่มสัก, เกียวโต"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                />
              </div>

              {typeof lat === 'number' && typeof lng === 'number' && (
                <div className="col-span-1 sm:col-span-2 flex items-center justify-between text-[11px] bg-[#FBE9D0] px-3 py-2 rounded-xl border border-[#E4CAB3] text-[#874F41]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#E64833]" />
                    <span>พิกัดบนแผนที่: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
                  </span>
                  <span className="text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full font-medium">
                    เชื่อมต่อจุดบนแผนที่แล้ว
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Date & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                วันที่เดินทางไป *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dateVisited}
                  onChange={(e) => setDateVisited(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                เพื่อนร่วมทาง
              </label>
              <select
                value={companion}
                onChange={(e) => setCompanion(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
              >
                <option value="ไปคนเดียว (Solo)">ไปคนเดียว (Solo)</option>
                <option value="กับเพื่อน">กับเพื่อน</option>
                <option value="กับแฟน">กับแฟน</option>
                <option value="กับครอบครัว">กับครอบครัว</option>
                <option value="แก๊งสายลุย">แก๊งสายลุย</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                สภาพอากาศ
              </label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#874F41]"
              >
                <option value="หนาวเย็น">❄️ หนาวเย็น</option>
                <option value="แดดออก">☀️ แดดออกแจ่มใส</option>
                <option value="มีหมอก">🌫️ ทะเลหมอกหนา</option>
                <option value="ฝนตกปรอยๆ">🌧️ ฝนตกปรอยๆ</option>
                <option value="หิมะ">⛄ หิมะตก</option>
              </select>
            </div>
          </div>

          {/* Elevation if hiking */}
          {category === 'hiking' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#EEF4F3] rounded-2xl border border-[#BCCECE]">
              <div>
                <label className="block text-xs font-semibold text-[#4A6C74] mb-1">
                  ความสูงยอดเขา (เมตร จากระดับน้ำทะเล)
                </label>
                <input
                  type="number"
                  placeholder="เช่น 2225"
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#BCCECE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A6C74] mb-1">
                  จุดประทับใจ / ไฮไลต์
                </label>
                <input
                  type="text"
                  placeholder="เช่น ผาหล่มสัก, ทะเลหมอกกิ่วลม"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#BCCECE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6C74]"
                />
              </div>
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#7B483B]">
                รูปถ่ายความทรงจำ (อัปโหลดจากเครื่อง หรือใส่ URL)
              </label>
              <span className="text-[11px] text-[#9C6B58]">
                {photos.length} รูปที่เลือก
              </span>
            </div>

            {/* Upload Area */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl border border-dashed border-[#874F41] bg-[#EAD3BB] hover:bg-[#FDF4E7] text-[#874F41] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>เลือกรูปจากอุปกรณ์ (มือถือ/คอม)</span>
              </button>

              <div className="flex-1 flex gap-1.5">
                <input
                  type="url"
                  placeholder="หรือวางลิงก์รูปภาพ (URL)..."
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#874F41]"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="px-3 py-2 bg-[#FDF4E7] hover:bg-[#E4CAB3] text-[#7B483B] text-xs font-medium rounded-xl transition-colors"
                >
                  เพิ่ม URL
                </button>
              </div>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-2">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-[#FDF4E7] border border-[#E4CAB3] group">
                    <img
                      src={url}
                      alt={`Memory photo ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px]">
                        ภาพปก
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Memory Note Section */}
          <div>
            <label className="block text-xs font-semibold text-[#7B483B] mb-1">
              เขียนโน๊ตความทรงจำ & เรื่องราวประทับใจ *
            </label>
            <textarea
              required
              rows={3}
              placeholder="เล่าเรื่องราวความรู้สึก รสชาติอาหาร บรรยากาศ พระอาทิตย์ขึ้น หรือมิตรภาพระหว่างทาง..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FBE9D0] border border-[#E4CAB3] rounded-2xl text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-2 focus:ring-[#874F41]/30 leading-relaxed"
            />
          </div>

          {/* Rating & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#7B483B] mb-1.5">
                ระดับความประทับใจ
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-[#D4AF37] hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#E4CAB3]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-[#9C6B58] ml-2">
                  {rating === 5 ? 'ประทับใจสุดๆ' : rating === 4 ? 'ดีมาก' : rating === 3 ? 'ปานกลาง' : 'พอใช้'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7B483B] mb-1">
                แท็ก (กด Enter เพื่อเพิ่ม)
              </label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="เช่น ทะเลหมอก, วิวหลักล้าน, กาแฟดอย"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-3 py-1.5 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#874F41]"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-[#FDF4E7] text-[#874F41] flex items-center gap-1"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#EFDAC1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-[#9C6B58] hover:bg-[#FBE9D0] font-medium"
            >
              ยกเลิก
            </button>
            <button
              id="save-pin-submit-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#874F41] hover:bg-[#6C3F34] text-[#FBE9D0] text-sm font-semibold shadow-md shadow-[#874F41]/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingPin ? 'บันทึกการแก้ไข' : 'ปักหมุดความทรงจำ'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
