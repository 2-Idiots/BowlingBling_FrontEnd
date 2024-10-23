import { UserProfileUpdateType } from '@/interface'
import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

// api.interceptors.request.use(
//   async (config) => {
//     if (config.method !== 'OPTIONS') {
//       const session = await getSession()
//       console.log('Interceptor Session:', session) // 여기에 로그를 추가합니다.
//       if (session?.accessToken) {
//         config.headers['Authorization'] = `Bearer ${session.accessToken}`
//       }
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )
api.interceptors.request.use(
  async (config) => {
    if (config.method !== 'OPTIONS') {
      const session = await getSession()
      console.log('API Interceptor Session:', session)
      if (session?.accessToken) {
        config.headers['Authorization'] = `Bearer ${session.accessToken}`
        config.headers['Content-Type'] = 'application/json'
      }
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

// export const fetchLessonById = async (id: string) => {
//   const response = await api.get(`/lesson/${id}`)
//   return response.data
// }

export const fetchLessonById = async (id: string) => {
  const response = await api.get(`/lesson/${id}`)
  const lessonData = response.data

  // 백엔드에서 id나 isLiked를 제공하지 않는 경우, 여기서 추가
  return {
    ...lessonData,
    id: parseInt(id), // 문자열 id를 숫자로 변환
    isLiked: lessonData.isLiked || false, // isLiked가 없으면 기본값 false
  }
}

// 레슨 찜하기
export const likeLesson = async (lessonId: number) => {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('No access token available')
  }
  if (lessonId === undefined || lessonId === null) {
    throw new Error('Invalid lesson id')
  }
  console.log('Sending like request for lesson:', lessonId)
  const response = await api.post(`/lesson/${lessonId}/like`, null, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })
  console.log('Like response:', response.data)
  return response.data
}

export const unlikeLesson = async (lessonId: number) => {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('No access token available')
  }
  if (lessonId === undefined || lessonId === null) {
    throw new Error('Invalid lesson id')
  }
  console.log('Sending unlike request for lesson:', lessonId)
  const response = await api.post(`/lesson/${lessonId}/like-cancel`, null, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })
  console.log('Unlike response:', response.data)
  return response.data
}

export const fetchUserLikedLessons = async () => {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('No access token available')
  }
  const response = await api.get('/users/liked-lessons', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })
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

// 댓글
export const fetchComments = async (lessonId: number, page = 0) => {
  const response = await api.get(`/lesson/${lessonId}/comments`, {
    params: { page },
  })
  return response.data
}

export const createComment = async (lessonId: number, comments: string) => {
  const response = await api.post(`/lesson/${lessonId}/comments/save`, {
    comments,
  })
  return response.data
}

export const updateComment = async (
  lessonId: number,
  commentId: number,
  comments: string,
) => {
  const response = await api.patch(
    `/lesson/${lessonId}/comments/${commentId}/update`,
    { comments },
  )
  return response.data
}

// export const deleteComment = async (lessonId: number, commentId: number) => {
//   const response = await api.delete(
//     `/lesson/${lessonId}/comments/${commentId}/delete`,
//   )
//   return response.data
// }

export const deleteComment = async (lessonId: number, commentId: number) => {
  try {
    const session = await getSession()
    console.log('Deleting comment with session:', session)

    if (!session?.accessToken) {
      throw new Error('No access token available')
    }

    const response = await api.delete(
      `/lesson/${lessonId}/comments/${commentId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    )

    console.log('Delete response:', response)
    return response.data
  } catch (error) {
    console.error('Delete comment error:', error)
    throw error
  }
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
  try {
    const response = await api.get('/users/info')
    return response.data
  } catch (error) {
    console.error('Error fetching user info:', error)
    throw error
  }
}

export const updateUserProfile = async (
  userData: UserProfileUpdateType,
  file?: File,
) => {
  try {
    const session = await getSession()
    if (!session?.accessToken) {
      throw new Error('No access token available')
    }

    const formData = new FormData()

    // JSON 데이터를 문자열로 변환하여 'request' 키로 추가
    formData.append(
      'request',
      new Blob([JSON.stringify(userData)], { type: 'application/json' }),
    )

    // 파일이 있는 경우 'files' 키로 추가
    if (file) {
      formData.append('files', file)
    }

    const response = await api.patch('/users/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error updating user profile:', error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error setting up request:', error.message)
      }
    }
    throw error
  }
}

export default api
