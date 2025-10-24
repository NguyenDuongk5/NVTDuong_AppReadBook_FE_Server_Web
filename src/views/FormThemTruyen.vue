<template>
  <div class="popup">
    <h3>Thêm truyện mới</h3>
    <form @submit.prevent="handleAddManga">
      <!-- Tiêu đề -->
      <div class="form-row">
        <label>Tiêu đề truyện:</label>
        <input v-model="newManga.manga_title" required />
      </div>

      <!-- Tác giả -->
      <div class="form-row">
        <label>Tác giả:</label>
        <input v-model="newManga.manga_author" />
      </div>

      <!-- Mô tả -->
      <div class="form-row">
        <label>Mô tả:</label>
        <textarea v-model="newManga.manga_description"></textarea>
      </div>

      <!-- Ảnh bìa -->
      <div class="form-row">
        <label>Ảnh bìa:</label>
        <div class="upload-area">
          <div v-if="!cover.file" class="upload-empty">
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" style="display: none" />
            <button type="button" class="upload-btn" @click="openFilePicker">Chọn ảnh</button>
            <div class="upload-help">PNG / JPG / GIF — tối đa 5MB</div>
          </div>

          <div v-else class="upload-preview">
            <img :src="cover.preview" alt="Cover preview" class="cover-thumb" />
            <div class="preview-actions">
              <button type="button" @click="previewImage">Xem</button>
              <button type="button" @click="downloadImage">Tải về</button>
              <button type="button" class="danger" @click="removeImage">Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Thể loại -->
      <div class="form-row">
        <label>Thể loại:</label>
        <div class="checkbox-group">
          <label v-for="category in categories" :key="category.id" class="checkbox-item">
            <input type="checkbox" :value="category.id" v-model="newManga.selectedCategories" />
            {{ category.name }}
          </label>
        </div>
      </div>

      <!-- Trạng thái + năm phát hành -->
      <div class="form-row inline">
        <div>
          <label>Trạng thái:</label>
          <select v-model.number="newManga.manga_status">
            <option :value="1">Đang phát hành</option>
            <option :value="0">Đã hoàn thành</option>
          </select>
        </div>

        <div>
          <label>Năm phát hành:</label>
          <input type="date" v-model="newManga.manga_release_year" />
        </div>
      </div>

      <!-- Nút -->
      <div class="btn-group">
        <BaseButton type="success">Lưu</BaseButton>
        <BaseButton type="danger" @click="$emit('close')">Hủy</BaseButton>
      </div>
    </form>

    <!-- Lightbox -->
    <div v-if="dialogVisible" class="lightbox" @click.self="dialogVisible = false">
      <img :src="cover.preview" alt="Preview" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseButton from "../components/base/BaseButton.vue";
import axiosClient from "../api/axiosClient";

const emit = defineEmits(["close", "refresh"]);

// Dữ liệu form chính
const newManga = ref({
  manga_id: crypto.randomUUID(),
  manga_title: "",
  manga_author: "",
  manga_description: "",
  manga_image: "",
  list_category_id: "",
  manga_status: 1,
  manga_release_year: "",
  created_by: "Admin",
  modified_by: "Admin",
  selectedCategories: [],
});

// Ảnh
const cover = ref({ file: null, preview: "" });
const fileInput = ref(null);
const dialogVisible = ref(false);

function openFilePicker() {
  fileInput.value?.click();
}
function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) return alert("Ảnh quá lớn!");
  cover.value.file = file;
  cover.value.preview = URL.createObjectURL(file);
  newManga.value.manga_image = cover.value.preview;
}
function removeImage() {
  if (cover.value.preview) URL.revokeObjectURL(cover.value.preview);
  cover.value = { file: null, preview: "" };
  newManga.value.manga_image = "";
}
function previewImage() {
  dialogVisible.value = true;
}
function downloadImage() {
  const a = document.createElement("a");
  a.href = cover.value.preview;
  a.download = cover.value.file?.name || "cover";
  a.click();
}

