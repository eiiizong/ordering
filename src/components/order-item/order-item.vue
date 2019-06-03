<template>
  <!-- order-item -->
  <div class="order-item"
       v-if="dataOrder">
    <div class="info">
      <div class="name">
        <span>{{dataShop.shop_name}}</span>
        <span class="status">{{caclStateText}}</span>
      </div>
      <div class="time">{{dataOrder.created_at}}</div>
    </div>
    <div class="foods">
      <div class="food"
           @click="$emit('clickSeeDetail')">
        <div class="img-wrapper">
          <block v-for="(item, index) in dataOrder.goods"
                 :key="index">
            <img :src="item.img"
                 alt=""
                 v-if="index<2 && dataOrder.goods.length>1">
            <img :src="item.img"
                 alt=""
                 v-if="dataOrder.goods.length===1">
            <img :src="item.img"
                 alt=""
                 v-if="dataOrder.goods.length===1">
          </block>
        </div>
        <div class="text-hint">
          <span v-if="dataOrder.goods.length>1">{{dataOrder.goods[0].goods_name + "等" + dataOrder.goods.length + "件商品"}}</span>
          <span v-else>{{dataOrder.goods[0].goods_name +"1件商品"}}</span>
          <i class="iconfont icon-link-right"></i>
        </div>
      </div>
      <div class="price">¥{{dataOrder.payment_amount}}</div>
    </div>
    <div class="handle"
         v-if="dataOrder.state === '1'">
      <div class="btn-wrapper">
        <Btn value="加菜"
             @click="$emit('clickAddFood')"
             btnClassName="reverse"></Btn>
      </div>
      <div class="btn-wrapper">
        <Btn value="买单"
             @click="$emit('clickPay')"></Btn>
      </div>
    </div>
  </div>
</template>

<script>
import Btn from "@/components/btn/btn";
export default {
  props: {
    dataOrder: {
      type: Object
    },
    dataShop: {
      type: Object
    }
  },
  data () {
    return {
    };
  },
  computed: {
    caclStateText () {
      let state = parseInt(this.dataOrder.state, 10);
      let text = "";
      switch (state) {
        case 1:
          text = "待支付";
          break;
        case 2:
          text = "已付款";
          break;
        case 96:
          text = "待退款";
          break;
        case 97:
          text = "已退款";
          break;
        case 98:
          text = "已取消";
          break;
        case 99:
          text = "已完成";
          break;
        default:
          text = "未知状态";
      }
      return text;
    }
  },
  mounted () {
  },
  components: {
    Btn
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.order-item {
  width: 100%;
  background-color: #fff;
  padding: 0 27rpx;
  border-radius: 10rpx;
  > div {
    border-bottom: 2rpx solid #eee;
    &:last-child {
      border-bottom: 0;
    }
  }
  .info {
    height: 105rpx;
    padding-top: 22rpx;
    font-size: 30rpx;
    font-weight: 700;
    line-height: 1;
    color: #010101;
    .name {
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      font-weight: 700;
      span {
        line-height: 1;
      }
    }
    .status {
      font-size: 24rpx;
      font-weight: normal;
      line-height: 1;
    }
    .time {
      font-size: 20rpx;
      line-height: 1;
      color: #8e8e8e;
      padding-top: 12rpx;
      font-weight: normal;
    }
  }
  .foods {
    display: flex;
    height: 92rpx;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    line-height: 1;
    color: #000;
    font-weight: 700;
    .food {
      display: flex;
      line-height: 1;
      align-items: center;
      font-size: 24rpx;
      color: #979797;
      font-weight: 500;
    }
  }
  .img-wrapper {
    position: relative;
    margin-right: 30rpx;
    img {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      opacity: 0.2;
      &:last-child {
        position: absolute;
        transform: translateX(-50%);
        opacity: 1;
      }
    }
  }
  .text-hint {
    display: flex;
    align-items: center;
    .icon-link-right {
      font-size: 24rpx;
    }
  }
  .handle {
    height: 102rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .btn-wrapper {
      width: 148rpx;
      height: 60rpx;
      &:first-child {
        margin-right: 20rpx;
      }
    }
  }
}
</style>
