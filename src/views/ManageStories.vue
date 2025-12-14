<template>
  <div class="manga-manager">
    <div class="header">
      <h2>Quản lý truyện</h2>
      <!-- Nút thêm truyện -->
      <base-button type="primary" @click="handleAddNew">+ Thêm truyện</base-button>
    </div>
    <!-- Search history: nằm NGAY dưới ô search -->
    <div class="search-history" v-if="searchHistory.length && keyword">
      <span class="label">Lịch sử:</span>

      <div v-for="k in searchHistory" :key="k" class="history-item">
        <span class="text" @click="onSelectHistory(k)">
          {{ k }}
        </span>
        <span class="remove" @click="removeHistory(k)">
          ❌
        </span>
      </div>
       <button
      v-if="searchHistory.length"
      class="clear-all"
      @click="clearHistory"
    >
      Xóa tất cả
    </button>
    </div>
    <!-- Nếu có keyword → render FilteredMangas -->
    <FilteredMangas v-if="keyword" :keyword="keyword" :mangas="filteredMangas" @select="goToChapters" @select-history="onSelectHistory"/>
    

    <!-- Nếu không có keyword → render table -->
    <div v-else class="manga-table">
      <table>
        <thead>
          <tr>
            <th class="border">STT</th>
            <th class="border">Tên truyện</th>
            <th class="border">Tác giả</th>
            <th class="border">Ngày tạo</th>
            <th class="border">Thể loại</th>
            <th class="border">Ảnh bìa</th>
            <th class="border">Thao tác</th>
          </tr>
        </thead>
        <!-- Danh sách truyện trong bảng -->
        <tbody>
          <!-- <tr v-for="(m, index) in mangas" :key="m.manga_id"> -->
            <tr v-for="(m, index) in pagedMangas" :key="m.manga_id">


            <!-- Tên truyện, tác giả, ngày tạo, thể loại, sẵn hình bìa-->
            <td class="border" style="text-align: center" @click="goToChapters(m)">{{ indexManga(index) }}</td>
            <td class="border" @click="goToChapters(m)">{{ m.manga_title }}</td>
            <td class="border" @click="goToChapters(m)">{{ m.manga_author }}</td>
            <td class="border" @click="goToChapters(m)">{{ formatDate(m.created_date) }}</td>
            <td class="border" @click="goToChapters(m)"> {{ m.category_names }}</td>
            <td class="border" >
              <div class="img-cell">
                <img :src="m.manga_image" alt="Ảnh truyện"  @click="openImage(m.manga_image)" class="img" />
                <base-button @click="openImage(m.manga_image)" class="view-btn">Xem</base-button>
              </div>
            </td>
            <!-- Nút sửa / xóa -->
            <td class="border">
              <div class="btn-group">
                <base-button type="primary" @click="editManga(m)">Sửa</base-button>
                <base-button type="danger" @click="deleteManga(m.manga_id)">Xóa</base-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="pagination-example" v-if="!keyword">
      <span class="pagination-info">
        Hiển thị 
        {{ startIndex }} - {{ endIndex }} / {{ total }}
      </span>
      <base-paging
        title="Danh sách truyện"
        :total="total"
        :page="pageSize"
        :current="currentPage"
        @page-changed="onPageChange"
      />
    </div>
    
    <!-- Popup xem ảnh -->
    <div v-if="showImage" class="image-popup-overlay" @click="closeImage">
      <img :src="selectedImage" class="image-popup" />
    </div>

    <!-- Popup form thêm / sửa -->
    <div v-if="openForm" class="popup-overlay" @click.self="closeForm">
      <AddStory
        :manga-data="editingManga"
        @refresh="loadMangas"
        @close="closeForm"
      />
    </div>
  </div>
  <BaseDialog
    v-if="!keyword"
    v-model:show="showDialog"
    :message="dialogMessage"
    :typeDialog="dialogType"
  />
  
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BasePaging from "@/components/base/BasePaging.vue";
import FilteredMangas from "@/views/FilteredMangas.vue";
import AddStory from "@/views/AddStory.vue";
import ChapterManager from "@/views/ChapterManager.vue";

import { mangaApi } from "@/api/mangaApi";
import categoryApi from "@/api/categoryApi.js";
import { chapterApi } from "@/api/chapterApi";


