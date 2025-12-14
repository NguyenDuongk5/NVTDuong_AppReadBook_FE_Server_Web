<template>
  <div class="chapter-manager-container">
    <!-- Sidebar danh sách chapter -->
    <aside class="chapter-list">
      <h2>Danh sách</h2>
      <ul>
        <!-- Danh sách chapter -->
        <li v-for="c in chapters"
          :key="c.chapter_id"
          :class="{active: selectedChapter && selectedChapter.chapter_id === c.chapter_id }"
          @click="selectChapter(c)"
        >
          Chapter {{ c.chapter_number }}: 
          <span v-if="selectedChapter && selectedChapter.chapter_id === c.chapter_id">
            {{form.chapter_title }}
          </span>
          <span v-else>
            {{ c.chapter_title }}
          </span>
        </li>
        <li class="add-new" @click="selectChapter(null)">+ Thêm nội dung</li>
      </ul>
    </aside>

    <!-- Nội dung chỉnh sửa / thêm chapter -->
    <section class="chapter-content">
      <h2>{{ mangaTitle }}</h2>
      <h3>{{ selectedChapter ? 'Chỉnh sửa chapter' : 'Thêm chapter mới' }}</h3>
      <form @submit.prevent="saveChapter">
        <div class="form-group">
          <label>Tên chapter:</label>
          <input
            type="text"
            v-model="form.chapter_title"
            placeholder="Nhập tên chapter"
            required
          />
        </div>

        <div class="form-group">
          <label>Nội dung:</label>
          <textarea
            v-model="form.chapter_content"
            placeholder="Nhập nội dung dưới 5000 ký tự"
            required
            maxlength="5000"
          ></textarea>
        </div>

        <div class="actions">
          <div class="btn-back" @click="goBack"> Quay lại</div>
          <div class="btn-group" >              
              <button type="submit" class="btn-save">
                {{ selectedChapter ? 'Cập nhật' : 'Lưu' }}
              </button>
              <button type="button" class="btn-cancel" @click="cancelEdit">Hủy</button>
              <button
                v-if="selectedChapter"
                type="button"
                class="btn-delete"
                @click="deleteChapter(selectedChapter.chapter_id)"
              >Xóa
              </button>
          </div>
        </div>
      </form>
    </section>
  </div>
   <BaseDialog
    v-model:show="showDialog"
    :message="dialogMessage"
    :typeDialog="dialogType"
  />
</template>

<script>
import chapterApi from "@/api/chapterApi";
import {mangaApi} from "@/api/mangaApi";
import  BaseDialog  from "@/components/base/BaseDialog.vue";


