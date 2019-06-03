<template>
  <!-- 备注页面 -->
  <div class="remark">
    <TopNav text="备注"></TopNav>
    <div class="content">
      <div class="bg">
        <textarea placeholder="请输入您的其他要求"
                  class="textarea"
                  @input="textareaChange"
                  focus
                  v-model="orderRemark"
                  show-confirm-bar
                  maxlength="50" />
        <div class="limit-hint">
          <span>{{textLength}}</span>/<span>50</span>
        </div>
        </div>
      </div>
    <div class="btn-wrapper">
      <Btn value="确定"
           @click="btnOK" :disabled="btnDisabled"></Btn>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import Btn from "@/components/btn/btn";
// import Utils from "../../utils/utils";

export default {
  data () {
    return {
      textLength: 0,
      orderRemark: "",
      btnDisabled: true
    };
  },

  components: {
    Btn,
    TopNav
  },

  onShow () {
    this.initRemarkText();
  },
  methods: {
    // 初始化remarkText
    initRemarkText () {
      const orderRemark = this.globalData.orderRemark;
      if (orderRemark) {
        this.orderRemark = orderRemark;
      }
    },
    // 点击确定按钮
    btnOK () {
      // 将字符串去掉所有空格
      this.orderRemark = this.orderRemark.replace(/\s*/g, "");

      this.globalData.orderRemark = this.orderRemark;
      mpvue.navigateBack({
        delta: 1
      });
    },
    // 输入时触发
    textareaChange (e) {
      const textLength = e.target.cursor;
      this.textLength = textLength;
      if (!this.orderRemark.replace(/\s*/g, "")) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";

.remark {
  padding-bottom: 80rpx + 58rpx + 32rpx;
  position: relative;
  .content {
    .bg {
      padding: $scss_padding-LR;
      width: 100%;
      background-color: #fff;
      position: relative;
      .textarea {
        width: 100%;
        border: 2rpx solid #eee;
        border-radius: 10rpx;
        height: 200rpx;
        padding: 10rpx;
        background-color: #e9e9e9;
        color: #282828;
        font-size: 30rpx;
        font-weight: 500;
      }
      .limit-hint {
        position: absolute;
        bottom: $scss_padding-LR + 4rpx;
        right: $scss_padding-LR + 4rpx;
        font-size: 30rpx;
        line-height: 1;
        color: #666;
      }
    }
  }
  .btn-wrapper {
    position: absolute;
    bottom: 40rpx;
    left: 0;
    width: 100%;
    padding: 0 $scss_padding-LR;
  }
}
</style>
