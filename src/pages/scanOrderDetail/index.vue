<template>
  <!-- 已完成下单页面 -->
  <div class="scan-order-detail">
    <div class="content">
      <!-- 共同内容 -->
      <div class="dashed-wrapper">
        <block v-for="(item1, index1) in foods"
               :key="index1">
          <div class="item"
               v-if="item1.length>0">
            <h3 class="store-name">
              <p>
                <span v-if="index1===0">{{orderDetail.shops.shop_name}}</span>
                <span v-if="index1!==0 && index1 + 1!==foods.length">加菜{{index1}}次({{addFoodsTotalNumArr[index1]}})</span>
                <span v-if="returnDishes.length>0">退菜({{addFoodsTotalNumArr[index1]}})</span>
              </p>
              <p v-if="index1===0">{{orderStateToText}}</p>
              <p v-else></p>
            </h3>
            <div class="food-wrapper"
                 :class="index1+2===foods.length?'last':''">
              <block v-for="item2 in item1"
                     :key="item2.id">
                <FoodItem middle
                          :data="item2"></FoodItem>
              </block>
            </div>
          </div>
        </block>
        <i class="icon icon-bottom-left"></i>
        <i class="icon icon-bottom-right"></i>
      </div>
      <div class="info">
        <div class="cell-wrapper">
          <CellOrder textLeft="优惠活动"
                     textRight="未使用优惠"
                     iconBeforeClassName="icon-subtract"
                     iconAfterClassName=""></CellOrder>
        </div>
        <div class="small-total-wrapper">
          <SmallTotal :referentialPrice="parseFloat(orderDetail.preferential_amount, 10)"
                      :totalPrice="orderDetail.total_amount"></SmallTotal>
        </div>
      </div>
    </div>

    <!-- 订单其他信息 -->
    <div class="order-info">
      <p v-if="!!orderDetail.memo">备注：{{orderDetail.memo}}</p>
      <p>下单时间: {{orderDetail.created_at}}</p>
      <p>订单号: {{orderDetail.order_no}}</p>
    </div>

    <div class="btn-wrapper"
         v-if="orderType!=='takeout' && orderDetail.order_type==='2' && orderDetail.state==='1'">
      <Btn value="加菜"
           @click="clickAddFood"></Btn>
      <Btn value="去支付"
           @click="clickGoPay"></Btn>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import Btn from "@/components/btn/btn";
import CellOrder from "@/components/cell-order/cell-order";
import SmallTotal from "@/components/small-total/small-total";
import FoodItem from "@/components/food-item/food-item";
import DropDown from "@/components/drop-down/drop-down";
import Utils from "../../utils/utils";

