import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from '@/constants'
import { LessonType, LocationType } from '@/interface'
import { atom } from 'recoil'

export const selectedLessonState = atom<LessonType | null>({
  key: 'lesson',
  default: null,
})

export const locationState = atom<LocationType>({
  key: 'location',
  default: {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    zoom: ZOOM_LEVEL,
  },
})

export const filterState = atom({
  key: 'filterState',
  default: {
    date: '',
    time: '',
    students: 1,
  },
})
