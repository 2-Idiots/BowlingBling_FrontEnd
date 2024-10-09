import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
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
  return response.data
}

export const fetchGatheringById = async (id: string) => {
  const response = await api.get(`/gatherings/${id}`)
  return response.data
}

export default api
