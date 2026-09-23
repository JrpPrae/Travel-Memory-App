import React, { useState, useEffect, useMemo } from 'react';
import {
  Header,
  ActiveTab
} from './components/Header';
import { AuthView } from './components/AuthView';
import { InteractiveMapView } from './components/InteractiveMapView';
import { PinboardView } from './components/PinboardView';
import { ThailandView } from './components/ThailandView';
import { HikingTrailsView } from './components/HikingTrailsView';
import { WorldCountriesView } from './components/WorldCountriesView';
import { ChecklistView } from './components/ChecklistView';
import { MyPlanView } from './components/MyPlanView';
import { PinModal } from './components/PinModal';
import { PinDetailModal } from './components/PinDetailModal';
import {
  TravelPin,
  ChecklistItem,
  TripPlan,
  HikingTrail,
  PinCategory,
  ThaiProvince,
  WorldCountry
} from './types';
import {
  getSavedPins,
  savePins,
  getSavedChecklist,
  saveChecklist,
  getSavedPlans,
  savePlans,
  getSavedTrails,
  saveTrails,
  calculateTravelStats,
  resetToSampleData,
  setStorageNamespace
} from './utils/storage';
import { getCurrentUsername, logout } from './utils/auth';
import { DEFAULT_CHECKLIST_TEMPLATES } from './data/checklistTemplates';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => getCurrentUsername());
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [pins, setPins] = useState<TravelPin[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [plans, setPlans] = useState<TripPlan[]>([]);
  const [trails, setTrails] = useState<HikingTrail[]>([]);

  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<TravelPin | null>(null);
  const [pinModalCategory, setPinModalCategory] = useState<PinCategory>('province');
  const [pinModalLocationCode, setPinModalLocationCode] = useState<string>('');
  const [pinModalTitle, setPinModalTitle] = useState<string>('');
  const [pinModalSubtitle, setPinModalSubtitle] = useState<string>('');
  const [pinModalCoords, setPinModalCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [selectedDetailPin, setSelectedDetailPin] = useState<TravelPin | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load the logged-in user's own data whenever the active account changes
  useEffect(() => {
    if (!currentUser) return;
    setStorageNamespace(currentUser);
    setPins(getSavedPins());
    setChecklist(getSavedChecklist());
    setPlans(getSavedPlans());
    setTrails(getSavedTrails());
  }, [currentUser]);

  const handleAuthSuccess = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setPins([]);
    setChecklist([]);
    setPlans([]);
    setTrails([]);
    setActiveTab('map');
  };

  // Compute live statistics (hiking trails also count their home province)
  const stats = useMemo(() => calculateTravelStats(pins, trails), [pins, trails]);

  // Handlers for Pins
  const handleSavePin = (savedPin: TravelPin) => {
    setPins((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === savedPin.id);
      let updated: TravelPin[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = savedPin;
        showToast(`อัปเดตหมุด "${savedPin.title}" เรียบร้อยแล้ว`);
      } else {
        updated = [savedPin, ...prev];
        showToast(`🎉 ปักหมุด "${savedPin.title}" สำเร็จแล้ว!`);
      }
      savePins(updated);
      return updated;
    });

    if (selectedDetailPin && selectedDetailPin.id === savedPin.id) {
      setSelectedDetailPin(savedPin);
    }
  };

  const handleDeletePin = (pinId: string) => {
    setPins((prev) => {
      const updated = prev.filter((p) => p.id !== pinId);
      savePins(updated);
      showToast('ลบหมุดความทรงจำแล้ว');
      return updated;
    });
    if (selectedDetailPin?.id === pinId) {
      setSelectedDetailPin(null);
    }
  };

  // Quick action openers
  const handleOpenNewPin = (category?: PinCategory, initialCoords?: { lat: number; lng: number }) => {
    setEditingPin(null);
    setPinModalCategory(category || 'province');
    setPinModalLocationCode('');
    setPinModalTitle('');
    setPinModalSubtitle('');
    setPinModalCoords(initialCoords);
    setIsPinModalOpen(true);
  };

  const handleOpenPinWithProvince = (prov: ThaiProvince) => {
    setEditingPin(null);
    setPinModalCategory('province');
    setPinModalLocationCode(prov.id);
    setPinModalTitle(`${prov.nameTh} (${prov.nameEn})`);
    setPinModalSubtitle(`${prov.regionTh} • ประเทศไทย`);
    setIsPinModalOpen(true);
  };

  const handleOpenPinWithTrail = (trail: HikingTrail) => {
    setEditingPin(null);
    setPinModalCategory('hiking');
    setPinModalLocationCode(trail.id);
    setPinModalTitle(trail.name);
    setPinModalSubtitle(`${trail.parkName} จ.${trail.province}`);
    setIsPinModalOpen(true);
  };

  const handleOpenPinWithCountry = (country: WorldCountry) => {
    setEditingPin(null);
    setPinModalCategory('country');
    setPinModalLocationCode(country.code);
    setPinModalTitle(`${country.nameTh} (${country.nameEn} ${country.flag})`);
    setPinModalSubtitle(`ทวีป${country.continentTh}`);
    setIsPinModalOpen(true);
  };

  const handleEditPin = (pin: TravelPin) => {
    setEditingPin(pin);
    setPinModalCategory(pin.category);
    setIsPinModalOpen(true);
    setSelectedDetailPin(null);
  };

  // Checklist handlers
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      saveChecklist(updated);
      return updated;
    });
  };

  const handleAddChecklist = (text: string, category: ChecklistItem['category']) => {
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      text,
      completed: false,
      category,
    };
    setChecklist((prev) => {
      const updated = [...prev, newItem];
      saveChecklist(updated);
      showToast('เพิ่มรายการเช็กของแล้ว');
      return updated;
    });
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveChecklist(updated);
      return updated;
    });
  };

  const handleResetDefaultChecklist = () => {
    if (window.confirm('คุณต้องการรีเซ็ตรายการสิ่งของเป็นแม่แบบมาตรฐานใช่หรือไม่?')) {
      setChecklist(DEFAULT_CHECKLIST_TEMPLATES);
      saveChecklist(DEFAULT_CHECKLIST_TEMPLATES);
      showToast('รีเซ็ตรายการเช็กของเรียบร้อย');
    }
  };

  // Plan handlers
  const handleAddPlan = (planData: Omit<TripPlan, 'id' | 'createdAt'>) => {
    const newPlan: TripPlan = {
      ...planData,
      id: `plan-${Date.now()}`,
      createdAt: Date.now(),
    };
    setPlans((prev) => {
      const updated = [newPlan, ...prev];
      savePlans(updated);
      showToast('บันทึกแผนการเดินทางเรียบร้อย');
      return updated;
    });
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      savePlans(updated);
      showToast('ลบแผนการเดินทางแล้ว');
      return updated;
    });
  };

  const handleConvertPlanToPin = (plan: TripPlan) => {
    setEditingPin(null);
    setPinModalCategory(plan.category);
    setPinModalTitle(plan.title);
    setPinModalSubtitle(plan.notes ? `จากแผน: ${plan.notes.slice(0, 30)}...` : '');
    setIsPinModalOpen(true);
  };

  // Custom Hiking trail handler
  const handleAddNewCustomTrail = (newTrail: HikingTrail) => {
    setTrails((prev) => {
      const updated = [newTrail, ...prev];
      saveTrails(updated);
      showToast(`เพิ่มเส้นทาง "${newTrail.name}" เรียบร้อยแล้ว`);
      return updated;
    });
  };

  const handleResetDemo = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลความทรงจำทั้งหมดของบัญชีนี้ใช่หรือไม่?')) {
      resetToSampleData();
    }
  };

  // Not logged in: show the login / register screen instead of the app
  if (!currentUser) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f3e8] text-[#244855] flex flex-col font-sans selection:bg-[#E4CAB3] selection:text-[#244855]">

      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenNewPinModal={() => handleOpenNewPin()}
        onResetDemo={handleResetDemo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Tab 0: แผนที่ปักหมุดความทรงจำ (Map Pinboard View - matches user screenshot) */}
        {activeTab === 'map' && (
          <InteractiveMapView
            pins={pins}
            stats={stats}
            onOpenPinDetail={(pin) => setSelectedDetailPin(pin)}
            onOpenNewPinModal={(cat, coords) => handleOpenNewPin(cat, coords)}
            onSelectCategory={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab 1: กระดานความทรงจำ (All Pins Polaroid Grid) */}
        {activeTab === 'pinboard' && (
          <PinboardView
            pins={pins}
            onOpenPinDetail={(pin) => setSelectedDetailPin(pin)}
            onOpenNewPinModal={(cat) => handleOpenNewPin(cat)}
          />
        )}

        {/* Tab 2: จังหวัดที่เคยไป (Thailand 77) */}
        {activeTab === 'provinces' && (
          <ThailandView
            pins={pins}
            trails={trails}
            onOpenPinDetail={(pin) => setSelectedDetailPin(pin)}
            onOpenNewPinModalWithProvince={handleOpenPinWithProvince}
          />
        )}

        {/* Tab 3: ป่าและอุทยาน สำหรับสายเดินป่า (Hiking Trails) */}
        {activeTab === 'hiking' && (
          <HikingTrailsView
            trails={trails}
            pins={pins}
            onOpenPinDetail={(pin) => setSelectedDetailPin(pin)}
            onOpenNewPinModalWithTrail={handleOpenPinWithTrail}
            onAddNewCustomTrail={handleAddNewCustomTrail}
          />
        )}

        {/* Tab 4: ประเทศที่เคยไป (World Countries) */}
        {activeTab === 'countries' && (
          <WorldCountriesView
            pins={pins}
            onOpenPinDetail={(pin) => setSelectedDetailPin(pin)}
            onOpenNewPinModalWithCountry={handleOpenPinWithCountry}
          />
        )}

        {/* Tab 5: Check List (Gear & Travel Essentials) */}
        {activeTab === 'checklist' && (
          <ChecklistView
            items={checklist}
            onToggleItem={handleToggleChecklist}
            onAddItem={handleAddChecklist}
            onDeleteItem={handleDeleteChecklist}
            onResetDefaultChecklist={handleResetDefaultChecklist}
          />
        )}

        {/* Tab 6: My Plan (Trip Planner & Bucket list) */}
        {activeTab === 'plans' && (
          <MyPlanView
            plans={plans}
            onAddPlan={handleAddPlan}
            onDeletePlan={handleDeletePlan}
            onConvertToPin={handleConvertPlanToPin}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#E4CAB3] bg-[#FDF4E7] py-8 text-center text-xs text-[#9C6B58]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-sm text-[#244855]">
              Travel Memory Pinboard
            </span>
            {/* <span>•</span> */}
            {/* <span>ปักหมุดความทรงจำ 3 หมวดการเดินทาง</span> */}
          </div>
          <p className="text-[#9C6B58]">
            บันทึกรูปภาพ • โน๊ต • วันที่ • เช็กลิสต์ • แผนการเดินทาง
          </p>
        </div>
      </footer>

      {/* Modal: New / Edit Pin */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSavePin={handleSavePin}
        initialCategory={pinModalCategory}
        initialLocationCode={pinModalLocationCode}
        initialTitle={pinModalTitle}
        initialSubtitle={pinModalSubtitle}
        initialCoords={pinModalCoords}
        editingPin={editingPin}
        customTrails={trails}
      />

      {/* Modal: Detail View (Polaroid memory journal) */}
      <PinDetailModal
        pin={selectedDetailPin}
        onClose={() => setSelectedDetailPin(null)}
        onEdit={handleEditPin}
        onDelete={handleDeletePin}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#244855] text-[#90AEAD] px-4 py-3 rounded-2xl shadow-xl border border-[#244855] text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
