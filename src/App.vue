<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <Sidebar :collapsed="isCollapsed" />
    <!-- Main -->
    <main class="main" :class="{ expanded: isCollapsed }">
      <!-- Topbar -->
      <Topbar :class="{ collapsed: isCollapsed }" @toggle-sidebar="toggleSidebar" />
      <!-- Content -->
      <router-view></router-view>
    </main>
  </div>
  

</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    Topbar,
  },
  data() {
    return {
      // trạng thái sidebar: false = mở, true = thu gọn
      isCollapsed: false
    }
  },
  methods: {
    /**
     * Phép đổi trạng thái sidebar
     * author: NvtDuong
     * createdDate: 03/11/25
     */
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
      console.log('Sidebar collapsed:', this.isCollapsed)
    }
  }
}
</script>


<style src="./assets/main.css"></style>

<style>
/* Áp dụng font và cỡ chữ cho toàn trang admin */
* {
  font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
}
h2{
  font-size: 20px;
}
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
  margin-left: 60px; /* khi sidebar thu gọn */
  padding: 0;
}
.side-bar.collapsed {
  width: 10px;
  align-items: center;
  padding: 20px 10px;
  
}

.side-bar.collapsed .nav-item span {
  display: none; /* Ẩn text khi thu gọn */
}

.side-bar.collapsed .logo {
  margin: 0 auto;
}

.side-bar.collapsed .s {
  flex-direction: column;
  padding-top: 10px ;
}

</style>



