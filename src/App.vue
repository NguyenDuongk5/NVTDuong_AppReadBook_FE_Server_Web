<!-- 
  1. props – Dữ liệu cha → con: Component cha truyền dữ liệu xuống component con.
  2. emit – Dữ liệu con → cha
  3. data() – Nội bộ của component: Đây là dữ liệu local, chỉ dùng trong component đó.
  4. computed – Giá trị tự động tính lại Computed không tự set, chỉ đọc. Nó chạy lại khi dữ liệu liên quan thay đổi.
  5. methods – Hàm xử lý: Chứa hành vi của component.
-->
<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="isCollapsed"
      :chapters="chapters"
      :selectedChapter="selectedChapter"
      @select-chapter="selectChapter"
      @reload-truyen="reloadTruyen"
    />
    <!-- Main -->
    <main class="main" :class="{ expanded: isCollapsed }">
      <!-- Topbar -->
      <Topbar 
        :class="{ collapsed: isCollapsed }" 
        @toggle-sidebar="toggleSidebar"
        @search="onSearch"
      />
      
      <!-- Content -->
      <router-view
        :chapters="chapters"
        :selectedChapter="selectedChapter"
        :keyword="searchKeyword"
        @search="onSearch"
      ></router-view>
    </main>
  </div>
  

</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import chapterApi from './api/chapterApi' 

export default {
  name: 'App',
  components: {
    Sidebar,
    Topbar,
  },
  data() {
  return {
      searchKeyword: "",
      isCollapsed: false,
      chapters: [],          // <--- khai báo chapters
      selectedChapter: null, // <--- khai báo selectedChapter
      mangaId: null,         // nếu muốn load chapters theo manga, set id ở đây
    };
},

  methods: {
    reloadTruyen() {
    // Nếu đang ở /truyen → chỉ reload data
    if (this.$route.name === "truyen") {
      this.$refs.truyenPage?.loadMangas();
    }
  },
    selectChapter(chapter) {
    this.selectedChapter = chapter;
  },
    onSearch(keyword) {
      this.searchKeyword = keyword || "";
    },
    /**
     * Phép đổi trạng thái sidebar
     * author: NvtDuong
     * createdDate: 03/11/25
     */
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    async loadChapters() {
      try {
        const res = await chapterApi.getAll();
        // lọc theo mangaId
        this.chapters = (res.data || []).filter(c => c.manga_id === this.mangaId);
      } catch (err) {
        console.error("Lỗi khi tải danh sách chapter:", err);
      }
    },


  onSearch(keyword) {
    this.searchKeyword = keyword || ""; // cập nhật keyword tìm kiếm
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



