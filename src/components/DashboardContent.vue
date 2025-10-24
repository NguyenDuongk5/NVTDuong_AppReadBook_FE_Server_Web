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
<script setup>
import { ref, onMounted } from "vue";
import mangaApi from "../api/mangaApi";

// Biến thống kê
const totalMangas = ref(0);
const totalMangasToday = ref(0);

// Hàm tải thống kê
async function loadStats() {
  try {
    // Gọi API lấy tổng số truyện
    const resTotal = await mangaApi.count();

    // Gọi API lấy số truyện đăng trong ngày
    const resToday = await mangaApi.countToday();

    totalMangas.value = resTotal.data;
    totalMangasToday.value = resToday.data;

    console.log("Thống kê:", {
      total: resTotal.data,
      today: resToday.data,
    });
  } catch (err) {
    console.error("Lỗi tải thống kê:", err);
  }
}

// Tự động gọi khi component load
onMounted(() => {
  loadStats();
});
</script>


<style scoped>
.content {
  margin-top: 30px;
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
  color: #2f5492
;
  margin-bottom: 10px;
}

.card p {
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
