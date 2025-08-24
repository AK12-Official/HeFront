import { ref } from 'vue'
import { getPlayInfo } from '@/api/Video'
import type { PlayInfoDTO } from '@/api/Video/types'

export function useVideoDetail() {
  const videoInfo = ref<PlayInfoDTO | null>(null)
  const loading = ref(false)

  // 获取视频详细信息
  const fetchVideoDetail = async (videoId: string) => {
    loading.value = true
    
    try {
      const response = await getPlayInfo({ videoId })
      
      if (response.code === 10000) {
        videoInfo.value = response.data
        return response.data
      } else {
        console.error('获取视频信息失败:', response.message)
        return null
      }
    } catch (error) {
      console.error('获取视频信息异常:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    videoInfo,
    loading,
    fetchVideoDetail
  }
}