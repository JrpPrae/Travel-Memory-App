import React, { useState, useRef, useEffect } from 'react';
import {
  Map,
  Compass,
  CheckSquare,
  CalendarDays,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { TravelStats } from '../types';

export type ActiveTab = 'map' | 'pinboard' | 'provinces' | 'hiking' | 'countries' | 'checklist' | 'plans';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: TravelStats;
  onOpenNewPinModal: () => void;
  onResetDemo: () => void;
  currentUser: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenNewPinModal,
  onResetDemo,
  currentUser,
  onLogout,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = currentUser.slice(0, 2).toUpperCase();

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
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-1" onClick={() => setActiveTab('pinboard')}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#874F41] to-[#5C3A2E] flex items-center justify-center text-[#FBE9D0] shadow-sm shadow-[#874F41]/20 flex-shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-xl lg:text-2xl text-[#244855] tracking-tight truncate">
                  Travel Memory
                </span>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-[#FDF4E7] text-[#7B483B] font-medium border border-[#E4CAB3] flex-shrink-0">
                  Pinboard
                </span>
              </div>
            </div>
          </div>

          {/* Profile / Account */}
          <div className="relative flex-shrink-0" ref={profileRef}>
            <button
              id="header-profile-btn"
              onClick={() => setIsProfileOpen((v) => !v)}
              className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-full border border-[#E4CAB3] bg-[#FDF4E7] hover:bg-[#FFFFFF] transition-colors shadow-xs"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#4A6C74] to-[#244855] text-[#FBE9D0] flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs">
                {initials}
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-[#244855] max-w-[100px] truncate">
                {currentUser}
              </span>
              <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-[#9C6B58] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] rounded-2xl border border-[#E4CAB3] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[#EFDAC1] bg-[#FBE9D0]">
                  <p className="text-[11px] text-[#9C6B58]">เข้าสู่ระบบเป็น</p>
                  <p className="text-sm font-semibold text-[#244855] truncate">{currentUser}</p>
                </div>
                <button
                  id="header-logout-btn"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm text-[#B82525] hover:bg-[#FBE8E8] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            )}
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
