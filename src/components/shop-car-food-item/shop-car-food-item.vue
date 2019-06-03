<template>
  <div class="shop-car-food-item"
       v-if="data">
    <div class="left">
      <img :src="data.img"
           alt="">
    </div>
    <div class="right">
      <div class="name">
        <span>{{data.goods_name}}</span>
        <span v-if="data.spec_str">({{data.spec_str}})</span>
      </div>
      <div class="num">
        <div class="price">{{data.sell_price}}</div>
        <div>
          <BtnCounter :currentOrderNum="data.goods_num"
                      @clickAdd="$emit('clickAddFood')"
                      @clickSubtract="$emit('clickSubtractFood')"></BtnCounter>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BtnCounter from "@/components/btnCounter/btnCounter";
export default {
  props: {
    data: {
      type: Object
    }
  },
  components: {
    BtnCounter
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.shop-car-food-item {
  width: 100%;
  background-color: #fff;
  padding: 0 28rpx 0 20rpx;
  position: relative;
  height: 110rpx;
  border-radius: 5px;
  margin-bottom: 10rpx;
  .left {
    position: absolute;
    top: 14rpx;
    left: 20rpx;
    img {
      width: 82rpx;
      height: 82rpx;
      border-radius: 4rpx;
    }
  }
  .right {
    height: 100%;
    padding-left: 108rpx;
    width: 100%;
    position: relative;
  }
  .name {
    font-size: 28rpx;
    line-height: 1;
    color: #282828;
    padding-top: 16rpx;
  }
  .num {
    width: 100%;
    display: flex;
    font-size: 24rpx;
    font-weight: 600;
    line-height: 1;
    position: absolute;
    left: 0;
    bottom: 14rpx;
    align-items: flex-end;
    justify-content: space-between;
    padding-left: 108rpx;
    > div:first-child {
      flex: 1;
    }
    .price {
      font-size: 36rpx;
      line-height: 1;
      color: #f00;
      &::before {
        content: "¥";
        font-size: 26rpx;
      }
    }
  }
}
</style>
