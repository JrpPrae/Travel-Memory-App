import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Sparkles, 
  Mountain, 
  Luggage, 
  FileText,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { ChecklistItem } from '../types';
import { DEFAULT_CHECKLIST_TEMPLATES } from '../data/checklistTemplates';

interface ChecklistViewProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (text: string, category: ChecklistItem['category']) => void;
  onDeleteItem: (id: string) => void;
  onResetDefaultChecklist: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetDefaultChecklist,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'hiking' | 'travel' | 'document'>('all');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<ChecklistItem['category']>('hiking');

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddItem(newText.trim(), newCategory);
    setNewText('');
  };

  const getCategoryIcon = (cat: ChecklistItem['category']) => {
    switch (cat) {
      case 'hiking':
        return <Mountain className="w-3.5 h-3.5 text-[#4A6C74]" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-[#E64833]" />;
      default:
        return <Luggage className="w-3.5 h-3.5 text-[#874F41]" />;
    }
  };

  const getCategoryLabel = (cat: ChecklistItem['category']) => {
    switch (cat) {
      case 'hiking':
        return 'สายเดินป่า & แคมป์';
      case 'document':
        return 'เอกสาร & การเดินทาง';
      default:
        return 'ของใช้ทั่วไป & สัมภาระ';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header card */}
      <div className="bg-gradient-to-r from-[#FDF4E7] via-[#FFFFFF] to-[#FDF4E7] rounded-3xl p-6 sm:p-8 border border-[#E4CAB3] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAD3BB] text-[#7B483B] text-xs font-semibold mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Feature • Travel & Hiking Checklist</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#244855]">
              รายการเช็กของก่อนออกเดินทาง
            </h2>
            <p className="text-xs sm:text-sm text-[#9C6B58] mt-1">
              จัดกระเป๋าไม่ตกหล่น ทั้งอุปกรณ์เดินป่า แคมป์ปิ้ง ยาสามัญ และเอกสารเดินทางรอบโลก
            </p>
          </div>

          {/* Progress meter */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E4CAB3] shadow-xs min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-[#9C6B58] mb-2">
              <span>ความพร้อมการจัดของ</span>
              <span className="font-bold text-[#874F41]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#FDF4E7] h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-[#874F41] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-[#9C6B58] flex items-center justify-between">
              <span>จัดเตรียมแล้ว {completedCount} / {items.length} ชิ้น</span>
              {progressPercent === 100 && (
                <span className="text-[#4A6C74] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> พร้อมลุย!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E4CAB3] shadow-xs flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#874F41] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
            }`}
          >
            ทั้งหมด ({items.length})
          </button>
          <button
            onClick={() => setActiveCategory('hiking')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === 'hiking'
                ? 'bg-[#4A6C74] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>อุปกรณ์เดินป่า ({items.filter((i) => i.category === 'hiking').length})</span>
          </button>
          <button
            onClick={() => setActiveCategory('document')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === 'document'
                ? 'bg-[#E64833] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>เอกสารสำคัญ ({items.filter((i) => i.category === 'document').length})</span>
          </button>
          <button
            onClick={() => setActiveCategory('travel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === 'travel'
                ? 'bg-[#874F41] text-[#FBE9D0]'
                : 'bg-[#FBE9D0] text-[#874F41] hover:bg-[#FDF4E7]'
            }`}
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>สัมภาระทั่วไป ({items.filter((i) => i.category === 'travel').length})</span>
          </button>
        </div>

        <button
          onClick={onResetDefaultChecklist}
          title="โหลดรายการแนะนำเริ่มต้นใหม่"
          className="text-xs text-[#9C6B58] hover:text-[#244855] flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4CAB3] hover:bg-[#FBE9D0]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>รีเซ็ตแม่แบบ</span>
        </button>
      </div>

      {/* Add new item form */}
      <form onSubmit={handleAdd} className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E4CAB3] shadow-xs flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="เพิ่มรายการที่ต้องเตรียม (เช่น ไม้เท้าเดินป่า, เสื้อกันหนาว, ปลั๊กแปลง)..."
          className="flex-1 px-3.5 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-2 focus:ring-[#874F41]/30"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="px-3 py-2 bg-[#FBE9D0] border border-[#E4CAB3] rounded-xl text-xs sm:text-sm text-[#7B483B] focus:outline-none"
        >
          <option value="hiking">⛰️ อุปกรณ์เดินป่า</option>
          <option value="document">📄 เอกสารสำคัญ</option>
          <option value="travel">🧳 สัมภาระทั่วไป</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#874F41] hover:bg-[#6C3F34] text-[#FBE9D0] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มรายการ</span>
        </button>
      </form>

      {/* Checklist items */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4CAB3] shadow-xs divide-y divide-[#EFDAC1] overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-[#B98D79] text-sm">
            ไม่มีรายการในหมวดนี้ เพิ่มรายการใหม่ได้เลย!
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                item.completed ? 'bg-[#FBE9D0]/50' : 'hover:bg-[#FBE9D0]'
              }`}
            >
              <div
                onClick={() => onToggleItem(item.id)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className="text-[#874F41]">
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-[#4A6C74] fill-[#EEF4F3]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#B98D79]" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      item.completed
                        ? 'line-through text-[#B98D79]'
                        : 'text-[#244855] font-medium'
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#EAD3BB] text-[#9C6B58] border border-[#EFDAC1]">
                    {getCategoryIcon(item.category)}
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 text-[#B98D79] hover:text-[#B84E25] hover:bg-[#FBE8E8] rounded-lg transition-colors"
                title="ลบรายการ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
