
import React, { useState, useEffect } from 'react';
// Fix: Correct path to Header component
import Header from './components/Header';
import PlantCard from './components/PlantCard';
import PlantForm from './components/PlantForm';
import PlantDetail from './components/PlantDetail';
import { Plant, AppView, PlantCategory, PlantStageEntry } from './types';
// Fix: Added missing 'Camera' import to resolve error on line 95
import { Leaf, Search, Filter, Plus, Database, Sprout, Heart, Sun, Camera } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('plant_library_data');
    if (saved) {
      setPlants(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('plant_library_data', JSON.stringify(plants));
  }, [plants]);

  const handleSavePlant = (plantData: Partial<Plant>) => {
    const newPlant = plantData as Plant;
    setPlants([newPlant, ...plants]);
    setView('library');
  };

  const handleAddStage = (plantId: string, stageEntry: PlantStageEntry) => {
    setPlants(plants.map(p => 
      p.id === plantId 
        ? { ...p, stages: [...p.stages, stageEntry] } 
        : p
    ));
  };

  const filteredPlants = plants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'الكل' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header currentView={view} onNavigate={(v) => {
        setView(v);
        setSelectedPlantId(null);
      }} />

      <main className="flex-1 pb-20">
        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="bg-emerald-600 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">مرحباً بك في واحتك الخاصة</h1>
                <p className="text-emerald-50 text-lg mb-8 opacity-90 leading-relaxed">
                  سجل رحلة نمو نباتاتك، وثق كل مرحلة من البذرة حتى الحصاد، واستخدم الذكاء الاصطناعي لتقديم أفضل رعاية.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setView('add-plant')}
                    className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-colors flex items-center shadow-lg"
                  >
                    <Plus className="ml-2 h-5 w-5" />
                    إضافة أول نبتة
                  </button>
                  <button 
                    onClick={() => setView('library')}
                    className="bg-emerald-500/30 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500/40 transition-colors shadow-lg"
                  >
                    عرض المكتبة
                  </button>
                </div>
              </div>
              <div className="absolute left-[-5%] top-[-10%] opacity-10">
                <Leaf className="h-64 w-64" />
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
                <Sprout className="h-96 w-96" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'إجمالي النباتات', val: plants.length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'مراحل موثقة', val: plants.reduce((acc, p) => acc + p.stages.length, 0), icon: Camera, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'فئات متنوعة', val: new Set(plants.map(p => p.category)).size, icon: Filter, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'أيام التوثيق', val: plants.length > 0 ? Math.ceil((Date.now() - Math.min(...plants.map(p => p.createdAt))) / (1000*60*60*24)) : 0, icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center">
                  <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl ml-4`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {plants.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">نباتاتك المضافة حديثاً</h2>
                  <button onClick={() => setView('library')} className="text-emerald-600 font-bold hover:underline">مشاهدة الكل</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plants.slice(0, 4).map(plant => (
                    <PlantCard 
                      key={plant.id} 
                      plant={plant} 
                      onClick={(id) => {
                        setSelectedPlantId(id);
                        setView('plant-detail');
                      }} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                <Heart className="h-16 w-16 text-emerald-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">مكتبتك فارغة حالياً</h3>
                <p className="text-gray-500 mb-6">ابدأ بجمع بذورك وتوثيق نمو نباتاتك هنا.</p>
                <button 
                  onClick={() => setView('add-plant')}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  إضافة أول نبتة
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'library' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">المكتبة</h1>
                <p className="text-gray-500">إدارة وتصفح مجموعتك النباتية الكاملة</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="ابحث عن نبتة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64 shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => setView('add-plant')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center shadow-md"
                >
                  <Plus className="ml-2 h-5 w-5" />
                  إضافة
                </button>
              </div>
            </div>

            <div className="flex space-x-reverse space-x-2 overflow-x-auto pb-4 custom-scrollbar">
              {['الكل', ...Object.values(PlantCategory)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 border border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredPlants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlants.map(plant => (
                  <PlantCard 
                    key={plant.id} 
                    plant={plant} 
                    onClick={(id) => {
                      setSelectedPlantId(id);
                      setView('plant-detail');
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-lg">لم يتم العثور على نتائج تطابق بحثك</p>
              </div>
            )}
          </div>
        )}

        {view === 'add-plant' && (
          <PlantForm 
            onSave={handleSavePlant} 
            onCancel={() => setView('library')} 
          />
        )}

        {view === 'plant-detail' && selectedPlant && (
          <PlantDetail 
            plant={selectedPlant} 
            onAddStage={handleAddStage}
            onBack={() => setView('library')} 
          />
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      {view !== 'add-plant' && view !== 'plant-detail' && (
        <button 
          onClick={() => setView('add-plant')}
          className="fixed bottom-6 left-6 md:hidden w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce z-40"
        >
          <Plus className="h-8 w-8" />
        </button>
      )}
    </div>
  );
};

export default App;
