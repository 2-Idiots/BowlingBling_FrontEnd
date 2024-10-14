'use client'
import Script from 'next/script'
import { useQuery } from 'react-query'
import { GatheringType } from '@/interface'
import { BsMap } from 'react-icons/bs'
import { useSetRecoilState } from 'recoil'
import { selectedGatheringState } from '@/atom'
import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from '@/constants'
import { FullPageLoader } from '../Loader'
import { fetchGatherings } from '@/lib/api'

declare global {
  interface Window {
    kakao: any
  }
}

export default function GatheringMap() {
  const setSelectedGathering = useSetRecoilState(selectedGatheringState)

  const { data: gatherings, isSuccess } = useQuery('map-gatherings', () =>
    fetchGatherings(),
  )

  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map')
      const mapOption = {
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        level: ZOOM_LEVEL,
      }

      const map = new window.kakao.maps.Map(mapContainer, mapOption)

      gatherings?.content.forEach((gathering: GatheringType) => {
        const markerPosition = new window.kakao.maps.LatLng(
          gathering.lat,
          gathering.lng,
        )

        const imageSrc = '/images/marker-icon.png'
        const imageSize = new window.kakao.maps.Size(30, 30)
        const imageOption = { offset: new window.kakao.maps.Point(16, 46) }

        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption,
        )

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        })

        marker.setMap(map)

        const content = `<div class="custom_overlay">${gathering.title}</div>`

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
        })

        customOverlay.setMap(map)

        window.kakao.maps.event.addListener(marker, 'click', function () {
          setSelectedGathering(gathering)
        })
      })

      window.kakao.maps.event.addListener(map, 'click', function () {
        setSelectedGathering(null)
      })
    })
  }

  return (
    <>
      {isSuccess ? (
        <Script
          strategy="afterInteractive"
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
          onReady={loadKakaoMap}
        />
      ) : (
        <FullPageLoader />
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
