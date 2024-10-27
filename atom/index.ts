import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from '@/constants'
import {
  CenterType,
  GatheringType,
  LessonType,
  LocationType,
} from '@/interface'
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
  },
})

export const selectedCenterState = atom<CenterType | null>({
  key: 'selectedCenterState',
  default: null,
})

export const selectedGatheringState = atom<GatheringType | null>({
  key: 'selectedGatheringState',
  default: null,
})
