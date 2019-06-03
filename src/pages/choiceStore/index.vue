<template>
  <!-- 按钮 -->
  <div class="choice-store">
    <div class="hint">
      <h2>请选择您要点餐的餐厅哦</h2>
      <p>赶快看看下面为小主准备的餐厅吧！</p>
    </div>
    <div class="store-wrapper">
      <scroll-view class="scroll-view"
                   scroll-y>
        <radio-group class="radio-group"
                     @change="radioChange">
          <label class="radio"
                 :class="item.checked?'active': ''"
                 v-for="(item, index) in shopList"
                 :key="index">
            <radio :value="index"
                   :checked="item.checked" />
            <div class="left">
              <img :src="item.image"
                   alt="">
            </div>
            <div class="right">
              <div class="inner">
                <div class="title"
                     :class="!item.notice?'noNotice':''">
                  <div class="name">{{item.shop_name}}</div>
                  <div class="icon-radio">
                    <i class="iconfont icon-gou"></i>
                  </div>
                </div>
                <div class="notice">
                  {{item.notice}}
                </div>
                <div class="address">
                  {{item.shop_address}}
                </div>
              </div>
            </div>
          </label>
        </radio-group>
      </scroll-view>
    </div>
    <div class="btn-wrapper">
      <btn value="确定"
           @click="clickDetermineChoice"></btn>
    </div>
  </div>
</template>

<script>
import Btn from "@/components/btn/btn";
// import Utils from "../../utils/utils.js";

export default {
  data () {
    return {
      shopList: [],
      shopId: ""
    };
  },
  components: {
    Btn
  },
  created () {
  },
  onShow () {
    this.initShopList();
  },
  mounted () {
  },
  methods: {
    initShopList () {
      const globalData = this.globalData;

      const data = globalData.shopList;
      this.shopList = data;

      const shopId = parseInt(globalData.shopId);
      this.shopId = shopId;

      // 默认选中
      data.forEach((item, index) => {
        if (item.id === shopId) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });

      console.log("this.globalData => ", this.globalData);
      console.log("this.shopId => ", this.shopId);
      console.log("this.shopList => ", this.shopList);
    },
    // 选择
    radioChange (e) {
      const indexString = e.target.value;
      const index = parseInt(indexString, 10);
      const data = this.shopList;
      data.forEach((e, i) => {
        if (index === i) {
          e.checked = true;
          this.shopId = e.id;
          this.shopInfo = e;
        } else {
          e.checked = false;
        }
      });
      console.log("this.shopId => ", this.shopId);
    },
    // 确定选择
    clickDetermineChoice () {
      this.globalData.shopId = this.shopId;
      this.globalData.shopInfo = this.shopInfo;
      // 返回
      mpvue.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../static/styles/scss/variable";
.choice-store {
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100vh;
  padding-bottom: 80rpx + 34rpx + 24rpx;
  background-color: #fff;
  .hint {
    padding: 0 $scss_padding-LR;
    padding-top: 40rpx;
    h2 {
      font-size: 38rpx;
      font-weight: 700;
      line-height: 1;
      color: #000;
      padding-bottom: 26rpx;
    }
    p {
      font-size: 24rpx;
      font-weight: 500;
      line-height: 1;
      color: #b2b2b2;
      padding-bottom: 32rpx;
    }
  }
  .store-wrapper {
    flex: 1;
    overflow: hidden;
    .scroll-view {
      height: 100%;
    }
    .radio {
      width: 100%;
      position: relative;
      background-color: #fff;
      &:last-child {
        .right {
          .inner {
            border-bottom: 0;
          }
        }
      }
      &.active {
        background-color: #ecebf1;
        .icon-radio {
          background-color: $scss_theme-color;
          border-color: $scss_theme-color;
          .iconfont {
            transform: scale(1);
          }
        }
        .right {
          background-color: #ecebf1;
        }
      }
    }
    .left {
      position: absolute;
      top: 24rpx;
      left: 52rpx;
      z-index: 2;
      img {
        width: 140rpx;
        height: 140rpx;
        border-radius: 50%;
      }
    }
    radio {
      display: none;
    }
    .right {
      width: 100%;
      height: 190rpx;
      padding-left: 216rpx;
      font-size: 34rpx;
      font-weight: 500;
      line-height: 1;
      color: #000;
      .inner {
        height: 100%;
        border-bottom: 2rpx solid #ecebf1;
        padding-right: $scss_padding-LR;
      }
      .title {
        display: flex;
        justify-content: space-between;
        padding-top: 50rpx;
        align-items: center;
        &.address {
          margin-bottom: 48rpx;
        }
      }
      .notice {
        font-size: 24rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #b2b2b2;
        padding: 12rpx 0;
        padding-right: 54rpx;
      }
      .address {
        padding-right: 54rpx;
        font-size: 24rpx;
        line-height: 1.4;
        color: #666;
      }
    }
    .icon-radio {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      border: 2rpx solid #c6c7ce;
      background-color: #fff;
      display: flex;
      transition: all 0.3s;
      .iconfont {
        font-size: 24rpx;
        color: #fff;
        margin: auto;
        transition: all 0.3s;
      }
    }
  }
  .btn-wrapper {
    position: fixed;
    left: 0;
    bottom: 34rpx;
    width: 100%;
    padding: 0 50rpx;
    height: 80rpx;
  }
}
</style>
