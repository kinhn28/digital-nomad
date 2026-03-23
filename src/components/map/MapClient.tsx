'use client';

import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

export interface CafeMarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapClientProps {
  cafes: CafeMarkerData[];
  selectedCafeId: string | null;
  onSelectCafe: (id: string) => void;
}

export default function MapClient({ cafes, selectedCafeId, onSelectCafe }: MapClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        setIsLoaded(true);
      } else {
        setTimeout(checkKakaoMaps, 500);
      }
    };
    checkKakaoMaps();
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
        지도를 불러오는 중입니다...
      </div>
    );
  }

  // 선택된 카페가 있으면 해당 위치로, 없으면 기본 위치(시청)
  const mapCenter = selectedCafeId 
    ? cafes.find(c => c.id === selectedCafeId) || { lat: 37.5665, lng: 126.9780 } 
    : { lat: 37.5665, lng: 126.9780 };

  return (
    <Map
      center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
      style={{ width: "100%", height: "100%" }}
      level={selectedCafeId ? 4 : 5} // 선택했을 때 약간 줌인
    >
      {cafes.map((cafe) => (
        <MapMarker
          key={cafe.id}
          position={{ lat: cafe.lat, lng: cafe.lng }}
          title={cafe.name}
          onClick={() => onSelectCafe(cafe.id)}
          image={{
            src: selectedCafeId === cafe.id 
              ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png' 
              : 'https://t1.daumcdn.net/mapjsapi/images/marker.png',
            size: selectedCafeId === cafe.id ? { width: 24, height: 35 } : { width: 24, height: 35 }
          }}
        />
      ))}
    </Map>
  );
}
