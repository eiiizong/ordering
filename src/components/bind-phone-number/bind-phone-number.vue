<template>
  <!-- 按钮 -->
  <div class="bind-phone-number">
    <div class="bg">
      <img src="/static/images/bind-phone-number-bg.png"
           alt="">
      <i class="icon icon-bind-tel"></i>
      <p>请绑定手机号</p>
    </div>
    <div class="input-wrapper">
      <input type="number"
             maxlength="11"
             :value="valueTel"
             placeholder="请输入手机号"
             @input="$emit('inputTel', $event)"
             auto-focus>
      <div class="btn-wrapper get-phone-number">
        <Btn value="获取手机号"
             btnClassName="no"
             @getphonenumber="$emit('getphonenumber',$event)"
             openType="getPhoneNumber"></Btn>
      </div>
    </div>
    <div class="input-wrapper">
      <input type="text"
             :value="valueCode"
             placeholder="请输入手验证码"
             @input="$emit('inputCode', $event)">
      <div class="btn-wrapper">
        <Btn :value="getCodeBtnText"
             btnClassName="no"
             :disabled="getCodeBtnIsDisabled"
             @click="$emit('clickGetCode')"></Btn>
      </div>
    </div>
    <div class="btn-wrapper">
      <Btn value="绑定"
           :disabled="disabled"
           @click="$emit('clickBindPhoneNumberBtn')"></Btn>
    </div>
    <!-- <div class="close">
      <i class="icon icon-close"
         @click="$emit('clickCloseBindPhoneNumber')"></i>
    </div> -->
  </div>
</template>

<script>
import Btn from "@/components/btn/btn";
export default {
  props: {
    valueTel: {
      type: String
    },
    valueCode: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    getCodeBtnText: {
      type: String,
      default: "获取验证码"
    },
    getCodeBtnTextNum: {
      type: String
    },
    getCodeBtnIsDisabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Btn
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.bind-phone-number {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  position: relative;
  .bg {
    position: relative;
    text-align: center;
    padding-bottom: 10rpx;
    .icon {
      position: absolute;
      left: 50%;
      top: 40rpx;
      transform: translateX(-50%);
    }
    p {
      position: absolute;
      font-size: 36rpx;
      font-weight: 700;
      left: 0;
      top: 168rpx;
      width: 100%;
      line-height: 1;
      color: #fdfaf9;
    }
  }
  .input-wrapper {
    padding: 0 40rpx;
    margin-bottom: 20rpx;
    position: relative;
    input {
      width: 100%;
      height: 90rpx;
      background-color: #f4f4f4;
      border-radius: 5rpx;
      font-size: 30rpx;
      line-height: 40rpx;
      padding-left: 24rpx;
      padding-right: 200rpx;
    }
    .btn-wrapper {
      position: absolute;
      top: 0;
      right: 70rpx;
      height: 100%;
      width: auto;
      padding: 0;
      color: $scss_theme-color;
    }
  }
  .btn-wrapper {
    height: 80rpx + 26rpx + 34rpx;
    padding: 26rpx 125rpx 34rpx;
  }
  .close {
    position: absolute;
    top: -20rpx;
    right: 20rpx;
  }
  img {
    width: 100%;
    height: 290rpx;
  }
  .icon-bind-tel {
    width: 110rpx;
    height: 110rpx;
    background-image: url(data:image/png;base64,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);
  }
  // 获取手机号按钮
  .get-phone-number {
    display: none;
  }
}
</style>
