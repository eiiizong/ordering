<template>
  <!-- 我的 页面 -->
  <div class="home"
       :style="{position: isFixed?'fixed':'static'}">
    <!-- 选择店铺 -->
    <div class="choice-store"
         @click="clickLinkToChoiceStore">
      <img :src="shopInfo.image"
           alt="">
      <div class="shop-name">
        <span>{{shopInfo.shop_name}}</span>
        <i class="iconfont icon-drop-down"
           v-if="isManyStores"></i>
      </div>
    </div>
    <!-- 滚动区域 -->
    <div class="scroll-wrapper">
      <scroll-view class="scroll-view"
                   scroll-y>
        <div class="top-banner">
          <div class="content">
            <swiper class="swiper"
                    interval="3000"
                    duration="500"
                    indicator-color="#d5d5d5"
                    indicator-active-color="#fa7570"
                    easing-function="default"
                    circular
                    indicator-dots
                    v-if="shops.adList"
                    autoplay>
              <block v-for="(item, index) in shops.adList"
                     :key="item.id">
                <swiper-item class="swiper-item">
                  <div class="link"
                       @click="clickBannerToWebView(index)">
                    <img :src="item.thumb" />
                  </div>
                </swiper-item>
              </block>
            </swiper>
          </div>
        </div>
        <!-- 如果是扫码点餐之后才显示 也许是下单之后再显示-->
        <div class="nav-after-ordering"
             v-if="indexOrderType==='scan'">
          <div class="item">
            <div class="link"
                 @click="clickLinkToAddFood">
              <img src="/static/images/home/add-food.jpg"
                   alt="">
              <div class="content">
                <i class="icon icon-add-food"></i>
                <p>加菜</p>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="link"
                 @click="clickLinkToPay">
              <img src="/static/images/home/pay.jpg"
                   alt="">
              <div class="content">
                <i class="icon icon-pay"></i>
                <p>买单</p>
              </div>
            </div>
          </div>
        </div>

        <div class="nav">
          <div class="item">
            <div class="link"
                 @click="clickLinkToScanOrder">
              <div class="content">
                <img class="img-scan-order"
                     src="/static/images/home/code-order.png"
                     alt="">
                <p>扫码点餐</p>
                <span>扫码自助点餐</span>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="link"
                 @click="clickLinkToTakeOutOrder">
              <div class="content">
                <img class="img-take-out"
                     src="/static/images/home/take-out.png"
                     alt="">
                <p>外卖</p>
                <span>足不出户享受美食</span>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="link"
                 @click="clickLinkToRowNumber">
              <div class="content">
                <img class="img-row-number"
                     src="/static/images/home/row-number.png"
                     alt="">
                <p>排号</p>
                <span v-if="userIsQueued">您已经排号，立即点餐</span>
                <span v-else>您当前没有排号哦</span>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="link"
                 @click="clickLinkToAppointment">
              <div class="content">
                <img class="img-appointment"
                     src="/static/images/home/appointment.png"
                     alt="">
                <p>预约</p>
                <span v-if="bookingNum>0">您已经预约，立即点餐</span>
                <span v-else>您当前有暂无预约</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 推荐菜系 -->
        <div class="recommend"
             :class="newsList.length>0?'':'space-bottom'"
             v-if="shopInfo">
          <div class="title">
            <p>推荐菜系</p>
          </div>
          <div class="scroll-wrapper">
            <scroll-view scroll-x
                         class="scorll-view">
              <block v-for="(item, index) in shopInfo.recommendFoods"
                     :key="item.id">
                <div class="item"
                     @click="clickViewFoodImg(index)">
                  <img :src="item.img"
                       alt="">
                  <div class="name">{{item.goods_name}}</div>
                  <div class="sale">月售{{item.sale}}份</div>
                </div>
              </block>
            </scroll-view>
          </div>
        </div>
        <!-- 店铺八卦 -->
        <div class="news"
             v-if="newsList.length>0">
          <div class="title">
            <p>饭店八卦</p>
          </div>
          <div class="scroll-wrapper">
            <scroll-view scroll-x
                         class="scorll-view">
              <block v-for="(item, index) in newsList"
                     :key="index">
                <div class="item"
                     @click="viewStoreNewDetail(index)">
                  <div class="img-wrapper">
                    <img :src="item.thumb"
                         alt="">
                  </div>
                  <div class="name">{{item.title}}</div>
                </div>
              </block>
            </scroll-view>
          </div>
        </div>
      </scroll-view>
    </div>

    <!-- 授权登录弹窗 -->
    <div class="popup-accredit popup-wrapper"
         v-if="isShowAccreditPopup">
      <div class="popup">
        <div class="content">
          <img src="/static/images/bind-login.png"
               alt="">
          <p>请先授权登录</p>
          <div class="btn-wrapper"
               v-if="deviceType==='wx'">
            <btn value="授权登录"
                 @getuserinfo="bindGetUserInfo"
                 open-type="getUserInfo"></btn>
          </div>
          <div class="btn-wrapper"
               v-else>
            <btn value="授权登录"
                 @click="clickAliLogin"></btn>
          </div>
        </div>
      </div>
      <div class="popup-mask"></div>
    </div>
    <!-- 绑定电话号码弹窗 -->
    <div class="popup-bind-tel popup-wrapper"
         v-if="isShowBindTelPopup">
      <div class="popup">
        <div class="content">
          <BindPhoneNumber @inputTel="inputTel"
                           @inputCode="inputCode"
                           :valueTel="userInfo.phone"
                           :valueCode="userInfo.verificationCode"
                           @clickGetCode="clickGetCode"
                           @getphonenumber="getphonenumber"
                           :getCodeBtnText="getCodeBtnText"
                           :getCodeBtnIsDisabled="getCodeBtnIsDisabled"
                           @clickCloseBindPhoneNumber="handleBindTelPopup"
                           :disabled="bindPhoneNumberBtnDisabled"
                           @clickBindPhoneNumberBtn="clickBindPhoneNumberBtn"></BindPhoneNumber>
        </div>
      </div>
      <div class="popup-mask"></div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import Btn from "@/components/btn/btn";
