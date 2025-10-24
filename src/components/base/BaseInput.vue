<template>
  <div class="base-input">
    <!-- Input bình thường -->
    <div v-if="typeInput === 'normal'" class="input-wrapper">
      <slot name="icon"></slot> 
      <input
        class="input input-normal"
        type="text"
        v-model="text"
        :placeholder="placeholder"
      />
    </div>

    <!-- Input có nút clear -->
    <div v-else-if="typeInput === 'clearable'" class="input-wrapper">
      <slot name="icon"></slot>
      <input
        class="input"
        type="text"
        v-model="text"
        :placeholder="placeholder"
      />
      <div
        v-if="text"
        @click="text = ''"
        class="clear-btn"
        title="Xoá nội dung"
      ></div>
    </div>

    <!-- Input bị disable -->
    <div v-else-if="typeInput === 'disabled'">
      <input
        class="input input-disable"
        type="text"
        v-model="text"
        :placeholder="placeholder"
        disabled
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: ''
  },
  typeInput: {
    type: String,
    default: 'normal', // normal | clearable | disabled
  }
})
const emit = defineEmits(['update:modelValue'])
const text = ref(props.modelValue)
watch(text, (val) => emit('update:modelValue', val))
</script>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input {
  height: 50px;
  width: 50vw;
  min-width: 300px;
  border: 2px #e8f0fe solid;
  outline: none;
  font-size: 18px;
  padding: 0 45px;
  border-radius: 8px;
  background: none;
  color: #333;
  margin: 20px;
  line-height: 50px;
  padding-top: 4px;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.clear-btn {
  background-image: url('@/assets/btn-x.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  cursor: pointer;
}
.input-disable {
  background: #262727;
  color: #8d9095;
  cursor: not-allowed;
}
.input:focus {
  animation: inputFocus 0.3s forwards;
}
@keyframes inputFocus {
  0% {
    border-color: #e8f0fe;
  }
  100% {
    border-color: #4a80dc;
  }
}
.input-disable:focus {
  border: 1px #e8f0fe solid;
  animation: none;
  outline: none;
}
</style>
