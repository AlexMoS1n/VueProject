<template>
  <div class="stocks-view">
    <h2>🏭 Склады</h2>
    
    <FilterPanel 
      v-model:filters="filters"
      :show-date-to="false"
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

const { data, loading, error, totalPages, currentPage, fetchData } = useApi('/api/stocks')

const filters = ref({
  dateFrom: dayjs().format('YYYY-MM-DD'), // Только текущий день
  limit: 50
})

const fetchStocksData = async () => {
  await fetchData({
    dateFrom: filters.value.dateFrom,
    page: currentPage.value,
    limit: filters.value.limit
  })
}

const handleFiltersUpdate = (newFilters) => {
  // Для складов используем только dateFrom
  filters.value.dateFrom = newFilters.dateFrom
  filters.value.limit = newFilters.limit
  currentPage.value = 1
  fetchStocksData()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchStocksData()
}

const tableData = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return []
  return data.value
})

const tableColumns = computed(() => [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'product_name', label: 'Товар', type: 'string' },
  { key: 'warehouse', label: 'Склад', type: 'string' },
  { key: 'quantity', label: 'Количество', type: 'number' },
  { key: 'reserved', label: 'Зарезервировано', type: 'number' },
  { key: 'available', label: 'Доступно', type: 'number' }
])

const chartData = computed(() => {
  if (!tableData.value.length) return null
  
  const stockByWarehouse = tableData.value.reduce((acc, stock) => {
    const warehouse = stock.warehouse || 'Unknown'
    if (!acc[warehouse]) acc[warehouse] = 0
    acc[warehouse] += parseInt(stock.quantity || 0)
    return acc
  }, {})

  return {
    labels: Object.keys(stockByWarehouse),
    datasets: [{
      label: 'Количество товаров',
      data: Object.values(stockByWarehouse),
      backgroundColor: '#36A2EB',
      borderColor: '#2a7cac',
      borderWidth: 1
    }]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Товары на складах'
    }
  }
}

onMounted(() => {
  fetchStocksData()
})
</script>

<style scoped>
.stocks-view {
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