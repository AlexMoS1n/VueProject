import { createRouter, createWebHistory } from 'vue-router'
import SalesView from '@/views/SalesView.vue'
import OrdersView from '@/views/OrdersView.vue'
import StocksView from '@/views/StocksView.vue'
import IncomesView from '@/views/IncomesView.vue'

const routes = [
  { path: '/', redirect: '/sales' },
  { path: '/sales', name: 'sales', component: SalesView },
  { path: '/orders', name: 'orders', component: OrdersView },
  { path: '/stocks', name: 'stocks', component: StocksView },
  { path: '/incomes', name: 'incomes', component: IncomesView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router