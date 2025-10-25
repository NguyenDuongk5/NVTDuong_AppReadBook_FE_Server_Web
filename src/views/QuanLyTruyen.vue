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
            <th class="border">ID</th>
            <th class="border">Tên truyện</th>
            <th class="border">Tác giả</th>
            <th class="border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in mangas" :key="m.manga_id">
            <td class="border">{{ m.manga_id }}</td>
            <td class="border">{{ m.manga_title }}</td>
            <td class="border">{{ m.manga_author }}</td>
            <td class="border">
              <button @click="deleteManga(m.manga_id)" class="text-red-500">Xóa</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
    <!-- Form thêm truyện -->
    <div v-show="openForm" class="popup-overlay" @click.self="closeForm">
      <FormThemTruyen v-show="openForm" @refresh="loadMangas" @close="closeForm" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import BaseButton from "../components/base/BaseButton.vue";
import FormThemTruyen from "@/views/FormThemTruyen.vue";
import mangaApi from "../api/mangaApi";

export default {
  name: "QuanLyTruyen",
  components: {
    BaseButton,
    FormThemTruyen,
  },

  data() {
    return {
      openForm: false,
      mangas: [],
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
    async loadMangas() {
      try {
        const me = this;
        const res = await mangaApi.getAll();
        me.mangas = res.data;
      } catch (err) {
        console.error("Lỗi tải danh sách truyện:", err);
      }
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
    async deleteManga(id) {
      if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;
      try {
        await mangaApi.delete(id);
        loadMangas();
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
  },
};

</script>


<style scoped>
.manga-manager {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  z-index: 60;
  overflow: hidden;
}

.popup {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  max-width: calc(100% - 32px);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.manga-table {
  margin-top: 20px;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.manga-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  font-family: "Segoe UI", sans-serif;
}

.manga-table th {
  background: linear-gradient(to right, #dbeafe, #bfdbfe);
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

.manga-table td {
  padding: 10px;
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
</style>
