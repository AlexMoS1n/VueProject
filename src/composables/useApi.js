import { ref } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const API_BASE = 'http://109.73.206.144:6969'
const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

export function useApi(endpoint) {
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalPages = ref(1)
  const currentPage = ref(1)

  const fetchData = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams({
        ...params,
        key: API_KEY,
        page: params.page || 1,
        limit: params.limit || 50
      }).toString()

      const response = await axios.get(`${API_BASE}${endpoint}?${queryParams}`)
      data.value = response.data.data || response.data
      
      // Предполагаем, что API возвращает информацию о пагинации
      if (response.data.meta) {
        totalPages.value = response.data.meta.last_page
        currentPage.value = response.data.meta.current_page
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('API Error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    totalPages,
    currentPage,
    fetchData
  }
}