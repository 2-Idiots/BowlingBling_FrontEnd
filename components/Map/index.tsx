'use client'
/*global kakao*/

import Script from 'next/script'
import { useQuery } from 'react-query'
import axios from 'axios'
import { LessonType } from '@/interface'
import { BsMap } from 'react-icons/bs'

declare global {
  interface Window {
    kakao: any
  }
}

// const DEFAULT_LAT = 37.565337
// const DEFAULT_LNG = 126.9772095
const DEFAULT_LAT = 37
const DEFAULT_LNG = 128
const ZOOM_LEVEL = 7

// export default function Map() {
//   const fetchBowlAlley = async () => {
//     const { data } = await axios('/api/lesson')
//     return data as LessonType[]
//   }
export default function Map() {
  const fetchBowlAlley = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/lesson`,
      )
      console.log('API Response:', data) // 응답 데이터 로깅
      return data.content as LessonType[]
    } catch (error) {
      console.error('Error fetching lessons:', error)
      throw error
    }
  }

  const { data: lesson, isSuccess } = useQuery('map-lesson', fetchBowlAlley)

  // @see - https://apis.map.kakao.com/web/documentation/#load
  const loadKakoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map')
      const mapOption = {
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        level: ZOOM_LEVEL,
      }

      const map = new window.kakao.maps.Map(mapContainer, mapOption)

      // @see - https://apis.map.kakao.com/web/sample/basicMarker/
      lesson?.map((lesson) => {
        // 마커가 표시될 위치입니다
        const markerPosition = new window.kakao.maps.LatLng(
          lesson.lat,
          lesson.lng,
        )

        // custom overlay를 설정해줍니다
        const content = `<div class="custom_overlay">${lesson.teacherName?.toLocaleString()} ${lesson.category?.toLocaleString()}</div>`

        // custon overlay를 생성합니다
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
        })

        // 커스텀 오버레이가 지도 위에 표시되도록 설정합니다
        customOverlay.setMap(map)
      })
    })
  }
  return (
    <>
      {isSuccess && (
        <Script
          strategy="afterInteractive"
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
          onReady={loadKakoMap}
        />
      )}
      <div id="map" className="w-full h-screen" />
    </>
  )
}

export function MapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 items-center text-sm bg-black rounded-full text-white px-5 py-3.5 shadows-sm hover:shadow-lg mx-auto sticky bottom-12 hover:bg-rose-500 transition-colors"
    >
      지도 표시하기 <BsMap className="text-xs" />
    </button>
  )
}
