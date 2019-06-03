<template>
  <!-- 主页菜品 滚动 -->
  <block v-if="goods">
    <div class="goods">
      <!-- 菜品种类 -->
      <scroll-view class="menu-wrapper"
                   :scroll-into-view="menuContentActive"
                   scroll-with-animation
                   scroll-y>
        <ul class="goods-items">
          <li class="goods-item"
              :class="index === currentIndex? 'active':''"
              v-for="(item, index) in goods"
              :data-index="index"
              :id="scrollIDPrefix + item.id"
              @click="clickGoodsItem"
              :key="item.id">
            <i class="icon"
               :class="'icon-' + item.id"></i>
            <span>{{item.name}}</span>
            <i class="badge"
               v-if="item.goods_num > 0">{{item.goods_num}}</i>
          </li>
        </ul>
      </scroll-view>

      <scroll-view class="foods-wrapper"
                   :scroll-into-view="contentActive"
                   scroll-with-animation
                   @scroll="handleFoodsWrapperScroll"
                   scroll-y>
        <ul class="foods-items">
          <li class="foods-item"
              v-for="(item, index) in goods"
              :key="item.id"
              :id="scrollIDPrefix + item.id">
            <h3>{{item.name}}</h3>
            <ul class="food-items">
              <li class="food-item"
                  v-for="(foodsItem, foodsIndex) in item.goodsList"
                  :key="foodsIndex">
                <div class="img-wrapper">
                  <img :src="foodsItem.img"
                       alt="">
                </div>
                <div class="food-info">
                  <h4>{{foodsItem.goods_name}}</h4>
                  <div class="desc">{{foodsItem.desc}}</div>
                  <div class="bottom">
                    <p>月售{{foodsItem.sale}}份</p>
                    <div class="handle">
                      <div class="price">
                        {{foodsItem.sell_price}}
                      </div>
                      <!-- :currentOrderNum="selectedFoodsArr[index][foodsIndex]" -->
                      <BtnCounter @clickSubtract="$emit('clickSubtractFoods', {index, foodsIndex})"
                                  :currentOrderNum="foodsItem.goods_num"
                                  @clickAdd="$emit('clickAddGoods', {index, foodsIndex})"></BtnCounter>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </scroll-view>
    </div>
  </block>
</template>

