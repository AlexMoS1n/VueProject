<template>
  <div class="filter-panel">
    <div class="filter-group">
      <label>Дата от:</label>
      <input 
        type="date" 
        v-model="localFilters.dateFrom" 
        @change="updateFilters"
      >
    </div>
    
    <div class="filter-group" v-if="showDateTo">
      <label>Дата до:</label>
      <input 
        type="date" 
        v-model="localFilters.dateTo" 
        @change="updateFilters"
      >
    </div>
    
    <div class="filter-group">
      <label>Лимит:</label>
      <select v-model="localFilters.limit" @change="updateFilters">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
    
    <button @click="resetFilters" class="reset-btn">Сбросить</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: Object,
  showDateTo: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({ ...props.filters })

const updateFilters = () => {
  emit('update:filters', { ...localFilters.value })
}

const resetFilters = () => {
  localFilters.value = {
    dateFrom: '',
    dateTo: '',
    limit: 50
  }
  emit('update:filters', { ...localFilters.value })
}

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<style scoped>
.filter-panel {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: bold;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn:hover {
  background: #ff3742;
}
</style>