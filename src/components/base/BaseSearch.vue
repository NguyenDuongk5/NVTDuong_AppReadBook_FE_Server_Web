<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import BaseInput from './BaseInput.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "search"]);

const text = ref(props.modelValue);
const showHistory = ref(false);
const historyList = ref([]);

// Cập nhật v-model
watch(text, (val) => {
  emit("update:modelValue", val);
});

// Khi nhấn Enter hoặc icon search → phát search
function triggerSearch() {
  const key = text.value.trim();
  if (!key) return;

  addHistory(key);
  emit("search", String(text.value));
  showHistory.value = false;
}

// Lịch sử search
function loadHistory() {
  const stored = localStorage.getItem("searchHistory");
  historyList.value = stored ? JSON.parse(stored) : [];
}

function saveHistory() {
  localStorage.setItem("searchHistory", JSON.stringify(historyList.value));
}

function addHistory(item) {
  historyList.value = historyList.value.filter(i => i !== item);
  historyList.value.unshift(item);
  if (historyList.value.length > 10) historyList.value.pop();
  saveHistory();
}

function removeHistoryItem(index) {
  historyList.value.splice(index, 1);
  saveHistory();
}

function clearHistory() {
  historyList.value = [];
  saveHistory();
}

function selectHistory(item) {
  text.value = item;
  triggerSearch();
}

// Click ngoài dropdown để đóng
function handleClickOutside(e) {
  if (!e.target.closest(".base-search")) {
    showHistory.value = false;
  }
}

onMounted(() => {
  loadHistory();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="base-search">
    <BaseInput
      v-model="text"
      placeholder="Tìm kiếm..."
      typeInput="clearable"
      @focus="showHistory = true"
      @keyup.enter="triggerSearch"
    >
      <template #icon>
        <div class="search-icon" @click="triggerSearch"></div>
      </template>
    </BaseInput>

    <div v-if="showHistory && historyList.length" class="history-dropdown">
      <div class="history-header">
        <span>Lịch sử tìm kiếm</span>
        <button @click="clearHistory">Xóa tất cả</button>
      </div>
      <ul>
        <li v-for="(item, index) in historyList" :key="index">
          <span @click="selectHistory(item)">{{ item }}</span>
          <button @click="removeHistoryItem(index)">✖</button>
        </li>
      </ul>
    </div>
  </div>
</template>



<style scoped>
.search-icon {
  background-image: url('../../assets/icon-search.svg');
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  width: 24px;
  height: 24px;
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.8;
  cursor: pointer;
}
.base-search {
  position: relative;
  width: 300px;
}
.history-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}
.history-header {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.history-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.history-dropdown li {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  cursor: pointer;
}
.history-dropdown li:hover {
  background: #f0f0f0;
}
.history-dropdown li button {
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
}
</style>
