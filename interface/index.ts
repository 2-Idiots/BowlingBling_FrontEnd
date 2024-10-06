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
