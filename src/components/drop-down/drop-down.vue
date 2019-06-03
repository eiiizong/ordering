<template>
  <!-- 按钮 -->
  <div class="drop-down"
       :class="className"
       @click="$emit('click')"
       v-if="text">
    <div v-if="storeNotice">
      <p>公告：{{text}}</p>
      <i class="iconfont icon-drop-down"></i>
    </div>
    <div v-else>
      <p>{{text}}</p>
      <i class="iconfont icon-drop-down"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ""
    },
    storeNotice: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.drop-down {
  font-size: 22rpx;
  line-height: 1;
  color: #a5a5a5;
  width: 100%;
  display: flex;
  align-items: center;
  vertical-align: top;
  > div {
    max-width: 100%;
    margin: auto;
    position: relative;
    display: flex;
    align-items: center;
    p {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 1;
      max-height: 1em;
      white-space: nowrap;
    }
    .iconfont {
      transition: all 0.3s;
    }
  }
  &.car {
    font-size: 32rpx;
    font-weight: 700;
    line-height: 1;
    color: #242424;
    .icon {
      font-size: 28rpx;
    }
  }
  // 显示全部
  &.show-all {
    font-size: 26rpx;
    color: #b2b2b2;
    margin: auto;
    &.rotate {
      .iconfont {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
