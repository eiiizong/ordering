<template>
  <!-- 订单 页面 -->
  <div class="order-list">
    <TopNav text="订单"
            hasGoBackBtn="false"></TopNav>
    <div class="order-wrapper"
         v-if="orders.length>0">
      <OrderItem v-for="(item, index) in orders"
                 :key="item.id"
                 :dataOrder="item"
                 :dataShop="shopInfo"
                 @clickAddFood="clickAddFood(item)"
                 @clickPay="clickPay(item)"
                 @clickSeeDetail="clickSeeDetail(index)"></OrderItem>
    </div>
    <div class="no-order"
         v-else>
      <NoPage imgUrl="/static/images/no-order.png"></NoPage>
    </div>
  </div>
</template>

<script>
import OrderItem from "@/components/order-item/order-item";
import TopNav from "@/components/top-nav/top-nav";
import NoPage from "@/components/no-page/no-page";
import Utils from "../../utils/utils.js";

export default {
  components: {
    OrderItem,
    TopNav,
    NoPage
  },

  data () {
    return {
      shopInfo: {},
      orders: [],
      shopId: "",
      deviceType: "",
      orderType: "",
      categoryList: []
    };
  },
  onShow () {
    this.initInfo();
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;
      const orderType = globalData.order_type;

      this.shopInfo = globalData.shopInfo;
      this.shopId = globalData.shopId;
      this.userInfo = globalData.userInfo;
      this.deviceType = globalData.device_type;
      this.orderType = orderType;

      // 请求数据
      this.requestOrderListData(this.shopId);

      console.log("this.globalData => ", this.globalData);
      console.log("this.shopInfo => ", this.shopInfo);
      console.log("this.userInfo => ", this.userInfo);
      console.log("this.shopId => ", this.shopId);
      console.log("this.deviceType => ", this.deviceType);

      if (orderType === "scan") {
        globalData.changeCategoryList = data => {
          this.updateBarBadge(data);
        };
        globalData.SocketTaskSendGetAllFoods(globalData.SocketTask, this);
      }
    },
    // 请求数据
    requestOrderListData (shopId) {
      const url = "orders/list";
      const methods = "POST";
      const data = {
        "shop_id": shopId,
        "orderby": "id"
      };
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起请求 获取 ${url} 数据请求 成功 => 请求结果：`, result);
        this.orders = result.data;
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 错误详情：`, err);
      });
    },
    // 查看订单详情
    clickSeeDetail (index) {
      console.log(index);
      const item = this.orders[index];
      const orderId = item.id;
      let url = "";
      if (item.is_takeout === "1") {
        this.globalData.order_type = "takeout";
        url = "../completeOrder/main";
      } else {
        url = "../scanOrderDetail/main";
      }
      this.globalData.order_id = orderId;
      mpvue.navigateTo({ url });
    },
    // 加菜
    clickAddFood (item) {
      if (item.desk_id !== "0") {
        this.globalData.order_type = "scan";
        this.globalData.deskId = item.desk_id;
      } else if (item.queue_id !== "0") {
        this.globalData.order_type = "queue";
        this.globalData.queueId = item.queue_id;
      } else if (item.booking_id !== "0") {
        this.globalData.order_type = "booking";
        this.globalData.booking_id = item.booking_id;
      } else if (item.is_takeout === "1") {
        this.globalData.order_type = "takeout";
      }
      this.globalData.shopId = item.shop_id;
      const url = "../ordering/main";
      mpvue.navigateTo({ url });
    },
    // 买单
    clickPay (item) {
      this.globalData.homeUrl = "../orders/main";
      this.globalData.order_id = item.id;
      this.globalData.isPayOrder = true;
      const url = "../confirmOrder/main";
      mpvue.navigateTo({ url });
    },
    // 更新购物车数量
    updateBarBadge (data) {
      Utils.updateShopingCarBarBadge(data);
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";

.order-list {
  display: block;
  padding: $scss_padding-T $scss_padding-LR;
  .order-item {
    margin-bottom: 16rpx;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
