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
  padding-bottom: 15px;
  background-color: #ffffff;
  padding: 20px;
}
.icon-bars{
  background-image: url('../assets/icon-bars.svg');
  height: 30px;
  width: 30px;
  margin: 10px;
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
