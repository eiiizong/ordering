<template>
  <div class="food-item"
       :class="middle ? 'middle': ''"
       v-if="data">
    <div class="left">
      <img :src="data.img"
           alt="">
    </div>
    <div class="right">
      <div class="name">
        <span>{{data.goods_name}}</span><span v-if="data.spec_str">({{data.spec_str}})</span>
      </div>
      <div class="tips"
           v-if="middle && data.likes">
        <span>变态辣</span>
        <span>变态辣</span>
      </div>
      <div class="bottom">
        <div class="price">¥{{data.sell_price}}</div>
        <div class="total">
          <div class="num">x{{data.goods_num}}</div>
          <div class="total-price">¥{{caclTotalPrice}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BtnCounter from "@/components/btnCounter/btnCounter";
export default {
  props: {
    middle: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  data () {
    return {
      foodTotalPrice: 0
    };
  },
  mounted () {

  },
  components: {
    BtnCounter
  },
  computed: {
    caclTotalPrice () {
      const data = this.data;
      const price = parseFloat(data.sell_price, 10);
      const num = parseFloat(data.goods_num, 10);
      let foodTotalPrice = price * num;
      foodTotalPrice = foodTotalPrice.toFixed(2);
      return foodTotalPrice;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

$scss_cell-height: 94rpx;
.food-item {
  width: 100%;
  background-color: #fff;
  padding: 18rpx 0;
  position: relative;
  border-bottom: 2rpx solid $scss_border-color;
  height: 120rpx;
  .left {
    position: absolute;
    top: 18rpx;
    left: 0;
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
    font-size: 28rpx;
    line-height: 1;
    color: #282828;
    .name {
      width: 100%;
    }
    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding-left: 108rpx;
      display: flex;
      justify-content: space-between;
      .total {
        flex: 1;
        display: flex;
        justify-content: space-between;
      }
      .price {
        width: 140rpx;
      }
    }
  }
  &.middle {
    height: 170rpx;
    .left {
      top: 16rpx;
      img {
        width: 136rpx;
        height: 136rpx;
        border-radius: 5rpx;
      }
    }
    .tips {
      display: flex;
      padding-top: 14rpx;
      span {
        font-size: 22rpx;
        font-weight: 500;
        line-height: 1;
        color: #979797;
        padding: 10rpx 12rpx;
        background-color: #f9f9f9;
        border-radius: 5rpx;
        margin-right: 10rpx;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .right {
      padding-left: 170rpx;
      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding-left: 170rpx;
        display: flex;
        justify-content: space-between;
        .total {
          flex: 1;
          display: flex;
          justify-content: space-between;
        }
        .price {
          width: 140rpx;
        }
      }
    }
  }
}
</style>
