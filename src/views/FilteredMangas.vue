<template>
  <div class="filtered-container" ref="container">
    <!-- Tiêu đề tìm kiếm -->
    <h2 class="title" v-if="keyword">
      Kết quả tìm kiếm cho "{{ keyword }}"
    </h2>

    <!-- Không có kết quả -->
    <p v-if="results.length === 0 && keyword" class="no-result">
      Không tìm thấy truyện nào.
    </p>

    <!-- Thông tin đã load -->
    <p v-if="shown.length > 0" class="loaded-info">
      Đã hiển thị {{ shown.length }} / {{ results.length }} truyện
    </p>

    <!-- Grid truyện -->
    <div class="manga-grid">
      <div class="manga-item" v-for="m in shown" :key="m.manga_id" @click="selectManga(m)">
        <img
          :src="m.manga_thumbnail || m.manga_image"
          class="thumbnail"
          alt="thumbnail"
        />
        <div class="info">
          <h3>{{ m.manga_title }}</h3>
          <p><b>Tác giả:</b> {{ m.manga_author || "Chưa rõ" }}</p>
          <p><b>Thể loại:</b> {{ m.category_names || "Chưa rõ" }}</p>
          <p><b>Ngày tạo:</b> {{ formatDate(m.created_date) }}</p>
        </div>
      </div>
    </div>

    <!-- Loading khi load thêm batch -->
    <div class="loading" v-if="isLoading">
      <div class="loader"></div>
      Đang tải thêm...
    </div>

    <!-- Hết dữ liệu -->
    <p v-if="shown.length >= results.length && results.length > 0" class="end-text">
      Bạn đã xem hết kết quả.
    </p>
  </div>

</template>

<script>
import { mangaApi } from "@/api/mangaApi";

export default {
  name: "FilteredMangas",
  emits: ["select", "select-history"],
  props: {
    keyword: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      results: [],
      shown: [],
      isLoading: false,
      batchSize: 8,
      searchHistory: []
    };
  },


  methods: {
    async loadSearch() {
      const key = this.keyword?.trim();

      if (!key) {
        this.results = [];
        this.shown = [];
        return;
      }

      this.isLoading = true;
      try {
        const res = await mangaApi.search(key);
        this.results = res.data || [];
        this.shown = this.results.slice(0, this.batchSize);
        this.saveHistory(key); // Luu lich su tim kiem
      } catch (err) {
        console.error("Search error:", err);
        this.results = [];
        this.shown = [];
      }
      this.isLoading = false;
    },
    saveHistory(keyword) {
    let history = [...this.searchHistory];

    // bỏ trùng
    history = history.filter(k => k !== keyword);

    // thêm lên đầu
    history.unshift(keyword);

    // giới hạn 6 từ
    history = history.slice(0, 6);

    this.searchHistory = history;
    localStorage.setItem("search_history", JSON.stringify(history));
  },

  loadHistory() {
    const raw = localStorage.getItem("search_history");
    this.searchHistory = raw ? JSON.parse(raw) : [];
  },

  // selectHistory(keyword) {
  //   // emit lên parent để đổi keyword
  //   this.$emit("select-history", keyword);
  // },

    loadMore() {
      if (this.isLoading) return;
      if (this.shown.length >= this.results.length) return;

      this.isLoading = true;

      setTimeout(() => {
        const next = this.results.slice(
          this.shown.length,
          this.shown.length + this.batchSize
        );
        this.shown.push(...next);
        this.isLoading = false;
      }, 300);
    },
    selectManga(m) {
    this.$emit("select", m);
  },

    onScroll() {
      const el = this.$refs.container;
      if (!el) return;

      const nearBottom =
        el.scrollTop + el.clientHeight + 150 >= el.scrollHeight;

      if (nearBottom) {
        this.loadMore();
      }
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const d = new Date(dateString);
      return (
        String(d.getDate()).padStart(2, "0") +
        "/" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "/" +
        d.getFullYear()
      );
    },
    removeHistory(keyword) {
      const history = this.searchHistory.filter(k => k !== keyword);
      this.searchHistory = history;
      localStorage.setItem("search_history", JSON.stringify(history));
    },
  },

  watch: {
    keyword() {
      this.loadSearch();
    }
  },

  mounted() {
    const el = this.$refs.container;
    if (el) {
      el.addEventListener("scroll", this.onScroll);
    }
    if (this.keyword) {
      this.loadSearch();
    }
    
  },

  beforeUnmount() {
    const el = this.$refs.container;
    if (el) {
      el.removeEventListener("scroll", this.onScroll);
    }
  },

};

</script>

<style scoped>
.filtered-container {
  padding: 20px;
  height: 80vh; /* để container scroll */
  overflow-y: auto;
}
.title { 
  font-size: 22px; 
  font-weight: bold; 
  margin-bottom: 16px; 
}
.loaded-info { 
  margin-bottom: 10px; 
  color: #555; 
  font-size: 14px; 
  text-align: center; 
}
.manga-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
  gap: 16px; 
}
.manga-item { 
  display: flex; 
  flex-direction: column; 
  border-radius: 8px; 
  overflow: hidden; 
  background: #fafafa; 
  border: 1px solid #eee; 
  cursor: pointer; 
  transition: 0.2s; 
}
.manga-item:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
}
.thumbnail { 
  width: 100%; 
  height: 220px; 
  object-fit: cover; 
  background: #ddd; 
}
.info { 
  padding: 10px; 
  display: flex; 
  flex-direction: column; 
  gap: 4px; 
}
.info h3 { 
  font-size: 16px; 
  margin: 0; 
  color: #2f5492; 
}
.info p { 
  margin: 0; 
  font-size: 13px; 
  color: #555; 
}
.loading { 
  margin-top: 20px; 
  text-align: center; 
  font-size: 14px; 
}
.loader { 
  width: 32px; 
  height: 32px; 
  border: 4px solid #ccc; 
  border-top-color: #3498db; 
  border-radius: 50%; 
  margin: 0 auto 8px; 
  animation: spin 0.7s linear infinite; 
}
@keyframes spin { 
  to { 
  transform: rotate(360deg); 
} }
.no-result, .end-text { 
  margin-top: 20px; 
  text-align: center; 
  color: #555; 
  }
</style>
