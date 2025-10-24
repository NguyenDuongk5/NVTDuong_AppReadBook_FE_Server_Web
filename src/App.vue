<template>
  <div class="dashboard">
    <Sidebar :collapsed="isCollapsed" />
    <main class="main" :class="{ expanded: isCollapsed }">
      <Topbar @toggle-sidebar="toggleSidebar" />
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  console.log('Sidebar collapsed:', isCollapsed.value)
}
</script>

<style src="./assets/main.css"></style>

<style scoped>
.dashboard {
  display: flex;
}

/* Main tự co giãn theo sidebar */
.main {
  flex: 1;
  transition: margin-left 0.3s ease;
  margin-left: 240px; /* khi sidebar bình thường */
}

.main.expanded {
  margin-left: 80px; /* khi sidebar thu gọn */
}
.side-bar.collapsed {
  width: 80px;
  align-items: center;
  padding: 20px 10px;
  
}

.side-bar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 0;
}

.side-bar.collapsed .nav-item span {
  display: none; /* Ẩn text khi thu gọn */
}

.side-bar.collapsed .logo {
  margin: 0 auto;
}

.side-bar.collapsed .s {
  flex-direction: column;
}

</style>



