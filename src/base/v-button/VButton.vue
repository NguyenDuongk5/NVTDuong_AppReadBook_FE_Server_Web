<template>
    <button v-if="leftIcon" class="button left-icon" :class="leftIcon">
        {{ text ?? "Button" }}
    </button>

    <button v-else-if="rightIcon" class="button right-icon" :class="rightIcon">
        {{ text ?? "Button" }}
    </button>
</template>
<script>
export default {
    name:"VButton",
    props:[
        "text",
        "leftIcon",
        "rightIcon"
    ]
}
</script>
<style lang="scss">

    .button{
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        min-width: 80px;
    }
    .left-icon{
        background-size: 20px 20px;
        background-repeat: no-repeat;
        background-position-y: center;
        background-position-x: left;
        padding: 4px 8px 4px 24px;

    }

    .right-icon{
        background-size: 20px 20px;
        background-repeat: no-repeat;
        background-position-y: center;
        background-position-x: right;
        padding: 4px 24px 4px 8px;

    }


    @import url(../../base/css/icon.css);
</style>