import BindPhoneNumber from "@/components/bind-phone-number/bind-phone-number";
import Utils from "../../utils/utils.js";

export default {
  data () {
    return {
      // 控制页面固定定位 防止滚动
      isFixed: false,
      // 控制授权登录弹窗
      isShowAccreditPopup: false,
      // 控制绑定电话号码弹窗弹窗
      isShowBindTelPopup: false,
      // 点餐类型 默认为外卖
      orderType: "",
      // 首页点餐类型 控制点餐是否是为扫码点餐 scan
      indexOrderType: "",
      // 用户信息
      userInfo: {},
      // 店铺
      shops: {
        shopList: [
          {
            "id": 1,
            "shop_name": "洋富柜儿",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
            "phone": "13401020304",
            "shop_address": "地址",
            "long": "68.4761132",
            "lat": "19.3627613",
            "setting": {
              "postprandial_settlement": "0",
              "queue_state": "1",
              "queue_postpone_number": 54,
              "takeout_state": "0",
              "booking_state": "1",
              "takeout_auto_receipt": "0"
            },
            "recommendFoods": [
              {
                "id": 1,
                "goods_name": "菜品1",
                "img": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
                "desc": "",
                "sale": "327"
              },
              {
                "id": 2,
                "goods_name": "菜品1",
                "img": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
                "desc": "",
                "sale": "531"
              },
              {
                "id": 3,
                "goods_name": "菜品1",
                "img": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
                "desc": "",
                "sale": "951"
              },
              {
                "id": 4,
                "goods_name": "菜品1",
                "img": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
                "desc": "",
                "sale": "62"
              },
              {
                "id": 5,
                "goods_name": "菜品1",
                "img": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
                "desc": "",
                "sale": "56"
              },
              {
                "id": 6,
                "goods_name": "菜品1",
                "img": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
                "desc": "",
                "sale": "85"
              }
            ],
            "deskList": [
              {
                "id": "2",
                "shop_id": 1,
                "alias": "桌位别名",
                "number": 2
              }
            ]
          }
        ]
      },
      newsList: [],
      shopList: [],
      // 店铺具体详情
      shopInfo: {},
      // 店铺 index
      index: 0,
      // 用户是否已经授权获取用户信息
      canGetUserInfo: false,
      getCodeBtnText: "获取验证码",
      bindPhoneNumberBtnDisabled: true,
      getCodeBtnIsDisabled: false,
      // 验证码
      passCode: "",
      // 是否多店铺
      isManyStores: false,
      // 扫码进入时的店铺id和座位ID
      scanShopId: "",
      scanDeskId: "",
      // 设备类型
      deviceType: "",
      // 店铺 id
      shopId: "",
      // 我的有效预约数量
      bookingNum: 0,
      // 用户是否已经排号
      userIsQueued: false,
      // 菜品列表
      categoryList: [],
      // 扫码 类型 排队 queue 分享 share
      scanType: "",
      // 小程序是否是扫码进入
      isScanEnter: false
    };
  },
  components: {
    TopNav,
    Btn,
    BindPhoneNumber
  },
  // 页面加载进来的参数
  onLoad (options) {
    console.log("******************************************************************************************************************onLoad**********************");
    console.log("扫码二维码进入小程序 携带参数=>", options);
    // 如果 options 不为 {}
    if (options) {
      this.shopId = parseInt(options.s, 10);
      this.scanType = options.t;
      this.scanShopId = this.shopId;
      this.scanDeskId = options.d;
      // 扫码进入 点餐
      if (options.d && options.s) {
        this.isScanEnter = true;
        this.orderType = "scan";
      }
      // 扫码进入 排队
      if (options.t === "queue" && options.s) {
        this.isScanEnter = true;
      }

      this.globalData.shopId = this.scanShopId;
      this.globalData.deskId = this.scanDeskId;
      this.globalData.order_type = this.orderType;
    }
  },
  beforeCreate () {
    console.log("******************************************************************************************************************beforeCreate**********************");
  },
  created () {
    console.log("******************************************************************************************************************created**********************");
  },
  activated () {
    console.log("******************************************************************************************************************activated**********************");
  },
  deactivated () {
    console.log("******************************************************************************************************************deactivated**********************");
  },
  beforeDestroy () {
    console.log("******************************************************************************************************************beforeDestroy**********************");
  },
  destroyed () {
    console.log("******************************************************************************************************************destroyed**********************");
  },
  // 页面显示
  onShow () {
    console.log("******************************************************************************************************************onShow**********************");
    this.initInfo();
  },
  onReady () {
    console.log("******************************************************************************************************************onReady**********************");
  },
  onUnload () {
    console.log("******************************************************************************************************************onUnload**********************");
  },
  onPageScroll () {
    console.log("******************************************************************************************************************onPageScroll**********************");
  },
  // 页面隐藏
  onHide () {
    console.log("******************************************************************************************************************onHide**********************");
    Utils.saveDataToLocalStorage(Utils.SHOPID, this.shopId);
  },
  beforeMount () {
    console.log("******************************************************************************************************************beforeMount**********************");
  },
  mounted () {
    console.log("******************************************************************************************************************mounted**********************");
    // 获取设备类型 => 获取店铺信息 => 登录
    this.getDeviceType();

    if (mpvuePlatform === "wx") {
      // 检测用户是否授权获取用户信息 主要用于判断用户是否已经授权登录 => 注册
      this.getSetting();

      mpvue.showShareMenu({
        withShareTicket: true
      });
    }
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;

      this.shopId = globalData.shopId;

      const orderType = globalData.order_type;

      this.orderType = orderType;

      if (globalData.shopInfo) {
        this.shopInfo = globalData.shopInfo;
      }

      // 如果存在 orderType
      if (orderType) {
        if (orderType === "scan") {
          globalData.changeCategoryList = data => {
            console.log("接收到点餐页推送过来的数据 => ", data);
            this.updateBarBadge(data);
          };
          if (globalData.SocketTask) {
            globalData.SocketTaskSendGetAllFoods(globalData.SocketTask, this);
          }
        } else {
          this.initCategoryList(orderType);
        }
      }

      // 更新我的预约总数 排号信息
      if (globalData.userInfo && globalData.userInfo.access_token) {
        let accessToken = globalData.userInfo.access_token;
        let shopId = globalData.shopId;
        if (accessToken) {
          this.requestBookingMyList(accessToken);
          this.requestShopQueuesInfo(accessToken, shopId);
        }
      }

      console.log("this.globalData =>", globalData);
    },
    // 获取手机号
    getphonenumber (e) {
      console.log("获取手机号结果 =>", e);
    },
    // 点餐类型非扫码点餐执行 获取global对象上的 categoryList 用于更新购物车barBadge
    initCategoryList (orderType) {
      const _this = this;
      const func = (key) => {
        const result = _this.globalData[key];
        if (result) {
          _this.categoryList = result;
          _this.updateBarBadge(result);
        }
      };
      Utils.operatingData(orderType, "c", func);
    },
    // 检测店铺是否是多店铺
    initIsManyStores (data) {
      this.isManyStores = false;
      if (data.length > 1) {
        this.isManyStores = true;
      }
    },
    // 登录 获取code 用于请求数据
    login () {
      const _this = this;
      if (mpvuePlatform === "wx") {
        Utils.login().then(result => {
          console.log(result);
          this.requestLogin(result.code);
        }).catch(err => {
          console.log("mpvue.login 登录失败! => ", err);
        });
      } else if (mpvuePlatform === "my") {
        mpvue.getAuthCode({
          scopes: ["auth_user"],
          success (res) {
            console.log("获取到的授权码 => ", res);
            _this.isFixed = true;
            _this.isShowAccreditPopup = false;
            _this.isShowBindTelPopup = false;
            _this.canGetUserInfo = true;
            _this.getUserInfo();
            // 请求服务器 检测用户是否注册
            _this.requestLogin(res.authCode);
          },
          fail (err) {
            // 用户拒绝授权
            _this.isFixed = true;
            _this.isShowAccreditPopup = true;
            _this.isShowBindTelPopup = false;
            _this.canGetUserInfo = true;
            console.log(err);
          }
        });
      }
    },
    // alipay 授权登录
    clickAliLogin () {
      this.login();
    },
    // 检测用户是否已经同意授权使用用户信息 同时标记
    getSetting () {
      const _this = this;
      if (mpvuePlatform === "wx") {
        Utils.getSetting("scope.userInfo").then(result => {
          console.log("用户信息 => 已授权", result);
          _this.canGetUserInfo = true;
          _this.getUserInfo();
        }).catch(err => {
          console.log("用户信息 => 未授权", err);
          _this.canGetUserInfo = false;
        });
      } else if (mpvuePlatform === "my") {
        Utils.getSetting("userInfo").then(result => {
          _this.canGetUserInfo = true;
          console.log("用户信息 => 已授权", result);
        }).catch(err => {
          console.log("用户信息 => 未授权", err);
          _this.canGetUserInfo = false;
        });
      }
    },
    // 支付宝获取用户信息
    getUserInfo () {
      Utils.getUserInfo().then(result => {
        console.log("用户信息 => ", result);
        if (mpvuePlatform === "wx") {
          this.userInfo = {
            ...this.userInfo,
            ...result.userInfo
          };
        } else if (mpvuePlatform === "my") {
          this.userInfo = {
            ...this.userInfo,
            ...result
          };
        }
        this.globalData.userInfo = this.userInfo;
      }).catch(err => {
        this.isShowAccreditPopup = true;
        console.log("获取用户信息失败", err);
      });
    },
    // 用户授权时点击的确定取消按钮执行的事件
    bindGetUserInfo (e) {
      if (e.target.rawData) {
        console.log("===========用户同意授权登录=====", e);
        this.userInfo = {
          ...this.userInfo,
          ...e.target.userInfo
        };
        this.isShowAccreditPopup = false;
        this.isShowBindTelPopup = true;
        this.globalData.userInfo = this.userInfo;
      } else {
        console.log("==============用户拒绝授权登录=======");
      }
    },
    // 获取设备类型
    getDeviceType () {
      let deviceType = "";
      if (mpvuePlatform === "wx") {
        deviceType = "wechat";
      } else if (mpvuePlatform === "my") {
        deviceType = "alipay";
      }
      // 将device_type的值保存在全部globalData中
      this.deviceType = deviceType;
      this.globalData.device_type = deviceType;
      this.requestShopsData(deviceType);
    },
    // 控制绑定电话号码是否可用
    handleBindPhoneNumberBtnDisabled () {
      if (!this.userInfo.phone) {
        this.bindPhoneNumberBtnDisabled = true;
      } else if (!this.userInfo.verificationCode) {
        this.bindPhoneNumberBtnDisabled = true;
      } else {
        this.bindPhoneNumberBtnDisabled = false;
      }
    },
    // 根据code登录
    requestLogin (code) {
      const url = "login";
      const methods = "POST";
      const data = {};
      const header = {
        "code": code,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        let resultData = result.data;

        if (!resultData.access_token) {
          console.log("================用户未注册================");
          this.isFixed = true;
          if (this.canGetUserInfo) {
            console.log("================用户未注册 但已授权使用用户信息================");
            this.isShowAccreditPopup = false;
            this.isShowBindTelPopup = true;
          } else {
            console.log("================用户未注册 同时未授权使用用户信息================");
            this.isShowAccreditPopup = true;
            this.isShowBindTelPopup = false;
          }
          this.userInfo = {
            ...this.userInfo,
            ...resultData
          };
        } else {
          console.log("================用户已经注册================");
          // 关闭弹框
          this.isFixed = false;
          this.isShowAccreditPopup = false;
          this.isShowBindTelPopup = false;

          this.userInfo = resultData;
          this.globalData.userInfo = resultData;
          // 我的预约
          this.requestBookingMyList(resultData.access_token);
          // 我的排号
          this.requestShopQueuesInfo(resultData.access_token, this.shopId);

          if (this.scanDeskId && this.scanShopId) {
            const url = "../ordering/main";
            mpvue.navigateTo({ url });
          }
          if (this.scanType && this.scanType === "queue") {
            const url = "../rowNumber/main";
            mpvue.navigateTo({ url });
          }
        }
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 获取所有店铺信息
    requestShopsData (deviceType) {
      const url = "shops";
      const methods = "POST";
      const data = {};
      const header = {
        "device-type": deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log("发起获取" + url + "数据请求 成功 => 返回的结果：", result);
        const resultData = result.data;

        this.shops = resultData;
        this.newsList = resultData.newsList;
        this.shopList = resultData.shopList;

        // 扫码进入
        if (this.isScanEnter) {
          resultData.shopList.forEach(item => {
            // shopId 为 number 类型
            if (item.id === this.scanShopId) {
              this.shopInfo = item;
              this.globalData.shopInfo = item;
              this.shopId = item.id;
              this.globalData.shopId = item.id;
            }
          });
        } else {
          // 不是扫码进入
          // 店铺id默认取第一个
          Utils.getDataToLocalStorage(Utils.SHOPID).then(result => {
            resultData.shopList.forEach(item => {
              // shopId 为 number 类型
              if (item.id === result) {
                this.shopInfo = item;
                this.globalData.shopInfo = item;
                this.shopId = item.id;
                this.globalData.shopId = item.id;
              }
            });
          }).catch(err => {
            this.shopInfo = resultData.shopList[0];
            this.shopId = this.shopInfo.id;
            this.globalData.shopId = this.shopId;
            this.globalData.shopInfo = this.shopInfo;
            console.log(err);
          });
        }
        this.globalData.shopList = resultData.shopList;

        this.initIsManyStores(resultData.shopList);

        // 登录
        this.login();
      }).catch(err => {
        console.log("发起获取" + url + "数据请求 失败 => 返回的结果：", err);
      });
    },
    // 请求我的预约 针对全部店铺
    requestBookingMyList (accessToken) {
      const url = "user/center";
      const methods = "POST";
      const data = {};
      const header = {
        "access-token": accessToken,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        this.bookingNum = result.data.booking_wait_num;
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 获取店铺排队信息
    requestShopQueuesInfo (accessToken, shopId) {
      const url = "queues";
      const methods = "POST";
      const data = {
        "shop_id": shopId
      };
      const header = {
        "access-token": accessToken,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        const resultData = result.data;
        this.userIsQueued = false;
        resultData.some(item => {
          if (item.myQueue.id) {
            this.userIsQueued = true;
            return true;
          }
        });
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 获取验证码请求
    requestGetPassCode () {
      const url = "verification/send/register";
      const methods = "POST";
      const data = {
        "phone": this.userInfo.phone
      };
      const header = {
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 注册请求
    requestSign () {
      const url = "register";
      const methods = "POST";
      const userInfo = this.userInfo;
      let data = {
        "phone": userInfo.phone,
        "verificationCode": userInfo.verificationCode,
        "username": userInfo.nickName,
        "avatar": userInfo.avatarUrl
      };
      if (mpvuePlatform === "my") {
        data = {
          ...data,
          "avatar": userInfo.avatar
        };
      }
      const header = {
        "open-id": userInfo.open_id,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        const resultData = result.data;
        this.userInfo = resultData;
        this.globalData.userInfo = resultData;
        // 关闭弹窗
        this.isShowBindTelPopup = false;
        this.isFixed = false;
        // 如果是扫码进入直接跳转页面
        if (this.scanDeskId && this.scanShopId) {
          const url = "../ordering/main";
          mpvue.navigateTo({ url });
        }
        // 排号
        if (this.scanType && this.scanType === "queue") {
          const url = "../rowNumber/main";
          mpvue.navigateTo({ url });
        }
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
        Utils.showToast(err.msg);
      });
    },
    // 输入电话号码时执行的事件
    inputTel (e) {
      console.log(this.userInfo);
      let length = e.target.cursor;
      let phone = e.target.value;
      if (length === 11) {
        mpvue.hideKeyboard();
      }
      this.userInfo.phone = phone;
      // 检测绑定电话号码是否可用
      this.handleBindPhoneNumberBtnDisabled();
    },
    // 输入验证码时执行的事件
    inputCode (e) {
      this.userInfo.verificationCode = e.target.value;
      // 检测绑定电话号码是否可用
      this.handleBindPhoneNumberBtnDisabled();
    },
    // 点击查看图片大图 推荐菜品
    clickViewFoodImg (index) {
      const data = this.shopInfo.recommendFoods;
      let urls = [];
      data.forEach((item, index) => {
        urls[index] = item.img;
      });
      mpvue.previewImage({
        current: urls[index], // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      });
    },
    // 获取验证码
    clickGetCode () {
      const _this = this;
      const telIsOK = /^1(3|4|5|7|8)\d{9}$/.test(_this.userInfo.phone);
      let timer;
      let num = 60;
      if (telIsOK) {
        console.log("手机号输入正确");
        _this.getCodeBtnIsDisabled = true;
        timer = setInterval(() => {
          num--;
          _this.getCodeBtnText = "(" + num + "s)后重试";
          if (num === 1) {
            clearInterval(timer);
            _this.getCodeBtnIsDisabled = false;
            _this.getCodeBtnText = "获取验证码";
          }
        }, 1000);
        // 请求数据
        _this.requestGetPassCode();
      } else {
        Utils.showToast("请输入正确的手机号码");
      }
    },
    // 绑定电话号码按钮
    clickBindPhoneNumberBtn () {
      if (this.userInfo.verificationCode) {
        // 注册
        this.requestSign();
      } else {
        Utils.showToast("验证码为空，请重新输入");
      }
    },
    // 加菜
    clickLinkToAddFood () {
      // 如何还未登录则返回
      const accessToken = this.userInfo.access_token;
      if (!accessToken) {
        return false;
      }
      const url = "../ordering/main";
      mpvue.navigateTo({ url });
    },
    // 买单
    clickLinkToPay () {
      // 如何还未登录则返回
      const accessToken = this.userInfo.access_token;
      if (!accessToken) {
        return false;
      }
      const url = "../completeOrder/main";
      mpvue.navigateTo({ url });
    },
    // url 中获取参数
    getUrlParameter (url) {
      let urlSearch = url.split("?");
      let params = urlSearch[1].split("&");
      let obj = {};
      let len = params.length;
      for (let i = 0; i < len; i++) {
        let item = params[i];
        let valus = item.split("=");
        obj[valus[0]] = valus[1];
      }
      return obj;
    },
    // 扫码点餐
    clickLinkToScanOrder () {
      // 如何还未登录则返回
      const accessToken = this.userInfo.access_token;
      if (!accessToken) {
        return false;
      }
      const _this = this;
      if (mpvuePlatform === "wx") {
        mpvue.scanCode({
          onlyFromCamera: true,
          success: (res) => {
            console.log("扫码二维码结果...=> ", res);
            const path = res.path;
            if (path) {
              let params = _this.getUrlParameter(path);
              if (params.d && params.s) {
                _this.globalData.deskId = params.d;
                _this.globalData.shopId = params.s;
                _this.shopId = params.s;
                _this.shopList.some(item => {
                  if (params.s === item.id.toString()) {
                    _this.shopInfo = item;
                    _this.shopId = params.s;
                    _this.globalData.shopInfo = item;
                    return true;
                  }
                });
                _this.categoryList = null;
                _this.globalData.order_type = "scan";
                const url = "../ordering/main";
                mpvue.navigateTo({ url });
              }
            } else {
              Utils.showToast("请扫码正确的二维码");
            }
          }
        });
      } else if (mpvuePlatform === "my") {
        mpvue.scan({
          type: "qr",
          hideAlbum: true,
          success: (res) => {
            console.log("扫码二维码结果...=> ", res);
            const path = res.path;
            if (path) {
              let params = _this.getUrlParameter(path);
              if (params.d && params.s) {
                _this.globalData.deskId = params.d;
                _this.globalData.shopId = params.s;
                _this.shopId = params.s;
                _this.shopList.some(item => {
                  if (params.s === item.id.toString()) {
                    _this.shopInfo = item;
                    _this.shopId = params.s;
                    _this.globalData.shopInfo = item;
                    return true;
                  }
                });
                _this.categoryList = null;
                _this.globalData.order_type = "scan";
                const url = "../ordering/main";
                mpvue.navigateTo({ url });
              }
            } else {
              Utils.showToast("请扫码正确的二维码");
            }
          }
        });
      }
    },
    // 外卖
    clickLinkToTakeOutOrder () {
      // 如何还未登录则返回
      const accessToken = this.userInfo.access_token;
      if (!accessToken) {
        return false;
      }
      const setting = this.shopInfo.setting;
      // queue_state takeout_state booking_state
      if (setting.takeout_state === "1") {
        // 关闭 socket
        const globalData = this.globalData;
        if (globalData.socketIsOpen) {
          globalData.SocketTaskClose(globalData.SocketTask, this);
        }
        const url = "../ordering/main";
        this.globalData.order_type = "takeout";
        mpvue.navigateTo({ url });
      } else {
        Utils.showToast("该店铺暂未开启外卖功能");
      }
    },
    // 排号
    clickLinkToRowNumber () {
      // 如何还未登录则返回
      const accessToken = this.userInfo.access_token;
      if (!accessToken) {
        return false;
      }
      const setting = this.shopInfo.setting;
      // queue_state takeout_state booking_state
      if (setting.queue_state === "1") {
        const url = "../rowNumber/main";
        mpvue.navigateTo({ url });
      } else {
        Utils.showToast("该店铺暂未开启排号功能");
      }
    },
    // 预约
    clickLinkToAppointment () {
      // 如何还未登录则返回
      const accessToken = this.userInfo.access_token;
      if (!accessToken) {
        return false;
      }
      const setting = this.shopInfo.setting;
      // queue_state takeout_state booking_state
      if (setting.booking_state === "1") {
        const url = "../myAppointment/main";
        mpvue.navigateTo({ url });
      } else {
        Utils.showToast("该店铺暂未开启预约功能");
      }
    },
    // 选择店铺
    clickLinkToChoiceStore () {
      if (this.isManyStores) {
        const url = "../choiceStore/main";
        mpvue.navigateTo({ url });
      }
    },
    // banner webview
    clickBannerToWebView (index) {
      const adItem = this.shops.adList[index];
      if (!adItem.url) {
        return false;
      } else {
        const url = `../webView/main?name=${adItem.name}&url=${adItem.url}`;
        mpvue.navigateTo({ url });
      }
    },
    // 店铺新闻详情
    viewStoreNewDetail (index) {
      const data = this.newsList[index];
      if (!data.uri) {
        return false;
      } else {
        const url = `../webView/main?name=${data.title}&url=${data.uri}`;
        mpvue.navigateTo({ url });
      }
    },
    // 更新购物车数量
    updateBarBadge (data) {
      Utils.updateShopingCarBarBadge(data);
    }
  },
  // 分享
  onShareAppMessage (e) {
    const shopId = this.shopId;
    if (mpvuePlatform === "wx") {
      return {
        title: "舌尖上的美味，来自灵魂深处的颤抖...",
        path: `/pages/index/main?s=${shopId}&t=share`,
        imageUrl: "/static/images/share.jpg"
      };
    } else if (mpvuePlatform === "my") {
      return {
        title: "舌尖上的美味，来自灵魂深处的颤抖...",
        path: `/pages/index/main?s=${shopId}&t=share`,
        imageUrl: "/static/images/share.jpg"
      };
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../static/styles/scss/variable";
.home {
  width: 100%;
  height: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .choice-store {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
    padding: 10rpx $scss_padding-LR;
    background-color: $scss_theme-color;
    img {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    .shop-name {
      display: flex;
      align-items: center;
      font-size: 36rpx;
      font-weight: 700;
      line-height: 1;
      color: #fff;
    }
  }
  .scroll-wrapper {
    flex: 1;
    overflow: hidden;
    .scroll-view {
      height: 100%;
    }
  }
  .top-banner {
    height: 250rpx;
    background-color: $scss_theme-color;
    position: relative;
    margin-bottom: 124rpx;
    .content {
      position: absolute;
      width: 100%;
      top: 14rpx;
      left: 0;
      display: flex;
      align-items: center;
      color: #fff;
      height: 310rpx;
    }
    .swiper {
      width: 100%;
      height: 100%;
    }
    .link {
      width: 100%;
      height: 100%;
      padding: 0 $scss_padding-LR;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
  }
  .nav-after-ordering {
    padding: 0 $scss_padding-LR;
    display: flex;
    justify-content: space-between;
    margin-bottom: 24rpx;
    .item {
      width: 330rpx;
      height: 140rpx;
    }
    .link {
      width: 100%;
      height: 100%;
      position: relative;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 10rpx;
    }
    .content {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 34rpx;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    p {
      margin-left: 8rpx;
    }
  }
  .nav {
    padding: 0 $scss_padding-LR;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: 330rpx;
      height: 260rpx;
      background-color: #fff;
      border-radius: 10rpx;
      margin-bottom: 24rpx;
    }
    .link {
      width: 100%;
      height: 100%;
      display: flex;
    }
    .content {
      margin: auto;
      font-size: 0;
    }
    img {
      &.img-scan-order {
        width: 102rpx;
        height: 92rpx;
      }
      &.img-take-out {
        width: 120rpx;
        // height: 86rpx;
        height: 92rpx;
        padding-top: 6rpx;
      }
      &.img-row-number {
        // height: 98rpx;
        height: 100rpx;
        width: 100rpx;
        padding-top: 2rpx;
      }
      &.img-appointment {
        height: 100rpx;
        width: 108rpx;
      }
    }
    p {
      width: 100%;
      font-size: 34rpx;
      font-weight: 700;
      line-height: 1;
      color: #010101;
      padding: 20rpx 0 14rpx;
    }
    span {
      width: 100%;
      font-size: 24rpx;
      line-height: 1;
      color: #949494;
    }
  }
  .title {
    padding: 0 $scss_padding-LR;
    p {
      position: relative;
      height: 36rpx;
      font-size: 36rpx;
      font-weight: 600;
      color: #000;
      line-height: 1;
      padding-left: 20rpx;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 4rpx;
        height: 100%;
        background-color: $scss_theme-color;
      }
    }
  }
  .scroll-wrapper {
    width: 100%;
    .scorll-view {
      min-width: 100%;
      height: 264rpx;
      white-space: nowrap;
      .item {
        display: inline-block;
        margin-right: 26rpx;
        font-size: 0;
        &:first-child {
          margin-left: $scss_padding-LR;
        }
        &:last-child {
          margin-right: $scss_padding-LR;
        }
      }
      img {
        width: 190rpx;
        height: 190rpx;
        border-radius: 4rpx;
      }
      .name {
        font-size: 32rpx;
        font-weight: 700;
        line-height: 1;
        color: #2a2a2a;
        padding: 8rpx 0 12rpx;
      }
      .sale {
        font-size: 20rpx;
        font-weight: normal;
        line-height: 1;
        color: #929292;
      }
    }
  }
  .recommend {
    width: 100%;
    padding-top: 26rpx;
    .title {
      padding-bottom: 44rpx;
    }
  }
  .news {
    padding: 40rpx 0;
    .title {
      padding-bottom: 28rpx;
    }
    .scroll-wrapper {
      .scorll-view {
        width: 100%;
        height: 280rpx;
        .item {
          background-color: #fff;
          border-radius: 10rpx;
        }
        .img-wrapper {
          img {
            width: 100%;
            height: 214rpx;
          }
        }
        .name {
          width: 100%;
          font-size: 30rpx;
          font-weight: 700;
          line-height: 66rpx;
          background-color: #fff;
          border-bottom-left-radius: 10rpx;
          border-bottom-right-radius: 10rpx;
          height: 66rpx;
          color: #2a2a2a;
          padding: 0 20rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .space-bottom {
    padding-bottom: 40rpx;
  }
}
.popup-accredit {
  .popup {
    padding: 0 75rpx;
    bottom: 50%;
    transform: translateY(50%);
    .content {
      background-color: #fff;
      border-radius: 20rpx;
      text-align: center;
      position: relative;
      img {
        position: absolute;
        top: -72rpx;
        width: 248rpx;
        height: 292rpx;
        left: 50%;
        margin-left: -124rpx;
      }
      p {
        padding-top: 218rpx;
        padding-bottom: 90rpx;
        font-size: 36rpx;
        color: #000;
        line-height: 1;
      }
      .btn-wrapper {
        padding: 0 64rpx 40rpx;
        height: 120rpx;
      }
    }
  }
}
.popup-bind-tel {
  .popup {
    padding: 0 75rpx;
    bottom: 50%;
    transform: translateY(50%);
  }
}
</style>