// Danh sách thể loại
const categories = [ 
  { id: "8bf30693-982e-11f0-834d-3c396d7503af", name: "Phiêu lưu" },
 { id: "8bf31669-982e-11f0-834d-3c396d7503af", name: "Hài hước" },
 { id: "8bf31811-982e-11f0-834d-3c396d7503af", name: "Tình cảm" },
 { id: "8bf318a2-982e-11f0-834d-3c396d7503af", name: "Kinh dị" },
 { id: "8bf31959-982e-11f0-834d-3c396d7503af", name: "Khoa học viễn tưởng" },
 { id: "8bf319dd-982e-11f0-834d-3c396d7503af", name: "Học đường" },
 { id: "8bf31a53-982e-11f0-834d-3c396d7503af", name: "Thể thao" },
 { id: "8bf31ad5-982e-11f0-834d-3c396d7503af", name: "Trinh thám" },
 { id: "99c4cf49-9eaf-11f0-834d-3c396d7503af", name: "Action" },
 { id: "99c4d482-9eaf-11f0-834d-3c396d7503af", name: "Adventure" },
 { id: "99c4d6a1-9eaf-11f0-834d-3c396d7503af", name: "Comedy" },
 { id: "99c4d720-9eaf-11f0-834d-3c396d7503af", name: "Fantasy" },
 { id: "99c4d4e8-9eaf-11f0-834d-3c396d7503af", name: "Romance" },
 ]

// Gửi về API
async function handleAddManga() {
  try {
    const now = new Date().toISOString();

    const payload = {
      created_date: now,
      created_by: "Admin",
      modified_date: now,
      modified_by: "Admin",
      manga_id: newManga.value.manga_id,
      manga_title: newManga.value.manga_title,
      manga_author: newManga.value.manga_author,
      manga_status: newManga.value.manga_status,
      manga_description: newManga.value.manga_description,
      manga_image: newManga.value.manga_image,
      list_category_id: newManga.value.selectedCategories.join(","),
      manga_release_year: new Date(newManga.value.manga_release_year).toISOString(),
    };

    const res = await axiosClient.post("/Manga/insert", payload);
    if (res.status === 200) {
      alert("Thêm truyện thành công!");
      emit("close");     // đóng popup
      emit("refresh");   
    }
    newManga.value = {
      manga_id: crypto.randomUUID(),
      manga_title: "",
      manga_author: "",
      manga_description: "",
      manga_image: "",
      manga_status: 1,
      manga_release_year: "",
      created_by: "Admin",
      modified_by: "Admin",
      selectedCategories: [],
    };
    
  } catch (err) {
    console.error("Lỗi khi thêm truyện:", err);
  }
}
</script>


<style scoped>
.popup {
  background: #fff;
  padding: 22px;
  border-radius: 10px;
  width: 600px;
  max-width: calc(100% - 32px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  overflow-y: auto;
}

.form-row { display: flex; flex-direction: column; margin-bottom: 12px; }
.form-row.inline { display: flex; gap: 16px; }
label { font-weight: 600; margin-bottom: 6px; color: #2f5492; }
input, textarea, select {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  outline: none;
}
textarea {
    min-height: 70px; 
}
.upload-area {
    border: 1px dashed #d6dbe8; 
    padding: 12px; 
    border-radius: 8px; 

}
.upload-empty {
    display: flex; 
    flex-direction: column; 
    align-items: center; 

}
.upload-btn {
    background: #2f5492; 
    color: #fff; 
    border: none; 
    padding: 8px 12px; 
    border-radius: 6px; 
    cursor: pointer; 

}
.upload-help {
    font-size: 12px; 
    color: #666; 
    margin-top: 8px; 

}
.upload-preview {
    display: flex; 
    gap: 12px; 
    align-items: center; 

}
.cover-thumb {
    width: 120px; 
    height: 160px; 
    object-fit: cover; 
    border-radius: 6px; 
    border: 1px solid #eee; 

}
.preview-actions {
    display: flex; 
    flex-direction: column; 
    gap: 8px; 

}
.preview-actions button {
    background: none; 
    border: 1px solid #ddd; 
    padding: 6px 10px; 
    border-radius: 6px; 
    cursor: pointer; 

}
.preview-actions .danger {
    background: #dc3545; 
    color: #fff; 
    border-color: transparent; 

}
.btn-group {
    display: flex; 
    justify-content: flex-end; 
    gap: 10px; 
    margin-top: 14px; 

}
.btn-group .base-btn {
    min-width: 80px;
    height: 36px;
}
.lightbox {
    position: fixed; 
    inset: 0; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    background: rgba(0,0,0,0.7); 
    z-index: 70; 

}
.lightbox img {
    max-width: 90%; 
    max-height: 90%; 
    border-radius: 6px; 

}
.checkbox-group {
    display: flex; 
    flex-wrap: wrap; 
    gap: 10px; 
    margin-top: 5px; 

}
.checkbox-item {
    background: #f8f9fa; 
    border: 1px solid #ccc; 
    padding: 6px 10px; 
    border-radius: 8px; 
    cursor: pointer; 
    transition: background 0.2s; 

}
.checkbox-item:hover {
    background: #e6f0ff; 
}
</style>
