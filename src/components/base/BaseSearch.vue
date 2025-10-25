<script setup>
import BaseInput from './BaseInput.vue'
</script>

<template>
  <div>
    <BaseInput placeholder="Tìm kiếm..." typeInput="clearable">
      <template #icon>
        <div class="search-icon"></div>
      </template>
    </BaseInput>
  </div>
</template>

<style scoped>
.search-icon {
  background-image: url('../../assets/icon-search.svg');
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  width: 25px;
  height: 25px;
  position: absolute;
  left: 25px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.8;
  margin: 0 10px;
}
</style>