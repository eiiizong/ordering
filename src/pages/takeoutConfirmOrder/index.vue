<template>
  <!-- 确认订单页面 -->
  <div class="confirm-order">
    <!-- 扫码显示的确认订单页面 -->
    <div class="content">
      <!-- 头部导航 -->
      <div class="nav-wrapper">
        <div class="nav">
          <div :class="swiperIndex===0?'active':''"
               data-index='0'
               @click="changeNav">外卖配送</div>
          <div :class="swiperIndex===1?'active':''"
               data-index='1'
               @click="changeNav">到店自取</div>
        </div>
      </div>
      <swiper class="swiper"
              :current="swiperIndex"
              @change="swiperChange">
        <!-- 外卖配送 -->
        <swiper-item class="swiper-item">
          <div class="wrapper">
            <div class="address-wrapper"
                 @click="linkToAddress"
                 v-if="addressList.length > 0">
              <div class="left">
                <div class="address">
                  <i class="icon icon-address"></i>
                  <p>{{takeoutAddressInfo.address}}</p>
                </div>
                <div class="name-gender-phone">
                  <p>{{takeoutAddressInfo.accept_name}}</p>
                  <p>({{takeoutAddressInfo.gender==="1"?'先生':'女士'}})</p>
                  <p>{{takeoutAddressInfo.telphone}}</p>
                </div>
              </div>
              <div class="right">
                <i class="iconfont icon-link-right"></i>
              </div>
            </div>
            <!-- 地址缺省状态 -->
            <div class="address-wrapper"
                 @click="linkToAddAddress"
                 v-else>
              <div class="left">
                <div class="address">
                  <p>添加收货地址</p>
                </div>
              </div>
              <div class="right">
                <i class="iconfont icon-link-right"></i>
              </div>
            </div>
            <div class="picker-wrapper">
              <picker mode="time"
                      :start="wmTime"
                      end="22:00"
                      @change="wmChangeTime">

                <div class="picker">
                  <div class="left">
                    <p>配送时间</p>
                    <p>({{wmTime}})</p>
                  </div>
                  <div class="right">
                    <i class="iconfont icon-link-right"></i>
                  </div>
                </div>
              </picker>
            </div>
          </div>
        </swiper-item>
        <!-- 到店自取 -->
        <swiper-item class="swiper-item">
          <div class="wrapper">
            <div class="address-wrapper">
              <div class="left"
                   @click="openMap">
                <div class="address">
                  <i class="icon icon-address"></i>
                  <p>{{shopInfo.shop_address}}</p>
                </div>
                <div class="name-gender-phone">
                  <p>{{distance}}</p>
                </div>
              </div>
              <!-- <div class="right">
                <i class="iconfont icon-link-right"></i>
              </div> -->
            </div>
            <div class="two-item">
              <div class="picker-wrapper">
                <picker mode="time"
                        :start="wmTime"
                        end="22:00"
                        @change="wmChangeTime">
                  <div class="picker">
                    <div class="left">
                      <p>自取时间</p>
                      <p>({{wmTime}})</p>
                    </div>
                    <div class="right">
                      <i class="iconfont icon-link-right"></i>
                    </div>
                  </div>
                </picker>
              </div>
              <div class="picker-wrapper">
                <div class="picker"
                     @click="editorPhone">
                  <div class="left">
                    <p>预留电话</p>
                    <input type="number"
                           v-model="userInfo.phone"
                           maxlength="11"
                           @input="inputPhone"
                           :disabled="!isEditorPhone"
                           :focus="isEditorPhone">
                  </div>
                  <div class="right">
                    <i class="iconfont icon-link-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>

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
            <CellOrder textLeft="配送费"
                       v-if="swiperIndex===0"
                       :textRight="`￥${takeoutPrice}`"
                       iconBeforeClassName="icon-distribution"
                       noLink></CellOrder>
            <TakeoutTablewarePrice :price="takeoutTablewarePrice"
                                   :goodsNum="goodsNum"
                                   :totalPrice="tablewareTotalPrice"></TakeoutTablewarePrice>
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
                     :iconAfterClassName="!orderRemark?'icon-link-right':''"
                     @click="linkToRemark"></CellOrder>
        </div>
      </div>

      <GoPay :totalPrice="caclPayPrice"
             @clickGoPay="linkToCompleteOrder"
             btnValue="去支付"></GoPay>
      <div v-if="isShowModal">
        <ShowModal @clickCancel="showModalCancel"
                   openType=""
                   title="提示"
                   content="检测到您没打开洋富柜儿的定位权限，是否去设置打开？"
                   @clickConfirm="showModalConfirm"></ShowModal>
      </div>
    </div>
  </div>
