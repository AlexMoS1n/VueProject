import { ref, watch } from 'vue'

export function useFilters(initialFilters = {}) {
  const filters = ref(initialFilters)
  const appliedFilters = ref({})

  const applyFilters = () => {
    appliedFilters.value = { ...filters.value }
  }

  const resetFilters = () => {
    filters.value = { ...initialFilters }
    appliedFilters.value = { ...initialFilters }
  }

  // Автоматическое применение фильтров при изменении
  watch(filters, (newFilters) => {
    appliedFilters.value = { ...newFilters }
  }, { deep: true, immediate: true })

  return {
    filters,
    appliedFilters,
    applyFilters,
    resetFilters
  }
}