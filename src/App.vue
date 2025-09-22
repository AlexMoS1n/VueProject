<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <router-link 
          to="/sales" 
          :class="['nav-link', { active: $route.name === 'sales' }]"
        >
          📈 Продажи
        </router-link>
        <router-link 
          to="/orders" 
          :class="['nav-link', { active: $route.name === 'orders' }]"
        >
          📦 Заказы
        </router-link>
        <router-link 
          to="/stocks" 
          :class="['nav-link', { active: $route.name === 'stocks' }]"
        >
          🏭 Склады
        </router-link>
        <router-link 
          to="/incomes" 
          :class="['nav-link', { active: $route.name === 'incomes' }]"
        >
          💰 Доходы
        </router-link>
      </nav>
    </header>
    
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-link {
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.nav-link:hover {
  color: #007bff;
  background: #f8f9fa;
}

.nav-link.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background: #f8f9fa;
}

.main {
  padding: 0;
}
</style>