'use client'
/*global kakao*/

import Script from 'next/script'
import { GatheringType } from '@/interface'
import { FullPageLoader } from '../Loader'

declare global {
  interface Window {
    kakao: any
  }
}

export default function DetailGatheringMap({ data }: { data: GatheringType }) {
  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map')
      const mapOption = {
        center: new window.kakao.maps.LatLng(data?.lat, data?.lng),
        level: 5,
      }

      const map = new window.kakao.maps.Map(mapContainer, mapOption)

      const markerPosition = new window.kakao.maps.LatLng(data.lat, data.lng)

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

      const content = `<div class="custom_overlay">${data.title}</div>`

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
      })

      customOverlay.setMap(map)

      const mapTypeControl = new window.kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

      const zoomControl = new window.kakao.maps.ZoomControl()
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
    })
  }

  return (
    <>
      {data ? (
        <Script
          strategy="afterInteractive"
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
          onReady={loadKakaoMap}
        />
      ) : (
        <FullPageLoader />
      )}
      <div id="map" className="w-full h-[500px] border border-gray-300" />
    </>
  )
}
