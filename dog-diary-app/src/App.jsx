import React, { useState } from 'react';
import { Calendar, Utensils, Droplets, Plus, List, ChevronLeft, ChevronRight, User, MapPin, MessageCircle, Camera, Edit, Weight, Syringe, Scissors, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DogCareApp() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(0);
  const [dogProfile, setDogProfile] = useState({
    name: '',
    gender: '',
    birthday: '',
    breed: '',
    photo: null,
    foodTypes: ['ドライフード'],
    vaccinations: [],
    socialMedia: {
      twitter: '',
      instagram: '',
      facebook: ''
    },
    places: []
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [records, setRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'toilet',
    time: '',
    memo: '',
    subType: '',
    condition: ''
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFoodTypeEdit, setShowFoodTypeEdit] = useState(false);
  const [newFoodType, setNewFoodType] = useState('');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [vaccinationForm, setVaccinationForm] = useState({
    type: '',
    date: '',
    nextDate: '',
    photo: null
  });
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    type: '',
    date: '',
    memo: '',
    vaccinationType: ''
  });
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [placeForm, setPlaceForm] = useState({
    type: '',
    name: '',
    phone: '',
    address: '',
    memo: ''
  });
  const [walkTracking, setWalkTracking] = useState({
    isTracking: false,
    startLocation: null,
    endLocation: null,
    startTime: null,
    endTime: null
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [calendarFilter, setCalendarFilter] = useState(['toilet', 'food', 'walk', 'weight', 'vaccination', 'trimming']);

  const recordTypes = {
    toilet: { name: 'トイレ', icon: Droplets, color: 'bg-blue-500' },
    food: { name: 'ごはん', icon: Utensils, color: 'bg-orange-500' },
    walk: { name: '散歩', icon: Calendar, color: 'bg-green-500' },
    weight: { name: '体重', icon: Weight, color: 'bg-purple-500' },
    vaccination: { name: '予防接種', icon: Syringe, color: 'bg-red-500' },
    trimming: { name: 'トリミング', icon: Scissors, color: 'bg-pink-500' }
  };

  const vaccinationTypes = [
    { value: '狂犬病', label: '狂犬病ワクチン' },
    { value: '混合ワクチン', label: '混合ワクチン' },
    { value: 'ノミダニ', label: 'ノミダニ予防薬' }
  ];

  const conditionEmojis = {
    good: '😊',
    normal: '😐',
    bad: '😰'
  };

  const popularBreeds = [
    'トイプードル', '柴犬', 'チワワ', 'ミニチュアダックスフンド',
    'ポメラニアン', 'フレンチブルドッグ', 'ゴールデンレトリバー',
    'ラブラドールレトリバー', 'その他'
  ];

  const qaCategories = [
    { title: 'しつけ', icon: '🎓', questions: ['トイレトレーニング', '噛み癖', '吠え癖', 'お座り'] },
    { title: '健康', icon: '❤️', questions: ['運動量', 'ワクチン', '食欲不振', '体重管理'] },
    { title: '食事', icon: '🍖', questions: ['フード量', 'おやつ', 'アレルギー', '禁止食材'] },
    { title: '日常ケア', icon: '✨', questions: ['シャンプー', '爪切り', '歯磨き', 'ブラッシング'] }
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDogProfile({ ...dogProfile, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const newRecord = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString('ja-JP'),
      timestamp: new Date().toLocaleString('ja-JP')
    };
    setRecords([newRecord, ...records]);
    setFormData({ type: 'toilet', time: '', memo: '', subType: '', condition: '' });
    setShowAddForm(false);
    setActiveTab('records');
  };

  const handleEventSubmit = () => {
    const newRecord = {
      id: Date.now(),
      type: eventForm.type,
      date: new Date(eventForm.date).toLocaleDateString('ja-JP'),
      timestamp: new Date(eventForm.date).toLocaleString('ja-JP'),
      memo: eventForm.memo,
      subType: eventForm.type === 'vaccination' ? eventForm.vaccinationType : ''
    };
    setRecords([newRecord, ...records]);
    setEventForm({ type: '', date: '', memo: '', vaccinationType: '' });
    setShowEventForm(false);
  };

  const handleVaccinationSubmit = () => {
    const newVaccination = { id: Date.now(), ...vaccinationForm };
    setDogProfile({ ...dogProfile, vaccinations: [...dogProfile.vaccinations, newVaccination] });
    setVaccinationForm({ type: '', date: '', nextDate: '', photo: null });
    setShowVaccinationForm(false);
  };

  const handleVaccinationPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setVaccinationForm({ ...vaccinationForm, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteVaccination = (id) => {
    setDogProfile({ ...dogProfile, vaccinations: dogProfile.vaccinations.filter(v => v.id !== id) });
  };

  const RecordIcon = ({ type }) => {
    const IconComponent = recordTypes[type].icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const getRecordsForDate = (date) => {
    const dateStr = date.toLocaleDateString('ja-JP');
    return records.filter(record => record.date === dateStr && calendarFilter.includes(record.type));
  };

  const toggleCalendarFilter = (type) => {
    if (calendarFilter.includes(type)) {
      setCalendarFilter(calendarFilter.filter(t => t !== type));
    } else {
      setCalendarFilter([...calendarFilter, type]);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const completeRegistration = () => {
    setIsRegistered(true);
    setRegistrationStep(0);
  };

  const addFoodType = () => {
    if (newFoodType.trim()) {
      setDogProfile({ ...dogProfile, foodTypes: [...dogProfile.foodTypes, newFoodType.trim()] });
      setNewFoodType('');
    }
  };

  const removeFoodType = (index) => {
    setDogProfile({ ...dogProfile, foodTypes: dogProfile.foodTypes.filter((_, i) => i !== index) });
  };

  const getWeightData = () => {
    return records
      .filter(r => r.type === 'weight')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(r => ({ date: r.date, weight: parseFloat(r.subType) }));
  };

  const getCurrentLocation = () => {
    setLocationError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          setCurrentLocation(location);
        },
        (error) => {
          setLocationError('位置情報の取得に失敗しました');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('このブラウザは位置情報に対応していません');
    }
  };

  const startWalk = () => {
    getCurrentLocation();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setWalkTracking({
            isTracking: true,
            startLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            startTime: new Date().toISOString(),
            endLocation: null,
            endTime: null
          });
        },
        (error) => {
          setLocationError('位置情報の取得に失敗しました');
        }
      );
    }
  };

  const endWalk = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const endLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const endTime = new Date().toISOString();
          
          const duration = Math.round((new Date(endTime) - new Date(walkTracking.startTime)) / 1000 / 60);
          const distance = calculateDistance(
            walkTracking.startLocation.lat,
            walkTracking.startLocation.lng,
            endLocation.lat,
            endLocation.lng
          );

          const newRecord = {
            id: Date.now(),
            type: 'walk',
            date: new Date().toLocaleDateString('ja-JP'),
            timestamp: new Date().toLocaleString('ja-JP'),
            subType: `${distance.toFixed(2)}km / ${duration}分`,
            memo: `開始: ${walkTracking.startLocation.lat.toFixed(6)}, ${walkTracking.startLocation.lng.toFixed(6)}\n終了: ${endLocation.lat.toFixed(6)}, ${endLocation.lng.toFixed(6)}`,
            startLocation: walkTracking.startLocation,
            endLocation: endLocation,
            duration: duration,
            distance: distance
          };

          setRecords([newRecord, ...records]);
          setWalkTracking({
            isTracking: false,
            startLocation: null,
            endLocation: null,
            startTime: null,
            endTime: null
          });
        },
        (error) => {
          setLocationError('位置情報の取得に失敗しました');
        }
      );
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openInGoogleMaps = (record) => {
    if (record.startLocation && record.endLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${record.startLocation.lat},${record.startLocation.lng}&destination=${record.endLocation.lat},${record.endLocation.lng}&travelmode=walking`;
      window.open(url, '_blank');
    }
  };

  const handlePlaceSubmit = () => {
    const newPlace = {
      id: Date.now(),
      ...placeForm
    };
    setDogProfile({
      ...dogProfile,
      places: [...dogProfile.places, newPlace]
    });
    setPlaceForm({ type: '', name: '', phone: '', address: '', memo: '' });
    setShowPlaceForm(false);
  };

  const deletePlace = (id) => {
    setDogProfile({
      ...dogProfile,
      places: dogProfile.places.filter(p => p.id !== id)
    });
  };

  const placeTypes = [
    { value: 'hospital', label: '🏥 動物病院', color: 'bg-red-100 text-red-800 border-red-300' },
    { value: 'trimming', label: '✂️ トリミングサロン', color: 'bg-pink-100 text-pink-800 border-pink-300' },
    { value: 'hotel', label: '🏨 ペットホテル', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { value: 'dogrun', label: '🐕 ドッグラン', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'other', label: '📍 その他', color: 'bg-gray-100 text-gray-800 border-gray-300' }
  ];

  if (!isRegistered) {
    if (registrationStep === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-8xl mb-8 animate-bounce">🐕</div>
            <h1 className="text-5xl font-bold text-white mb-4">わんこダイアリー</h1>
            <p className="text-xl text-white/90 mb-12">愛犬の毎日を記録しよう</p>
            <button onClick={() => setRegistrationStep(1)} className="bg-white text-orange-500 font-bold text-xl px-12 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform">
              はじめる
            </button>
          </div>
        </div>
      );
    }

    if (registrationStep === 1) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🐾</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">愛犬の名前は?</h2>
                <p className="text-gray-500">わんちゃんのお名前を教えてください</p>
              </div>
              <input
                type="text"
                value={dogProfile.name}
                onChange={(e) => setDogProfile({ ...dogProfile, name: e.target.value })}
                placeholder="例: ポチ"
                className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:border-orange-500 focus:outline-none mb-6"
              />
              <button
                onClick={() => dogProfile.name && setRegistrationStep(2)}
                disabled={!dogProfile.name}
                className={`w-full font-bold text-lg py-4 rounded-xl transition ${
                  dogProfile.name ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (registrationStep === 2) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎀</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{dogProfile.name}ちゃんの性別は?</h2>
              </div>
              <div className="space-y-4 mb-6">
                <button onClick={() => { setDogProfile({ ...dogProfile, gender: 'オス' }); setRegistrationStep(3); }} className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-lg py-6 rounded-xl transition">
                  <div className="text-3xl mb-1">♂️</div>オス
                </button>
                <button onClick={() => { setDogProfile({ ...dogProfile, gender: 'メス' }); setRegistrationStep(3); }} className="w-full bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-lg py-6 rounded-xl transition">
                  <div className="text-3xl mb-1">♀️</div>メス
                </button>
              </div>
              <button onClick={() => setRegistrationStep(1)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl">戻る</button>
            </div>
          </div>
        </div>
      );
    }

    if (registrationStep === 3) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎂</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">誕生日を教えて!</h2>
              </div>
              <input type="date" value={dogProfile.birthday} onChange={(e) => setDogProfile({ ...dogProfile, birthday: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:border-orange-500 focus:outline-none mb-6" />
              <button onClick={() => dogProfile.birthday && setRegistrationStep(4)} disabled={!dogProfile.birthday} className={`w-full font-bold text-lg py-4 rounded-xl mb-3 ${dogProfile.birthday ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>次へ</button>
              <button onClick={() => setRegistrationStep(2)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl">戻る</button>
            </div>
          </div>
        </div>
      );
    }

    if (registrationStep === 4) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 py-8">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🐶</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">犬種を選択</h2>
              </div>
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {popularBreeds.map((breed) => (
                  <button key={breed} onClick={() => { setDogProfile({ ...dogProfile, breed }); setRegistrationStep(5); }} className="w-full bg-gray-50 hover:bg-orange-100 text-gray-800 font-semibold text-left px-6 py-4 rounded-xl transition border-2 border-gray-200">{breed}</button>
                ))}
              </div>
              <button onClick={() => setRegistrationStep(3)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl">戻る</button>
            </div>
          </div>
        </div>
      );
    }

    if (registrationStep === 5) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📸</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">写真をアップロード</h2>
              </div>
              <div className="mb-6">
                {dogProfile.photo ? (
                  <div className="relative">
                    <img src={dogProfile.photo} alt="Dog" className="w-full h-64 object-cover rounded-2xl" />
                    <button onClick={() => setDogProfile({ ...dogProfile, photo: null })} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full">✕</button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50">
                    <Camera className="w-16 h-16 text-gray-400 mb-4" />
                    <span className="text-gray-500 font-semibold">写真を選択</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
              <button onClick={completeRegistration} className="w-full font-bold text-lg py-4 rounded-xl mb-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">{dogProfile.photo ? '完了' : 'スキップして完了'}</button>
              <button onClick={() => setRegistrationStep(4)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl">戻る</button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">🐕 わんこダイアリー</h1>
        <p className="text-center text-amber-100 mt-1">{dogProfile.name}ちゃんの記録</p>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-24">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">今日の記録</h2>
              <div className="grid grid-cols-4 gap-3">
                {['toilet', 'food', 'walk', 'weight'].map(type => (
                  <button key={type} onClick={() => { setFormData({ type, time: '', memo: '', subType: '', condition: '' }); setShowAddForm(true); }} className={`${recordTypes[type].color} hover:opacity-90 text-white rounded-xl p-4 transition`}>
                    <RecordIcon type={type} />
                    <div className="font-bold text-sm mt-1">{recordTypes[type].name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">最近の記録</h2>
                <button onClick={() => setActiveTab('records')} className="text-orange-500 font-semibold text-sm">すべて見る →</button>
              </div>
              {records.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>まだ記録がありません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.slice(0, 3).map(record => (
                    <div key={record.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`${recordTypes[record.type].color} text-white p-2 rounded-lg`}>
                        <RecordIcon type={record.type} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {recordTypes[record.type].name}
                          {record.subType && record.type !== 'weight' && ` (${record.subType})`}
                          {record.type === 'weight' && ` (${record.subType}kg)`}
                          {record.condition && ` ${conditionEmojis[record.condition]}`}
                        </div>
                        <div className="text-sm text-gray-500">{record.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showPlaceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">お店・施設を追加</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">種類</label>
                  <div className="grid grid-cols-2 gap-2">
                    {placeTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setPlaceForm({ ...placeForm, type: type.value })}
                        className={`py-3 px-4 rounded-lg text-sm font-semibold transition border-2 ${
                          placeForm.type === type.value
                            ? type.color
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">名前 *</label>
                  <input
                    type="text"
                    value={placeForm.name}
                    onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                    placeholder="例: ○○動物病院"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">電話番号</label>
                  <input
                    type="tel"
                    value={placeForm.phone}
                    onChange={(e) => setPlaceForm({ ...placeForm, phone: e.target.value })}
                    placeholder="例: 03-1234-5678"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">住所</label>
                  <input
                    type="text"
                    value={placeForm.address}
                    onChange={(e) => setPlaceForm({ ...placeForm, address: e.target.value })}
                    placeholder="例: 東京都渋谷区..."
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">メモ</label>
                  <textarea
                    value={placeForm.memo}
                    onChange={(e) => setPlaceForm({ ...placeForm, memo: e.target.value })}
                    placeholder="営業時間、特記事項など"
                    rows="3"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPlaceForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-3 rounded-lg"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handlePlaceSubmit}
                    disabled={!placeForm.type || !placeForm.name}
                    className={`flex-1 font-bold py-3 rounded-lg ${
                      placeForm.type && placeForm.name
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">すべての記録</h2>
            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-400"><List className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>まだ記録がありません</p></div>
            ) : (
              <div className="space-y-3">
                {records.map(record => (
                  <div key={record.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className={`${recordTypes[record.type].color} text-white p-3 rounded-lg`}><RecordIcon type={record.type} /></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-lg">
                        {recordTypes[record.type].name}
                        {record.subType && record.type !== 'weight' && ` (${record.subType})`}
                        {record.type === 'weight' && ` (${record.subType}kg)`}
                        {record.condition && ` ${conditionEmojis[record.condition]}`}
                      </div>
                      <div className="text-sm text-gray-500">{record.timestamp}</div>
                      {record.memo && <div className="text-sm text-gray-700 mt-1">{record.memo}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-6 h-6" /></button>
              <h2 className="text-2xl font-bold text-gray-800">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</h2>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-6 h-6" /></button>
            </div>

            <button onClick={() => setShowEventForm(true)} className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-3 rounded-xl mb-4">+ 予定を追加</button>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 py-2">{day}</div>
              ))}
              
              {(() => {
                const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
                const days = [];
                for (let i = 0; i < startingDayOfWeek; i++) {
                  days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                }
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dayRecords = getRecordsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  days.push(
                    <button key={day} onClick={() => setSelectedDate(date)} className={`aspect-square border-2 rounded-lg p-1 hover:bg-gray-50 ${isToday ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                      <div className="text-sm font-semibold">{day}</div>
                      <div className="flex gap-1 flex-wrap justify-center">
                        {dayRecords.slice(0, 3).map(record => (
                          <div key={record.id} className={`w-2 h-2 rounded-full ${recordTypes[record.type].color}`}></div>
                        ))}
                      </div>
                    </button>
                  );
                }
                return days;
              })()}
            </div>

            {selectedDate && (
              <div className="mt-6 border-t-2 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedDate.toLocaleDateString('ja-JP')}の記録</h3>
                  <button onClick={() => setSelectedDate(null)} className="text-gray-500">✕</button>
                </div>
                {getRecordsForDate(selectedDate).length === 0 ? (
                  <p className="text-center text-gray-400 py-4">この日の記録はありません</p>
                ) : (
                  <div className="space-y-3">
                    {getRecordsForDate(selectedDate).map(record => (
                      <div key={record.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`${recordTypes[record.type].color} text-white p-2 rounded-lg`}><RecordIcon type={record.type} /></div>
                        <div className="flex-1">
                          <div className="font-semibold">
                            {recordTypes[record.type].name}
                            {record.subType && record.type !== 'weight' && ` (${record.subType})`}
                            {record.type === 'weight' && ` (${record.subType}kg)`}
                            {record.condition && ` ${conditionEmojis[record.condition]}`}
                          </div>
                          <div className="text-sm text-gray-500">{record.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'walk-map' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">散歩記録</h2>
            
            {locationError && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 p-3 rounded-lg mb-4">
                {locationError}
              </div>
            )}

            <div className="mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">現在地</h3>
                    <p className="text-sm text-gray-600">位置情報を取得して散歩を記録</p>
                  </div>
                  <button onClick={getCurrentLocation} className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition">
                    <MapPin className="w-6 h-6" />
                  </button>
                </div>
                
                {currentLocation ? (
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">緯度: {currentLocation.lat.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mb-3">経度: {currentLocation.lng.toFixed(6)}</div>
                    <a
                      href={`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm font-semibold"
                    >
                      Google Mapsで開く →
                    </a>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">上のボタンをタップして現在地を取得</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              {!walkTracking.isTracking ? (
                <button
                  onClick={startWalk}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg"
                >
                  🐕 散歩を開始
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">🚶‍♂️</div>
                    <div className="font-bold text-green-800 text-lg mb-1">散歩中...</div>
                    <div className="text-sm text-green-700">
                      開始: {new Date(walkTracking.startTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <button
                    onClick={endWalk}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg"
                  >
                    散歩を終了
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">散歩履歴</h3>
              {records.filter(r => r.type === 'walk' && r.startLocation).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>まだ散歩の記録がありません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.filter(r => r.type === 'walk' && r.startLocation).map(record => (
                    <div key={record.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-800">{record.date}</div>
                        <div className="text-sm text-gray-500">{record.timestamp.split(' ')[1]}</div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <div>📏 距離: {record.distance.toFixed(2)}km</div>
                        <div>⏱️ 時間: {record.duration}分</div>
                      </div>
                      <button
                        onClick={() => openInGoogleMaps(record)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition text-sm"
                      >
                        Google Mapsでルートを見る
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-xs text-blue-800">
                💡 ヒント: 散歩を開始すると、開始位置と終了位置を自動で記録します。Google Mapsでルートを確認できます。
              </p>
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問</h2>
              <div className="grid grid-cols-2 gap-4">
                {qaCategories.map((cat) => (
                  <div key={cat.title} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200">
                    <div className="text-4xl mb-2">{cat.icon}</div>
                    <h3 className="font-bold mb-2">{cat.title}</h3>
                    <div className="space-y-1">
                      {cat.questions.slice(0, 2).map((q, i) => (
                        <div key={i} className="text-sm text-gray-600">• {q}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">AI相談コーナー</h3>
              <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl">AIに相談する</button>
              <p className="text-xs text-white/70 mt-3 text-center">※今後実装予定</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {dogProfile.photo ? (
                    <img src={dogProfile.photo} alt={dogProfile.name} className="w-24 h-24 rounded-full object-cover border-4 border-orange-300" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center text-4xl">🐕</div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{dogProfile.name}</h2>
                    <p className="text-gray-500">{dogProfile.breed}</p>
                  </div>
                </div>
                <button onClick={() => setShowProfileEdit(true)} className="text-orange-500"><Edit className="w-6 h-6" /></button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dogProfile.gender === 'オス' ? '♂️' : '♀️'}</span>
                    <div><div className="font-semibold">性別</div><div className="text-sm text-gray-500">{dogProfile.gender}</div></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎂</span>
                    <div><div className="font-semibold">誕生日</div><div className="text-sm text-gray-500">{dogProfile.birthday}</div></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3"><span className="text-2xl">🍖</span><div className="font-semibold">ごはんの種類</div></div>
                    <button onClick={() => setShowFoodTypeEdit(!showFoodTypeEdit)} className="text-orange-500"><Edit className="w-5 h-5" /></button>
                  </div>
                  {showFoodTypeEdit ? (
                    <div className="space-y-2">
                      {dogProfile.foodTypes.map((food, i) => (
                        <div key={i} className="flex justify-between bg-white p-2 rounded-lg">
                          <span className="text-sm">{food}</span>
                          <button onClick={() => removeFoodType(i)} className="text-red-500 text-sm">削除</button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input type="text" value={newFoodType} onChange={(e) => setNewFoodType(e.target.value)} placeholder="新しいごはん" className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        <button onClick={addFoodType} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">追加</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {dogProfile.foodTypes.map((food, i) => (
                        <span key={i} className="bg-white px-3 py-1 rounded-full text-sm">{food}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3"><span className="text-2xl">💉</span><div className="font-semibold">予防接種</div></div>
                    <button onClick={() => setShowVaccinationForm(true)} className="text-orange-500"><Plus className="w-5 h-5" /></button>
                  </div>
                  {dogProfile.vaccinations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">まだ登録がありません</p>
                  ) : (
                    <div className="space-y-2">
                      {dogProfile.vaccinations.map((vacc) => (
                        <div key={vacc.id} className="bg-white p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">{vacc.type}</span>
                            <button onClick={() => deleteVaccination(vacc.id)} className="text-red-500"><X className="w-4 h-4" /></button>
                          </div>
                          <div className="text-xs text-gray-500">接種日: {vacc.date}</div>
                          {vacc.nextDate && <div className="text-xs text-orange-600 font-semibold mt-1">次回: {vacc.nextDate}</div>}
                          {vacc.photo && (
                            <div className="mt-2">
                              <img src={vacc.photo} alt="接種証明" className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90" onClick={() => window.open(vacc.photo)} />
                              <p className="text-xs text-gray-500 mt-1">タップで拡大</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">SNS連携</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">X (Twitter)</div>
                    {dogProfile.socialMedia.twitter ? (
                      <a href={`https://twitter.com/${dogProfile.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600">
                        @{dogProfile.socialMedia.twitter}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-400">未設定</div>
                    )}
                  </div>
                  <button onClick={() => setShowProfileEdit(true)} className="text-orange-500 hover:text-orange-600">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">Instagram</div>
                    {dogProfile.socialMedia.instagram ? (
                      <a href={`https://instagram.com/${dogProfile.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-500 hover:text-pink-600">
                        @{dogProfile.socialMedia.instagram}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-400">未設定</div>
                    )}
                  </div>
                  <button onClick={() => setShowProfileEdit(true)} className="text-orange-500 hover:text-orange-600">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">Facebook</div>
                    {dogProfile.socialMedia.facebook ? (
                      <a href={`https://facebook.com/${dogProfile.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
                        {dogProfile.socialMedia.facebook}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-400">未設定</div>
                    )}
                  </div>
                  <button onClick={() => setShowProfileEdit(true)} className="text-orange-500 hover:text-orange-600">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">よく行くお店・施設</h3>
                <button onClick={() => setShowPlaceForm(true)} className="text-orange-500 hover:text-orange-600">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              
              {dogProfile.places.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">まだ登録がありません</p>
                  <p className="text-xs mt-1">右上の+ボタンから追加できます</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dogProfile.places.map((place) => {
                    const placeType = placeTypes.find(t => t.value === place.type);
                    return (
                      <div key={place.id} className={`p-4 rounded-xl border-2 ${placeType?.color || 'bg-gray-100'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-bold text-lg mb-1">{placeType?.label}</div>
                            <div className="font-semibold text-gray-800">{place.name}</div>
                          </div>
                          <button onClick={() => deletePlace(place.id)} className="text-red-500 hover:text-red-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {place.phone && (
                          <a href={`tel:${place.phone}`} className="text-sm text-blue-600 hover:text-blue-700 block mb-1">
                            📞 {place.phone}
                          </a>
                        )}
                        {place.address && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 block mb-1"
                          >
                            📍 {place.address}
                          </a>
                        )}
                        {place.memo && (
                          <div className="text-sm text-gray-700 mt-2 p-2 bg-white/50 rounded">
                            {place.memo}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {getWeightData().length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Weight className="w-6 h-6 text-purple-500" />体重の推移</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getWeightData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">{recordTypes[formData.type].name}を記録</h3>
              <div className="space-y-4">
                {formData.type === 'toilet' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">種類</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setFormData({ ...formData, subType: 'おしっこ' })} className={`py-3 rounded-lg font-semibold ${formData.subType === 'おしっこ' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>💧 おしっこ</button>
                        <button onClick={() => setFormData({ ...formData, subType: 'うんち' })} className={`py-3 rounded-lg font-semibold ${formData.subType === 'うんち' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>💩 うんち</button>
                      </div>
                    </div>
                    {formData.subType && (
                      <div>
                        <label className="block text-sm font-semibold mb-2">状態</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button onClick={() => setFormData({ ...formData, condition: 'good' })} className={`py-3 rounded-lg font-semibold ${formData.condition === 'good' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>😊 良い</button>
                          <button onClick={() => setFormData({ ...formData, condition: 'normal' })} className={`py-3 rounded-lg font-semibold ${formData.condition === 'normal' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}>😐 普通</button>
                          <button onClick={() => setFormData({ ...formData, condition: 'bad' })} className={`py-3 rounded-lg font-semibold ${formData.condition === 'bad' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>😰 悪い</button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {formData.type === 'food' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">ごはんの種類</label>
                    <select value={formData.subType} onChange={(e) => setFormData({ ...formData, subType: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3">
                      <option value="">選択してください</option>
                      {dogProfile.foodTypes.map((food, i) => (
                        <option key={i} value={food}>{food}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.type === 'weight' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">体重 (kg)</label>
                    <input type="number" step="0.1" value={formData.subType} onChange={(e) => setFormData({ ...formData, subType: e.target.value })} placeholder="例: 5.2" className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">時間</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">メモ(任意)</label>
                  <textarea value={formData.memo} onChange={(e) => setFormData({ ...formData, memo: e.target.value })} placeholder="量や様子など" rows="3" className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-3 rounded-lg">キャンセル</button>
                  <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-lg">記録する</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showVaccinationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">予防接種を追加</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">ワクチン種類</label>
                  <select value={vaccinationForm.type} onChange={(e) => setVaccinationForm({ ...vaccinationForm, type: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3">
                    <option value="">選択してください</option>
                    {vaccinationTypes.map((v) => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">接種日</label>
                  <input type="date" value={vaccinationForm.date} onChange={(e) => setVaccinationForm({ ...vaccinationForm, date: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">次回接種予定日</label>
                  <input type="date" value={vaccinationForm.nextDate} onChange={(e) => setVaccinationForm({ ...vaccinationForm, nextDate: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">接種証明書の写真</label>
                  {vaccinationForm.photo ? (
                    <div className="relative">
                      <img src={vaccinationForm.photo} alt="接種証明" className="w-full h-48 object-cover rounded-xl" />
                      <button
                        onClick={() => setVaccinationForm({ ...vaccinationForm, photo: null })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                      <Camera className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-gray-500 font-semibold text-sm">写真を選択</span>
                      <span className="text-gray-400 text-xs mt-1">接種証明書や注射の様子</span>
                      <input type="file" accept="image/*" onChange={handleVaccinationPhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowVaccinationForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-3 rounded-lg">キャンセル</button>
                  <button onClick={handleVaccinationSubmit} disabled={!vaccinationForm.type || !vaccinationForm.date} className={`flex-1 font-bold py-3 rounded-lg ${vaccinationForm.type && vaccinationForm.date ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 'bg-gray-300 text-gray-500'}`}>追加</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">予定を追加</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">種類</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setEventForm({ ...eventForm, type: 'trimming', vaccinationType: '' })} className={`py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${eventForm.type === 'trimming' ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>
                      <Scissors className="w-5 h-5" />トリミング
                    </button>
                    <button onClick={() => setEventForm({ ...eventForm, type: 'vaccination' })} className={`py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${eventForm.type === 'vaccination' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>
                      <Syringe className="w-5 h-5" />予防接種
                    </button>
                  </div>
                </div>

                {eventForm.type === 'vaccination' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">ワクチン種類</label>
                    <select value={eventForm.vaccinationType} onChange={(e) => setEventForm({ ...eventForm, vaccinationType: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3">
                      <option value="">選択してください</option>
                      {vaccinationTypes.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">日時</label>
                  <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">メモ(任意)</label>
                  <textarea value={eventForm.memo} onChange={(e) => setEventForm({ ...eventForm, memo: e.target.value })} placeholder="詳細など" rows="2" className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowEventForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-3 rounded-lg">キャンセル</button>
                  <button onClick={handleEventSubmit} disabled={!eventForm.type || !eventForm.date || (eventForm.type === 'vaccination' && !eventForm.vaccinationType)} className={`flex-1 font-bold py-3 rounded-lg ${eventForm.type && eventForm.date && (eventForm.type !== 'vaccination' || eventForm.vaccinationType) ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-gray-300 text-gray-500'}`}>追加</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showProfileEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">プロフィール編集</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">写真</label>
                  {dogProfile.photo ? (
                    <div className="relative">
                      <img src={dogProfile.photo} alt="Dog" className="w-full h-48 object-cover rounded-xl" />
                      <button onClick={() => setDogProfile({ ...dogProfile, photo: null })} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-500 font-semibold">写真を選択</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">名前</label>
                  <input type="text" value={dogProfile.name} onChange={(e) => setDogProfile({ ...dogProfile, name: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">犬種</label>
                  <select value={dogProfile.breed} onChange={(e) => setDogProfile({ ...dogProfile, breed: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3">
                    {popularBreeds.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">誕生日</label>
                  <input type="date" value={dogProfile.birthday} onChange={(e) => setDogProfile({ ...dogProfile, birthday: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" />
                </div>
                
                <div className="border-t-2 pt-4">
                  <h4 className="font-bold text-gray-800 mb-3">SNS連携</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </div>
                        X (Twitter)
                      </label>
                      <input 
                        type="text" 
                        value={dogProfile.socialMedia.twitter} 
                        onChange={(e) => setDogProfile({ ...dogProfile, socialMedia: { ...dogProfile.socialMedia, twitter: e.target.value }})} 
                        placeholder="ユーザー名（@なし）"
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
                        Instagram
                      </label>
                      <input 
                        type="text" 
                        value={dogProfile.socialMedia.instagram} 
                        onChange={(e) => setDogProfile({ ...dogProfile, socialMedia: { ...dogProfile.socialMedia, instagram: e.target.value }})} 
                        placeholder="ユーザー名（@なし）"
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </div>
                        Facebook
                      </label>
                      <input 
                        type="text" 
                        value={dogProfile.socialMedia.facebook} 
                        onChange={(e) => setDogProfile({ ...dogProfile, socialMedia: { ...dogProfile.socialMedia, facebook: e.target.value }})} 
                        placeholder="ユーザー名またはページ名"
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3" 
                      />
                    </div>
                  </div>
                </div>

                <button onClick={() => setShowProfileEdit(false)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-lg">保存</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto flex">
          {[
            { key: 'home', icon: Plus, label: '記録' },
            { key: 'calendar', icon: Calendar, label: 'カレンダー' },
            { key: 'walk-map', icon: MapPin, label: '散歩' },
            { key: 'qa', icon: MessageCircle, label: '相談' },
            { key: 'profile', icon: User, label: 'プロフィール' }
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-3 flex flex-col items-center gap-1 ${activeTab === key ? 'text-orange-500' : 'text-gray-400'}`}>
              {key === 'profile' && dogProfile.photo ? (
                <img src={dogProfile.photo} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
