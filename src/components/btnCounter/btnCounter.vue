<template>
  <!-- 主页点餐加减按钮 -->
  <div class="btn-counter-wrapper">
    <i class="iconfont icon-subtract-sign"
       @click="$emit('clickSubtract')"
       v-if="currentOrderNum"></i>
    <span v-if="currentOrderNum">{{currentOrderNum}}</span>
    <i class="iconfont icon-add-sign"
       @click="$emit('clickAdd')"></i>
  </div>
</template>

<script>
export default {
  props: {
    currentOrderNum: {
      type: Number,
      default: 0
    }
  },
  mounted () {
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";
// @import "./icon.css";

.btn-counter-wrapper {
  display: flex;
  width: auto;
  align-items: center;
  font-size: 56rpx;
  color: $scss_theme-color;
  span {
    width: 40rpx;
    text-align: center;
    color: #2a2a2a;
    font-size: 28rpx;
  }
  .iconfont {
    font-size: 48rpx;
  }
}
</style>
