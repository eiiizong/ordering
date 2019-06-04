<template>
  <!-- 主页 首页 -->
  <div class="ordering">
    <div class="top">
      <div class="card">
        <img :src="shopInfo.image"
             alt="">
        <div class="name">{{shopInfo.shop_name}}</div>
        <div class="notice">
          <DropDown :text="shopInfo.notice"
                    storeNotice
                    @click="handleNoticePopupShow"></DropDown>
        </div>
        <div class="full-reduction"
             @click="handleNoticePopupShow">
          <div class="info">
            <i class="icon">优惠</i>
            <block v-for="(item, index) in activityList"
                   :key="item.id">
              <span v-if="index<2">{{item.activity_name}}</span>
            </block>
          </div>
          <div class="drop-down-wrapper">
            <DropDown :text="`${activityList.length}个优惠`"></DropDown>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <Goods :goods="categoryList"
             @clickAddGoods="clickAddGoods"
             :deviceType="deviceType"
             @clickSubtractFoods="clickSubtractFoods"></Goods>
    </div>

    <Gopay @clickGoPay="clickToPlaceOrder"
           btnValue="去下单"
           hasShoppingCar
           :totalPrice="caclTotalPrice"
           @clickCar="handleSelectedFoodPopup"
           :shoppingCarNumber="caclShoppingCarTotalNum"
           :disabled="checkGoPayBtnDisabled"></Gopay>

    <!-- 公告 优惠 弹窗-->
    <div class="popup-wrapper popup-notice"
         v-if="isShowNoticePopup">
      <div class="popup">
        <div class="content">
          <div class="store-name">{{shopInfo.shop_name}}</div>
          <div class="discount-info">
            <h3>优惠信息</h3>
            <div class="item"
                 v-for="item in activityList"
                 :key="item.id">
              <i class="icon icon-subtract"></i>
              <p>{{item.content}}</p>
            </div>
          </div>
          <div class="store-notice">
            <h3>商家公告</h3>
            <p>{{shopInfo.notice}}</p>
          </div>
          <i class="icon icon-close-size"
             @click="handleNoticePopupShow"></i>
        </div>
      </div>
      <div class="popup-mask"></div>
    </div>

    <!-- 规格 弹窗 -->
    <div class="popup-wrapper popup-size"
         v-if="isShowSizePopup && currentSelectedFood">
      <div class="popup">
        <div class="content">
          <div class="food-name">
            <p>{{currentSelectedFood.goods_name}}</p>
            <i class="icon icon-close-size"
               @click="handleSizePopupShow"></i>
          </div>
          <div class="choice choice-size"
               v-if="currentSelectedFood.is_multiple_spec==='1'">
            <p>请选择规格</p>
            <div class="items">
              <div class="item"
                   :class="currentSelectedFoodSizeIndex === sizeIndex? 'active':''"
                   v-for="(sizeItem, sizeIndex) in currentSelectedFood.specs"
                   :data-index="sizeIndex"
                   @click="clickChoiceFoodSize"
                   :key="sizeIndex">{{sizeItem.spec_str}}</div>
            </div>
          </div>
          <div class="choice choice-like"
               v-if="currentSelectedFood.likes">
            <p>请选择偏好</p>
            <div class="items">
              <div class="item"
                   v-for="(likeItem, likeIndex) in currentSelectedFood.likes"
                   :key="likeIndex">{{likeItem.str}}</div>
            </div>
          </div>
          <div class="handle">
            <div>
              <span class="price">¥{{currentSelectedFoodSize.sell_price}}</span><span>{{currentSelectedFoodSize.spec_str}}</span><span v-if="currentSelectedFoodSize.like_str"
                    class="like-hint">{{currentSelectedFoodSize.like_str}}</span>
            </div>
            <div>
              <BtnCounter :currentOrderNum="currentSelectedFoodSize.goods_num"
                          @clickSubtract="clickChoiceSizePopupSubtractFood"
                          @clickAdd="clickChoiceSizePopupAddFood"></BtnCounter>
            </div>
          </div>
          <div class="btn-wrapper">
            <Btn value="确定"
                 @click="clickChioceFoodSizeOK"></Btn>
          </div>
        </div>
      </div>
      <div class="popup-mask"
           @click="handleSizePopupShow"></div>
    </div>

    <!-- 已选菜品 -->
    <div class="popup-wrapper popup-selected-food"
         v-if="isShowSelectedFoodPopup && shoppingCarTotalNum>0 && willBuyFoods.length>0">
      <div class="popup">
        <div class="content">
          <div class="tool-bar">
            <div>
              <span>已选商品({{shoppingCarTotalNum}})</span>
            </div>
            <div class="clear"
                 @click="clearShoppingCarAllFood">
              <i class="icon icon-clear-foods"></i>
              <p>清空</p>
            </div>
          </div>
          <scroll-view class="items"
                       scroll-y>
            <div class="item"
                 v-for="(item, index) in willBuyFoods"
                 :key="item.id">
              <div class="left">
                <div class="name">
                  <p>
                    <span>{{item.goods_name}}</span>
                    <span v-if="item.spec_str">（{{item.spec_str}}）</span>
                  </p>
                  <p v-if="item.like_str">{{item.like_str}}</p>
                </div>
                <div class="price">{{item.sell_price}}</div>
              </div>
              <div class="right">
                <BtnCounter :currentOrderNum="item.goods_num"
                            @clickAdd="clickFoodListAddFood(index)"
                            @clickSubtract="clickFoodListSubtractFood(index)"></BtnCounter>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="popup-mask"
           @click="handleSelectedFoodPopup"></div>
    </div>
  </div>
