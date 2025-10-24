<template>
    <div>
        <input class="input" :placeholder="placeholder" @input="changeModelValue($event, modelValue)" type="text">
    </div>
</template>
<script>
export default {
    name: "VInput",
    props: [
        "placeholder"
    ],

    methods:{
        /**
         * 
         * @param event : 
         */
        changeModelValue(event) {
            const me = this;
            me.$emit("update:modelValue", event.target.value);
        },
    }
}
</script>
<style lang="scss" scoped>
    .input{
        width: 150px;
        height: 28px;
    }
</style>