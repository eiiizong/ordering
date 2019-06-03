<template>
  <!-- 已完成下单页面 -->
  <div class="complete-order order">
    <TopNav text="已完成下单"></TopNav>
    <!-- 扫码显示的已完成下单页面 -->
    <div class="content">
      <!-- 外卖 -->
      <div class="top"
           v-if="takeoutType==='1'">
        <div class="cell">
          <div class="left">
            <p>{{caclTackOutStateText}}</p>
            <i class="icon icon-waiting-order"></i>
          </div>
          <div class="right">
            <p>送餐时间: {{orderDetail.takeout.delivery_time}}</p>
          </div>
        </div>
        <div class="cell">
          <div class="left"
               @click="clickContactRider">
            <i class="icon icon-horseman"></i>
            <p>联系骑手</p>
          </div>
          <div class="right"
               @click="clickContactStore">
            <i class="icon icon-merchant"></i>
            <p>联系商家</p>
          </div>
        </div>
      </div>
      <!-- 到店自取 -->
      <div class="top dd"
           v-else>
        <div class="cell">
          <div class="left">
            <p>等待取餐</p>
            <i class="icon icon-waiting-order"></i>
          </div>
          <div class="right"
               @click="clickContactStore">
            <i class="icon icon-merchant"></i>
            <p>联系商家</p>
          </div>
        </div>
        <div class="cell"
             @click="openMap">
          <div class="left">
            <i class="icon icon-address"></i>
            <p>{{orderDetail.shops.shop_address}}</p>
          </div>
        </div>
        <div class="cell">
          <div>
            <p>自取时间</p>
            <p>({{orderDetail.takeout.delivery_time}})</p>
          </div>
          <div>
            <p>预留电话</p>
            <p>{{orderDetail.takeout.phone}}</p>
          </div>
        </div>
      </div>
      <!-- 共同内容 -->
      <div class="main-content center">
        <div class="dashed-wrapper">
          <h3 class="store-name">
            <p>{{orderDetail.shops.shop_name}}</p>
            <p>{{caclOrderStateText}}</p>
          </h3>
          <div class="food-wrapper">
            <block v-for="(item, index) in orderDetail.goods"
                   :key="index">
              <FoodItem middle
                        v-if="index<foodShowNumber"
                        :data="item"></FoodItem>
            </block>
          </div>
          <div class="show-all-wrapper"
               v-if="orderDetail.goods.length>2"
               @click="showAllFood">
            <DropDown :text="isFoodShowAll?'收起':'全部显示'"
                      :className="isFoodShowAll?'show-all rotate':'show-all'"></DropDown>
          </div>
          <i class="icon icon-bottom-left"></i>
          <i class="icon icon-bottom-right"></i>
        </div>
        <div class="info">
          <div class="cell-wrapper">
            <CellOrder textLeft="优惠活动"
                       :textRight="caclActivityName"
                       iconBeforeClassName="icon-subtract"
                       iconAfterClassName=""></CellOrder>
          </div>
          <div class="small-total-wrapper">
            <SmallTotal :referentialPrice="orderDetail.preferential_amount"
                        :totalPrice="orderDetail.total_amount"></SmallTotal>
          </div>
        </div>
      </div>
      <!-- 外卖配送信息 -->
      <div class="btm"
           v-if="takeoutType==='1'">
        <div class="title">配送信息</div>
        <div class="cell-wrapper">
          <div class="cell">
            <div class="left">
              <p>配送时间</p>
            </div>
            <div class="right">
              <p>{{orderDetail.takeout.delivery_time}}</p>
            </div>
          </div>
          <div class="cell">
            <div class="left">
              <p>配送地址</p>
            </div>
            <div class="right">
              <p>{{orderDetail.takeout.accept_name}}({{orderDetail.takeout.gender==='0'?'先生':'女士'}}）{{orderDetail.takeout.phone}}</p>
              <p>{{orderDetail.takeout.delivery_address}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单其他信息 -->
      <div class="order-ok-info">
        <p v-if="!!orderDetail.memo">备注：{{orderDetail.memo}}</p>
        <p>下单时间: {{orderDetail.created_at}}</p>
        <p>订单号: {{orderDetail.order_no}}</p>
      </div>
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
      // 默认先生的菜品数量
      foodShowNumber: 2,
      // 标记是否已经查看全部菜品
      isFoodShowAll: false,
      // 用户信息
      userInfo: {},
      // 设备类型
      deviceType: "",
      // 订单详情
      orderDetail: {
        goods: [],
        shops: {},
        takeout: {}
      },
      // 订单状态文字描述
      orderStateText: "",
      // 外卖 类型 1 配送 2 自取
      takeoutType: "",
      // 外卖状态文字描述
      tackOutStateText: ""
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
    initOrderType (data) {
      let orderType = "";
      if (data.desk_id !== "0") {
        orderType = "scan";
      } else if (data.booking_id !== "0") {
        orderType = "booking";
      } else if (data.queue_id !== "0") {
        orderType = "queue";
      } else if (data.is_takeout === "1") {
        orderType = "takeout";
      }
      this.orderType = orderType;
    },
    // 请求数据
    requestData (orderId) {
      const url = "orders/view/" + orderId;
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

        if (resultData.is_takeout === "1") {
          this.takeoutType = resultData.takeout.takeout_type;
        }

        this.initOrderType(resultData);

        console.log("this.takeoutType => ", this.takeoutType);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 查看全部商品
    showAllFood () {
      if (this.isFoodShowAll) {
        this.foodShowNumber = 2;
        this.isFoodShowAll = !this.isFoodShowAll;
      } else {
        this.foodShowNumber = this.orderDetail.goods.length;
        this.isFoodShowAll = !this.isFoodShowAll;
      }
    },
    // 联系骑手
    clickContactRider () {
      const phoneNumber = this.orderDetail.takeout.express_phone;
      if (phoneNumber !== "") {
        if (mpvuePlatform === "wx") {
          mpvue.makePhoneCall({
            phoneNumber
          });
        } else if (mpvuePlatform === "my") {
          mpvue.makePhoneCall({
            number: phoneNumber
          });
        }
      } else {
        Utils.showToast("电话号码为空，无法拨号");
      }
    },
    // 联系店铺
    clickContactStore () {
      const phoneNumber = this.orderDetail.shops.phone;
      if (phoneNumber !== "") {
        if (mpvuePlatform === "wx") {
          mpvue.makePhoneCall({
            phoneNumber
          });
        } else if (mpvuePlatform === "my") {
          mpvue.makePhoneCall({
            number: phoneNumber
          });
        }
      } else {
        Utils.showToast("电话号码为空，无法拨号");
      }
    },
    // 打开地图导航
    openMap () {
      console.log("打开地图导航");
      let name = this.orderDetail.shops.shop_name;
      let address = this.orderDetail.shops.shop_address;
      mpvue.getLocation({
        type: "gcj02",
        success (res) {
          const latitude = res.latitude;
          const longitude = res.longitude;
          mpvue.openLocation({
            latitude,
            longitude,
            scale: 18,
            address,
            name
          });
        }
      });
    }
  },
  computed: {
    // 计算活动名称
    caclActivityName () {
      const data = this.orderDetail;
      let text = "";
      if (data.activity) {
        const type = data.activity.activity_type;
        if (type === "1") {
          text = `指定商品满${data.activity.full_amount}减${data.activity.discount_amount}`;
        } else {
          text = `指定商品${data.activity.discount}折扣`;
        }
      } else {
        text = "未使用优惠";
      }
      return text;
    },
    // 将订单状态从数字转换为文字
    caclOrderStateText () {
      const state = this.orderDetail.state;
      let text = Utils.orderStateToText(state);
      return text;
    },
    // 将配送状态从数字转换为文字
    caclTackOutStateText () {
      const state = this.orderDetail.takeout.takeout_state;
      let text = Utils.orderStateToText(state);
      return text;
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.order {
  .content {
    width: 100%;
    padding: 28rpx 12rpx;
    .top {
      background-color: #fff;
      border-radius: 10rpx;
      padding: 0 40rpx;
      margin-bottom: 20rpx;
      .cell {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 32rpx;
        font-weight: 700;
        color: #282828;
        line-height: 1;
        height: 106rpx;
        border-bottom: 2rpx solid #eee;
        > div {
          display: flex;
          align-items: center;
        }
        .right {
          font-size: 26rpx;
          font-weight: 500;
          color: #f9696e;
        }
        &:last-child {
          height: 102rpx;
          border-bottom: 0;
          > div {
            width: 50%;
            font-size: 28rpx;
            font-weight: 500;
            color: #947fe8;
            line-height: 1;
            justify-content: center;
            .icon {
              margin-right: 14rpx;
            }
          }
          .right {
            position: relative;
            &::before {
              content: "";
              width: 2rpx;
              height: 30rpx;
              background-color: #eee;
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
            }
          }
        }
      }
      &.dd {
        .right {
          p {
            color: #46e2ee;
            margin-left: 16rpx;
          }
        }
        .cell {
          &:last-child {
            > div {
              font-size: 24rpx;
              color: #000;
              justify-content: flex-start;
              flex-wrap: wrap;
              p {
                width: 100%;
                &:last-child {
                  padding-top: 12rpx;
                }
              }
            }
          }
        }
      }
    }
    .center {
      margin-bottom: 20rpx;
      .dashed-wrapper {
        .store-name {
          display: flex;
          line-height: 104rpx;
          font-weight: 700;
          font-size: 32rpx;
          border-bottom: 2rpx solid $scss_border-color;
          justify-content: space-between;
          p {
            &:last-child {
              font-size: 26rpx;
              color: #000;
              font-weight: 500;
            }
          }
        }
        .food-wrapper {
          .food-item {
            &:last-child {
              border-bottom: 0;
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
    }
    // 订单配送信息
    .btm {
      background-color: #fff;
      border-radius: 10rpx;
      font-size: 28rpx;
      color: #000;
      padding: 0 40rpx;
      .title {
        font-size: 32rpx;
        line-height: 108rpx;
        color: #282828;
        border-bottom: 2rpx solid #eee;
        height: 110rpx;
      }
      .cell-wrapper {
        padding-top: 20rpx;
        padding-bottom: 50rpx;
      }
      .cell {
        min-height: 76rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right {
          text-align: right;
        }
      }
    }
    .order-ok-info {
      font-size: 28rpx;
      line-height: 48rpx;
      color: #999;
      padding: 10rpx $scss_padding-LR;
    }
  }
}
</style>
