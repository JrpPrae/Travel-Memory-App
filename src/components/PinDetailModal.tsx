import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Mountain, 
  Globe2, 
  Star, 
  Users, 
  CloudSun, 
  Edit3, 
  Trash2, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';
import { TravelPin } from '../types';

interface PinDetailModalProps {
  pin: TravelPin | null;
  onClose: () => void;
  onEdit: (pin: TravelPin) => void;
  onDelete: (id: string) => void;
}

export const PinDetailModal: React.FC<PinDetailModalProps> = ({
  pin,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!pin) return null;

  const hasPhotos = pin.photos && pin.photos.length > 0;

  const getCategoryInfo = () => {
    switch (pin.category) {
      case 'province':
        return { label: '🇹🇭 จังหวัดในไทย', color: 'bg-[#EAD3BB] text-[#874F41] border-[#E4CAB3]', icon: MapPin };
      case 'hiking':
        return { label: '⛰️ สายเดินป่า / ยอดดอย', color: 'bg-[#EEF4F3] text-[#4A6C74] border-[#BCCECE]', icon: Mountain };
      case 'country':
        return { label: '🌍 ประเทศทั่วโลก', color: 'bg-[#FBD9C7] text-[#E64833] border-[#F4B199]', icon: Globe2 };
    }
  };

  const catInfo = getCategoryInfo();
  const Icon = catInfo.icon;

  const handleCopyStory = () => {
    const text = `📌 บันทึกความทรงจำการเดินทาง: ${pin.title}\n🗓️ วันที่: ${pin.dateVisited}\n✨ ไฮไลต์: ${pin.note}\n#TravelMemoryPinboard`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#244855]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-3xl w-full border border-[#E4CAB3] shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#EFDAC1] flex items-center justify-between bg-[#FBE9D0]">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${catInfo.color}`}>
              <Icon className="w-3.5 h-3.5" />
              {catInfo.label}
            </span>
            <span className="text-xs text-[#9C6B58] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {pin.dateVisited}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyStory}
              className="p-2 text-[#9C6B58] hover:text-[#244855] hover:bg-[#FDF4E7] rounded-xl transition-colors text-xs flex items-center gap-1"
              title="คัดลอกเรื่องราว"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'คัดลอกแล้ว' : 'แชร์'}</span>
            </button>

            <button
              onClick={() => onEdit(pin)}
              className="p-2 text-[#9C6B58] hover:text-[#874F41] hover:bg-[#FDF4E7] rounded-xl transition-colors"
              title="แก้ไขหมุด"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm('คุณต้องการลบหมุดความทรงจำนี้ใช่หรือไม่?')) {
                  onDelete(pin.id);
                  onClose();
                }
              }}
              className="p-2 text-[#B98D79] hover:text-red-600 hover:bg-[#FBE8E8] rounded-xl transition-colors"
              title="ลบหมุด"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#B98D79] hover:text-[#244855] hover:bg-[#FDF4E7] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Photo Showcase (Polaroid Frame) */}
          {hasPhotos && (
            <div className="space-y-3">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#FDF4E7] border border-[#E4CAB3] shadow-inner">
                <img
                  src={pin.photos[activePhotoIdx]}
                  alt={pin.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Slideshow Controls */}
                {pin.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : pin.photos.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev < pin.photos.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-xs">
                      {activePhotoIdx + 1} / {pin.photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails strip */}
              {pin.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {pin.photos.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activePhotoIdx === idx ? 'border-[#874F41] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Titles & Meta */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#244855] leading-tight">
                  {pin.title}
                </h2>
                {pin.subtitle && (
                  <p className="text-sm text-[#9C6B58] mt-1 font-light">
                    {pin.subtitle}
                  </p>
                )}
              </div>

              {/* Rating */}
              {pin.rating && (
                <div className="flex items-center gap-1 bg-[#EAD3BB] px-3 py-1.5 rounded-xl border border-[#EFDAC1]">
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="font-bold text-sm text-[#244855]">{pin.rating} / 5</span>
                </div>
              )}
            </div>

            {/* Badges strip: Elevation, Weather, Companion */}
            <div className="flex flex-wrap gap-2 pt-2">
              {pin.elevation && (
                <span className="px-2.5 py-1 rounded-lg bg-[#EEF4F3] text-[#4A6C74] text-xs font-semibold border border-[#BCCECE] flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5" />
                  ความสูง: {pin.elevation.toLocaleString()} เมตร
                </span>
              )}
              {pin.companion && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FBE9D0] text-[#874F41] text-xs font-medium border border-[#E4CAB3] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#874F41]" />
                  {pin.companion}
                </span>
              )}
              {pin.weather && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FBE9D0] text-[#874F41] text-xs font-medium border border-[#E4CAB3]">
                  สภาพอากาศ: {pin.weather}
                </span>
              )}
              {pin.highlight && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FFF8E7] text-[#9E6900] text-xs font-medium border border-[#FCE8B3] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  จุดประทับใจ: {pin.highlight}
                </span>
              )}
            </div>
          </div>

          {/* Memory Note Section */}
          <div className="bg-[#FBE9D0] p-5 rounded-2xl border border-[#E4CAB3] space-y-2">
            <span className="text-xs font-bold text-[#874F41] uppercase tracking-wider block">
              📖 บันทึกความทรงจำ (Travel Note)
            </span>
            <p className="text-sm text-[#244855] leading-relaxed whitespace-pre-line font-light">
              {pin.note || 'ไม่มีข้อความบันทึก'}
            </p>
          </div>

          {/* Tags */}
          {pin.tags && pin.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {pin.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#FDF4E7] text-[#874F41]"
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EFDAC1] bg-[#FBE9D0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#874F41] hover:bg-[#6C3F34] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
