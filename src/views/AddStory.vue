<template>
  <div class="popup">
    <h2 class="title">Thêm truyện mới</h2>
    <form @submit.prevent="handleAddManga">
      <!-- Tiêu đề -->
      <div class="form-row">
        <label >Tiêu đề truyện:</label>
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
              <button type="button" class="danger" @click="handleDeleteImage">Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Thể loại -->
      <div class="form-row">
        <label>Thể loại:</label>
        <div class="checkbox-group">
          <label v-for="category in categories" :key="category.category_id" class="checkbox-item">
            <input
              type="checkbox"
              :value="category.category_id"
              v-model="newManga.selectedCategories"
            />
            {{ category.category_name }}
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
      <img
        :src="newManga.manga_image || cover.preview"
        alt="Cover preview"
        class="cover-thumb"
      />

    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import BaseButton from "../components/base/BaseButton.vue";
import axiosClient from "../api/axiosClient";
import { mangaApi, uploadApi } from "../api/mangaApi";
import categoryApi from "@/api/categoryApi";


export default {
  name: "AddStory",
  components: { BaseButton },

  data() {
    return {
      /** Thông tin truyện mới cần thêm */
      newManga: {
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
      },
      categories: [
      ],
      cover: { file: null, preview: "" },
      dialogVisible: false,
    };
  },

  emits: ["close", "refresh"],

  async mounted() {
    await this.loadCategories();
  },

  methods: {
    /** Tải danh sách thể loại */
    async loadCategories() {
      try {
        const res = await categoryApi.getAll();
        this.categories = res.data;
        console.log("Danh sách thể loại:", this.categories);
      } catch (error) {
        console.error("Lỗi tải danh sách thể loại:", error);
      }
    },

    /**
     * Mô tả file
     * @param {Event} e
     */
    openFilePicker() {
      this.$refs.fileInput.click();
    },

    /**
     * Xuất file
     * @param {Event} e
     */
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh quá lớn!");
        return;
      }
      this.cover.file = file;
      this.cover.preview = URL.createObjectURL(file);
      this.handleFileUpload({ target: { files: [file] } });
    },

    /**
     * Xoa file
     */
    removeImage() {
      if (this.cover.preview) URL.revokeObjectURL(this.cover.preview);
      this.cover = { file: null, preview: "" };
      this.newManga.manga_image = "";
    },

    /**
     * Xem file
     */
    previewImage() {
      this.dialogVisible = true;
    },

    /**
     * Tải file
     */
    downloadImage() {
      const a = document.createElement("a");
      a.href = this.cover.preview;
      a.download = this.cover.file?.name || "cover";
      a.click();
    },

    /**
     * Thêm truyện
     */
    async handleAddManga() {
      try {
        const now = new Date().toISOString();
        
        const payload = {
          created_date: now,
          created_by: "Admin",
          modified_date: now,
          modified_by: "Admin",
          manga_id: this.newManga.manga_id,
          manga_title: this.newManga.manga_title,
          manga_author: this.newManga.manga_author,
          manga_status: this.newManga.manga_status,
          manga_description: this.newManga.manga_description,
          manga_image: this.newManga.manga_image,
          list_category_id: this.newManga.selectedCategories.join(","),
          manga_release_year: this.newManga.manga_release_year,
        };

        const res = await mangaApi.insert(payload);

        if (res.status !== 200) {
          console.error("Lỗi khi thêm truyện:", res.message);
          return;
        }

        if (res.status === 200) {
          alert("Thêm truyện thành công!");
          this.$emit("close");
          this.$emit("refresh");
        }

        this.newManga = {
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
    },

    /**
     * 
     * @param event 
     */
    async handleFileUpload(event) {
      
      const file = event.target.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("File", file);

        const res = await uploadApi.uploadImage(formData);

        this.newManga.manga_image = res.data.url;
        console.log("Ảnh đã upload:", res.data.url);
      } catch (err) {
        console.error("Lỗi upload ảnh:", err);
        alert("Tải ảnh thất bại!");
      }
    }
  },
};
</script>


<style scoped>
.popup {
  background: #fff;
  border-radius: 16px;
  width: 600px;
  max-width: calc(100% - 32px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  /* Sửa cách hiển thị thanh cuộn */
  max-height: 90vh;
  overflow: hidden; /* tránh cắt bo góc */
  display: flex;
  flex-direction: column;
}

.popup form {
  flex: 1;
  overflow-y: auto; /* thanh cuộn chỉ ở phần nội dung form, không ảnh hưởng bo góc */
  padding-right: 6px; /* tránh che chữ bởi scrollbar */
}

/* Thanh cuộn tròn gọn, không phá layout */
.popup form::-webkit-scrollbar {
  width: 8px;
}
.popup form::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.25);
  border-radius: 8px;
}

.title{
    color: #2f5492;
    text-align: center;
    margin-bottom: 16px;
}

.form-row { 
  display: flex; 
  flex-direction: column; 
  margin-bottom: 12px; 
}

.form-row.inline { 
  display: flex; 
  gap: 16px; 
}

label { 
  font-weight: 600; 
  margin-bottom: 6px; 
  color: #2f5492; 
}

input, textarea, select {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
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
