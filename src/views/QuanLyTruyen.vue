<template>
  <!-- -->
  <div class="manga-manager">
    <div class="header">
      <h2>Quản lý truyện</h2>
      <!-- Nút thêm truyện -->
      <BaseButton type="primary" @click="openForm = true">+ Thêm truyện</BaseButton>
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
    <div v-if="openForm" class="popup-overlay" @click.self="closeForm">
      <FormThemTruyen
        v-if="openForm"
        @refresh="loadMangas"
        @close="closeForm"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseButton from "../components/base/BaseButton.vue";
import FormThemTruyen from "../views/FormThemTruyen.vue";
import mangaApi from "../api/mangaApi";

// Biến để điều khiển hiển thị form thêm truyện
const openForm = ref(false);

// Mảng lưu danh sách truyện lấy từ API
const mangas = ref([]);

/**
 * Hàm loadMangas
 * - Mục đích: Tải danh sách truyện từ API khi component được mount hoặc sau khi thêm/xóa truyện
 * - Thực hiện gọi mangaApi.getAll() và lưu dữ liệu trả về vào biến mangas
 * - Bắt lỗi và log ra console nếu có sự cố
 * - author: NVTDuong
 * - date: 22/10/2025
 */
async function loadMangas() {
  try {
    const res = await mangaApi.getAll();
    mangas.value = res.data;
  } catch (err) {
    console.error("Lỗi tải danh sách truyện:", err);
  }
}

/**
 * Hàm handleSave
 * - Mục đích: Xử lý lưu truyện mới vào hệ thống
 * - Thực hiện gọi mangaApi.insert() với payload truyền vào
 * - Hiển thị thông báo thành công và tải lại danh sách truyện
 * - author: NVTDuong
 * - date: 22/10/2025
 * @param payload 
 */
async function handleSave(payload) {
  try {
    await mangaApi.insert(payload);
    alert("Đã thêm truyện mới!");
    openForm.value = false;
    loadMangas();
  } catch (err) {
    console.error("Lỗi khi lưu truyện:", err);
  }
}

/**
  * Hàm deleteManga
  * - Mục đích: Xóa truyện theo ID
  * - Thực hiện gọi mangaApi.delete() với ID truyền vào
  * - Hiển thị thông báo xác nhận trước khi xóa
  * - Tải lại danh sách truyện sau khi xóa thành công
  * - author: NVTDuong
  * - date: 22/10/2025
  */
async function deleteManga(id) {
  if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;
  try {
    await mangaApi.delete(id);
    loadMangas();
  } catch (err) {
    console.error("Lỗi khi xóa truyện:", err);
  }
}

/**
 * Hàm closeForm
 * - Mục đích: Đóng form thêm truyện
 */
function closeForm() {
  openForm.value = false;
}
// Tải danh sách truyện khi component được mount
onMounted(() => loadMangas());
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
