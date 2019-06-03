<template>
  <!-- 购物车 -->
  <div class="go-pay"
       :class="hasShoppingCar?'shop-car':''">
    <div class="total-price">
      <div class="shop-car-icon"
           @click="$emit('clickCar')"
           v-if="hasShoppingCar">
        <div class="inner">
          <i class="icon icon-shopping-car"></i>
        </div>
      </div>
      <div class="badge"
           v-if="!shoppingCarNumber?false:true">{{shoppingCarNumber}}</div>
      <p>￥{{totalPrice}}</p>
    </div>
    <div class="btn-wrapper">
      <Btn :value="btnValue"
           btnClassName="to-pay"
           @click="$emit('clickGoPay')"
           :disabled="disabled"></Btn>
    </div>
  </div>
</template>

<script>
import Btn from "@/components/btn/btn";
export default {
  props: {
    hasShoppingCar: {
      type: Boolean,
      default: false
    },
    btnValue: {
      type: String
    },
    shoppingCarNumber: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    totalPrice: {
      type: String,
      default: "0"
    }
  },
  components: {
    Btn
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.go-pay {
  width: 100%;
  padding: 0;
  position: fixed;
  bottom: 0;
  left: 0;
  height: $scss_go-pay-height;
  background-color: #fff;
  border-top: 2rpx solid #f1f1f1;
  display: flex;
  z-index: 1000;
  .total-price {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    .badge {
      bottom: 86rpx;
      left: 90rpx;
      position: absolute;
      min-width: 30rpx;
      height: 30rpx;
      line-height: 30rpx;
      background-color: #f00;
      text-align: center;
      color: #fff;
      border-radius: 50px;
      font-size: 20rpx;
      padding: 0 8rpx;
    }
    p {
      width: 100%;
      font-size: 36rpx;
      font-weight: 700;
      color: #f00;
      padding-left: 40rpx;
      line-height: 1;
    }
  }
  &.shop-car {
    .total-price {
      p {
        padding-left: 158rpx;
        margin-top: -20rpx;
      }
    }
  }
  .btn-wrapper {
    width: 210rpx;
    height: 100%;
  }
  // 购物车icon
  .shop-car-icon {
    width: 92rpx;
    height: 92rpx;
    background-color: rgba(255, 119, 114, 0.2);
    border-radius: 50%;
    display: flex;
    position: absolute;
    top: -20rpx;
    left: 28rpx;
    .inner {
      margin: auto;
      width: 70rpx;
      height: 70rpx;
      background-color: $scss_theme-color;
      border-radius: 50%;
      display: flex;
      .icon-shopping-car {
        width: 44rpx;
        height: 44rpx;
        margin: auto;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9UlEQVRoQ+VZ7XUUMQzUVACpgKQCuAqACoAKIBUQKiBUAFcBoQJCBUkq4KgAUgGhAvHmYu/TOrv+OuL1Pfzv3u16NZZGGsmQPV/Yc/sFqvpERN6KyOEEmF8i8gXAZa9ACYDGPU0YeASAYLpbuQDeAfjUnfUi2xA6EZGPCeMYRm+6BECjHIiHgYHPTGhdAeDv7tZsFgo8cwPgoDvrGUJzRqkqT/zC/H8A4KY3ENE6oKpqDCZXNh0B+ANgkwJAgx93ZHRoyjoF4ExEXncM4CoF4FRE3hsAaxFZmgdM54+cTUkPhER+vqSsUFXKnZ/mQFcpD7A2/DYvLFqRg9R+DeAwqUZVlRrIu2zRiqyqPH0vOj8AOM0BcC4iL5wXNgBWS5Daqebv5ttbgZkDYERkAMl37gOgqtqM+AMA24D5SuyNUNWXIvLVGLUIkVWVXPR6beBi8jQnmN+cyKrK1Pk5DJ8sDzi1ytz/YMi9AGVFs6WqlodD+JQAsF1bU2k9EQHHAMiH7UqGkPMAuzH2zbcvNSTyRMM1UsW5AMIYbBY+wYe+AWBSGVYuAKYsm4OXArCihC4G4MLI9gatAVyLyAkAknm0sjzgAFgir9E4E82dWAkAWwmbZqKYu0sA2PFLN01+CYBRb9Aylf4TD0wQeRFNVE1iB8A2+aOK2DotDUW15MOZY8iSLXOfPQNwPPVwNgecByhn2aF5YZdrwK7PcQYUjj5vZU3pzq4zYkHxbWbpFjXPz9adYgA1X7/Pd/5vAE6rs6gtNuyq8oDrk3kp4kccJParUCmWhE6wJw+EPGP7Gj2cYgATTb63kx+i3C2+S5voef2eyTFODYDYpWDV4CuYOISOixbMGgCxvqBYpU4MrEIAUeleA8COGsOP3Wn5UjxQ1XD+Gr6yHSHu3A/4DVQ1HLnbvUnkO11TBohYWEbvqIs94CSFndN4+6InFQPh0jFBhNU9KRirADgQ7A/81ev5LinU6CxOP7gnVe9lzl1ENYBUWLT6f+8B/AW24zJEd/RGRgAAAABJRU5ErkJggg==);
      }
    }
  }
}
</style>
