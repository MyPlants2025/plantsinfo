<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مكتبة النباتات</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Tajawal', sans-serif;
      background-color: #f8fafc;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #10b981;
      border-radius: 10px;
    }
    @media print {
      .no-print {
        display: none !important;
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }
    .animate-pulse-custom {
      animation: pulse 2s infinite;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    // === أنواع البيانات ===
    const PlantCategory = {
      FRUIT: 'فواكه',
      VEGETABLE: 'خضروات',
      INDOOR: 'نباتات زينة داخلية',
      OUTDOOR: 'نباتات زينة خارجية',
      MEDICINAL: 'نباتات طبية'
    };

    const GrowthStage = {
      SEED: 'بذرة',
      SEEDLING: 'شتلة',
      MATURE: 'نبتة كاملة',
      FLOWER: 'زهرة',
      FRUIT: 'ثمرة'
    };

    // === مكون الهيدر ===
    const Header = ({ currentView, onNavigate }) => {
      const navItems = [
        { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
        { id: 'library', label: 'المكتبة', icon: '📚' },
        { id: 'add-plant', label: 'إضافة نبتة', icon: '➕' },
      ];

      return (
        <header className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-sm no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => onNavigate('dashboard')}
              >
                <div className="bg-emerald-600 p-1.5 rounded-lg">
                  <span className="text-white text-xl">🌱</span>
                </div>
                <span className="mr-2 text-xl font-bold text-emerald-900">مكتبة النباتات</span>
              </div>

              <nav className="hidden md:flex space-x-reverse space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span className="ml-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="md:hidden">
                <div className="flex items-center space-x-reverse space-x-2">
                  <button 
                    onClick={() => onNavigate('add-plant')}
                    className="p-2 text-emerald-600 bg-emerald-50 rounded-full"
                  >
                    <span className="text-xl">➕</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      );
    };

    // === بطاقة النبات ===
    const PlantCard = ({ plant, onClick }) => {
      const latestImage = plant.stages.length > 0 
        ? plant.stages[plant.stages.length - 1].imageUrl 
        : `https://picsum.photos/seed/${plant.id}/400/300`;

      return (
        <div 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer animate-fadeIn"
          onClick={() => onClick(plant.id)}
        >
          <div className="relative h-48 w-full overflow-hidden">
            <img 
              src={latestImage} 
              alt={plant.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-emerald-700">
              {plant.category}
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {plant.name}
                </h3>
                <p className="text-sm italic text-gray-500">{plant.scientificName}</p>
              </div>
            </div>
            
            <div className="flex items-center mt-4 text-xs text-gray-400">
              <span className="ml-1">🌱</span>
              <span>{plant.stages.length} مراحل مسجلة</span>
              <span className="mx-2">•</span>
              <span>{new Date(plant.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>

            <div className="mt-4 flex items-center justify-end text-emerald-600 font-medium text-sm group-hover:translate-x-[-4px] transition-transform">
              عرض التفاصيل
              <span className="mr-1">←</span>
            </div>
          </div>
        </div>
      );
    };

    // === نموذج إضافة النبات ===
    const PlantForm = ({ onSave, onCancel }) => {
      const [loading, setLoading] = useState(false);
      const [preview, setPreview] = useState(null);
      const fileInputRef = useRef(null);
      
      const [formData, setFormData] = useState({
        name: '',
        scientificName: '',
        category: PlantCategory.OUTDOOR,
        generalInfo: '',
        careInstructions: ''
      });

      const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result;
          setPreview(base64);
          setLoading(false);
        };
        reader.readAsDataURL(file);
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const newPlant = {
          ...formData,
          id: Date.now().toString(),
          createdAt: Date.now(),
          stages: preview ? [{
            id: Date.now().toString() + '-stage',
            stage: GrowthStage.SEED,
            imageUrl: preview,
            description: 'الصورة الافتتاحية للنبتة',
            date: new Date().toISOString()
          }] : []
        };
        onSave(newPlant);
      };

      const categories = Object.values(PlantCategory);

      return (
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-50 overflow-hidden animate-fadeIn">
            <div className="bg-emerald-600 px-6 py-8 text-white relative">
              <h2 className="text-2xl font-bold">إضافة نبتة جديدة</h2>
              <p className="mt-2 text-emerald-100">املأ بيانات نبتتك لتوثيقها في المكتبة</p>
              <span className="absolute left-6 top-8 text-3xl text-emerald-400 opacity-50">✨</span>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="relative">
                {preview ? (
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-inner group">
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => { setPreview(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500 hover:bg-red-50"
                    >
                      ❌
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    <span className="text-4xl mb-2">📷</span>
                    <span className="text-emerald-700 font-medium">ارفع صورة للنبتة</span>
                    <span className="text-xs text-emerald-500 mt-1">(اختياري)</span>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم النبتة الشائع</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="مثلاً: نعناع، طماطم..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم العلمي</label>
                  <input 
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) => setFormData({...formData, scientificName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Scientific name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تصنيف النبتة</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">معلومات عامة</label>
                <textarea 
                  rows={3}
                  value={formData.generalInfo}
                  onChange={(e) => setFormData({...formData, generalInfo: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="اكتب وصفاً مختصراً للنبتة..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تعليمات العناية</label>
                <textarea 
                  rows={3}
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({...formData, careInstructions: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="كيف نعتني بها؟ (الري، الإضاءة، التسميد)..."
                />
              </div>

              <div className="flex space-x-reverse space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                >
                  <span className="ml-2">💾</span>
                  حفظ النبتة
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    // === تفاصيل النبات ===
    const PlantDetail = ({ plant, onAddStage, onBack }) => {
      const [isAddingStage, setIsAddingStage] = useState(false);
      const [newStage, setNewStage] = useState({
        stage: GrowthStage.SEEDLING,
        imageUrl: '',
        description: ''
      });
      const fileInputRef = useRef(null);

      const handleStageFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewStage({ ...newStage, imageUrl: reader.result });
        };
        reader.readAsDataURL(file);
      };

      const handleAddStageSubmit = () => {
        if (!newStage.imageUrl) return;
        
        const stageEntry = {
          id: Date.now().toString(),
          stage: newStage.stage,
          imageUrl: newStage.imageUrl,
          description: newStage.description || `مرحلة ${newStage.stage}`,
          date: new Date().toISOString()
        };

        onAddStage(plant.id, stageEntry);
        setIsAddingStage(false);
        setNewStage({ stage: GrowthStage.SEEDLING, imageUrl: '', description: '' });
      };

      const printReport = () => {
        window.print();
      };

      return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
          <button 
            onClick={onBack}
            className="mb-6 flex items-center text-emerald-700 hover:text-emerald-900 font-medium no-print transition-colors"
          >
            <span className="mr-1">←</span>
            العودة للمكتبة
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6 no-print">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50 sticky top-24">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{plant.name}</h1>
                <p className="text-emerald-600 font-medium mb-6">{plant.scientificName}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="ml-3 text-emerald-500">ℹ️</span>
                    <div>
                      <p className="font-semibold text-gray-900">التصنيف</p>
                      <p>{plant.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <span className="ml-3 text-emerald-500 mt-0.5">📅</span>
                    <div>
                      <p className="font-semibold text-gray-900">تاريخ البدء</p>
                      <p>{new Date(plant.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <span className="ml-3 text-emerald-500 mt-0.5">✅</span>
                    <div>
                      <p className="font-semibold text-gray-900">مراحل النمو</p>
                      <p>{plant.stages.length} مراحل مسجلة</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                  <button 
                    onClick={() => setIsAddingStage(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <span className="ml-2">➕</span>
                    إضافة مرحلة جديدة
                  </button>
                  <button 
                    onClick={printReport}
                    className="w-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold py-3 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <span className="ml-2">🖨️</span>
                    طباعة تقرير
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="bg-emerald-100 p-2 rounded-lg ml-3">
                    <span className="text-emerald-600">📄</span>
                  </div>
                  معلومات العناية العامة
                </h2>
                <div>
                  <h4 className="text-lg font-bold text-emerald-800 mb-2">عن النبتة:</h4>
                  <p className="text-gray-700 mb-6 leading-relaxed">{plant.generalInfo}</p>
                  
                  <h4 className="text-lg font-bold text-emerald-800 mb-2">تعليمات العناية:</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{plant.careInstructions}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-emerald-100 p-2 rounded-lg ml-3">
                    <span className="text-emerald-600">📷</span>
                  </div>
                  سجل النمو الموثق
                </h2>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:mr-5 before:w-0.5 before:bg-emerald-100 before:pointer-events-none">
                  {plant.stages.map((entry, idx) => (
                    <div key={entry.id} className="relative pr-12 group">
                      <div className="absolute right-0 top-0 h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold z-10 border-4 border-white shadow-sm transition-transform group-hover:scale-110">
                        {idx + 1}
                      </div>
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                            <img src={entry.imageUrl} className="w-full h-full object-cover" alt={entry.stage} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                  {entry.stage}
                                </span>
                                <p className="text-sm text-gray-400 mt-2">
                                  {new Date(entry.date).toLocaleDateString('ar-EG')}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed mt-4">
                              {entry.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isAddingStage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
              <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                  <h3 className="text-xl font-bold">توثيق مرحلة جديدة</h3>
                  <button onClick={() => setIsAddingStage(false)}>
                    ❌
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div 
                    className="h-48 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center bg-emerald-50 cursor-pointer overflow-hidden relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {newStage.imageUrl ? (
                      <img src={newStage.imageUrl} className="w-full h-full object-cover" alt="مرحلة جديدة" />
                    ) : (
                      <>
                        <span className="text-3xl mb-2">📷</span>
                        <span className="text-emerald-700 font-medium">التقط صورة أو ارفع ملف</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleStageFileChange} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">اختر المرحلة</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.values(GrowthStage).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewStage({...newStage, stage: s})}
                          className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                            newStage.stage === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">وصف الصورة</label>
                    <textarea 
                      rows={4}
                      value={newStage.description}
                      onChange={(e) => setNewStage({...newStage, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      placeholder="اكتب تفاصيل عن حالة النبتة في هذه المرحلة..."
                    />
                  </div>

                  <div className="flex space-x-reverse space-x-3">
                    <button
                      type="button"
                      onClick={handleAddStageSubmit}
                      disabled={!newStage.imageUrl}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      حفظ المرحلة
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingStage(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    // === التطبيق الرئيسي ===
    const App = () => {
      const [view, setView] = useState('dashboard');
      const [plants, setPlants] = useState([]);
      const [selectedPlantId, setSelectedPlantId] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [activeCategory, setActiveCategory] = useState('الكل');

      // تحميل البيانات المحفوظة
      useEffect(() => {
        const saved = localStorage.getItem('plant_library_data');
        if (saved) {
          try {
            setPlants(JSON.parse(saved));
          } catch (e) {
            console.log('خطأ في تحميل البيانات');
          }
        }
      }, []);

      // حفظ البيانات عند التغيير
      useEffect(() => {
        localStorage.setItem('plant_library_data', JSON.stringify(plants));
      }, [plants]);

      const handleSavePlant = (plantData) => {
        setPlants([plantData, ...plants]);
        setView('library');
      };

      const handleAddStage = (plantId, stageEntry) => {
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/50 to-green-50/50">
          <Header currentView={view} onNavigate={(v) => {
            setView(v);
            setSelectedPlantId(null);
          }} />

          <main className="flex-1 pb-20">
            {view === 'dashboard' && (
              <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
                <div className="bg-emerald-600 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">مرحباً بك في واحتك الخاصة</h1>
                    <p className="text-emerald-50 text-lg mb-8 opacity-90 leading-relaxed">
                      سجل رحلة نمو نباتاتك، وثق كل مرحلة من البذرة حتى الحصاد.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => setView('add-plant')}
                        className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-colors flex items-center shadow-lg"
                      >
                        <span className="ml-2">➕</span>
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
                  <div className="absolute left-[-5%] top-[-10%] opacity-10 text-9xl">
                    🌱
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'إجمالي النباتات', val: plants.length, icon: '📊', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'مراحل موثقة', val: plants.reduce((acc, p) => acc + p.stages.length, 0), icon: '📷', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'فئات متنوعة', val: new Set(plants.map(p => p.category)).size, icon: '🏷️', color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'أيام التوثيق', val: plants.length > 0 ? Math.ceil((Date.now() - Math.min(...plants.map(p => p.createdAt))) / (1000*60*60*24)) : 0, icon: '☀️', color: 'text-yellow-600', bg: 'bg-yellow-50' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center animate-fadeIn" style={{animationDelay: `${i * 0.1}s`}}>
                      <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl ml-4`}>
                        <span className="text-xl">{stat.icon}</span>
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
                  <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 animate-pulse-custom">
                    <span className="text-6xl text-emerald-200 mx-auto mb-4">❤️</span>
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
              <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">المكتبة</h1>
                    <p className="text-gray-500">إدارة وتصفح مجموعتك النباتية الكاملة</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
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
                      <span className="ml-2">➕</span>
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
                    {plants.length === 0 ? (
                      <>
                        <span className="text-5xl mb-4 block">🌱</span>
                        <p className="text-gray-400 text-lg mb-4">لم تقم بإضافة أي نباتات بعد</p>
                        <button 
                          onClick={() => setView('add-plant')}
                          className="bg-emerald-600 text-white px-6 py-2 rounded-lg"
                        >
                          أضف نبتة جديدة
                        </button>
                      </>
                    ) : (
                      <p className="text-gray-400 text-lg">لم يتم العثور على نتائج تطابق بحثك</p>
                    )}
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

          {/* زر عائم للجوال */}
          {view !== 'add-plant' && view !== 'plant-detail' && (
            <button 
              onClick={() => setView('add-plant')}
              className="fixed bottom-6 left-6 md:hidden w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 animate-bounce"
            >
              <span className="text-2xl">➕</span>
            </button>
          )}

          {/* تذييل الصفحة */}
          <footer className="bg-gray-800 text-white py-6 mt-12 no-print">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400">© {new Date().getFullYear()} مكتبة النباتات - تطبيق لتوثيق رحلة النباتات</p>
              <p className="text-gray-500 text-sm mt-2">تم التطوير باستخدام React و Tailwind CSS</p>
            </div>
          </footer>
        </div>
      );
    };

    // تشغيل التطبيق
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
