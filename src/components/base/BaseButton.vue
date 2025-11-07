<template>
  <button
    :class="['base-btn', type]"
    @click="$emit('click')"
  >
    <img v-if="iconSrc" :src="iconSrc" alt="icon" class="btn-icon" />
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'danger', 'warning'].includes(value)
  },
  iconSrc: {
    type: String,
    default: ''
  }
})
function tong(){

}

defineEmits(['click'])
</script>
<style scoped>
    .base-btn {
        background-color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 5px;
        width: auto;             
        display: inline-block;  
        white-space: nowrap; 
        box-sizing: border-box;
        
    }
    .base-btn.primary{
      border: 1px solid #007bff;
      color: #007bff;
    }

    .base-btn.success{
      border: 1px solid #4CAF50;
      color: #4CAF50;
    }
    .base-btn.danger{
      border: 1px solid #f44336;
      color: #f44336;
      
    }
    .base-btn.warning{
      border: 1px solid #ff9800;
      color: #ff9800;
    }
    .base-btn:hover {
        opacity: 0.8;
    }


    
</style>