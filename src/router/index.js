import { createRouter, createWebHistory } from 'vue-router'
import DashboardContent from '../components/DashboardContent.vue'
import QuanLyTruyen from '../views/QuanLyTruyen.vue'

const routes = [
  { path: '/', name: 'home', component: DashboardContent },
  { path: '/truyen', name: 'truyen', component: QuanLyTruyen },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
