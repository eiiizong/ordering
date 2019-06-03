<template>
  <!-- small-total -->
  <div class="small-total">
    <div class="left">
      <p>小计</p>
    </div>
    <div class="right">
      <p v-if="referentialPrice!==0">优惠¥{{referentialPrice}}</p>
      <p>{{totalPrice}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    referentialPrice: String,
    totalPrice: String
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.small-total {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 116rpx;
  font-size: 30rpx;
  color: #282828;
  padding: 0 40rpx;
  border-top: 2rpx solid $scss_border-color;
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: inherit;
    p {
      &:first-child {
        padding-top: 6rpx;
      }
      &:last-child {
        margin-left: 30rpx;
        font-size: 44rpx;
        position: relative;
        padding-left: 18rpx;
        &::before {
          content: "￥";
          position: absolute;
          bottom: 6rpx;
          left: 0;
          font-size: 24rpx;
        }
      }
    }
  }
}
</style>
