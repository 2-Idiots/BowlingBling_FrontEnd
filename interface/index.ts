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
}

export interface ParamsProps {
  params: {
    id: string
  }
}
