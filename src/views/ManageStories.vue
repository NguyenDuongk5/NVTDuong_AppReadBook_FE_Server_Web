<template>
  <div class="manga-manager">
    <div class="header">
      <h2>Quản lý truyện</h2>
      <!-- Nút thêm truyện -->
      <base-button type="primary" @click="handleAddNew">+ Thêm truyện</base-button>
    </div>

    <!-- Bảng quản lý truyện -->
    <div class="manga-table">
      <table>
        <thead>
          <tr>
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
          <tr v-for="m in mangas" :key="m.manga_id">
            <!-- Tên truyện, tác giả, ngày tạo, thể loại, sẵn hình bìa-->
            <td class="border">{{ m.manga_title }}</td>
            <td class="border">{{ m.manga_author }}</td>
            <td class="border">{{ formatDate(m.created_date) }}</td>
            <td class="border"> {{ m.category_names }}</td>
            <td class="border">
              <div class="img-cell">
                <img :src="m.manga_image" alt="Ảnh truyện" class="img" />
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
    <div class="pagination-example">
      <base-paging
        title="Danh sách truyện"
        :total="total"
        :page="pageSize"
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
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";
import BasePaging from "@/components/base/BasePaging.vue";
import AddStory from "@/views/AddStory.vue";
import { mangaApi } from "@/api/mangaApi";
import categoryApi from "@/api/categoryApi.js";


export default {
  name: "ManageStories",
  components: {
    BaseButton,
    AddStory,
    BasePaging,
  },

  data() {
    return {
      openForm: false,
      mangas: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showImage: false,
      selectedImage: null,
      editingManga: null,
    };
  },

  async mounted() {
    const me = this;
    await me.loadMangas();
  },
  

  methods: {
    /** Tải danh sách truyện từ API, gắn tên thể loại cho từng truyện
     * author: NvtDuong
     * createdDate: 07/11/25
     */
    async loadMangas() {
      const me = this;
      try {
        // Gọi API song song: danh sách truyện + danh sách thể loại
        const [res, categoryRes] = await Promise.all([
          mangaApi.paging(me.currentPage, me.pageSize),
          categoryApi.getAll()
        ]);
        // Lấy dữ liệu phân trang
        const dataLayer = res.data.data || {};
        me.mangas = dataLayer.data || res.data.data.data || [];
        me.total = dataLayer.total_record || res.data.total_record || 0;

        const categories = categoryRes.data || [];

        // Map id -> tên thể loại
        const categoryMap = {};
        categories.forEach(c => {
          categoryMap[c.category_id] = c.category_name;
        });

        // Gắn tên thể loại vào mỗi manga
        me.mangas = me.mangas.map(m => {
          if (m.list_category_id) {
            const ids = m.list_category_id.split(",").filter(id => id); // tách string -> array
            m.category_names = ids.map(id => categoryMap[id]).filter(Boolean).join(", "); // array -> string tên thể loại
          } else {
            m.category_names = "";
          }
          return m;
        });
      } catch (err) {
        console.error("Lỗi tải danh sách truyện:", err);
      }
    },
    

    /** khi chuyển trang phân trang, cập nhật currentPage và tải lại danh sách truyện
     * author: NvtDuong
     * createdDate: 03/11/25
     */
    async onPageChange(page) {
      const me = this;
      me.currentPage = page;
      await me.loadMangas();
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
          alert("Xóa truyện thành công!");
          // load lại danh sách sau khi xóa
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
    closeForm() {
      const me = this;
      me.openForm = false;
      me.editingManga = null;
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
  width: 100px;
  background: linear-gradient(to right, #dbeafe, #bfdbfe);
  text-align: center;
  border-bottom: 2px solid #e5e7eb;
  font-style: bold;
  color: #2f5492;
  height: 48px;
  box-sizing: border-box;

}

.manga-table td {
  height: 48px;
  padding: 0 20px;
  border-bottom: 1px solid #e5e7eb;
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
</style>
