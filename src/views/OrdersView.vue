<template>
  <div class="orders-view">
    <h2>📦 Заказы</h2>
    
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

const { data, loading, error, totalPages, currentPage, fetchData } = useApi('/api/orders')

const filters = ref({
  dateFrom: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  dateTo: dayjs().format('YYYY-MM-DD'),
  limit: 50
})

const fetchOrdersData = async () => {
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
  fetchOrdersData()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchOrdersData()
}

const tableData = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return []
  return data.value
})

const tableColumns = computed(() => [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'order_date', label: 'Дата заказа', type: 'datetime' },
  { key: 'customer_name', label: 'Клиент', type: 'string' },
  { key: 'status', label: 'Статус', type: 'string' },
  { key: 'total_amount', label: 'Сумма', type: 'currency' }
])

const chartData = computed(() => {
  if (!tableData.value.length) return null
  
  const ordersByStatus = tableData.value.reduce((acc, order) => {
    const status = order.status || 'Unknown'
    if (!acc[status]) acc[status] = 0
    acc[status]++
    return acc
  }, {})

  return {
    labels: Object.keys(ordersByStatus),
    datasets: [{
      label: 'Количество заказов',
      data: Object.values(ordersByStatus),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ]
    }]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Заказы по статусам'
    }
  }
}

onMounted(() => {
  fetchOrdersData()
})
</script>

<style scoped>
.orders-view {
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