export default {
  data () {
    return {
      // 订单类型
      orderType: "",
      // 用户信息
      userInfo: {},
      shopInfo: {},
      // 设备类型
      deviceType: "",
      // 订单详情
      orderDetail: {},
      // food
      foods: [],
      // 退菜
      returnDishes: [],
      // 加菜
      addFoodsTotalNumArr: []
    };
  },
  components: {
    FoodItem,
    TopNav,
    DropDown,
    CellOrder,
    SmallTotal,
    Btn
  },
  onShow () {
    this.initInfo();
  },
  mounted () {
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;
      this.shopInfo = globalData.shopInfo;
      this.userInfo = globalData.userInfo;
      this.deviceType = globalData.device_type;
      this.orderId = globalData.order_id;

      // 请求数据
      this.requestData(this.orderId);

      console.log("this.userInfo => ", this.userInfo);
      console.log("this.deviceType => ", this.deviceType);
      console.log("this.orderId => ", this.orderId);
    },
    // 初始化订单类型
    initFoods (data) {
      let foods = [];
      // 退菜
      let returnDishes = [];
      data.forEach(item => {
        console.log("item => ", item);
        const index = parseInt(item.buy_times, 10);
        console.log("index => ", index);
        if (!foods[index]) {
          foods[index] = [];
        }
        foods[index].push(item);
        // 退菜
        if (item.return_num !== "0") {
          let food = {
            ...item,
            goods_num: item.return_num
          };
          returnDishes.push(food);
        }
      });
      // 如果有退菜
      if (returnDishes.length > 0) {
        foods[foods.length] = returnDishes;
      } else {
        foods[foods.length] = [];
      }
      console.log("foods => ", foods);
      this.initAddFoodsTotalNumArr(foods);
      this.foods = foods;
      this.returnDishes = returnDishes;
    },
    // 初始化加菜 退菜总量
    initAddFoodsTotalNumArr (data) {
      let arr = [];
      data.forEach(item => {
        let num = 0;
        if (item.length > 0) {
          item.forEach(item2 => {
            let goodsNum = parseInt(item2.goods_num, 10);
            if (goodsNum > 0) {
              num += goodsNum;
            }
          });
        }
        arr.push(num);
      });
      this.addFoodsTotalNumArr = arr;
      console.log("this.addFoodsTotalNumArr =>", this.addFoodsTotalNumArr);
    },
    // 请求数据
    requestData (orderId) {
      // const url = "orders/view/" + orderId;
      const url = "orders/view/" + this.orderId;
      const methods = "POST";
      const data = {};
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        const resultData = result.data;
        this.orderDetail = resultData;
        this.initFoods(resultData.goods);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 去支付
    clickGoPay () {
      const data = this.orderDetail;
      this.globalData.order_id = data.id;
      this.globalData.isPayOrder = true;
      const url = "../confirmOrder/main";
      mpvue.navigateTo({ url });
    },
    // 去加菜
    clickAddFood () {
      const item = this.orderDetail;
      if (item.desk_id !== "0") {
        this.globalData.order_type = "scan";
        this.globalData.deskId = item.desk_id;
      } else if (item.queue_id !== "0") {
        this.globalData.order_type = "queue";
        this.globalData.queueId = item.queue_id;
      } else if (item.booking_id !== "0") {
        this.globalData.order_type = "booking";
        this.globalData.bookingId = item.booking_id;
      } else if (item.is_takeout === "1") {
        this.globalData.order_type = "takeout";
      }
      this.globalData.shopId = item.shop_id;
      const url = "../ordering/main";
      mpvue.navigateTo({ url });
    }
  },
  computed: {
    // 计算 订单状态
    orderStateToText () {
      const state = this.orderDetail.state;
      const text = Utils.orderStateToText(state);
      return text;
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.scan-order-detail {
  min-height: 100%;
  padding: 28rpx 12rpx 28rpx + 146rpx;
  .content {
    width: 100%;
    .dashed-wrapper {
      .store-name {
        display: flex;
        line-height: 104rpx;
        font-weight: 700;
        font-size: 32rpx;
        justify-content: space-between;
        border-bottom: 2rpx solid $scss_border-color;
        p {
          &:last-child {
            font-size: 26rpx;
            color: #000;
            font-weight: 500;
          }
        }
      }
      .show-all-wrapper {
        height: 90rpx;
        border-top: 2rpx solid #eee;
        display: flex;
        .drop-down {
          width: auto;
          margin: auto;
        }
      }
    }
    .info {
      border-bottom-right-radius: 10rpx;
      border-bottom-left-radius: 10rpx;
      overflow: hidden;
      background-color: #fff;
    }
    .item {
      .food-wrapper {
        &.last {
          .food-item {
            &:last-child {
              border-bottom: 0;
            }
          }
        }
      }
    }
  }
  .order-info {
    font-size: 28rpx;
    line-height: 48rpx;
    color: #999;
    padding: 10rpx $scss_padding-LR;
  }
  .btn-wrapper {
    height: 146rpx;
    width: 100%;
    position: fixed;
    background-color: #fff;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 $scss_padding-LR;
    align-items: center;
    .btn {
      width: 336rpx;
      height: 80rpx;
      &:first-child {
        background-color: #fff;
        border: solid 2rpx $scss_theme-color;
        color: $scss_theme-color;
      }
    }
  }
}
</style>
