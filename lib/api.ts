import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session?.backendToken) {
      const token = JSON.parse(session.backendToken)
      config.headers['Authorization'] = `Bearer ${token.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 레슨
export const fetchLessons = async (page = 1, limit = 8) => {
  const response = await api.get('/lesson', {
    params: { page, limit },
  })
  return response.data
}

export const fetchLessonById = async (id: string) => {
  const response = await api.get(`/lesson/${id}`)
  return response.data
}

// 볼링장
export const fetchCenters = async (page = 1, limit = 8) => {
  const response = await api.get('/centers', {
    params: { page, limit },
  })
  return response.data
}

export const fetchCenterById = async (id: string) => {
  const response = await api.get(`/centers/${id}`)
  return response.data
}

// 벙개
export const fetchGatherings = async (page = 1, limit = 8) => {
  const response = await api.get('/gatherings', {
    params: { page, limit },
  })
  console.log('Gatherings data:', response.data)
  return response.data
}

export const fetchGatheringById = async (id: string) => {
  const response = await api.get(`/gatherings/${id}`)
  return response.data
}

// 사용자 정보
export const fetchUserInfo = async () => {
  const response = await api.get('/users/info')
  return response.data
}

export const updateUserProfile = async (userData: any) => {
  const response = await api.put('/users/profile/update', userData)
  return response.data
}

export default api
