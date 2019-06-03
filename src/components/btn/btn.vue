<template>
  <!-- 按钮 -->
  <button class="btn"
          :class="btnClassName?disabled?btnClassName + ' disabled':btnClassName : disabled?'disabled':''"
          :open-type="openType"
          :disabled="disabled"
          :scope="scope"
          @click="$emit('click')"
          @getuserinfo="$emit('getuserinfo', $event)"
          @getphonenumber="$emit('getphonenumber', $event)"
          @getAuthorize="$emit('getAuthorize', $event)"
          @error="$emit('error', $event)">
    <i class="icon"
       v-if="iconClassName"></i>
    <span>{{value}}</span>
  </button>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "按钮"
    },
    openType: {
      type: String,
      default: ""
    },
    iconClassName: {
      type: String,
      default: ""
    },
    btnClassName: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    scope: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

$scss_btn-color: #fff;
$scss_btn-fs: 30rpx;
$scss_btn-bgc: $scss_theme-color;
.btn {
  width: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $scss_btn-fs;
  color: $scss_btn-color;
  background-color: $scss_btn-bgc;
  border-radius: 10rpx;
  transition: all 0.3s;
  font-weight: 700;
  &::after {
    border: 0;
  }
  // 按钮点击时
  &.button-hover {
    background-color: lighten($color: $scss_btn-bgc, $amount: 10%);
    border-color: lighten($color: $scss_btn-bgc, $amount: 10%);
  }
  // 按钮 disabled
  &.disabled {
    opacity: 0.5;
    background-color: $scss_btn-bgc;
    color: $scss_btn-color;
  }
  // 去支付 去下单
  &.to-pay {
    border-radius: 0;
  }
  // 使用优惠券按钮 父盒子 display:flex; 按钮 margin:auto; 自动居中
  &.coupon {
    width: 204rpx;
    height: 56rpx;
    background-image: linear-gradient(
        90deg,
        #efd986 0%,
        #e1cb7b 50%,
        #d2bc6f 100%
      ),
      linear-gradient(#46e2ee, #46e2ee);
    background-blend-mode: normal, normal;
    font-size: 26rpx;
    line-height: 56rpx;
    color: #3f2a02;
    border-radius: 50px;
    margin: auto;
  }
  // 没有背景色 高度
  &.no {
    color: inherit;
    font-weight: 500;
    background-color: transparent;
    border: 0;
    &.disabled {
      color: #666;
    }
  }
  // 购物车 确认下单
  &.br100 {
    border-radius: 100px;
  }
  &.reverse {
    border: 2rpx solid $scss_btn-bgc;
    background-color: #fff;
    color: $scss_btn-bgc;
  }
  // 排号
  &.appointment-reverse {
    border: 2rpx solid $scss_btn-bgc;
    background-color: #fff;
    color: $scss_btn-bgc;
    font-size: 28rpx;
    font-weight: normal;
  }
}
</style>
