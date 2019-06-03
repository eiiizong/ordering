<template>
  <button class="cell"
          @click="$emit('click')"
          :open-type="openType"
          :class="className?className:''"
          v-if="text">
    <div class="left"
         v-if="iconClassName">
      <i class="icon"
         :class="iconClassName"></i>
    </div>
    <div class="right">
      <div class="text">{{text}}</div>
      <i class="iconfont icon-link-right"></i>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    text: String,
    openType: String,
    className: {
      type: String,
      default: ""
    },
    iconClassName: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";

$scss_cell-height: 94rpx;
.cell {
  &.link {
    width: 100%;
    height: $scss_cell-height;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30rpx;
    line-height: 1;
    .left {
      margin-right: 20rpx;
    }
    .right {
      flex: 1;
      height: 100%;
      border-bottom: 2rpx solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #000;
      font-size: 28rpx;
      .iconfont {
        color: #5f5f5f;
      }
    }
    &:active {
      background-color: $scss_link-active-bgc;
      border-radius: 0;
    }
  }
}
</style>