export default {
  name: "ChapterManager",
  components: {
    BaseDialog,
  },
  props: [
    // ID của truyện muốn xem/chỉnh sửa chapters.
    "mangaId",    
  ],
  emits: ["selectChapter"],



  data() {
    return {
      mangaTitle: "",
      chapters: [],
      selectedChapter: null,
      form: {
        chapter_title: "",
        chapter_content: "",
      },
      showDialog: false,
      dialogMessage: "",
      dialogType:"success",
    };
  },
  /**
   * Khi mangaId thay đổi, tự động gọi loadManga() và loadChapters()
   * author: NvtDuong
   * createdDate: 20/11/25
   */
  watch: {
    mangaId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          const me = this;
          me.loadManga();
          me.loadChapters();
        }
      },
    },
  },
  methods: {
    /**
     * Lấy thống tin truyện
     * author: NvtDuong
     * createdDate: 20/11/25
     */
    async loadManga() {
  try {
    const res = await mangaApi.getById(this.mangaId);
    this.mangaTitle = res.data.manga_title;
  } catch (err) {
    console.error(err);
    this.mangaTitle = "Không tìm thấy truyện";
  }
},

    /**
     * Lấy danh sách chapter
     * author: NvtDuong
     * createdDate: 20/11/25
     */
    async loadChapters() {
      try {
        const me = this;
        const res = await chapterApi.getAll();
        // Lọc chapter theo mangaId
        me.chapters = res.data
          .filter(c => c.manga_id === me.mangaId)
          .sort((a, b) => a.chapter_number - b.chapter_number); // sắp xếp tăng dần

        // Nếu đang sửa, cập nhật form từ selectedChapter
        if (me.selectedChapter) {
          const updated = me.chapters.find(c => c.chapter_id === me.selectedChapter.chapter_id);
          if (updated) {
            me.form.chapter_content = updated.chapter_content;
            me.form.chapter_title = updated.chapter_title;
            me.selectedChapter = updated; // cập nhật reference
          } else {
            me.selectChapter(null);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách chapter:", error);
      }
    },

    /**
     * Khi chọn một chapter
     * author: NvtDuong
     * createdDate: 20/11/25
     */
    selectChapter(chapter) {
      const me = this;
      me.selectedChapter = chapter;
      if (chapter) {
        // Chỉnh sửa
        // gắn dữ liệu vào form
        me.form.chapter_title = chapter.chapter_title;
        me.form.chapter_content = chapter.chapter_content;
      } else {
        // Thêm mới
        const nextNumber = me.chapters.length > 0 ? Math.max(...me.chapters.map(c => c.chapter_number)) + 1 : 1;

        me.form.chapter_title = `Chapter ${nextNumber}`;
        me.form.chapter_content = "";
      }
    },

    /**
     * Lưu chapter
     * author: NvtDuong
     * createdDate: 20/11/25
     */
    async saveChapter() {
      try {
        const me = this;
        const now = new Date().toISOString();
        const user = "admin";
        // Cập nhật backend
        if (me.selectedChapter) {
          // Gọi chapterApi.update để lấy dữ liệu
          await chapterApi.update({
            chapter_id: me.selectedChapter.chapter_id,
            manga_id: me.selectedChapter.manga_id,
            chapter_number: me.selectedChapter.chapter_number,
            chapter_title: me.form.chapter_title,
            chapter_content: me.form.chapter_content,
            created_by: me.selectedChapter.created_by,
            modified_date: now,
            modified_by: user,
          });
          // Update giao diện
          me.selectedChapter.chapter_title = me.form.chapter_title;
          me.selectedChapter.chapter_content = me.form.chapter_content;

           // Hiển thị dialog thành công
          me.dialogMessage = "Cập nhật chapter thành công!";
          me.dialogType = "success";
          me.showDialog = true;

          // alert("Lưu chapter thành công!");

        } 
        // Thêm mới
        else {
          const nextNumber = me.chapters.length + 1;
          const newChapter = {
            chapter_id: crypto.randomUUID(),
            manga_id: me.mangaId,
            chapter_number: nextNumber,
            chapter_title: me.form.chapter_title,
            chapter_content: me.form.chapter_content,
            created_date: now,
            created_by: user,
            modified_date: now,
            modified_by: user,
          };
          await chapterApi.insert(newChapter);
          me.chapters.push(newChapter);

          
          // Hiển thị dialog thành công
          me.dialogMessage = "Thêm chapter thành công!";
          me.dialogType = "success";
          me.showDialog = true;
        }

        me.selectChapter(null);
      } catch (error) {
          console.error("Lỗi khi lưu chapter:", error);
          // Hiển thị dialog lỗi
          this.dialogMessage = "Lưu chapter thất bại!";
          this.dialogType = "error";
          this.showDialog = true;
      }
    },

    /**
     * Hủy chỉnh sửa
     * author: NvtDuong
     * createdDate: 20/11/25
     */
    cancelEdit() {
      const me = this;
      me.selectChapter(null);
    },

    /**
     * Xóa chapter
     * author: NvtDuong
     * createdDate: 20/11/25
     * @param id 
     */
    async deleteChapter(id) {
      const me = this;
      if (!confirm("Bạn có chắc muốn xóa chapter này?")) return;

      try {
        await chapterApi.delete(id);

        // Xóa chapter khỏi list
        me.chapters = me.chapters.filter(c => c.chapter_id !== id);

        // Sắp xếp lại
        me.chapters.sort((a, b) => a.chapter_number - b.chapter_number);

        // Đánh số lại từ 1 → n
        me.chapters.forEach((c, index) => {
          c.chapter_number = index + 1;
        });

        // Gửi update lại backend để đảm bảo thứ tự chính xác
        for (const c of me.chapters) {
          await chapterApi.update({
            ...c,
            modified_date: new Date().toISOString(),
            modified_by: "admin"
          });
        }

        me.selectChapter(null);
         // Hiển thị dialog thành công
          me.dialogMessage = "Xóa chapter thành công!";
          me.dialogType = "success";
          me.showDialog = true;

      } catch (error) {
        console.error("Lỗi khi xóa chapter:", error);
         // Hiển thị dialog thành công
          me.dialogMessage = "Lỗi xóa chapter!";
          me.dialogType = "error";
          me.showDialog = true;
      }
    },

    /**
     * Quay lại trang truyện  
     * 
     */
    goBack() {
      const me = this;
      const page = me.$route.query.page || 1;

      me.$router.push({
        name: "truyen",
        query: { page: page }  
      });
    }
  },
};
</script>

<style scoped>
.chapter-manager-container {
  display: flex;
  gap: 8px;
  height: calc(100vh - 60px);
  padding: 20px;
  background: #fdfdfd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-top: 60px;
}

/* Sidebar danh sách chapter */
.chapter-list {
  width: 220px;
  background: #f5f6fa;
  border-radius: 10px;
  padding: 15px;
  overflow-y: auto;
}

.chapter-list h2 {
  margin-bottom: 12px;
  font-size: 20px;
  color: #2f5492;
  text-align: center;
}


.chapter-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chapter-list li {
  display: flex;
  padding: 0 12px;
  border-radius: 8px;
  cursor: pointer;
  height: 48px;
  align-items: center;
  transition: all 0.3s ease-in-out;
  font-weight: 600 ;
  margin-bottom:5px ;
}

.chapter-list li.active {
  color: #2f5492;
    background: #cadcfa;

}

.chapter-list li:hover {
  background: #cadcfa;
  color: #2f5492;
}

.chapter-list li.add-new {
  margin-top: 10px;
  font-weight: bold;
  color: #007bff;
  cursor: pointer;
}
.chapter-list li span {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
}

/* Form chỉnh sửa / thêm */
.chapter-content {
  flex: 1;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.03);
}

.chapter-content h2 {
  font-size: 20px;
  color: #2f5492;
  align-content: center;
  width: 100%;
}
.chapter-content h3 {
  margin: 8px 0;
    color: #828292;

}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007bff;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
  height: 50vh;
}

.actions {
  display: flex;
  justify-content: space-between;
}
.btn-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-back{
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  color: #0062cc;
}
.btn-back:hover{
  color: #2c7acd;
}
.actions button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-save {
  background-color: #007bff;
  color: #fff;
}

.btn-save:hover {
  background-color: #0062cc;
}

.btn-cancel {
  background-color: #ccc;
  color: #333;
}

.btn-cancel:hover {
  background-color: #b3b3b3;
}

.btn-delete {
  background-color: #ff4d4f;
  color: #fff;
}

.btn-delete:hover {
  background-color: #d9363e;
}


</style>
