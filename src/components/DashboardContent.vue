<template>
  <div class="content">
    <div class="card">
      <h3>Tổng số truyện</h3>
      <p>{{ totalMangas }} truyện</p>
    </div>
    <div class="card">
      <h3>Người dùng mới</h3>
      <p> 10 hôm nay</p>
    </div>
    <div class="card">
      <h3>Truyện được đăng trong ngày</h3>
      <p>{{ totalMangasToday }} truyện</p>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import  { mangaApi } from "@/api/mangaApi";

export default {
  name: "DashboardContent",
  data() {
    return {
      // biến lưu tổng số truyện
      totalMangas: 0,
      // biến lưu số truyện đăng trong ngày
      totalMangasToday: 0,
    };
  },
  mounted() {
    const me = this;
    // gọi hàm loadStats để lấy dữ liệu thống kê từ API
    me.loadStats();
  },
  methods: {
    /**
     * Lấy dữ liệu thống kê
     * @returns
     * author: NvtDuong
     * createdDate: 26/06/2025
     */
    async loadStats() {
      try {
        const me = this;
        // Gọi API lấy tổng số truyện
        const resTotal = await mangaApi.count();

        // Gọi API lấy số truyện đăng trong ngày
        const resToday = await mangaApi.countToday();

        me.totalMangas = resTotal.data;
        me.totalMangasToday = resToday.data;

        // In ra thống kê
        console.log("Thống kê:", {
          total: resTotal.data,
          today: resToday.data,
        });
      } catch (err) {
        console.error("Lỗi tải thống kê:", err);
      }
    },
  },
};
</script>


<style scoped>
.content {
  margin-top: 80px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.card h3 {
  color: #2f5492;
  margin-bottom: 10px;
}

.card p {
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