export default {
  name: "ManageStories",
  emits: ["select-chapter", "select-history"],
  components: {
    BaseButton,
    AddStory,
    BasePaging,
    BaseDialog,
    FilteredMangas,
  },
  props: {
    chapters: {
      type: Array,
      default: () => []
    },
    selectedChapter: {
      type: Object,
      default: null
    },
    keyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keywordLocal: "",
      openForm: false,
      mangas: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showImage: false,
      selectedImage: null,
      editingManga: null,
      index: 0,   // truyện đang chọn
      // dialog
      showDialog: false,
      dialogMessage: "",
      dialogType: "success",
      selectedManga: null,
      searchHistory: [],
      };
  },

  async mounted() {
    const me = this;
    this.currentPage = Number(this.$route.query.page) || 1;
    await me.loadMangas();
    this.loadSearchHistory();
  },

  computed: {
    /**
     * Lấy danh sách truyện theo phân trang
     * author: NvtDuong
     * createdDate: 13/12/2025
     */
    pagedMangas() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredMangas.slice(start, end);
    },
    /**
     * Lọc danh sách truyện theo keyword
     * author: NvtDuong
     * createdDate: 13/12/2025
     */
    filteredMangas() {
      if (!this.keyword) return this.mangas;
      const key = this.keyword.toLowerCase();
      return this.mangas.filter(m =>
        m.manga_title.toLowerCase().includes(key) ||
        m.manga_author.toLowerCase().includes(key)
      );
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    endIndex() {
      return Math.min(this.currentPage * this.pageSize, this.total);
    },
  },
  

  methods: {
    /**
     * Khi chọn một truyện trên table sử dụng emit select-chapter
     * @param chapter 
     */
    selectChapter(chapter) {
      this.$emit("select-chapter", chapter);
    },
    /** Tải danh sách truyện từ API, gắn tên thể loại cho từng truyện
     * author: NvtDuong
     * createdDate: 07/11/25
     */
    async loadMangas() {
      try {
        const [res, categoryRes] = await Promise.all([
          mangaApi.getAll(), // load tất cả truyện
          categoryApi.getAll()
        ]);

        let mangas = res.data || [];
        const categories = categoryRes.data || [];

        // Map category id -> name
        const categoryMap = {};
        categories.forEach(c => categoryMap[c.category_id] = c.category_name);

        // Gắn tên thể loại
        mangas = mangas.map(m => {
          if (m.list_category_id) {
            const ids = m.list_category_id.split(",").filter(id => id);
            m.category_names = ids.map(id => categoryMap[id]).filter(Boolean).join(", ");
          } else {
            m.category_names = "";
          }
          return m;
        });

        this.mangas = mangas;
        this.total = mangas.length;

      } catch (err) {
        console.error("Lỗi tải danh sách truyện:", err);
      }
    },
    /// quay lới trang truyện
    backToMangas() {
      this.selectedManga = null;
    },
    /** khi chuyển trang phân trang, cập nhật currentPage và tải lại danh sách truyện
     * author: NvtDuong
     * createdDate: 03/11/25
     */
    async onPageChange(page) {
      this.currentPage = page;
      this.$router.push({ name: "truyen", query: { page } });
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll lên đầu
    },

    /** Mở form thêm truyện mới
     * author: NvtDuong
     * createdDate: 03/11/25
     */
    handleAddNew() {
      const me = this;
      me.editingManga = null;
      me.openForm = true;
    },

    /** Sửa truyện 
     * author: NvtDuong
     * createdDate: 03/11/25
    */
    editManga(manga) {
      const me = this;
      me.editingManga = { ...manga,  };
      me.openForm = true;
    },

    /** Xóa truyện 
     * author: NvtDuong
     * createdDate: 03/11/25
    */
    async deleteManga(mangaId) {
      const me = this;
      if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;
      try {
        const res = await mangaApi.delete(mangaId);
        if (res.status === 200) {
          me.dialogMessage = "Xóa truyện thành công!";
          me.dialogType = "success"; 
          me.showDialog = true;
          await me.loadMangas();
        } else {
          alert("Xóa thất bại!");
        }
      } catch (err) {
        console.error("Lỗi khi xóa truyện:", err);
        alert("Không thể xóa truyện!");
      }
    },

    /** Định dạng ngày giờ từ chuỗi ISO sang dạng: HH:MM - dd/MM/yyyy 
     * author: NvtDuong
     * createdDate: 03/11/25
    */
    formatDate(dateString) {
      if (!dateString) return "";
      const d = new Date(dateString);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const MM = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${hh}:${mm} - ${dd}/${MM}/${yyyy}`;
    },

    /** Xem ảnh 
     * author: NvtDuong
     * createdDate: 03/11/25
    */
    openImage(imageUrl) {
      const me = this;
      me.selectedImage = imageUrl;
      me.showImage = true;
    },

    /** Đóng ảnh 
     * author: NvtDuong
     * createdDate: 03/11/25
    */
    closeImage() {
      const me = this;
      me.showImage = false;
      me.selectedImage = null;
    },

    /** Đóng form */
    closeForm(dialogInfo) {
      const me = this;
      me.openForm = false;
      me.editingManga = null;

      if (dialogInfo) {
        this.dialogMessage = dialogInfo.message;
        this.dialogType = dialogInfo.type || "success";
        this.showDialog = true;

        setTimeout(() => {
          this.showDialog = false;
        }, 5000); // tự ẩn sau 1.2s
      }
    },
    goToChapters(manga) {
      this.$router.push({
        name: "ChapterManager",
        params: { mangaId: manga.manga_id },
        query: { 
          title: manga.manga_title ,
          page: this.currentPage
        },
      });
    },
    indexManga(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    loadSearchHistory() {
      const data = localStorage.getItem("searchHistory");
      this.searchHistory = data ? JSON.parse(data) : [];
    },

    saveSearch(keyword) {
      if (!keyword) return;

      let history = this.searchHistory.filter(k => k !== keyword);
      history.unshift(keyword);

      if (history.length > 5) history.length = 5;

      this.searchHistory = history;
      localStorage.setItem("searchHistory", JSON.stringify(history));
    },

    removeHistory(k) {
      this.searchHistory = this.searchHistory.filter(x => x !== k);
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },
    onSelectHistory(k) {
      this.$emit("search", k); // đẩy lên App.vue
    },
     clearHistory() {
        this.searchHistory = [];
        localStorage.removeItem("search_history");
      }
  },

  watch: {
    keyword(newVal) {
      this.saveSearch(newVal);
    }
  },
};

</script>


<style scoped>
.manga-manager {
  background: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  margin-top: 60px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.header .base-btn {
  height: 36px;
  padding: 0 16px;
  font-weight: bold;
  border: 2px #e8f0fe solid;
}


.popup-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 3000; /* nổi trên topbar */
  overflow: auto; /* để nếu popup cao vẫn cuộn được */
  padding: 20px; /* để không dính sát mép màn hình */
}

/* Popup chính */
.popup-overlay > * {
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px 10px 24px 24px;
  animation: fadeIn 0.25s ease;
}

/* Hiệu ứng mượt khi mở popup */
@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.manga-table {
  overflow-x: auto;
  min-height: 528px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.manga-table table {
  height: auto;
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

.manga-table th {
  width: fit-content;
  background: linear-gradient(to right, #dbeafe, #bfdbfe);
  text-align: center;
  border-bottom: 2px solid #e5e7eb;
  font-style: bold;
  color: #2f5492;
  height: 48px;
  box-sizing: border-box;

}
.ellipsis {
  white-space: nowrap;        /* không xuống dòng */
  overflow: hidden;           /* ẩn phần dư */
  text-overflow: ellipsis;    /* hiện ... */
}


.manga-table td {
  max-width: 200px;
  height: 48px;
  padding: 0 20px;
  border-bottom: 1px solid #e5e7eb;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

}

.manga-table tr:nth-child(even) {
  background-color: #f0f6fc;
}
.manga-table tr:hover{
  background-color: #cadcfa;
  cursor: pointer;
}
.manga-table thead tr:hover{
  cursor:default !important;
}
.manga-table button {
  padding: 6px 10px;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;

}

.manga-thumbnail {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}
.img-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  text-align: center;
}

.view-btn{
  border: none !important;
}

.image-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.image-popup {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  object-fit: contain;
}
.btn-group{
  display: flex;
  gap: 8px;
  justify-content: center;
}
.pagination-example{
  display: flex;
  justify-content: space-between;
}
.pagination-info{
  padding: 10px;
  align-items: center;
}
/* ===== SEARCH HISTORY ===== */
.search-history {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 14px;
  margin: 8px 0 14px;
  background: #f8fbff;
  border: 1px solid #e0e7ff;
  border-radius: 10px;
}

.search-history .label {
  font-weight: 600;
  color: #1e3a8a;
  margin-right: 6px;
  white-space: nowrap;
}

/* mỗi item lịch sử */
.history-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e0ecff;
  border-radius: 999px;
  padding: 4px 10px;
  transition: all 0.2s ease;
}

/* hover nguyên item */
.history-item:hover {
  background: #c7ddff;
}

/* text keyword */
.history-item .text {
  cursor: pointer;
  font-size: 13px;
  color: #1e40af;
  font-weight: 500;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* nút xóa */
.history-item .remove {
  cursor: pointer;
  font-size: 12px;
  color: #64748b;
  transition: color 0.2s ease, transform 0.15s ease;
}

/* hover nút xóa */
.history-item .remove:hover {
  color: #dc2626;
  transform: scale(1.15);
}
.clear-all{
  cursor: pointer;
  font-size: 12px;
  color: #64748b;
  transition: color 0.2s ease, transform 0.15s ease;
  border: none;
  background: transparent;
}
.clear-all:hover{
  color: #dc2626;
}
/* mobile responsive */
@media (max-width: 768px) {
  .search-history {
    padding: 8px 10px;
  }

  .history-item {
    padding: 3px 8px;
  }

  .history-item .text {
    max-width: 100px;
    font-size: 12px;
  }
}


</style>
