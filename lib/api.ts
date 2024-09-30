import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

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

export default api
