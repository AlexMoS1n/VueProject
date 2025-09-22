<template>
  <div class="incomes-view">
    <h2>💰 Доходы</h2>
    
    <FilterPanel 
      v-model:filters="filters"
      @update:filters="handleFiltersUpdate"
    />
    
    <ChartComponent 
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
    
    <DataTable
      :data="tableData"
      :columns="tableColumns"
      :loading="loading"
      :error="error"
    />
    
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import FilterPanel from '@/components/FilterPanel.vue'
import ChartComponent from '@/components/ChartComponent.vue'
import DataTable from '@/components/DataTable.vue'
import Pagination from '@/components/Pagination.vue'
import dayjs from 'dayjs'

const { data, loading, error, totalPages, currentPage, fetchData } = useApi('/api/incomes')

const filters = ref({
  dateFrom: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dateTo: dayjs().format('YYYY-MM-DD'),
  limit: 50
})

const fetchIncomesData = async () => {
  await fetchData({
    dateFrom: filters.value.dateFrom,
    dateTo: filters.value.dateTo,
    page: currentPage.value,
    limit: filters.value.limit
  })
}

const handleFiltersUpdate = (newFilters) => {
  filters.value = newFilters
  currentPage.value = 1
  fetchIncomesData()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchIncomesData()
}

const tableData = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return []
  return data.value
})

const tableColumns = computed(() => [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'date', label: 'Дата', type: 'date' },
  { key: 'source', label: 'Источник', type: 'string' },
  { key: 'amount', label: 'Сумма', type: 'currency' },
  { key: 'description', label: 'Описание', type: 'string' }
])

const chartData = computed(() => {
  if (!tableData.value.length) return null
  
  const incomeByDate = tableData.value.reduce((acc, income) => {
    const date = dayjs(income.date).format('YYYY-MM-DD')
    if (!acc[date]) acc[date] = 0
    acc[date] += parseFloat(income.amount || 0)
    return acc
  }, {})

  return {
    labels: Object.keys(incomeByDate),
    datasets: [{
      label: 'Доходы',
      data: Object.values(incomeByDate),
      backgroundColor: '#FF6384',
      borderColor: '#cc4f6a',
      borderWidth: 1
    }]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Доходы по дням'
    }
  }
}

onMounted(() => {
  fetchIncomesData()
})
</script>

<style scoped>
.incomes-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}
</style>