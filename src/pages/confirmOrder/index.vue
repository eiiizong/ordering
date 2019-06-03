<template>
  <!-- 确认订单页面 -->
  <div class="scan-order">
    <!-- 扫码显示的确认订单页面 -->
    <div class="content">
      <!-- 头部导航 -->
      <!-- 主要内容 -->
      <div class="main-content">
        <div class="dashed-wrapper">
          <h3 class="store-name">
            <p>{{shopInfo.shop_name}}</p>
          </h3>
          <div class="food-wrapper">
            <block v-for="(item, index) in willBuyFoods"
                   :key="item.id">
              <FoodItem v-if="index<foodShowNumber"
                        :data="item"></FoodItem>
            </block>
          </div>
          <div class="show-all-wrapper"
               v-if="willBuyFoods.length>2"
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
                       :textRight="selectedActive?selectedActive.activity_name:ishavDisCount?'选择优惠':'暂无优惠券可用'"
                       iconBeforeClassName="icon-subtract"
                       iconAfterClassName="icon-link-right"
                       @click="linkToPromotions"></CellOrder>
          </div>
          <!-- 小计 -->
          <div class="small-total-wrapper">
            <SmallTotal :referentialPrice="calcDiscountPrice"
                        :totalPrice="caclTotalPrice"></SmallTotal>
          </div>
        </div>
        <!-- 备注 -->
        <div class="remark-wrapper">
          <CellOrder className="remark"
                     textLeft="备注："
                     :textRight="orderRemark || '口味、偏好'"
                     :iconAfterClassName="'icon-link-right'"
                     @click="linkToRemark"></CellOrder>
        </div>
      </div>
      <GoPay :totalPrice="caclPayPrice"
             @clickGoPay="linkToCompleteOrder"
             :btnValue="isPayOrder?'去支付':'确定下单'"></GoPay>

    </div>
  </div>
</template>

<script>
import GoPay from "@/components/goPay/goPay";
import LinkCell from "@/components/linkCell/linkCell";
import CellOrder from "@/components/cell-order/cell-order";
import FoodItem from "@/components/food-item/food-item";
import SmallTotal from "@/components/small-total/small-total";
import DropDown from "@/components/drop-down/drop-down";

import Utils from "../../utils/utils";
import NP from "../../utils/number-precision.js";