</template>

<script>
import Goods from "@/components/goods/goods";
import DropDown from "@/components/drop-down/drop-down";
import Gopay from "@/components/goPay/goPay";
import BtnCounter from "@/components/btnCounter/btnCounter";
import Btn from "@/components/btn/btn";

import Utils from "../../utils/utils.js";
import NP from "../../utils/number-precision.js";
export default {
  data () {
    return {
      // 控制店家公告优惠的弹窗是否显示
      isShowNoticePopup: false,
      // 控制商品的规格的弹窗是否显示
      isShowSizePopup: false,
      // 控制已选菜品弹窗是否显示
      isShowSelectedFoodPopup: false,
      // 去下单按钮能否使用
      goPayBtnDisabled: true,
      // 点餐类型
      orderType: "",
      // 当前点击加减按钮选中的商品
      currentSelectedFood: {},
      // 当前选择的规格
      currentSelectedFoodSize: {},
      // 规格大小 index
      currentSelectedFoodSizeIndex: 0,
      // 购物车数量
      shoppingCarTotalNum: 0,
      // 用户信息
      userInfo: {},
      // 店铺信息
      shopInfo: {},
      shopId: "",
      deviceType: "",
      // 将要购买的商品
      willBuyFoods: [],
      // 商品总价
      totalPrice: 0,
      // 商家信息
      businessInfo: {
        store_img: "https://wx.qlogo.cn/mmopen/vi_32/JJHquibNyibvoiao3Yx8yCLyjbdh9TBSSRzMn0wExdjyLCRdJib5Z8ibCzcVMyOUicB2AuD53BrNR8bO6dRibprVTcD0g/132",
        store_notice: "粥品香坊其烹饪粥料的秘方源于中国千年古法，在融和现代制作工艺，由世界烹饪大师屈浩先生领衔研发。坚守纯天然、0添加的良心品质深的消费者青睐，发展至今成为粥类引领品牌。是2008年奥运会和2013年园博会指定餐饮服务商11111111。",
        store_name: "蜀湘绝（春熙路店）",
        discount: [
          "22减6",
          "22减5",
          "22减4",
          "22减3"
        ]
      },
      // 菜品列表
      categoryList: [],
      // 活动列表
      activityList: [
        {
          // 活动 id
          "id": "",
          // 活动名
          "activity_name": "",
          // 活动描述
          "content": "",
          // 满
          "full_amount": "50.00",
          // 减
          "minus_amount": "5.00",
          // 折扣
          "discount": "5.00",
          // 菜品分类享有的优惠
          "category_ids": []
        }
      ],
      goodsList: {},
      socketIsOpen: false,
      socketMsgQueue: [],
      deskId: "",
      SocketTask: null,
      socketSessionId: ""
    };
  },
  components: {
    Goods,
    DropDown,
    Gopay,
    BtnCounter,
    Btn
  },
  onShow () {
    console.log("点餐页面显示........");
    this.initInfo();
  },
  mounted () {
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;
      this.orderType = globalData.order_type;
      this.userInfo = globalData.userInfo;
      this.shopInfo = globalData.shopInfo;
      this.deviceType = globalData.device_type;
      globalData.socketConnectTime = 0;

      // 如果店铺id不相同 => 请求数据
      if (this.shopId !== globalData.shopId) {
        globalData[Utils.SCANCATEGORYLIST] = null;
        globalData[Utils.BOOKINGCATEGORYLIST] = null;
        globalData[Utils.TAKEOUTCATEGORYLIST] = null;
        globalData[Utils.QUEUECATEGORYLIST] = null;
        this.willBuyFoods = [];
        this.requestCategoryList(globalData.shopId);
      } else {
        this.initCategoryList(this.goodsList.categoryList);
      }

      this.shopId = globalData.shopId;

      // Socket 连接
      if (this.orderType === "scan") {
        if (this.deskId !== globalData.deskId) {
          // 如果socket已打开 则关闭
          if (globalData.socketIsOpen) {
            let cb = (res) => {
              console.log("Socket 关闭成功 =>", res);
              this.deskId = globalData.deskId;
              // this.Socket();
            };
            globalData.SocketTaskClose(globalData.SocketTask, this, cb);
          } else {
            this.deskId = globalData.deskId;
            this.Socket();
          }
        } else {
          console.log("座位号相同, 拉取所有数据");
          this.globalData.SocketTaskSendGetAllFoods(this.globalData.SocketTask, this);
        }
      }

      console.log("this.globalData => ", this.globalData);
      console.log("this.orderType => ", this.orderType);
      console.log("this.userInfo => ", this.userInfo);
      console.log("this.shopInfo => ", this.shopInfo);
      console.log("this.shopId => ", this.shopId);
    },
    Socket () {
      // 连接 socket
      const globalData = this.globalData;

      globalData.SocketTaskConnect = this.SocketTaskConnect;
      globalData.SocketTaskOnOpen = this.SocketTaskOnOpen;
      globalData.SocketTaskOnClose = this.SocketTaskOnClose;
      globalData.SocketTaskOnMessage = this.SocketTaskOnMessage;
      globalData.SocketTaskOnError = this.SocketTaskOnError;
      globalData.SocketTaskClose = this.SocketTaskClose;
      globalData.SocketTaskSend = this.SocketTaskSend;
      globalData.SocketTaskSendGetAllFoods = this.SocketTaskSendGetAllFoods;
      globalData.SocketTaskSendClearAllFoods = this.SocketTaskSendClearAllFoods;

      // globalData.socketIsOpen = false;
      globalData.socketMsgQueue = [];

      // 如果 socket 没有连接
      if (!globalData.socketIsOpe) {
        globalData.SocketTask = globalData.SocketTaskConnect();
        globalData.SocketTaskOnOpen(globalData.SocketTask, this);
        globalData.SocketTaskOnMessage(globalData.SocketTask, this);
        globalData.SocketTaskOnError(globalData.SocketTask);
        globalData.SocketTaskOnClose(globalData.SocketTask, this);
      }
    },
    SocketTaskConnect () {
      console.log("==============正在连接 socket ====================");
      // const success = res => {
      //   console.log("connectSocket 接口调用成功 => ", res);
      // };
      // const fail = err => {
      //   console.log("connectSocket 接口调用失败 => ", err);
      // };
      const SocketTask = mpvue.connectSocket({
        url: "wss://www.yangfugui.com/info"
      });
      return SocketTask;
    },
    SocketTaskOnOpen (SocketTask, context) {
      if (mpvuePlatform === "wx") {
        SocketTask.onOpen((res) => {
          console.log("监听 Socket 连接打开事件 => socket 已打开", res);

          context.globalData.socketIsOpen = true;
          let firstSendData = { "route": "b", "d": { "token": context.globalData.userInfo.access_token, "desk_id": context.globalData.deskId } };
          firstSendData = encodeURIComponent(JSON.stringify(firstSendData));
          context.globalData.socketMsgQueue.push(firstSendData);
          let len = context.globalData.socketMsgQueue.length;
          for (let i = 0; i < len; i++) {
            SocketTask.send({
              data: context.globalData.socketMsgQueue[i]
            });
          }
          context.globalData.socketMsgQueue = [];
        });
      }

      if (mpvuePlatform === "my") {
        mpvue.onSocketOpen((res) => {
          console.log("监听 Socket 连接打开事件 => socket 已打开", res);

          context.globalData.socketIsOpen = true;
          let firstSendData = { "route": "b", "d": { "token": context.globalData.userInfo.access_token, "desk_id": context.globalData.deskId } };
          firstSendData = encodeURIComponent(JSON.stringify(firstSendData));
          context.globalData.socketMsgQueue.push(firstSendData);
          let len = context.globalData.socketMsgQueue.length;
          for (let i = 0; i < len; i++) {
            mpvue.sendSocketMessage({
              data: context.globalData.socketMsgQueue[i]
            });
          }
          context.globalData.socketMsgQueue = [];
        });
      }
    },
    // 监听 Socket 连接关闭事件
    SocketTaskOnClose (SocketTask, context) {
      if (mpvuePlatform === "wx") {
        SocketTask.onClose((res) => {
          console.log("监听 Socket 连接  => 此时已关闭", res);
          context.globalData.socketIsOpen = false;
          if (context.globalData.order_type === "scan") {
            if (context.globalData.socketConnectTime < 5) {
              console.log("正在尝试重新连接 socket....");
              context.Socket();
              context.globalData.socketConnectTime++;
            }
          }
        });
      }
      if (mpvuePlatform === "my") {
        mpvue.onSocketClose(message => {
          let data = JSON.parse(message.data);
          console.log("Socket 接受到服务器的消息 => ", message);
          console.log("Socket 接受到服务器的消息 data => ", data);

          context.globalData.socketIsOpen = false;
          if (context.globalData.order_type === "scan") {
            if (context.globalData.socketConnectTime < 5) {
              console.log("正在尝试重新连接 socket....");
              context.Socket();
              context.globalData.socketConnectTime++;
            }
          }
        });
      }
    },
    // 扫码进入点餐 计算 CategoryList
    scanCaclCategoryList (data) {
      let len = data.length;
      if (this.categoryList) {
        for (let i = 0; i < len; i++) {
          let item = data[i];
          let categoryId = item.category_id;
          let foodId = item.goods_specs_id;
          let goodsNum = parseInt(item.goods_num, 10);
          console.log(item, categoryId, foodId, goodsNum);
          this.scanFirstEnter(foodId, categoryId, goodsNum);
        }
      }
      console.log(data);
    },
    initCategoryListScan (data) {
      console.log("扫码进来   正在计算cat...");
      data.forEach(item1 => {
        item1.goods_num = 0;
        item1.goodsList.forEach(item2 => {
          item2.goods_num = 0;
          item2.specs.forEach(item3 => {
            item3.goods_num = 0;
          });
        });
      });
      this.categoryList = data;
      this.$set(this.categoryList);
    },
    scanFirstEnter (foodId, categoryId, goodsNum) {
      const data = this.categoryList;
      data.forEach(item1 => {
        item1.goodsList.forEach(item2 => {
          item2.specs.forEach(item3 => {
            let id = item3.id.toString();
            if (id === foodId) {
              item3.goods_num = goodsNum;
            }
          });
        });
      });
      this.$set(this.categoryList);
      this._caclCategoryList(categoryId);
    },
    caclSocketdata (data) {
      switch (data.route) {
        case "a":
          if (this.goodsList.categoryList) {
            this.initCategoryListScan(this.goodsList.categoryList);
            this.scanCaclCategoryList(data.d);
            this.saveData();
          }
          break;
        case "m":
          let mdata = data.d;
          let foodId = mdata.goods_specs_id;
          let num = mdata.goods_num;
          let event = mdata.event;
          let categoryId = mdata.category_id;
          this._sameFoodId(foodId, num, event);
          this._caclCategoryList(categoryId);
          break;
        case "c":
          this.globalData[Utils.SCANCATEGORYLIST] = null;
          this.initCategoryList(this.goodsList.categoryList);
          this._caclWillBuyFoods(this.categoryList);
          this.saveData();
          this.handleSelectedFoodPopup();
          break;
        default:
          Utils.showToast("Socket 返回数据错误");
      }
    },
    // 监听 WebSocket 接受到服务器的消息事件
    SocketTaskOnMessage (SocketTask, context) {
      if (mpvuePlatform === "wx") {
        SocketTask.onMessage((message) => {
          let data = JSON.parse(message.data);
          console.log("Socket 接受到服务器的消息 => ", message);
          console.log("Socket 接受到服务器的消息 data => ", data);

          if (data.d.sid) {
            // 第一次连接绑定 socket
            context.globalData.socketSessionId = data.d.sid;
            if (context.goodsList.categoryList) {
              context.SocketTaskSendGetAllFoods(SocketTask, context);
            }
          } else {
            if (context.globalData.userInfo.id !== data.d.user_id) {
              context.caclSocketdata(data);
            }
          }
        });
      }
      if (mpvuePlatform === "my") {
        mpvue.onSocketMessage(message => {
          let data = JSON.parse(message.data);
          console.log("Socket 接受到服务器的消息 => ", message);
          console.log("Socket 接受到服务器的消息 data => ", data);

          if (data.d.sid) {
            // 第一次连接绑定 socket
            context.globalData.socketSessionId = data.d.sid;
            context.SocketTaskSendGetAllFoods(SocketTask, context);
          } else {
            if (context.globalData.userInfo.id !== data.d.user_id) {
              context.caclSocketdata(data);
            }
          }
        });
      }
    },
    // 监听 WebSocket 错误事件
    SocketTaskOnError (SocketTask) {
      if (mpvuePlatform === "wx") {
        SocketTask.onError(errMsg => {
          console.log("监听 WebSocket 错误事件 =>", errMsg);
        });
      }

      if (mpvuePlatform === "my") {
        mpvue.onSocketError(errMsg => {
          console.log("监听 WebSocket 错误事件 =>", errMsg);
        });
      }
    },
    // 关闭 WebSocket 连接
    SocketTaskClose (SocketTask, context, cb) {
      if (!cb) {
        cb = function (res) {
          console.log("Socket 关闭成功 =>", res);
          context.globalData.socketIsOpen = false;
        };
      }
      if (mpvuePlatform === "wx") {
        SocketTask.close({
          success: cb
        });
      }
      if (mpvuePlatform === "my") {
        mpvue.closeSocket({
          success: cb
        });
      }
    },
    SocketTaskSend (SocketTask, foodId, categoryId, goodsNum, event, context = this) {
      // 通过 WebSocket 连接发送数据 b绑定
      let sendData = { "route": "m", "d": { "sid": context.globalData.socketSessionId, "md": { "goods_specs_id": foodId, "goods_num": goodsNum, "event": event, "category_id": categoryId } } };
      let data = encodeURIComponent(JSON.stringify(sendData));
      console.log("senddata", sendData);
      if (mpvuePlatform === "wx") {
        if (context.globalData.socketIsOpen) {
          SocketTask.send({
            data
          });
        } else {
          context.globalData.socketMsgQueue.push(data);
        }
      }
      if (mpvuePlatform === "my") {
        if (context.globalData.socketIsOpen) {
          mpvue.sendSocketMessage({
            data
          });
        } else {
          context.globalData.socketMsgQueue.push(data);
        }
      }
    },
    // socket 获取全部数据
    SocketTaskSendGetAllFoods (SocketTask, context = this) {
      let sendData = { "route": "a", "d": { "sid": context.globalData.socketSessionId } };
      let data = encodeURIComponent(JSON.stringify(sendData));
      if (mpvuePlatform === "wx") {
        if (context.globalData.socketIsOpen) {
          console.log("********************正在发送数据于 Socket 拉取点餐全部菜品*********************");
          SocketTask.send({
            data
          });
        } else {
          context.globalData.socketMsgQueue.push(data);
        }
      }
      if (mpvuePlatform === "my") {
        if (context.globalData.socketIsOpen) {
          console.log("********************正在发送数据于 Socket 拉取点餐全部菜品*********************");
          mpvue.sendSocketMessage({
            data
          });
        } else {
          context.globalData.socketMsgQueue.push(data);
        }
      }
    },
    SocketTaskSendClearAllFoods (SocketTask, context = this) {
      let sendData = { "route": "c", "d": { "sid": context.globalData.socketSessionId } };
      let data = encodeURIComponent(JSON.stringify(sendData));

      if (mpvuePlatform === "wx") {
        if (context.globalData.socketIsOpen) {
          SocketTask.send({
            data
          });
        } else {
          context.globalData.socketMsgQueue.push(data);
        }
      }

      if (mpvuePlatform === "my") {
        if (context.globalData.socketIsOpen) {
          mpvue.sendSocketMessage({
            data
          });
        } else {
          context.globalData.socketMsgQueue.push(data);
        }
      }
    },
    // 初始化 CategoryList
    initCategoryList (data) {
      const _this = this;
      const orderType = this.orderType;

      const initCategoryListData = (data) => {
        let newCategoryList = [];
        data.forEach((item, index) => {
          newCategoryList[index] = {
            ...item,
            goodsList: [],
            goods_num: 0
          };
          item.goodsList.forEach((item2, index2) => {
            newCategoryList[index].goodsList[index2] = {
              ...item2,
              goods_num: 0,
              specs: []
            };
            if (item2.is_multiple_spec === "1") {
              item2.specs.forEach((item3, index3) => {
                newCategoryList[index].goodsList[index2].specs[index3] = {
                  ...item3,
                  goods_num: 0
                };
              });
            } else {
              newCategoryList[index].goodsList[index2].specs[0] = {
                ...item2.specs[0],
                goods_num: 0
              };
            }
          });
        });
        _this.categoryList = newCategoryList;
        _this._caclWillBuyFoods(newCategoryList);
        console.log("初始化数据完成............", _this.categoryList);
      };

      const func = (key) => {
        let result = _this.globalData[key];
        if (result) {
          this._caclWillBuyFoods(result);
        } else {
          initCategoryListData(data);
        }
      };
      Utils.operatingData(orderType, "c", func);
    },
    // 计算 CategoryList 传入一个分类id作为参数
    _caclCategoryList (categoryId) {
      categoryId = categoryId + "";
      const data = this.categoryList;
      let MenuNum = 0;

      // 遍历整个数组
      data.forEach((item, index) => {
        item.goodsList.forEach((item2, index2) => {
          // 如果 种类id相同
          if (categoryId === item2.category_id) {
            let foodNum = 0;
            item2.specs.forEach((item3, index3) => {
              if (item3.goods_num > 0) {
                foodNum = foodNum + item3.goods_num;
              }
            });
            item2.goods_num = foodNum;
          }
        });
      });

      data.forEach((item, index) => {
        let id = item.id.toString();
        if (categoryId === id) {
          item.goodsList.forEach((item2, index2) => {
            MenuNum = MenuNum + item2.goods_num;
          });
          item.goods_num = MenuNum;
        }
      });

      // 更新视图
      for (let i = 0, len = data.length; i < len; i++) {
        let item = data[i];
        this.$set(this.categoryList, i, item);
      }

      this._caclWillBuyFoods(data);
    },
    // 相同id 联动
    _sameFoodId (foodId, num, event) {
      console.log("正在计算相同菜品 id....");
      const data = this.categoryList;
      data.forEach((item, index) => {
        item.goodsList.forEach((item2, index2) => {
          item2.specs.forEach((item3, index3) => {
            // 相同菜品 id
            if (foodId === item3.id) {
              if (event === "add") {
                console.log("多规格添加菜品");
                item3.goods_num = item3.goods_num + num;
              } else {
                console.log("多规格减少菜品");
                if (item3.goods_num > 0) {
                  item3.goods_num--;
                }
              }
            }
          });
        });
      });
      // 更新视图
      for (let i = 0, len = data.length; i < len; i++) {
        let item = data[i];
        this.$set(this.categoryList, i, item);
      }
    },
    // 初始化将要购买的商品
    _caclWillBuyFoods (data) {
      console.log("this.categoryList => ", data);
      let willBuyFoods = [];
      data.forEach((item, index) => {
        if (item.goods_num > 0) {
          item.goodsList.forEach((item2, index2) => {
            if (item2.goods_num > 0) {
              item2.specs.forEach((item3, index3) => {
                if (item3.goods_num > 0) {
                  let food = {
                    ...item2,
                    ...item3,
                    category_name: item.name,
                    specs: []
                  };
                  willBuyFoods.push(food);
                }
              });
            }
          });
        }
      });
      this.willBuyFoods = willBuyFoods;
      console.log("计算 willbuyfoods => 结果：", willBuyFoods);

      // 更新视图
      for (let i = 0, len = willBuyFoods.length; i < len; i++) {
        let item = willBuyFoods[i];
        this.$set(this.willBuyFoods, i, item);
      }

      this.saveData();
    },
    // 控制店家优惠公告是否显示的事件
    handleNoticePopupShow () {
      this.isShowNoticePopup = !this.isShowNoticePopup;
    },
    // 控制商品规格是否显示的事件
    handleSizePopupShow () {
      if (this.currentSelectedFood) {
        this.isShowSizePopup = !this.isShowSizePopup;
      }
    },
    // 显示购物车弹窗
    handleSelectedFoodPopup () {
      if (this.shoppingCarTotalNum > 0) {
        this.isShowSelectedFoodPopup = !this.isShowSelectedFoodPopup;
      } else {
        this.isShowSelectedFoodPopup = false;
      }
    },
    // 初始化店铺 店铺商品信息
    requestCategoryList (shopId) {
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
        this.goodsList = resultData;
        this.globalData.goodsList = resultData;

        this.activityList = resultData.activityList;
        this.globalData.activity_list = resultData.activityList;
        if (this.globalData.socketSessionId) {
          this.globalData.SocketTaskSendGetAllFoods(this.globalData.SocketTask, this);
        }
        this.initCategoryList(resultData.categoryList);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 清空购物车所有菜品
    clearShoppingCarAllFood () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        // Utils.SCANCATEGORYLIST
        Utils.showModal("提示", "是否清空购物车所有商品？").then(() => {
          _this.globalData[key] = null;

          _this.initCategoryList(this.goodsList.categoryList);

          _this._caclWillBuyFoods(this.categoryList);

          _this.SocketTaskSendClearAllFoods(_this.globalData.SocketTask, _this);
          _this.handleSelectedFoodPopup();
        }).catch(() => {
          // 隐藏弹框
          _this.handleSelectedFoodPopup();
        });
      };
      Utils.operatingData(orderType, "c", func);
    },
    // 点击添加菜品按钮执行的事件
    clickAddGoods (objIndex) {
      const _this = this;
      const data = _this.categoryList; // 从原始数组中获取当前点击的商品信息
      let food = data[objIndex.index].goodsList[objIndex.foodsIndex]; // 获取当前点击的商品数据
      const foodIsMultipleSpec = food.is_multiple_spec === "1"; // 当前商品是否为多规格
      const foodCategoryId = food.category_id; // 当前菜品所属种类
      let foodId = food.id; // 菜品ID
      console.log("clickFood => ", food);
      // 如果当前点击菜品为多规格菜品
      if (foodIsMultipleSpec) {
        // 初始化当前选择的商品
        _this.currentSelectedFood = {
          ...food
        };
        // 默获取多规格的第一个
        let specsItem = _this.currentSelectedFood.specs[0];
        // 如果已经购买过
        if (specsItem.goods_num > 0) {
          _this.currentSelectedFoodSize = {
            ...specsItem
          };
        } else {
          // 初始化选择规格弹框数据
          _this.currentSelectedFoodSize = {
            ...specsItem,
            goods_num: 1
          };
        }
        _this.handleSizePopupShow();
      } else {
        // 单规格菜品
        foodId = food.specs[0].id;
        // 相同ID 相同操作
        _this._sameFoodId(foodId, 1, "add");
        // 计算左边
        _this._caclCategoryList(foodCategoryId);

        if (_this.orderType === "scan") {
          _this.globalData.SocketTaskSend(_this.globalData.SocketTask, foodId, foodCategoryId, 1, "add", _this);
        }
      }
    },
    // 点击减少菜品按钮执行的事件
    clickSubtractFoods (objIndex) {
      const _this = this;
      const data = _this.categoryList; // 从原始数组中获取当前点击的商品信息
      let food = data[objIndex.index].goodsList[objIndex.foodsIndex]; // 获取当前点击的商品数据
      const foodCategoryId = food.category_id; // 当前菜品所属种类
      let foodId = food.id; // 菜品ID
      // 如果当前点击菜品为多规格菜品
      food.specs.some((item, index) => {
        if (item.goods_num > 0) {
          foodId = item.id;
          _this._sameFoodId(foodId, 1, "sub");
          return true;
        }
      });
      // 计算左边
      _this._caclCategoryList(foodCategoryId);
      if (_this.orderType === "scan") {
        _this.globalData.SocketTaskSend(_this.globalData.SocketTask, foodId, foodCategoryId, 1, "sub", _this);
      }
    },
    // 商品列表 添加菜品按钮
    clickFoodListAddFood (index) {
      const foodItem = this.willBuyFoods[index];
      const foodCategoryId = foodItem.category_id;
      const foodId = foodItem.id;

      this._sameFoodId(foodId, 1, "add");
      this._caclCategoryList(foodCategoryId);

      if (this.orderType === "scan") {
        this.globalData.SocketTaskSend(this.globalData.SocketTask, foodId, foodCategoryId, 1, "add", this);
      }
    },
    // 商品列表 减少菜品按钮
    clickFoodListSubtractFood (index) {
      const foodItem = this.willBuyFoods[index];
      const foodCategoryId = foodItem.category_id;
      const foodId = foodItem.id;

      this._sameFoodId(foodId, 1, "sub");
      this._caclCategoryList(foodCategoryId);

      if (this.orderType === "scan") {
        this.globalData.SocketTaskSend(this.globalData.SocketTask, foodId, foodCategoryId, 1, "sub", this);
      }
    },
    // 选择规格弹框 添加菜品按钮
    clickChoiceSizePopupAddFood () {
      this.currentSelectedFoodSize.goods_num++;
    },
    // 选择规格弹框 减少菜品按钮
    clickChoiceSizePopupSubtractFood () {
      this.currentSelectedFoodSize.goods_num--;
    },
    // 点击选择规格
    clickChoiceFoodSize (e) {
      // 获取index
      const index = e.currentTarget.dataset.index;
      const currentSelectedFood = this.currentSelectedFood;
      let currentSelectedFoodSize = currentSelectedFood.specs[index];
      if (currentSelectedFoodSize.goods_num > 0) {
        currentSelectedFoodSize = {
          ...currentSelectedFoodSize
        };
      } else {
        currentSelectedFoodSize = {
          ...currentSelectedFoodSize,
          goods_num: 1
        };
      }
      this.currentSelectedFoodSizeIndex = index;
      this.currentSelectedFoodSize = currentSelectedFoodSize;
    },
    // 确定选择规格
    clickChioceFoodSizeOK () {
      const data = this.categoryList;
      // 点击确定 只需要把currentSelectedFood 数据传过去
      const food = this.currentSelectedFood;
      console.log("this.currentSelectedFood => ", this.currentSelectedFood);
      const categoryId = food.category_id;
      // 商品id 是以多规格里面的id开始
      const foodItem = this.currentSelectedFoodSize;
      console.log("this.currentSelectedFoodSize => ", this.currentSelectedFoodSize);
      const foodId = foodItem.id;
      //  商品目前总量
      const newNum = foodItem.goods_num;
      let oldNum = 0;
      let handleNum = 0;

      data.some((item1, index1) => {
        let id = item1.id.toString();
        if (id === categoryId) {
          item1.goodsList.some((item2, index2) => {
            if (categoryId === item2.category_id) {
              item2.specs.some((item3, index3) => {
                if (item3.id === foodId) {
                  oldNum = item3.goods_num;
                  console.log("商品以前数量为 => ", oldNum);
                  return true;
                }
              });
            }
          });
        }
      });
      console.log("newNum", newNum);
      console.log("oldNum", oldNum);
      // 隐藏弹框
      this.handleSizePopupShow();

      handleNum = newNum - oldNum;
      if (handleNum > 0) {
        // 重置序号
        this.currentSelectedFoodSizeIndex = 0;
        // 相同ID 相同操作
        this._sameFoodId(foodId, newNum - oldNum, "add");
        // 计算左边
        this._caclCategoryList(categoryId);
        if (this.orderType === "scan") {
          this.globalData.SocketTaskSend(this.globalData.SocketTask, foodId, categoryId, newNum - oldNum, "add", this);
        }
      }
    },
    // 点击去下单按钮
    clickToPlaceOrder () {
      let orderType = this.orderType;
      let url = "";
      if (orderType === "takeout") {
        url = "../takeoutConfirmOrder/main";
      } else {
        this.globalData.isPayOrder = false;
        url = "../confirmOrder/main";
      }
      mpvue.navigateTo({ url });
    },
    // 保存数据
    saveData () {
      this.saveCategoryListData();
      this.saveWillBuyFoodsData();
    },
    // 保存 categoryList
    saveCategoryListData () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        _this.globalData[key] = _this.categoryList;
        // 通知数据 categoryList 已更新
        _this.globalData.pushCategoryList(_this.categoryList);
      };
      Utils.operatingData(orderType, "c", func);
    },
    // 保存 willBuyFoods
    saveWillBuyFoodsData () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        _this.globalData[key] = _this.willBuyFoods;
      };
      Utils.operatingData(orderType, "w", func);
    }
  },
  computed: {
    // 计算商品总价
    caclTotalPrice () {
      const data = this.willBuyFoods;
      let totalPrice = 0;
      data.forEach(item => {
        if (item.goods_num > 0) {
          let sellPrice = parseFloat(item.sell_price, 10);
          let price = NP.times(sellPrice, item.goods_num);
          totalPrice = NP.plus(price, totalPrice);
        }
      });
      return totalPrice;
    },
    // 计算购物车总数量
    caclShoppingCarTotalNum () {
      let data = this.willBuyFoods;
      let num = 0;
      data.forEach((item, index) => {
        if (item.goods_num > 0) {
          num += item.goods_num;
        }
      });
      // 控制购物车弹框 如果购物车总量为0 关闭弹窗
      if (num === 0) {
        this.isShowSelectedFoodPopup = false;
      }
      this.shoppingCarTotalNum = num;
      return num;
    },
    // j检测去下单按钮是否可用
    checkGoPayBtnDisabled () {
      const num = this.shoppingCarTotalNum;
      if (num > 0) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../static/styles/scss/variable";
.ordering {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100vh;
  min-height: auto;
  padding-bottom: 100rpx;
  .top {
    height: 250rpx;
    background-color: $scss_theme-color;
    margin-bottom: 120rpx;
    position: relative;
    .card {
      position: absolute;
      top: 54rpx;
      left: $scss_padding-LR;
      width: 690rpx;
      height: 260rpx;
      background-color: #fff;
      border-radius: 5rpx;
      padding-top: 80rpx;
      text-align: center;
    }
    img {
      position: absolute;
      width: 98rpx;
      height: 98rpx;
      border-radius: 5rpx;
      top: -40rpx;
      left: 50%;
      transform: translateX(-50%);
    }
    .name {
      line-height: 1;
      font-size: 36rpx;
      font-weight: 700;
      color: #010101;
    }
    .notice {
      width: 100%;
      padding: 12rpx 100rpx 32rpx;
      font-size: 0;
    }
    .full-reduction {
      display: flex;
      height: 30rpx;
      justify-content: space-between;
      align-items: center;
      padding: 0 46rpx;
      .info {
        display: flex;
        .icon {
          width: 52rpx;
          height: 30rpx;
          background-color: #ffae00;
          border: solid 2rpx #e09900;
          color: #fff;
          font-size: 18rpx;
          line-height: 26rpx;
          text-align: center;
          margin-right: 10rpx;
        }
        span {
          border: solid 1px $scss_theme-color;
          margin-right: 14rpx;
          line-height: 26rpx;
          font-size: 24rpx;
          color: $scss_theme-color;
          padding: 0 8rpx;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .drop-down-wrapper {
        height: 30rpx;
      }
    }
  }
  .bottom {
    flex: 1;
    width: 100%;
    overflow: auto;
    padding: 0 14rpx;
    border-top: 2rpx solid #e3e3e3;
  }
}
.popup-notice {
  z-index: 1001;
  .popup {
    height: 100%;
    .content {
      width: 100%;
      height: 100%;
      padding: 0 72rpx;
      padding-top: 128rpx;
      color: #fff;
      > div {
        position: relative;
        // border-top: 2rpx solid rgba(255, 255, 255, 0.2);
        font-size: 24rpx;
        font-weight: 200;
        line-height: 1;
        padding-top: 60rpx;
        padding-bottom: 70rpx;
        &::after,
        &::before {
          content: "";
          width: 224rpx;
          height: 2rpx;
          background-color: rgba(255, 255, 255, 0.2);
          position: absolute;
          top: 0;
        }
        &::before {
          left: 0;
        }
        &::after {
          right: 0;
        }
        > h3 {
          position: absolute;
          top: -14rpx;
          left: 50%;
          font-size: 28rpx;
          font-weight: 700;
          line-height: 1;
          padding: 0 24rpx;
          transform: translateX(-50%);
        }
      }
      .store-name {
        font-size: 32rpx;
        line-height: 168rpx;
        font-weight: 700;
        text-align: center;
        padding: 0;
        border-top: 0;
      }
      .discount-info {
        .item {
          display: flex;
          align-items: center;
          margin-bottom: 24rpx;
          .icon {
            margin-right: 12rpx;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .store-notice {
        p {
          line-height: 2;
        }
      }
      .icon-close-size {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        bottom: 80rpx;
        left: 50%;
        transform: translateX(-50);
      }
    }
  }
  .popup-mask {
    background-color: rgba(7, 17, 27, 0.8);
  }
}
.popup-size {
  z-index: 1001;
  .popup {
    bottom: 0;
    background-color: #fff;
    .content {
      color: #898989;
      padding: 0 $scss_padding-LR $scss_padding-LR;
      .food-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 30rpx;
        line-height: 1;
        color: #343434;
        height: 110rpx;
      }
      .choice {
        p {
          font-size: 24rpx;
          line-height: 1;
          padding: 20rpx 0;
          &:first-child {
            padding-top: 0;
          }
        }
        .items {
          display: flex;
          flex-wrap: wrap;
        }
        .item {
          border-radius: 6rpx;
          border: solid 2rpx #eee;
          font-size: 24rpx;
          line-height: 1;
          padding: 16rpx 52rpx;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          transition: all 0.3s;
          &:last-child {
            margin-right: 0;
          }
          &.active {
            border-color: $scss_theme-color;
            color: $scss_theme-color;
          }
        }
      }
      .handle {
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        div {
          &:first-child {
            display: flex;
            align-items: flex-end;
            span {
              line-height: 1;
              position: relative;
              &.like-hint {
                padding-left: 20rpx;
                &::after {
                  content: "";
                  position: absolute;
                  left: 10rpx;
                  width: 2rpx;
                  bottom: 0;
                  background-color: #898989;
                  height: 24rpx;
                }
              }
            }
            .price {
              font-size: 32rpx;
              font-weight: 700;
              color: #f00;
              margin-right: 18rpx;
              margin-top: -4rpx;
            }
          }
        }
      }
      .btn-wrapper {
        height: 80rpx;
        margin-top: 30rpx;
      }
    }
  }
}
.popup-selected-food {
  z-index: 999;
  .popup {
    bottom: 0;
    .content {
      background-color: #fff;
      color: #000;
      padding: 0 0 $scss_go-pay-height;
      .tool-bar {
        width: 100%;
        height: 82rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2rpx solid #eee;
        padding: 0 $scss_padding-LR;
        font-size: 32rpx;
        color: #5b5a5a;
        .clear {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: #676767;
          .icon {
            margin-right: 8rpx;
          }
        }
      }
      .items {
        max-height: 660rpx;
        overflow: auto;
      }
      .item {
        display: flex;
        justify-content: space-between;
        padding: 0 $scss_padding-LR;
        align-items: center;
        height: 110rpx;
        border-bottom: 2rpx solid #eee;
        font-size: 32rpx;
        line-height: 1;
        color: #2a2a2a;
        &:last-child {
          border-bottom: 0;
        }
        .left {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          p {
            &:last-child {
              font-size: 24rpx;
              line-height: 1;
              padding-top: 10rpx;
              color: #7f7f7f;
            }
          }
          .price {
            font-weight: 700;
            color: #f00;
            &::before {
              content: "¥";
              font-size: 22rpx;
              font-weight: normal;
            }
          }
        }
        .right {
          width: 200rpx;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
