<template>
  <div class="popup">
    <!-- Tiêu đề form -->
    <h2 class="title">{{ newManga.manga_id ? "Cập nhật truyện" : "Thêm truyện mới" }}</h2>

    <!-- Form thêm/cập nhật truyện -->
    <form @submit.prevent="handleSaveManga">
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
          <!-- Nếu chưa có ảnh thì hiển thị nút chọn ảnh -->
          <div v-if="!cover.file && !newManga.manga_image" class="upload-empty">
            <!-- khi chọn file thì gọi handleFileChange -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange" 
              style="display: none"
            />
            <button type="button" class="upload-btn" @click="openFilePicker">Chọn ảnh</button>
            <div class="upload-help">PNG / JPG / GIF — tối đa 5MB</div>
          </div>
          <!-- Nếu đã có ảnh thì hiển thị preview -->
          <div v-else class="upload-preview">
            <img :src="cover.preview || newManga.manga_image" alt="Cover preview" class="cover-thumb" />
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
          <label v-for="category in categories" :key="category.category_id" class="checkbox-item">
            <!-- Khi check checkbox, gọi handleCategoryChange -->
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

      <!-- Nút Lưu + Hủy -->
      <div class="btn-group">
        <BaseButton type="success">{{ isEdit ? "Cập nhật" : "Lưu" }}</BaseButton>
        <BaseButton type="danger" @click="$emit('close')">Hủy</BaseButton>
      </div>
    </form>

    <!-- Lightbox hien thi ảnh -->
    <div v-if="dialogVisible" class="lightbox" @click.self="dialogVisible = false">
      <img :src="cover.preview || newManga.manga_image" alt="Cover preview" class="cover-thumb" />
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";
import { mangaApi, uploadApi } from "@/api/mangaApi";
import categoryApi from "@/api/categoryApi";

export default {
  name: "AddStory",
  components: { BaseButton },
  // nếu có data truyền vào => edit
  props: {
    mangaData: {
      type: Object,
      default: null,
    },
  },
  
  emits: ["close", "refresh"],

  data() {
    return {
      newManga: {
        manga_id: "",
        manga_title: "",
        manga_author: "",
        manga_description: "",
        manga_image: "",
        list_category_id: "",
        category_names: "",
        manga_status: 1,
        manga_release_year: "",
        created_by: "Admin",
        modified_by: "Admin",
        selectedCategories: [],
      },
      cover: { file: null, preview: "" },
      categories: [],
      dialogVisible: false,
    };
  },
  
  computed: {
    isEdit() {
      const me = this;
      return !!me.mangaData;
    },
  },

  async mounted() {
    const me = this;
    await me.loadCategories();
    if (me.mangaData) me.fillFormData();
  },

  methods: {
    /**
     * gọi API lấy danh sách tất cả thể loại và lưu vào biến categories
     * author: NvtDuong
     * createdDate: 26/06/2025
     */
    async loadCategories() {
      const me = this;
      try {
        const res = await categoryApi.getAll();
        // lưu danh sách thể loại với biến categories
        me.categories = res.data;
      } catch (error) {
        console.error("Lỗi tải thể loại:", error);
      }
    },
    /**
     * Lưu dữ liệu với mã truyện
     * author: NvtDuong
     * createdDate: 26/06/2025
     */
    fillFormData() {
      const me = this;
      me.newManga = {
        ...me.mangaData,
        selectedCategories: me.mangaData.list_category_id
        // tách chuỗi ID thành array 
          ? me.mangaData.list_category_id.split(",")
          : [],
      };
      // hiển thị ảnh cũ
      me.cover.preview = me.newManga.manga_image || ""; 
    },

    /**
     * mở cửa sổ chọn file khi click nút "Chọn ảnh"
     * author: NvtDuong
     * createdDate: 26/06/2025
     */
    openFilePicker() {
      const me = this;
      me.$refs.fileInput.click();
    },

    /**
     * Hàm xuất hình ảnh
     * author: NvtDuong
     * createdDate: 26/06/2025
     */
    handleFileChange(e) {
      const me = this;
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh quá lớn!");
        return;
      }
      me.cover.file = file;
      me.cover.preview = URL.createObjectURL(file); // tạo preview tạm
      // upload lên server
      me.uploadImage(file);
    },

    /**
     * Hàm upload ảnh len server
     * author: NvtDuong
     * createdDate: 26/06/2025
     */
    async uploadImage(file) {
      const me = this;
      try {
        const formData = new FormData();
        formData.append("File", file);
        const res = await uploadApi.uploadImage(formData);
        // lưu URL ảnh
        me.newManga.manga_image = res.data.url;
      } catch (err) {
        console.error("Lỗi upload ảnh:", err);
        alert("Tải ảnh thất bại!");
      }
    },

    /**
     * Hàm xóa ảnh
     * author: NvtDuong
     * createdDate: 26/06/2025
     */
    removeImage() {
      const me = this;
      // giải phóng memory
      if (me.cover.preview) URL.revokeObjectURL(me.cover.preview); 
      me.cover = { file: null, preview: "" }; 
      me.newManga.manga_image = "";
    },

    /** Xem ảnh full */
    previewImage() {
      const me = this;
      me.dialogVisible = true;
    },

    /** Tải ảnh về máy */
    downloadImage() {
      const me = this;
      const a = document.createElement("a");
      a.href = me.cover.preview || me.newManga.manga_image;
      a.download = "cover";
      a.click();
    },

    /** Lưu hoặc cập nhật truyện */
    async handleSaveManga() {
      const me = this;
      try {
        const now = new Date().toISOString();
        const payload = {
          //copy tất cả thuộc tính của object manga
          ...me.newManga,
          // chuyển array => string
          list_category_id: me.newManga.selectedCategories.join(","),
          modified_date: now,
          modified_by: "Admin",
        };

        let res;
        // nếu đang cập nhật
        if (me.isEdit) {
          res = await mangaApi.update(payload);
        } 
        // nếu đang thêm
        else {
          payload.created_date = now;
          payload.manga_id = crypto.randomUUID(); // tạo ID mới
          res = await mangaApi.insert(payload);
        }
        // lưu truyện
        if (res.status === 200) {
          alert(me.isEdit ? "Cập nhật thành công!" : "Thêm truyện thành công!");
          me.$emit("close");
          me.$emit("refresh");
        }
      } catch (err) {
        console.error("Lỗi lưu truyện:", err);
        alert("Có lỗi xảy ra khi lưu dữ liệu!");
      }
    },
  },
};
</script>

<style scoped>
/* popup */
.popup {
  background: #fff;
  border-radius: 16px;
  width: 800px;
  max-width: calc(100% - 32px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  /* Sửa cách hiển thị thanh cuộn */
  max-height: 90vh;
  overflow: hidden; /* tránh cắt bo góc */
  display: flex;
  flex-direction: column;
}

/* form */
.popup form {
  flex: 1;
  overflow-y: auto; /* thanh cuộn chỉ ở phần nội dung form, không ảnh hưởng bo góc */
  padding-right: 6px; /* tránh che chữ bởi scrollbar */
}

/* Thanh cuộn tròn gọn, không phá layout */
.popup form::-webkit-scrollbar {
  width: 8px;
}
/* Thanh cuộn */
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
  border: none !important; 
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