export default {
  data () {
    return {
      totalPrice: "0",
      payPrice: "0",
      discountPrice: 0,
      userInfo: {},
      shopInfo: {},
      // 点餐类型 scan|takeout|booking|queue
      orderType: "",
      deviceType: "",
      shopId: "",
      deskId: "",
      willBuyFoods: [],
      // 是否有优惠可以使用
      ishavDisCount: false,
      // 控制配送费cell样式格式
      noLink: true,
      // 口味偏好备注
      orderRemark: "",
      // 商品应该显示的个数
      foodShowNumber: 2,
      // 标记是否已经全部显示了
      isFoodShowAll: false,
      activityList: [
        {
          "id": "1",
          "activity_name": "活动名",
          "content": "描述",
          // 1 满减 2折扣
          "type": "1",
          "full_amount": "50.00",
          "minus_amount": "5.00",
          "discount": "5.00",
          "category_ids": 3
        }
      ],
      // 菜品请求数据
      requestGoodsList: "",
      // 是否是前往支付页面
      isPayOrder: false,
      queueId: "",
      bookingId: "",
      // 选择的活动
      selectedActive: null,
      // 订单id
      orderId: "",
      // 是否餐前支付
      isBeforeMealPay: false,
      // 订单是否已经点击过支付或者下单了
      orderIsClickPay: false,
      foodsActiveTotalprices: [],
      // 订单详情
      orderDetail: {}
    };
  },
  components: {
    GoPay,
    LinkCell,
    FoodItem,
    DropDown,
    CellOrder,
    SmallTotal
  },
  created () {

  },
  onShow () {
    this.initInfo();
  },
  mounted () {

  },
  computed: {
    // 计算折扣
    calcDiscountPrice () {
      let discountPrice = 0;
      console.log("正在计算折扣....");
      if (this.isPayOrder) {
        const selectedActive = this.selectedActive;
        if (selectedActive) {
          let fullAmount = parseFloat(selectedActive.full_amount, 10);

          if (selectedActive.type === "1") {
            console.log("选择的优惠券类型为满减");
            this.foodsActiveTotalprices.forEach(item => {
              if (selectedActive.id === item.id) {
                if (item.totalPrice >= fullAmount) {
                  discountPrice = selectedActive.minus_amount;
                } else {
                  discountPrice = 0;
                }
              }
            });
          } else if (selectedActive.type === "2") {
            console.log("选择的优惠券类型为折扣");
            this.foodsActiveTotalprices.forEach(item => {
              if (selectedActive.id === item.id) {
                // 折扣 几折
                let discount = parseFloat(selectedActive.discount, 10) / 10;
                // 折数 * 总价
                let dprice = NP.times(item.totalPrice, discount);
                // 四舍五入
                let price = Math.round(dprice * 100) / 100;
                // 最终折扣价
                discountPrice = NP.minus(item.totalPrice, price);

                console.log("折扣....", discountPrice);
              }
            });
          }
        }
      } else {
        discountPrice = 0;
      }
      this.discountPrice = discountPrice;
      return discountPrice;
    },
    // 计算商品总价
    caclTotalPrice () {
      const data = this.willBuyFoods;
      let totalPrice = 0;
      data.forEach(item => {
        if (item.goods_num > 0) {
          let price = parseFloat(item.sell_price, 10);
          price = NP.times(price, item.goods_num);
          totalPrice = NP.plus(totalPrice, price);
        }
      });
      this.totalPrice = totalPrice;
      if (this.activityList) {
        this.initFullTotalPrice(data, this.activityList);
      }
      return totalPrice;
    },
    // 计算支付价
    caclPayPrice () {
      let discountPrice = parseFloat(this.discountPrice, 10);
      let totalPrice = parseFloat(this.totalPrice, 10);
      let payPrice = NP.minus(totalPrice, discountPrice);
      this.payPrice = payPrice;
      return payPrice;
    }
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;

      this.shopId = globalData.shopId;
      this.deskId = globalData.deskId || "";
      this.shopInfo = globalData.shopInfo;
      this.userInfo = globalData.userInfo;
      this.deviceType = globalData.device_type;
      this.orderType = globalData.order_type;
      this.orderRemark = globalData.orderRemark || "";
      this.queueId = globalData.queueId || "";
      this.bookingId = globalData.booking_id || "";

      this.isPayOrder = globalData.isPayOrder || false;
      this.selectedActive = globalData.selected_active || null;
      this.orderId = globalData.order_id || "";
      this.activityList = globalData.activity_list;

      // 每次页面显示 重置该状态
      this.orderIsClickPay = false;

      console.log("this.globalData => ", this.globalData);
      console.log("this.queueId => ", this.queueId);
      console.log("this.bookingId => ", this.bookingId);
      console.log("this.orderRemark => ", this.orderRemark);
      console.log("this.orderType => ", this.orderType);
      console.log("this.userInfo => ", this.userInfo);
      console.log("this.shopId => ", this.shopId);
      console.log("this.shopInfo => ", this.shopInfo);
      console.log("this.deviceType => ", this.deviceType);
      console.log("this.isPayOrder => ", this.isPayOrder);
      console.log("this.selectedActive => ", this.selectedActive);
      console.log("this.activityList => ", this.activityList);
      console.log("this.orderId => ", this.orderId);

      // 如果是支付订单
      if (this.isPayOrder) {
        this.requestOrderDetail(this.orderId);
      } else {
        // 检测是否餐前支付
        this.initIsBeforeMealPay(this.shopInfo);
        this.initWillBuyFoods();
      }
    },
    // 初始化是否是餐前支付
    initIsBeforeMealPay (data) {
      // 1 为餐后支付 0 为餐前支付
      if (data.setting.postprandial_settlement === "1") {
        this.isBeforeMealPay = false;
      } else {
        this.isBeforeMealPay = true;
        this.isPayOrder = true;
      }
    },
    // 初始化请求数据 requestGoodsList
    initRequestGoodsList (data) {
      let goodsList = [];
      data.forEach((item, index) => {
        goodsList[index] = {
          goods_specs_id: item.id,
          goods_num: item.goods_num
        };
      });
      this.requestGoodsList = JSON.stringify(goodsList);
    },
    // 计算活动价格
    initFullTotalPrice (data, activityList) {
      console.log("计算活动价格");
      console.log("willBuyFoods => ", data);
      console.log("activityList => ", activityList);
      // 用于保存最终结果
      let arr = [];
      // 遍历店铺所有活动
      activityList.forEach(item => {
        let obj = {
          id: item.id,
          type: item.type
        };
        let categoryIds = item.category_ids;
        // 符合商品分类id的总价格
        let fullPrice = 0;
        // 检测 categoryIds 是否存在
        // 不存在
        if (!categoryIds) {
        } else {
          // 存在
          categoryIds.forEach(item2 => {
            data.forEach(item3 => {
              if (item3.category_id === item2) {
                let sellPrice = parseFloat(item3.sell_price, 10);
                let goodsNum = parseFloat(item3.goods_num, 10);
                let price = NP.times(sellPrice, goodsNum);
                fullPrice = NP.plus(fullPrice, price);
              }
            });
          });
        }
        // 检测是否可用
        // 折扣
        if (item.type === "2") {
          if (fullPrice !== 0) {
            obj.isCanUse = true;
          } else {
            obj.isCanUse = false;
          }
        } else {
          if (fullPrice >= parseFloat(item.full_amount, 10)) {
            obj.isCanUse = true;
          } else {
            obj.isCanUse = false;
          }
        }
        obj.totalPrice = fullPrice;
        arr.push(obj);
      });
      this.foodsActiveTotalprices = arr;
      this.globalData.foodsActiveTotalprices = arr;
      this.initIshavDisCount(arr);
      console.log("this.foodsActiveTotalprices", this.foodsActiveTotalprices);
    },
    // 检测是否有可用优惠券
    initIshavDisCount (data) {
      if (this.isPayOrder) {
        this.ishavDisCount = false;
        data.some(item => {
          if (item.isCanUse === true) {
            this.ishavDisCount = true;
            return true;
          }
        });
      } else {
        this.ishavDisCount = false;
      }
    },
    // 获取本地菜品缓存
    initWillBuyFoods () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        let result = _this.globalData[key];
        if (result) {
          _this.willBuyFoods = result;
          _this.initFullTotalPrice(result, _this.activityList);
          _this.initRequestGoodsList(result);
        }
      };
      Utils.operatingData(orderType, "w", func);
    },
    // 清除本地缓存
    clearDataToLocalStorage () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        _this.globalData[key] = null;
        console.log(`正在清除 ${key} =>`, _this.globalData);
      };
      Utils.operatingData(orderType, "w", func);
      Utils.operatingData(orderType, "c", func);
    },
    // 请求订单详情 用于订单餐后支付
    requestOrderDetail (orderId) {
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
        this.willBuyFoods = resultData.goods;
        this.initRequestGoodsList(resultData.goods);
        this.orderRemark = resultData.memo;
        this.shopInfo = resultData.shops;

        // 如果不存在ActivityList
        if (!this.globalData.activity_list) {
          this.requestActivityList(this.shopId);
        } else {
          this.initFullTotalPrice(resultData.goods, this.activityList);
        }
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 从订单列表进入 获取店铺活动详情
    requestActivityList (shopId) {
      const url = "shops/goodsList";
      const methods = "POST";
      const data = {
        "shop_id": shopId
      };
      const header = {
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        const resultData = result.data;
        this.activityList = resultData.activityList;
        this.globalData.activity_list = resultData.activityList;
        this.initFullTotalPrice(this.willBuyFoods, this.activityList);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 订单支付
    requestPayOrders (orderId) {
      const _this = this;
      const url = "orders/payment/" + orderId;
      const methods = "POST";
      let data = {};
      if (this.selectedActive) {
        data = {
          "activity_id": this.selectedActive.id
        };
      }
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起请求 获取 ${url} 数据请求 成功 => 请求结果：`, result);
        const resultData = result.data;
        if (resultData.paymentdata) {
          mpvue.requestPayment({
            timeStamp: resultData.paymentdata.timeStamp.toString(),
            nonceStr: resultData.paymentdata.nonceStr,
            package: resultData.paymentdata.package,
            signType: resultData.paymentdata.signType,
            paySign: resultData.paymentdata.paySign,
            success (res) {
              Utils.showToast("支付成功");
              _this.globalData.order_id = resultData.id;
              _this.globalData.orderRemark = "";
              let linkUrl = "../scanOrderDetail/main";
              mpvue.redirectTo({ url: linkUrl });
            },
            fail (res) {
              Utils.showToast("支付失败");
            }
          });
        }
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 错误详情：`, err);
      });
    },
    // 订单创建
    requestOrdersCreated () {
      const _this = this;
      const orderType = this.orderType;
      const url = "orders/created";

      const methods = "POST";
      let data = {
        "shop_id": this.shopId,
        "goodsList": this.requestGoodsList,
        "order_type": this.orderType
      };

      switch (orderType) {
        case "scan":
          if (this.orderRemark) {
            data = {
              ...data,
              "memo": this.orderRemark,
              "desk_id": this.deskId
            };
          } else {
            data = {
              ...data,
              "desk_id": this.deskId
            };
          }
          if (this.selectedActive) {
            data = {
              ...data,
              "activity_id": this.selectedActive.id
            };
          }
          break;
        case "booking":
          if (this.orderRemark) {
            data = {
              ...data,
              "memo": this.orderRemark,
              "booking_id": this.bookingId
            };
          } else {
            data = {
              ...data,
              "booking_id": this.bookingId
            };
          }
          break;
        case "queue":
          if (this.orderRemark) {
            data = {
              ...data,
              "memo": this.orderRemark,
              "queue_id": this.queueId
            };
          } else {
            data = {
              ...data,
              "queue_id": this.queueId
            };
          }
          break;
        default:
          Utils.showToast("未知点餐类型");
      }
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起请求 获取 ${url} 数据请求 成功 => 请求结果：`, result);
        const resultData = result.data;
        const orderId = resultData.id;
        this.orderId = orderId;
        this.globalData.order_id = orderId;
        if (resultData.paymentdata) {
          mpvue.requestPayment({
            timeStamp: resultData.paymentdata.timeStamp.toString(),
            nonceStr: resultData.paymentdata.nonceStr,
            package: resultData.paymentdata.package,
            signType: resultData.paymentdata.signType,
            paySign: resultData.paymentdata.paySign,
            success (res) {
              Utils.showToast("支付成功");

              _this.globalData.orderRemark = "";
              _this.clearDataToLocalStorage();

              if (_this.orderType === "scan") {
                _this.globalData.SocketTaskSendClearAllFoods(_this.globalData.SocketTask, _this);
              }

              let linkUrl = "../scanOrderDetail/main";
              mpvue.redirectTo({ url: linkUrl });
            },
            fail (res) {
              Utils.showToast("支付失败");
            }
          });
        } else {
          this.globalData.orderRemark = "";
          this.clearDataToLocalStorage();
          if (_this.orderType === "scan") {
            _this.globalData.SocketTaskSendClearAllFoods(_this.globalData.SocketTask, _this);
          }

          let linkUrl = "../scanOrderDetail/main";
          mpvue.redirectTo({ url: linkUrl });
        }
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 错误详情：`, err);
      });
    },
    // 显示所有商品 和 显示两个商品切换
    showAllFood () {
      if (this.isFoodShowAll) {
        this.foodShowNumber = 2;
        this.isFoodShowAll = !this.isFoodShowAll;
      } else {
        this.foodShowNumber = this.willBuyFoods.length;
        this.isFoodShowAll = !this.isFoodShowAll;
      }
    },
    // 优惠券
    linkToPromotions () {
      if (this.activityList.length > 0) {
        if (this.isPayOrder) {
          this.globalData.onlySeePromotions = false;
        } else {
          this.globalData.onlySeePromotions = true;
        }
        const url = "../promotions/main";
        mpvue.navigateTo({ url });
      } else {
        Utils.showToast("该店铺暂未有可使用的优惠券");
      }
    },
    // 备注
    linkToRemark () {
      if (!this.isPayOrder) {
        const url = "../remark/main";
        mpvue.navigateTo({ url });
      } else {
        Utils.showToast("该订单状态此时无法更改备注");
      }
    },
    // 去支付
    linkToCompleteOrder () {
      // 如果是第一次点击支付按钮
      if (!this.orderIsClickPay) {
        // 如果此时订单是支付状态
        if (this.isPayOrder) {
          // 如果该订单是餐前支付
          if (this.isBeforeMealPay) {
            this.orderIsClickPay = true;
            this.requestOrdersCreated();
          } else {
            // 如果该订单是餐后支付
            const deskId = this.orderDetail.desk_id;
            // 此时还未绑定座位号
            if (deskId === "0") {
              Utils.showToast("您还尚未就餐，请就餐后再进行支付！");
            } else {
              // 此时已绑定座位号
              this.orderIsClickPay = true;
              this.requestPayOrders(this.orderId);
            }
          }
        } else {
          // 如果此时订单是确定订单状态
          this.orderIsClickPay = true;
          this.requestOrdersCreated();
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.scan-order {
  .content {
    padding: 28rpx 12rpx 60rpx + $scss_btn-pay-height;
    .main-content {
      .dashed-wrapper {
        .store-name {
          display: flex;
          line-height: 104rpx;
          font-weight: 700;
          font-size: 32rpx;
          border-bottom: 2rpx solid $scss_border-color;
          justify-content: space-between;
        }
        .food-wrapper {
          transition: all 0.3s;
          .food-item {
            &:last-child {
              border-bottom: 0;
            }
          }
        }
        .show-all-wrapper {
          border-top: 2rpx solid #eee;
          height: 90rpx;
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
      .remark-wrapper {
        margin-top: 26rpx;
        background-color: #fff;
        border-radius: 10rpx;
      }
    }
  }
}
</style>
