<template>
  <div class="base-paging">
    <!-- Nút Prev -->
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      <div class="icon-pre"></div>
    </button>

    <!-- Các nút số trang -->
    <button
      v-for="page in visiblePages"
      :key="page"
      class="page-btn"
      :class="{ active: currentPage === page }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <!-- Nút Next -->
    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      <div class="icon-next"></div>
    </button>
  </div>
</template>

<script>
export default {
  name: "BasePaging",
  props: {
    total: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.page);
    },
    visiblePages() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      const visiblePages = [];

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 5; i++) visiblePages.push(i);
          visiblePages.push("...");
          visiblePages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          visiblePages.push(1);
          visiblePages.push("...");
          for (let i = totalPages - 4; i <= totalPages; i++) visiblePages.push(i);
        } else {
          visiblePages.push(1);
          visiblePages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) visiblePages.push(i);
          visiblePages.push("...");
          visiblePages.push(totalPages);
        }
      }

      return visiblePages;
    },
  },
  methods: {
    changePage(page) {
      if (page === "..." || page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.$emit("page-changed", page);
    },
  },
};
</script>


<style scoped>
.base-paging {
  display: flex;
  justify-content: center;
  padding: 10px 0 0 0;
  gap: 10px;
}
.page-btn {
  background: #fff;
  padding: 6px 10px;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}
.icon-pre{
  background-image: url(../../assets/up.svg);
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  width: 25px;
  height: 25px;
  transform: rotate(-90deg);
}
.icon-next{
  background-image: url(../../assets/up.svg);
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  width: 25px;
  height: 25px;
  transform: rotate(90deg);
}
button {
  background: #fff;
  border: 1px solid #ccc;
  padding: 6px 10px;
  cursor: pointer;
  transition: background 0.2s;
  color: #2f539291;
  font-weight: bold;
}

button:hover {
  color: #2f5492;
}
button.active {
  color: #2f5492;
}
</style>