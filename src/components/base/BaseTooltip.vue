<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <!-- phần tử mà bạn bọc -->
    <slot />

    <!-- tooltip -->
    <div
      v-if="show"
      class="tooltip-box"
      :class="position"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseTooltip",
  props: {
    text: { type: String, required: true },
    position: { type: String, default: "top" }, // top, bottom, left, right
  },
  data() {
    return { show: false };
  },
};
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

/* Tooltip box */
.tooltip-box {
  position: absolute;
  background: #000;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none; /* tránh làm mất hover */
  opacity: 0;
  animation: fadeIn 0.15s forwards;
}

/* Vị trí tooltip */

.tooltip-box.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 6px;
}

.tooltip-box.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
}

.tooltip-box.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 6px;
}

.tooltip-box.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 6px;
}

/* Hiệu ứng mượt */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