<script>
import BtnCounter from "@/components/btnCounter/btnCounter";
export default {
  props: {
    goods: {
      type: String,
      required: true
    },
    deviceType: {
      type: String
    }
  },
  data () {
    return {
      // 设备屏幕宽度
      screenWidth: 375,
      // 控制左边菜单滚动事件 防止点击之后右边滚动事件改变左边
      isClick: false,
      // id前缀
      scrollIDPrefix: "scroll",
      // 控制右边菜品滚动
      contentActive: "",
      // 控制左边菜单滚动
      menuContentActive: "",
      currentIndex: 0,
      // 将菜品每个分类所占高度依次分类，再叠加，以便滚动的时候计算
      foodsItemHeightArr: [],
      // 控制数据监视
      updataNum: 0,
      aliPaydata: [],
      // 定时器
      timer: null
    };
  },
  created () { },
  components: {
    BtnCounter
  },
  mounted () {
    if (this.deviceType === "wx") {
    }
    this.getDeviceWidth();
  },
  methods: {
    // 获取设备屏幕宽高
    getDeviceWidth () {
      const _this = this;
      mpvue.getSystemInfo({
        success (res) {
          _this.screenWidth = res.screenWidth;
          _this.foodsItemHeightArr = _this.calcFoodsIetmHeight(res.screenWidth);
        }
      });
    },
    // 点击菜单类执行该事件
    clickGoodsItem (e) {
      clearTimeout(this.timer);
      this.contentActive = e.currentTarget.id;
      this.currentIndex = e.currentTarget.dataset.index;
      this.isClick = true;
      this.timer = setTimeout(() => {
        this.isClick = false;
      }, 1000);
    },
    // 计算每个分类菜品所占的高度
    calcFoodsIetmHeight (screenWidth) {
      // 每个标签标题高 62rpx
      // 每个菜品高度 190rpx
      // 每个菜品间距 40rpx
      let data = this.goods;
      if (data.length > 0) {
        let arr = [];
        let resultArr = [0];
        data.forEach(item => {
          let len = item.goodsList.length;
          // arr[index] = (62 + ((190 + 40) * len) - 40) * this.screenWidth / 750;
          const e = (22 + (230 * len)) * (screenWidth / 750);
          arr.push(e);
        });

        for (let i = 1, len = arr.length; i < len; i++) {
          resultArr[i] = arr[i - 1] + resultArr[i - 1];
        }
        return resultArr;
      }
    },
    // 监听菜品滚动 控制菜单滚动
    handleFoodsWrapperScroll (e) {
      console.log(e);
      if (!this.isClick) {
        const _this = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // 获取当前滚动的高度
          let currentScrollTop = e.target.scrollTop;
          let arr = _this.foodsItemHeightArr;
          let len = arr.length - 1;
          for (let i = 0; i < len; i++) {
            let item = arr[i];
            let nextItem = arr[i + 1];
            if (currentScrollTop >= item && currentScrollTop < nextItem) {
              _this.currentIndex = i;
              _this._scrollMenuWrapper();
            }
          }
          if (currentScrollTop >= arr[len]) {
            _this.currentIndex = len;
            _this._scrollMenuWrapper();
          }
        }, 200);
      }
    },
    // 右边菜品滚动 控制菜单滚动
    _scrollMenuWrapper () {
      // 每个标签高度 112rpx
      // console.log("this.goods", this.goods);
      const goods = this.goods;
      if (this.currentIndex > 2) {
        this.menuContentActive = this.scrollIDPrefix + goods[this.currentIndex - 2].id;
      } else {
        this.menuContentActive = this.scrollIDPrefix + goods[0].id;
      }
    }
  },
  watch: {
    // 监听数据 goods 第一次goods为空
    goods () {
      if (this.updataNum < 1) {
        this.foodsItemHeightArr = this.calcFoodsIetmHeight(this.screenWidth);
        this.updataNum++;
      }
    }
  },
  computed: {
    // caclAliPayData () {
    //   const data = this.goods;
    //   let tabs = [];
    //   console.log("正在计算data....", data);
    //   data.forEach(item => {
    //     const obj = {
    //       title: item.name,
    //       anchor: this.scrollIDPrefix + item.id,
    //       badgeType: "dot",
    //       badgeText: item.goods_num
    //     };
    //     tabs.push(obj);
    //   });
    //   console.log("tabs", tabs);
    //   return tabs;
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.goods {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  .menu-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 156rpx;
    text-align: center;
    li {
      height: 112rpx;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      font-size: 26rpx;
      line-height: 1;
      color: #898989;
      &::before {
        content: "";
        width: 4rpx;
        height: 100%;
        background-color: $scss_theme-color;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: all 0.3s;
      }
      &.active {
        background-color: transparent;
        color: #444;
        &::before {
          opacity: 1;
        }
      }
      .icon {
        margin-right: 8rpx;
      }
    }
    .badge {
      position: absolute;
      top: 10rpx;
      right: 4rpx;
      min-width: 30rpx;
      height: 30rpx;
      line-height: 30rpx;
      background-color: #f00;
      text-align: center;
      color: #fff;
      border-radius: 50px;
      font-size: 20rpx;
    }
  }
}
.foods-wrapper {
  width: 100%;
  padding-left: 170rpx;
  height: 100%;
  .foods-items {
    width: 100%;
  }
  .foods-item {
    width: 100%;
  }
  .food-items {
    width: 100%;
  }
  .food-item {
    width: 100%;
    position: relative;
    height: 190rpx;
    margin-bottom: 40rpx;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .img-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    img {
      width: 190rpx;
      height: 190rpx;
      border-radius: 10rpx;
    }
  }
  .food-info {
    width: 100%;
    padding-left: 200rpx;
  }
  h3 {
    width: 100%;
    line-height: 62rpx;
    font-size: 24rpx;
    color: #444;
  }
  h4 {
    width: 100%;
    font-weight: 700;
    font-size: 32rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 40rpx;
    max-height: 80rpx;
    color: #2a2a2a;
    margin-bottom: 6px;
  }
  .desc {
    width: 100%;
    font-size: 20rpx;
    line-height: 1;
    color: #929292;
    overflow: hidden;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-bottom: 12rpx;
  }
  .bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-left: 200rpx;
    p {
      font-size: 20rpx;
      line-height: 1;
      color: #929292;
      padding-bottom: 12rpx;
    }
    .handle {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .price {
        font-size: 36rpx;
        font-weight: 700;
        line-height: 40rpx;
        color: #f00;
        position: relative;
        padding-left: 22rpx;
        height: 40rpx;
        &::before {
          position: absolute;
          content: "￥";
          font-size: 26rpx;
          line-height: 1;
          bottom: 6rpx;
          left: 0;
        }
      }
    }
  }
}
</style>
