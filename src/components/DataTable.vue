<template>
  <div class="data-table-container">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>
    <div v-else-if="!data.length" class="no-data">Нет данных</div>
    
    <table v-else class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="item.id || index">
          <td v-for="column in columns" :key="column.key">
            {{ formatValue(item[column.key], column.type) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  error: String
})

const formatValue = (value, type = 'string') => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'date':
      return dayjs(value).format('YYYY-MM-DD')
    case 'datetime':
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    case 'number':
      return new Intl.NumberFormat().format(value)
    case 'currency':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
    default:
      return value.toString()
  }
}
</script>

<style scoped>
.data-table-container {
  margin: 1rem 0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.data-table tr:hover {
  background-color: #f5f5f5;
}

.loading, .error, .no-data {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.error {
  color: #dc3545;
}
</style>