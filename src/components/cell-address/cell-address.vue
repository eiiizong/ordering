<template>
  <div class="cell-address"
       :class="className"
       @click="$emit('clickChoiceAddress')"
       v-if="data">
    <div class="base">
      <div class="info">
        <div class="name">{{data.accept_name}}</div>
        <div>({{data.gender === "1" ?"先生":"女士"}})</div>
        <div class="tel">{{data.telphone}}</div>
      </div>
      <div class="handle"
           v-if="!isChoice">
        <i class="iconfont icon-editor"
           @click="$emit('clickEditor')"></i>
        <i class="iconfont icon-delete"
           @click="$emit('clickDelete')"></i>
      </div>
    </div>
    <div class="address">
      <i class="icon icon-address"></i>
      <span>{{data.address}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    isChoice: {
      type: Boolean
    },
    className: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.cell-address {
  width: 100%;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 46rpx 22rpx 40rpx;
  font-size: 28rpx;
  color: #000;
  line-height: 1;
  &.active {
    background-color: rgba($scss_theme-color, 0.2);
  }
  .base {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .name {
      font-size: 32rpx;
      font-weight: 700;
      line-height: 1;
      margin-right: 20rpx;
    }
    .tel {
      margin-left: 40rpx;
    }
    .handle {
      font-size: 32rpx;
      line-height: 1;
    }
  }
  .address {
    padding-top: 20rpx;
    display: flex;
    align-items: center;
    span {
      line-height: 34rpx;
    }
  }
  .iconfont {
    color: #969696;
  }
  .icon-editor {
    margin-right: 45rpx;
    font-size: 36rpx;
  }
  .icon-delete {
    font-size: 32rpx;
  }
}
</style>
