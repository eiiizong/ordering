<template>
  <div class="popup-wrapper">
    <div class="popup-content">
      <div class="show-modal">
        <div class="title">{{title}}</div>
        <div class="content">{{content}}</div>
        <div class="handle">
          <button class="btn cancel"
                  @click="$emit('clickCancel')">取消</button>
          <button class="btn confirm"
                  :open-type="openType"
                  @click="$emit('clickConfirm')">确定</button>
        </div>
      </div>
    </div>
    <div class="popup-mask"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "标题"
    },
    openType: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: "内容"
    }
  },
  data () {
    return {};
  },
  mounted () {
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.popup-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 3000;
  .popup-content {
    position: fixed;
    width: 100%;
    transition: all 0.3s;
    opacity: 1;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3002;
    padding: 0 70rpx;
  }
  .popup-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 3001;
  }
  .show-modal {
    background-color: #fff;
    width: 100%;
    min-height: 200rpx;
    border-radius: 10rpx;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding-bottom: 100rpx;
    .title {
      font-size: 36rpx;
      line-height: 1;
      padding: 40rpx 20rpx;
      font-weight: 700;
    }
    .content {
      font-size: 30rpx;
      line-height: 1.4;
      padding: 0 40rpx 40rpx;
      color: #999;
      word-wrap: break-word;
    }
    .handle {
      width: 100%;
      height: 100rpx;
      position: absolute;
      bottom: 0;
      left: 0;
      border-top: 2rpx solid #eee;
      button {
        width: 50%;
        float: left;
        height: 100%;
        font-size: 32rpx;
        font-weight: 700;
        border-radius: 0;
        display: flex;
        line-height: 1;
        align-items: center;
        justify-content: center;
        &:active {
          background-color: #eee;
        }
      }
      .cancel {
      }
      .confirm {
        border-left: 2rpx solid #eee;
        color: #356aff;
      }
    }
  }
}
</style>
