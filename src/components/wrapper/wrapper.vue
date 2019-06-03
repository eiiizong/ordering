<template>
  <!-- 折线 虚线 容器 -->
  <div class="wrapper">
    <i class="icon icon-top-left"></i>
    <i class="icon icon-top-right"></i>
    <i class="icon icon-bottom-left"></i>
    <i class="icon icon-bottom-right"></i>
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "按钮"
    },
    iconClassName: {
      type: String,
      default: ""
    },
    btnClassName: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.wrapper {
  width: 80%;
  background-color: #fff;
  margin: 0 auto;
  height: 200px;
  border-top: 2rpx dashed #eee;
  position: relative;
  .icon {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #f5f5f5;
    border-radius: 50%;
    z-index: 2001;
  }
  .icon-top-left {
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }
  .icon-top-right {
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }
  .icon-bottom-left {
    bottom: 0;
    left: 0;
    transform: translate(-50%, 50%);
  }
  .icon-bottom-right {
    bottom: 0;
    right: 0;
    transform: translate(50%, 50%);
  }
}
</style>
