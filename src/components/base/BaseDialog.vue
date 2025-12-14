<template>
  <div v-if="show" class="message" :class="typeDialog">
    <img class="icon" :src="iconSrc" alt="icon" />
    <span class="text">{{ message }}</span>
  </div>
</template>

<script setup>
import { watch, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,
  message: String,
  typeDialog: { type: String, default: "info" }, // success | error | warning | info
  duration: { type: Number, default: 2000 }      // ms
});

const emit = defineEmits(["update:show"]);

watch(() => props.show, (val) => {
  if (val) setTimeout(() => emit("update:show", false), props.duration);
});

const iconSrc = computed(() => {
  switch (props.typeDialog) {
    case "success": return "/src/assets/icon-success.svg";
    case "error": return "/src/assets/icon-error.svg";
    case "warning": return "/src/assets/icon-warning.svg";
    default: return "/src/assets/icon-info.svg";
  }
});

</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;          
  left: 50%;   
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  z-index: 1000;
  display: flex;
  align-items: center;
  font-weight: 600;
  animation: fadeInSlide 0.5s ease forwards;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.message .icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  animation: iconPop 0.5s ease forwards;
}

.message .text {
  display: inline-block;
}

/* Animation popup từ trên xuống + fade */
@keyframes fadeInSlide {
  0% { opacity: 0; transform: translate(-50%, -20px); }
  100% { opacity: 1; transform: translate(-50%, 0); }
}

/* Animation icon scale + fade */
@keyframes iconPop {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

/* Màu theo type */
.message.success { 
  background: #f0ffe8;
  color: #67c23a;
  border: 1px solid #cdffb47a;
}
.message.error {
  background: #f56c6c;
}
.message.warning {
  background: #e6a23c;
}
.message.info {
  background: #909399;
}
</style>
