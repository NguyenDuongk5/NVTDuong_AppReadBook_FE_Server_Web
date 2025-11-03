<template>
  <!-- -->
  <div class="manga-manager">
    <div class="header">
      <h2>Quản lý truyện</h2>
      <!-- Nút thêm truyện -->
      <base-button type="primary" @click="openForm = true">+ Thêm truyện</base-button>
    </div>
    <!-- Bảng quản lý truyện -->
    <div class="manga-table">
      <table class="">
        <thead>
          <tr class="">
            <th class="border">Tên truyện</th>
            <th class="border">Tác giả</th>
            <th class="border">Ngày tạo</th>
            <th class="border">Ảnh bìa</th>
            <th class="border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in mangas" :key="m.manga_id">
            <td class="border">{{ m.manga_title }}</td>
            <td class="border">{{ m.manga_author }}</td>
            <td class="border">{{ formatDate(m.created_date) }}</td>
            <td class="border">
              <div class="img-cell">
                <img :src="m.manga_image" alt="Ảnh truyện" class="img" />
                <button @click="openImage(m.manga_image)" class="view-btn">Xem</button>
              </div>
            </td>

            <td class="border">
              <button @click = "deleteManga(m.manga_id)" class="">Xóa</button>
            </td>
          </tr>

        </tbody>
      </table>
      </div>
      <div class="pagination-example">
        <base-paging
          title="Danh sách truyện"
          :total="total"
          :page="pageSize"
          @page-changed="onPageChange"
        />
      <!-- Popup xem ảnh -->
      <div
        v-if="showImage"
        class="image-popup-overlay"
        @click="closeImage"
      >
        <img
          :src="selectedImage"
          class="image-popup"
        />
      </div>


    </div>
    <!-- Form thêm truyện -->
    <div v-show="openForm" class="popup-overlay" @click.self="closeForm">
      <AddStory v-show="openForm" @refresh="loadMangas" @close="closeForm" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import BaseButton from "../components/base/BaseButton.vue";
import { mangaApi } from "../api/mangaApi";
import BasePaging from '../components/base/BasePaging.vue'

import AddStory from "./AddStory.vue";  
export default {
  name: "ManageStories",
  components: {
    BaseButton,
    AddStory,
    BasePaging
  },

  data() {
    return {
      openForm: false,
      mangas: [],
      showImage: false,
      selectedImage: null,
      total: 0,
      currentPage: 1,
      pageSize: 7,
    };
  },

  mounted() {
    const me = this;
    me.loadMangas();
  },

  methods: {
    /**
     * Tải danh sách truyện từ API
     */
    // trong methods của ManageStories.vue
    async loadMangas() {
      try {
        const res = await mangaApi.paging(this.currentPage, this.pageSize);
        console.log('paging response:', res.data);
        // Truy cập đúng tầng dữ liệu
        this.mangas = res.data.data.data || []; 
        this.total = res.data.total_record || res.data.data.total_record || 0;
      } catch (err) {
        console.error("Lỗi tải danh sách truyện:", err);
      }
    },
    async onPageChange(page) {
      const me = this;
      me.currentPage = page;
      await me.loadMangas();
    },
    /**
     * 
     * @param payload 
     */
    async handleSave(payload) {
      try {
        let result = await mangaApi.insert(payload);
        if(result.status !== 200) {
          console.error("Lỗi khi lưu truyện:", result.message);
          return;
        }
        else {
          alert("Lưu truyện thành công!");
        }
        me.openForm = false;
        await loadMangas();
      } catch (err) {
        console.error("Lỗi khi lưu truyện:", err);
      }
    },

    /**
     * Xoá truyện
     * @param {string} id 
     */
    async deleteManga(mangaId) {
      const me = this;
      if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;
      try {
        await mangaApi.delete(mangaId);
        me.loadMangas();
      } catch (err) {
        console.error("Lỗi khi xóa truyện:", err);
      }
    },

    /**
     * Đóng form thêm truyện
     */
    closeForm() {
      const me = this;
      me.openForm = false;
    },

    /**
   * Định dạng ngày giờ: giờ trước, ngày sau (vd: 14:35 - 30/10/2025)
   */
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    },
     /**
     * Tạo URL ảnh (đường dẫn tuyệt đối đến file ảnh đã upload)
     */
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      // await mangaApi.delete(mangaId);
      try {
        const res = await axios.post("https://localhost:7112/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.newManga.manga_image = res.data.url; // link ảnh thật từ backend
        console.log("Ảnh đã upload:", res.data.url);
      } catch (err) {
        console.error("Lỗi upload ảnh:", err);
      }
    },

    /** Mở popup xem ảnh */
    openImage(imageUrl) {
      console.log("Xem ảnh:", imageUrl);
      this.selectedImage = imageUrl;
      this.showImage = true;
    },

    /** Đóng popup ảnh */
    closeImage() {
      this.showImage = false;
      this.selectedImage = null;
    },

    /** Đóng form thêm truyện */
    closeForm() {
      this.openForm = false;
    },
  },
};

</script>


<style scoped>
.manga-manager {
  background: #fff;
  padding: 0 20px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.manga-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

.manga-table th {
  width: 100px;
  background: linear-gradient(to right, #dbeafe, #bfdbfe);
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #e5e7eb;
  font-style: bold;
  color: #2f5492;
  height: 48px;
  box-sizing: border-box;

}

.manga-table td {
  height: 48px;
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.manga-table tr:hover {
  background-color: #eff6ff;
  transition: 0.2s;
}

.manga-table button {
  color: #dc2626;
  border: 1px solid #dc2626;
  padding: 6px 10px;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.manga-table button:hover {
  background-color: #dc2626;
  color: white;
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
  gap: 8px; /* khoảng cách giữa ảnh và nút */
}

.img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.view-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
}

.view-btn:hover {
  background-color: #2563eb;
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

</style>
