'use client';

import { useState } from "react";
import Link from "next/link";
import MapClient from "@/components/map/MapClient";

const DUMMY_CAFES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: '스타벅스 무교동점',
    address: '서울특별시 중구 무교로 21',
    lat: 37.5678,
    lng: 126.9790,
    tags: ['🔌 콘센트 넉넉함', '📶 기가 와이파이']
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: '이디야커피 시청역점',
    address: '서울특별시 중구 서소문로 124',
    lat: 37.5645,
    lng: 126.9750,
    tags: ['🤫 조용한 편', '☕ 커피 가성비']
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: '블루보틀 광화문 카페',
    address: '서울특별시 종로구 청계천로 11',
    lat: 37.5695,
    lng: 126.9780,
    tags: ['🪑 좌석 편함', '🔌 자리마다 콘센트', '✨ 깔끔한 인테리어']
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: '투썸플레이스 을지로입구역점',
    address: '서울특별시 중구 남대문로 117',
    lat: 37.5668,
    lng: 126.9820,
    tags: ['📶 빠른 와이파이', '🤫 작업하기 좋음']
  }
];

export default function Home() {
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    plug: false,
    wifi: false,
    noise: false
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCafes = DUMMY_CAFES.filter(cafe => {
    if (filters.plug && !cafe.tags.some(t => t.includes('콘센트'))) return false;
    if (filters.wifi && !cafe.tags.some(t => t.includes('와이파이'))) return false;
    if (filters.noise && !cafe.tags.some(t => t.includes('조용한') || t.includes('작업하기'))) return false;
    return true;
  });

  return (
    <main className="flex h-screen w-full overflow-hidden bg-slate-50">
      <aside className="w-[420px] h-full bg-white border-r border-slate-200 shadow-[2px_0_8px_rgba(0,0,0,0.05)] flex flex-col z-10 relative">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">☕ 월요병연구소</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">디지털 노마드를 위한 완벽한 작업 공간</p>
        </div>
        
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex gap-2">
             <button 
               onClick={() => toggleFilter('plug')}
               className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                 filters.plug ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
               }`}>
               🔌 콘센트
             </button>
             <button 
               onClick={() => toggleFilter('wifi')}
               className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                 filters.wifi ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
               }`}>
               📶 와이파이
             </button>
             <button 
               onClick={() => toggleFilter('noise')}
               className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                 filters.noise ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
               }`}>
               🤫 소음도
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {filteredCafes.length === 0 ? (
            <div className="text-center p-8 text-slate-400 text-sm font-medium">조건에 맞는 카페가 없습니다.</div>
          ) : null}
          {filteredCafes.map((cafe) => (
            <div 
              key={cafe.id}
              onClick={() => setSelectedCafeId(cafe.id)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group ${
                selectedCafeId === cafe.id 
                  ? 'border-blue-500 shadow-md bg-blue-50/30' 
                  : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${selectedCafeId === cafe.id ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-300'}`}></div>
              <h3 className={`font-bold text-lg ${selectedCafeId === cafe.id ? 'text-blue-800' : 'text-slate-800'}`}>{cafe.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{cafe.address}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {cafe.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white border border-slate-100 text-slate-600 rounded-lg font-semibold shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              {selectedCafeId === cafe.id && (
                <Link 
                  href={`/cafes/${cafe.id}`}
                  className="mt-5 flex items-center justify-center w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  상세 정보 및 실시간 채팅 참여 💬
                </Link>
              )}
            </div>
          ))}
        </div>
      </aside>

      <section className="flex-1 h-full relative">
        <MapClient 
          cafes={filteredCafes} 
          selectedCafeId={selectedCafeId} 
          onSelectCafe={setSelectedCafeId} 
        />
      </section>
    </main>
  );
}
