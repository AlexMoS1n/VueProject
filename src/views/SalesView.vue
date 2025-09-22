<template>
  <div class="sales-view">
    <h2>📈 Продажи</h2>
    
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
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import FilterPanel from '@/components/FilterPanel.vue'
import ChartComponent from '@/components/ChartComponent.vue'
import DataTable from '@/components/DataTable.vue'
import Pagination from '@/components/Pagination.vue'
import dayjs from 'dayjs'

const { data, loading, error, totalPages, currentPage, fetchData } = useApi('/api/sales')

const filters = ref({
  dateFrom: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  dateTo: dayjs().format('YYYY-MM-DD'),
  limit: 50
})

const fetchSalesData = async () => {
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
  fetchSalesData()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchSalesData()
}

const tableData = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return []
  return data.value
})

const tableColumns = computed(() => [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'date', label: 'Дата', type: 'date' },
  { key: 'product_name', label: 'Товар', type: 'string' },
  { key: 'quantity', label: 'Количество', type: 'number' },
  { key: 'price', label: 'Цена', type: 'currency' },
  { key: 'total_amount', label: 'Сумма', type: 'currency' }
])

const chartData = computed(() => {
  if (!tableData.value.length) return null
  
  const salesByDate = tableData.value.reduce((acc, sale) => {
    const date = dayjs(sale.date).format('YYYY-MM-DD')
    if (!acc[date]) acc[date] = 0
    acc[date] += parseFloat(sale.total_amount || 0)
    return acc
  }, {})

  return {
    labels: Object.keys(salesByDate),
    datasets: [{
      label: 'Сумма продаж',
      data: Object.values(salesByDate),
      backgroundColor: '#4CAF50',
      borderColor: '#45a049',
      borderWidth: 1
    }]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Продажи по дням'
    }
  }
}

onMounted(() => {
  fetchSalesData()
})

watch(filters, () => {
  fetchSalesData()
}, { deep: true })
</script>

<style scoped>
.sales-view {
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