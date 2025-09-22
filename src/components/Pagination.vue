<template>
  <div class="pagination">
    <button 
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      ← Назад
    </button>
    
    <span class="page-info">
      Страница {{ currentPage }} из {{ totalPages }}
    </span>
    
    <button 
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      Вперед →
    </button>
  </div>
</template>

<script setup>

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['page-change'])

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: bold;
  color: #333;
}
</style>