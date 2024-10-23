export interface LessonType {
  id: number
  title: string
  teacherName: string
  contents: string
  location: string
  qualifications: string
  lat: string
  lng: string
  place: string
  category: string
  price: number
  hasFreeParking: boolean
  careerHistory: string
  program: string
  operatingHours: string
  imageUrls: string[]
  user?: UserType
  isLiked: boolean
}

export interface UserType {
  email: string
  name: string
  nickname: string
  password: string
  city: string
  age: number
  phonenum: string
  image: string | null
  introduction: string | null
  sex: string
  role: 'USER' | 'ADMIN'
  socialType: 'KAKAO' | 'NAVER' | 'GOOGLE' | null
  socialId: string | null
  refreshToken: string | null
  Lesson?: LessonType[]
  // club: ClubType | null
}

export interface LikedLessonsResponse {
  data: LessonType[]
  page: number
}

export interface CommentType {
  id: number
  image: string | null
  comments: string
  memberName: string
  modifiedAt: string
}

export interface CommentApiType {
  content: CommentType[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface UserProfileUpdateType {
  email?: string
  name?: string
  nickname?: string
  phonenum?: string
  city?: string
  sex?: string
  introduction?: string
  age?: number
}

export interface ParamsProps {
  params: {
    id: string
  }
}

export interface LocationType {
  lat?: string | null
  lng?: string | null
  zoom?: number
}

export interface CenterType {
  id: number
  businessName: string
  location: string
  operatingHours: string
  announcements: string
  laneCount: number
  images: string[]
  lat: string
  lng: string
}

export interface GatheringType {
  id: number
  leadername: string
  title: string
  minAverage: number
  maxAverage: number
  description: string
  location: string
  date: string
  maxParticipants: number
  currentParticipants: number
  images: string[]
  lat: string
  lng: string
}
