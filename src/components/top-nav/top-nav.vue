<template>
  <!-- 按钮 -->
  <div class="top-nav-wrapper">
    <div class="top-nav">
      <div class="special"
           v-if="special">
        <picker :range="pickerData"
                range-key="shop_name"
                @change="$emit('bindchange', $event)"
                v-if="!!pickerData">
          <div class="picker">
            <img :src="pickerData[index].image"
                 alt="">
            <p><span>{{pickerData[index].shop_name}}</span><i class="iconfont icon-drop-down"></i></p>
          </div>
        </picker>
      </div>
      <div class="normal"
           v-else>
        <block v-if="isWeChat">
          <i class="iconfont icon-go-back"
             @click="goBack"
             v-if="!hasGoBackBtn"></i>
        </block>
        <p>{{text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pickerData: {
      type: Array
    },
    special: {
      type: Boolean,
      defalut: false
    },
    text: {
      type: String
    },
    hasGoBackBtn: {
      type: Boolean
    },
    index: {
      type: Number,
      defalut: 0
    }
  },
  data () {
    return {
      isWeChat: true
    };
  },
  created () {
    if (mpvuePlatform === "my") {
      this.isWeChat = false;
    }
  },
  mounted () {
  },
  methods: {
    goBack () {
      mpvue.navigateBack({
        delta: 1,
        success (res) {
        },
        fail (err) {
          console.log(err);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";
.top-nav-wrapper {
  height: $scss_nav-top-height;
  display: none;
}
.top-nav {
  width: 100%;
  height: $scss_nav-top-height;
  background-color: $scss_theme-color;
  color: #fff;
  text-align: center;
  font-size: 34rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2002;
  .special {
    text-align: left;
    width: 100%;
    height: 100%;
    .picker {
      width: 100%;
      height: 100%;
      display: flex;
    }
    img {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      margin: 48rpx 8rpx 0 30rpx;
    }
    p {
      display: flex;
      align-items: center;
      height: 98rpx;
    }
    .iconfont {
      font-size: 24rpx;
    }
  }
  .normal {
    width: 100%;
    height: 100%;
    position: relative;
    p {
      position: absolute;
      left: 50%;
      bottom: 26rpx;
      transform: translateX(-50%);
      padding: 0;
    }
  }
  .icon-go-back {
    position: absolute;
    bottom: 22rpx;
    left: 0;
    padding-left: 12rpx;
    font-size: 40rpx;
  }
  p {
    line-height: 1;
    padding-top: 54rpx;
  }
}
</style>
