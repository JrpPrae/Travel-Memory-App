import React from 'react';
import {
  Map,
  Compass,
  CheckSquare,
  CalendarDays,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { TravelStats } from '../types';

export type ActiveTab = 'map' | 'pinboard' | 'provinces' | 'hiking' | 'countries' | 'checklist' | 'plans';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: TravelStats;
  onOpenNewPinModal: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenNewPinModal,
  onResetDemo,
}) => {
  const tabs = [
    { id: 'map' as ActiveTab, label: 'แผนที่ปักหมุด', icon: Map, count: stats.provincesVisitedCount + stats.hikingTrailsVisitedCount + stats.countriesVisitedCount },
    { id: 'pinboard' as ActiveTab, label: 'กระดานภาพโพลารอยด์', icon: Compass },
    { id: 'checklist' as ActiveTab, label: 'Check List', icon: CheckSquare },
    { id: 'plans' as ActiveTab, label: 'My Plan', icon: CalendarDays },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBE9D0]/95 backdrop-blur-md border-b border-[#E4CAB3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('pinboard')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#874F41] to-[#5C3A2E] flex items-center justify-center text-[#FBE9D0] shadow-sm shadow-[#874F41]/20">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#244855] tracking-tight">
                  Travel Memory
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FDF4E7] text-[#7B483B] font-medium border border-[#E4CAB3]">
                  Pinboard
                </span>
              </div>
              <p className="text-xs text-[#9C6B58] font-light hidden sm:block">
                ปักหมุดความทรงจำ • นับสถิติ 3 หมวดการเดินทาง
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="header-reset-btn"
              onClick={onResetDemo}
              title="รีเซ็ตเป็นข้อมูลตัวอย่าง"
              className="p-2.5 rounded-xl border border-[#E4CAB3] text-[#9C6B58] hover:bg-[#FDF4E7] hover:text-[#244855] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="header-add-pin-btn"
              onClick={onOpenNewPinModal}
              className="px-4 py-2.5 rounded-xl bg-[#874F41] hover:bg-[#6C3F34] text-[#FBE9D0] text-sm font-semibold shadow-sm shadow-[#874F41]/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ปักหมุดความทรงจำ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t border-[#FDF4E7]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#E4CAB3] text-[#244855] shadow-xs font-semibold'
                    : 'text-[#874F41] hover:text-[#244855] hover:bg-[#FDF4E7]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#874F41]' : 'text-[#9C6B58]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#874F41] text-[#FBE9D0]'
                        : 'bg-[#E4CAB3] text-[#874F41]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