</template>

<script>
import GoPay from "@/components/goPay/goPay";
import LinkCell from "@/components/linkCell/linkCell";
import CellOrder from "@/components/cell-order/cell-order";
import TakeoutTablewarePrice from "@/components/takeout-tableware-price/takeout-tableware-price";
import FoodItem from "@/components/food-item/food-item";
import SmallTotal from "@/components/small-total/small-total";
import DropDown from "@/components/drop-down/drop-down";
import ShowModal from "@/components/showModal/showModal";
import Utils from "../../utils/utils";
import NP from "../../utils/number-precision.js";
import QQMapWX from "../../utils/qqmap-wx-jssdk.js";

export default {
  data () {
    return {
      // 商品 + 配送费 + 餐盒费
      totalPrice: 0,
      // 支付价格
      payPrice: 0,
      // 优惠价格
      discountPrice: 0,
      // 快递费
      takeoutPrice: 0,
      // 餐盒费 单个
      takeoutTablewarePrice: 0,
      // 菜品总量
      goodsNum: 0,
      // 餐盒费总价
      tablewareTotalPrice: 0,
      // 0 外卖 1 到店自取
      swiperIndex: 0,
      userInfo: {},
      shopInfo: {},
      // 点餐类型 scan|takeout|booking|queue
      orderType: "",
      deviceType: "",
      shopId: "",
      willBuyFoods: [],
      // 是否有优惠可以使用
      ishavDisCount: false,
      // 控制配送费cell样式格式
      noLink: true,
      // 外卖立即送出时间
      wmTime: "",
      // 口味偏好备注
      orderRemark: "",
      // 商品应该显示的个数
      foodShowNumber: 2,
      // 标记是否已经全部显示了
      isFoodShowAll: false,
      // 活动列表
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
      // 选择的 优惠活动
      selectedActive: null,
      // 菜品请求数据
      requestGoodsList: "",
      // 外卖类型
      takeoutType: "1",
      // 外卖地址信息
      takeoutAddressInfo: {},
      // 日期
      day: "",
      // 我的地址
      addressList: [],
      // 所选商品总价 根据活动id
      foodsActiveTotalprices: [],
      // 订单是否已经点击过支付或者下单了
      orderIsClickPay: false,
      // 腾讯地址服务示例
      qqmapsdk: null,
      // 权限检测弹窗层
      isShowModal: false,
      // 两经纬度距离
      distance: "未打开权限无法计算距离",
      // 是否正在编辑预留电话号码
      isEditorPhone: false
    };
  },
  components: {
    GoPay,
    LinkCell,
    FoodItem,
    DropDown,
    CellOrder,
    SmallTotal,
    ShowModal,
    TakeoutTablewarePrice
  },
  created () {
  },
  computed: {
    // 计算折扣
    calcDiscountPrice () {
      let discountPrice = 0;
      console.log("正在计算折扣....");
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
      this.discountPrice = discountPrice;
      return discountPrice;
    },
    // 计算商品总价
    caclTotalPrice () {
      console.log("正在计算商品总价...........");
      const data = this.willBuyFoods;
      // 外卖类型 0 外卖 1 到店自取
      const takeoutType = this.swiperIndex;
      // 餐盒费 1个
      const takeoutTablewarePrice = this.takeoutTablewarePrice;
      // 配送费
      const takeoutPrice = this.takeoutPrice;
      // 总价
      let totalPrice = 0;
      // 商品总价
      let foodTotalPrice = 0;
      // 商品总数量
      let foodTotalNum = 0;
      // 计算所有商品总价
      data.forEach(item => {
        if (item.goods_num > 0) {
          foodTotalNum += item.goods_num;
          let price = parseFloat(item.sell_price, 10);
          price = NP.times(price, item.goods_num);
          foodTotalPrice = NP.plus(foodTotalPrice, price);
        }
      });
      // 所有商品餐盒费
      let takeoutTablewareAllPrice = NP.times(parseFloat(takeoutTablewarePrice, 10), foodTotalNum);
      totalPrice = NP.plus(foodTotalPrice, takeoutTablewareAllPrice);

      // 外卖
      if (takeoutType === 0) {
        totalPrice = NP.plus(totalPrice, parseFloat(takeoutPrice, 10));
      }

      this.totalPrice = totalPrice;

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
  onShow () {
    this.initInfo();
  },
  mounted () {
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;

      this.shopId = globalData.shopId;
      this.shopInfo = globalData.shopInfo;
      this.userInfo = globalData.userInfo;
      this.deviceType = globalData.device_type;
      this.orderType = globalData.order_type;
      this.orderRemark = globalData.orderRemark;
      this.selectedActive = globalData.selected_active;
      this.activityList = globalData.activity_list;
      this.takeoutTablewarePrice = globalData.shopInfo.setting.takeout_tableware_price;
      this.takeoutPrice = globalData.shopInfo.setting.takeout_price;

      this.orderIsClickPay = false;

      if (!globalData.takeoutAddressInfo) {
        this.requestAddressList();
      } else {
        this.takeoutAddressInfo = globalData.takeoutAddressInfo;
      }
      this.initWillBuyFoods();
      this.initNowTime();
      this.initQqmapsdk();
      this.getUserLocationSetting();

      console.log("this.globalData => ", this.globalData);
      console.log("this.queueId => ", this.queueId);
      console.log("this.activityList => ", this.activityList);
      console.log("this.selectedActive => ", this.selectedActive);
      console.log("this.takeoutPrice => ", this.takeoutPrice);
      console.log("this.orderRemark => ", this.orderRemark);
      console.log("this.orderType => ", this.orderType);
      console.log("this.userInfo => ", this.userInfo);
      console.log("this.shopId => ", this.shopId);
      console.log("this.shopInfo => ", this.shopInfo);
      console.log("this.deviceType => ", this.deviceType);
      console.log("this.wmTime => ", this.wmTime);
    },
    // 初始化腾讯地图
    initQqmapsdk () {
      this.qqmapsdk = new QQMapWX({
        key: "U7JBZ-STBWQ-S5Y56-GHLV3-OQL2T-ACF56"
      });
    },
    // 检测用户地理位置授权设置
    getUserLocationSetting () {
      const openSetting = () => {
        this.isShowModal = true;
      };
      Utils.getSetting("scope.userLocation", openSetting).then((result) => {
        console.log("检测用户地理位置授权 => 已授权", result);
        this.getUserLocation();
      }).catch(err => {
        this.getUserLocation();
        console.log("检测用户地理位置授权 => 未授权", err);
      });
    },
    // 获取用户地理位置授权
    getUserLocation () {
      Utils.getUserLocation().then(result => {
        console.log("用户已同意授权使用地理位置 =>", result);
        const form = {
          latitude: result.latitude,
          longitude: result.longitude
        };
        const to = `${this.shopInfo.lat},${this.shopInfo.long}`;
        this.calculateDistance(form, to);
      }).catch(err => {
        // 标记用户已经拒绝过授权
        console.lor("用户已拒绝授权使用地理位置 =>", err);
      });
    },
    // 计算两经纬度距离
    calculateDistance (from, to) {
      const _this = this;
      this.qqmapsdk.calculateDistance({
        // 步行
        mode: "driving",
        from,
        to,
        success (res) {
          console.log("两经纬度距离请求结果 =>", res);
          _this.distance = `距离${res.result.elements[0].distance}米`;
        },
        fail (err) {
          console.error(err);
        }
      });
    },
    // 模态框确定按钮执行事件
    showModalConfirm () {
      // 打开用户授权设置
      mpvue.openSetting();
      this.isShowModal = false;
    },
    // 模态框取消按钮执行事件
    showModalCancel () {
      this.isShowModal = false;
    },
    // 编辑预留电话
    editorPhone () {
      this.isEditorPhone = !this.isEditorPhone;
    },
    // 检测 预留电话输入时执行事件
    inputPhone (e) {
      if (e.target.cursor === 11) {
        mpvue.hideKeyboard();
        this.isEditorPhone = false;
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
      goodsList = JSON.stringify(goodsList);
      this.requestGoodsList = goodsList;
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
    // 初始化是否有可用优惠券
    initIshavDisCount (data) {
      this.ishavDisCount = false;
      data.some(item => {
        if (item.isCanUse === true) {
          this.ishavDisCount = true;
          return true;
        }
      });
      console.log("this.ishavDisCount", this.ishavDisCount);
    },
    // 获取本地菜品缓存
    initWillBuyFoods () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        const result = _this.globalData[key];
        if (result) {
          _this.initRequestGoodsList(result);
          _this.caclTakeoutTablewareTotalPrice(result);
          _this.initFullTotalPrice(result, _this.activityList);
          _this.willBuyFoods = result;
        }
      };
      Utils.operatingData(orderType, "w", func);
    },
    // 计算餐盒费总价
    caclTakeoutTablewareTotalPrice (data) {
      const takeoutTablewarePrice = this.takeoutTablewarePrice;
      let num = 0;
      data.forEach(item => {
        if (item.goods_num > 0) {
          num += item.goods_num;
        }
      });
      this.goodsNum = num;
      this.tablewareTotalPrice = NP.times(parseFloat(takeoutTablewarePrice, 10), num);
      console.log("num.................", num);
    },
    // 初始化时间
    initNowTime () {
      const now = new Date();
      let h = now.getHours();
      let m = now.getMinutes();
      let y = now.getFullYear();
      let month = now.getMonth() + 1;
      let d = now.getDate();
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (d < 10) {
        d = "0" + d;
      }
      this.wmTime = h + ":" + m;
      console.log("y => ", y);
      console.log("month => ", month);
      console.log("d => ", d);
      console.log("h => ", h);
      console.log("m => ", m);
      this.day = y + "-" + month + "-" + d;
    },
    // 清除本地缓存
    clearDataToLocalStorage () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        _this.globalData[key] = null;
      };
      Utils.operatingData(orderType, "c", func);
      Utils.operatingData(orderType, "w", func);
    },
    // 订单创建
    requestOrdersCreated () {
      const _this = this;
      const url = "orders/created";
      const methods = "POST";
      let data = {
        "shop_id": this.shopId,
        "goodsList": this.requestGoodsList,
        "order_type": this.orderType,
        "takeout_type": this.takeoutType,
        "takeout_data[phone]": this.takeoutAddressInfo.telphone,
        "takeout_data[delivery_time]": this.day + " " + this.wmTime
      };
      if (this.selectedActive) {
        data = {
          ...data,
          "activity_id": this.selectedActive.id
        };
      }
      if (this.takeoutType === "1") {
        data = {
          ...data,
          "takeout_data[accept_name]": this.takeoutAddressInfo.accept_name,
          "takeout_data[gender]": this.takeoutAddressInfo.gender,
          "takeout_data[long]": this.takeoutAddressInfo.long,
          "takeout_data[lat]": this.takeoutAddressInfo.lat,
          "takeout_data[delivery_address]": this.takeoutAddressInfo.address
        };
      }
      if (this.takeoutType === "2") {
        data = {
          ...data,
          "takeout_data[phone]": this.userInfo.phone
        };
      }
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起请求 获取 ${url} 数据请求 成功 => 请求结果：`, result);
        const resultData = result.data;
        // 调支付接口
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
              _this.clearDataToLocalStorage();
              _this.globalData.orderRemark = "";
              let linkUrl = "../completeOrder/main";
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
    // 请求地址列表
    requestAddressList () {
      const url = "address/list";
      const methods = "POST";
      let data = {};
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起请求 获取 ${url} 数据请求 成功 => 请求结果：`, result);
        const resultData = result.data;
        if (resultData.length > 0) {
          this.addressList = resultData;
          this.globalData.addressList = resultData;
          // 如果，没有默认地址 默认取第一个
          this.takeoutAddressInfo = resultData[0];
          this.globalData.takeoutAddressInfo = resultData[0];
          resultData.some(item => {
            if (item.is_default === "1") {
              this.takeoutAddressInfo = item;
              this.globalData.takeoutAddressInfo = item;
              return true;
            }
          });
        }
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 错误详情：`, err);
      });
    },
    // 显示所有商品
    showAllFood () {
      if (this.isFoodShowAll) {
        this.foodShowNumber = 2;
      } else {
        this.foodShowNumber = this.willBuyFoods.length;
      }
      this.isFoodShowAll = !this.isFoodShowAll;
    },
    // 外卖选择送出时间
    wmChangeTime (e) {
      this.wmTime = e.target.value;
      console.log(e);
    },
    // 点击 tabs 按钮
    changeNav (e) {
      let index = e.currentTarget.dataset.index;
      index = parseInt(index, 10);
      this.swiperIndex = index;
      this.takeoutType = (index + 1) + "";
    },
    // 滑动切换swiper
    swiperChange (e) {
      let index = e.target.current;
      index = parseInt(index, 10);
      this.swiperIndex = index;
      this.orderIsClickPay = false;
      this.takeoutType = (index + 1) + "";
    },
    // 优惠券
    linkToPromotions () {
      this.globalData.onlySeePromotions = false;
      this.globalData.goods_total_price = this.goodsTotalPrice;
      const url = "../promotions/main";
      mpvue.navigateTo({ url });
    },
    // 备注
    linkToRemark () {
      const url = "../remark/main";
      mpvue.navigateTo({ url });
    },
    // 选择地址
    linkToAddress () {
      this.globalData.isChoiceAddress = true;
      const url = "../myAddress/main";
      mpvue.navigateTo({ url });
    },
    // 去支付
    linkToCompleteOrder () {
      if (!this.orderIsClickPay) {
        this.requestOrdersCreated();
        this.orderIsClickPay = true;
      }
    },
    // 添加地址
    linkToAddAddress () {
      this.takeoutAddressInfo = null;
      this.globalData.isEditorAddress = false;
      // 清空 addressInfo
      this.globalData.addressInfo = null;
      const url = "../addAddress/main";
      mpvue.navigateTo({ url });
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.confirm-order {
  .content {
    padding: 28rpx 12rpx $scss_btn-pay-height + 60rpx;
    .nav-wrapper {
      .nav {
        display: flex;
        text-align: center;
        div {
          width: 50%;
          font-size: 32rpx;
          color: #000;
          line-height: 82rpx;
          border-top-left-radius: 10rpx;
          border-top-right-radius: 10rpx;
          transition: all 0.3s;
          &.active {
            background-color: #fff;
            font-weight: 700;
          }
        }
      }
    }
    .swiper {
      height: 270rpx;
      margin-bottom: 20rpx;
      .swiper-item {
        width: 100%;
        .wrapper {
          background-color: #fff;
          border-bottom-right-radius: 10rpx;
          border-bottom-left-radius: 10rpx;
          padding: 0 40rpx;
          margin-bottom: 20rpx;
          overflow: hidden;
          .address-wrapper {
            border-bottom: 2rpx solid #eee;
            font-size: 26rpx;
            color: #000;
            min-height: 156rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              display: flex;
              flex-wrap: wrap;
              .address {
                display: flex;
                align-items: center;
                margin-bottom: 10rpx;
                p {
                  font-weight: 700;
                  font-size: 32rpx;
                  line-height: 40rpx;
                }
              }
              .name-gender-phone {
                width: 100%;
                display: flex;
                align-items: center;
                p {
                  font-size: 26rpx;
                  line-height: 1;
                  &:last-child {
                    margin-left: 50rpx;
                    margin-right: 0;
                  }
                  &:first-child {
                    margin-right: 20rpx;
                    margin-left: 0;
                  }
                }
              }
            }
            .right {
              color: #b2b2b2;
              margin-left: 10rpx;
            }
          }
        }
        .picker-wrapper {
          width: 100%;
          font-size: 30rpx;
          color: #000;
          line-height: 1;
          position: relative;
          .picker {
            width: 100%;
            height: 116rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left {
              display: flex;
              p {
                line-height: 116rpx;
                color: #08d4e4;
                &:first-child {
                  margin-right: 8rpx;
                  color: #000;
                }
              }
              input {
                color: #08d4e4;
                padding: 0;
                margin-top: -10rpx;
                border: 0;
              }
            }
            .right {
              color: #b2b2b2;
            }
          }
        }
        .two-item {
          display: flex;
          .picker-wrapper {
            width: 50%;
            .picker {
              .left {
                flex-wrap: wrap;
                p {
                  line-height: 1;
                  min-width: 51%;
                  &:first-child {
                    margin-bottom: 10rpx;
                  }
                }
              }
            }
            &:last-child {
              padding-left: 28rpx;
            }
          }
        }
      }
    }
  }
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
</style>
