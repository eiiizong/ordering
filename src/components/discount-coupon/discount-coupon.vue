<template>
  <!-- 优惠券 -->
  <div class="discount-coupon"
       v-if="data && shopInfo">
    <div class="dashed-wrapper">
      <div class="price">
        <!-- 满减 -->
        <span class="mj"
              v-if="data.type==='1'">{{minusAmount}}</span>
        <span class="zk"
              v-else>{{minusAmount}}<span class="z">折</span></span>
      </div>
      <div class="limit">{{activityName}}</div>
      <div class="store-name">{{shopInfo.shop_name}}</div>
      <i class="icon icon-bottom-left"></i>
      <i class="icon icon-bottom-right"></i>
    </div>
    <div class="btn-wrapper">
      <Btn value="使用优惠券"
           btnClassName="coupon"
           :disabled="disabled"
           @click="$emit('clickUseCoupon')"></Btn>
    </div>
  </div>
</template>

<script>
import Btn from "@/components/btn/btn";
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    shopInfo: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean
    }
  },
  computed: {
    activityName () {
      const data = this.data;
      let text = "";
      if (data.type === "2") {
        text = `指定商品打${data.discount}折`;
      }
      if (data.type === "1") {
        text = `指定商品满${data.full_amount}减${data.minus_amount}`;
      }
      return text;
    },
    minusAmount () {
      const data = this.data;
      let text = "";
      if (data.type === "2") {
        text = data.discount;
      }
      if (data.type === "1") {
        text = data.minus_amount;
      }
      return text;
    }
  },
  components: {
    Btn
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.discount-coupon {
  width: 336rpx;
  // height: 304rpx;
  background-color: #fff;
  text-align: center;
  font-size: 26rpx;
  line-height: 1;
  color: #000;
  padding-top: 30rpx;
  .dashed-wrapper {
    padding: 0;
  }
  .price {
    span {
      display: inline-block;
      font-size: 54rpx;
      line-height: 1;
      padding: 0 0 30rpx 0;
      font-weight: 700;
      position: relative;
      &.mj {
        padding-left: 20rpx;
        &::before {
          content: "￥";
          position: absolute;
          top: 2rpx;
          left: 0;
          font-size: 24rpx;
        }
      }
      &.zk {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        .z {
          font-size: 24rpx;
          line-height: 1;
          margin-left: 4px;
        }
      }
    }
  }
  .limit {
    font-size: 20rpx;
    line-height: 1;
    padding-bottom: 14rpx;
    color: #979797;
  }
  .store-name {
    padding-bottom: 28rpx;
  }
  .btn-wrapper {
    height: 104rpx;
    display: flex;
  }
}
</style>
