<template>
  <div class="top-bar">
    <BaseButton @click="$emit('toggle-sidebar')" type="primary">
      <div class="icon-bars"></div>
    </BaseButton>

    <BaseSearch />
    <div class="user-info">
      <img src="https://i.pravatar.cc/40" alt="user" />
      <span>Admin</span>
    </div>

  </div>
</template>

<script>
import BaseInput from '../components/base/BaseInput.vue';
import BaseButton from '../components/base/BaseButton.vue';
import BaseSearch from './base/BaseSearch.vue';
export default {
  name: 'TopBar',
  components: {
    BaseInput,
    BaseButton,
    BaseSearch,
  },
  emits: ['toggle-sidebar'],
}
</script>
<style>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e8f0fe;
  background-color: #ffffff;
  padding: 0 20px;
  height: 60px;
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: left 0.3s ease;
}
/* Khi sidebar thu gọn */
.top-bar.collapsed {
  left: 60px;
}

.icon-bars{
  background-image: url('../assets/icon-bars.svg');
  background-repeat: no-repeat;
  width: 32px;
  height: 32px;
  background-size: 24px;
  background-position: center;
  cursor: pointer;
}

.base-btn.primary {
  border: 2px solid #e8f0fe !important;
  color: #e8f0fe;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info img {
  border-radius: 50%;
}
</style>
