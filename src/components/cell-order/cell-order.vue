<template>
  <!-- cell -->
  <div class="cell"
       :class="className?className:''"
       @click="$emit('click')">
    <div class="left">
      <i class="icon"
         v-if="iconBeforeClassName"
         :class="iconBeforeClassName"></i>
      <p>{{textLeft}}</p>
    </div>
    <div class="right"
         :class="noLink?'no-link':''">
      <p>{{textRight}}</p>
      <i class="iconfont"
         v-if="iconAfterClassName"
         :class="iconAfterClassName"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    textLeft: {
      type: String
    },
    textRight: {
      type: String
    },
    className: {
      type: String,
      default: ""
    },
    noLink: {
      type: Boolean,
      default: false
    },
    iconBeforeClassName: {
      type: String,
      default: ""
    },
    iconAfterClassName: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";
.cell {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 96rpx;
  font-size: 24rpx;
  padding: 0 40rpx;
  color: #282828;
  .left {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 10rpx;
    }
  }
  .right {
    display: flex;
    align-items: center;
    color: #b2b2b2;
    line-height: 1;
    span {
      margin-right: 10rpx;
    }
    .iconfont {
      font-size: inherit;
    }
    &.no-link {
      color: inherit;
    }
  }
  // 备注
  &.remark {
    border-bottom: 0;
    min-height: 100rpx;
    font-size: 30rpx;
    .right {
      p {
        max-width: 400rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
