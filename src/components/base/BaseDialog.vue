<template>
  <div v-if="show" class="message" :class="typeDialog">
    {{ message }}
  </div>
</template>

<script setup>
import { watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,              // điều kiện hiển thị
  message: String,            // nội dung thông báo
  typeDialog: {               // success | error | warning | info
    type: String,
    default: "info",
  },
  duration: {                 // thời gian tự ẩn (ms)
    type: Number,
    default: 2000
  }
});

const emit = defineEmits(["update:show"]);

watch(() => props.show, (val) => {
  if (val) {
    setTimeout(() => emit("update:show", false), props.duration);
  }
});
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  color: #fff;
  border: none;
  cursor: pointer;
}
.primary { background: #409eff; }
.success { background: #67c23a; }
.warning { background: #e6a23c; }
.info { background: #909399; }
.error { background: #f56c6c; }

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: #fff;
  animation: fade 0.3s ease;
  z-index: 9999;
}
.message.primary { background: #409eff; }
.message.success { background: #67c23a; }
.message.warning { background: #e6a23c; }
.message.info { background: #909399; }
.message.error { background: #f56c6c; }

@keyframes fade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
