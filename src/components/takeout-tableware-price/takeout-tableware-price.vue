<template>
  <!-- 外卖餐盒费 -->
  <div class="tableware">
    <div class="left">
      <i class="icon icon-BO"></i>
      <p>餐盒费</p>
    </div>
    <div class="right">
      <p>￥{{price}}</p>
      <p>×{{goodsNum}}</p>
      <p>￥{{totalPrice}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    totalPrice: {
      type: Number
    },
    goodsNum: {
      type: Number
    },
    price: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";
.tableware {
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
    width: 320rpx;
    display: flex;
    align-items: center;
    line-height: 1;
    justify-content: space-between;
  }
}
</style>
