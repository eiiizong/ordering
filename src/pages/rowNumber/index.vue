<template>
  <!-- 排号页面 -->
  <div class="row-number">
    <TopNav text="排号"></TopNav>
    <div class="content">
      <div class="title">当前排号信息</div>
      <div class="item"
           v-for="(item, index) in shopQueuesInfo"
           :key="item.id">
        <div class="dashed-wrapper">
          <div class="inner-content">
            <div class="status">
              <div class="cell">
                <div class="left">
                  <i class="icon icon-table"></i>
                  <span>{{item.name}}({{item.desc}})</span>
                </div>
                <div class="right">
                  <span v-if="item.nextQueue.id">下一位{{item.nextQueue.alias}}号</span>
                  <span v-if="!item.currentQueue.id && !item.nextQueue.id">暂无顾客排队信息</span>
                </div>
              </div>
              <p class="await">{{item.wait_num}}位顾客等待就餐</p>
            </div>
            <!-- 排号已经存在 只显示已排号的控制按钮 或者全部可控制-->
            <div class="handle cell"
                 :style="{display: userIsQueues?'none':'flex'}">
              <div class="left">
              </div>
              <div class="right">
                <Btn value="立即排号"
                     btnClassName="appointment-reverse"
                     @click="clickQueue(index)"></Btn>
              </div>
            </div>
            <div class="handle cell"
                 :style="{display: userIsQueues && index===rowNumberIndex?'flex':'none'}">
              <div class="left">
                <div>
                  <span>排号成功</span>
                  <i class="icon icon-row-num-ok"></i>
                </div>
              </div>
              <div class="right">
                <Btn value="取消排号"
                     btnClassName="no"
                     @click="clickQueue(index)"></Btn>
              </div>
            </div>
          </div>
          <i class="icon icon-bottom-left"
             v-if="userIsQueues && index===rowNumberIndex"></i>
          <i class="icon icon-bottom-right"
             v-if="userIsQueues && index===rowNumberIndex"></i>
        </div>
        <!-- 排号结果 -->
        <div class="success"
             v-if="item.myQueue.id">
          <p>您的排号为</p>
          <p class="num">{{item.myQueue.alias}}</p>
          <p>您前面还有{{calcQueueWaitNum}}位顾客等待就餐</p>
          <p>(预计等待{{item.myQueue.waiting_minute}}分钟)</p>
          <div class="btn-order"
               @click="immediatelyOrder(index)">
            <span>立即点餐</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 填写电话号码弹框 -->
    <div class="popup-wrapper"
         v-show="isShowPopup">
      <div class="popup">
        <div class="content">
          <form class="form">
            <h3 class="title">
              <span>填写信息</span>
              <i class="icon icon-input-info"></i>
            </h3>
            <div class="input-wrapper">
              <label for="phoneNumber">
                <span>联系电话</span>
              </label>
              <input type="number"
                     id="phoneNumber"
                     placeholder="请填写联系电话"
                     maxlength="11"
                     @input="inputTel"
                     v-model="phone"
                     focus>
            </div>
          </form>
          <div class="btn-wrapper">
            <Btn value="立即排号"
                 :disabled="btnQueuesIsDisabled"
                 @click="clickQueueAgain"></Btn>
          </div>
        </div>
      </div>
      <div class="popup-mask"
           @click="handlePopupShow"></div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import Btn from "@/components/btn/btn";
import Utils from "../../utils/utils.js";

export default {
  data () {
    return {
      // 填写电话号码弹窗
      isShowPopup: false,
      // 用户信息
      userInfo: {},
      // 店铺信息
      shopInfo: {},
      deviceType: "",
      // 排号电话号码
      phone: "",
      // 弹框排号按钮是否可用
      btnQueuesIsDisabled: true,
      // 店铺排号信息
      shopQueuesInfo: [
        {
          // 排队分类 id
          id: 1,
          // 当前排队人数
          wait_num: 10,
          // 平均每人等待时间
          average_time: 10,
          currentQueue: {
            // 队列 id
            id: 1,
            // 用户id
            user_id: 2,
            // 排序数字号
            num: "A32"
          },
          myQueue: {
            // 队列id
            "id": "1",
            // 队列号
            "num": "2",
            // 日期
            "day": "2019 03 25",
            // 顺序号
            "sort": "A65",
            // 别称
            "alias": "",
            // 用户 id
            "user_id": "22",
            // 店铺 id
            "shop_id": "1",
            // 排队分类id
            "queue_type_id": "22",
            // 电话
            "phone": "18482160080",
            // 状态
            "state": "1",
            // 前面排队人数
            "wait_num": "20"
          },
          nextQueue: {
            // 队列 id
            id: 2,
            // 用户id
            user_id: 3,
            // 排序数字号
            num: "A33"
          }
        }
      ],
      // 用户是否已经排号
      userIsQueues: false,
      // 排号序列
      rowNumberIndex: -1,
      // 排号和取消排号是点击的序号
      clickIndex: -1,
      // 店铺 id
      shopId: ""
    };
  },
  components: {
    TopNav,
    Btn
  },
  onShow () {
    this.initInfo();
  },
  methods: {
    // 用户信息
    initInfo () {
      const globalData = this.globalData;

      this.userInfo = globalData.userInfo;
      this.shopInfo = globalData.shopInfo;
      this.shopId = globalData.shopId;
      this.deviceType = globalData.device_type;
      this.phone = this.userInfo.phone;

      // 请求店铺排队情报
      this.requestShopQueuesInfo();
      console.log("this.globalData => ", this.globalData);
      console.log("this.shopInfo => ", this.shopInfo);
      console.log("this.shopId => ", this.shopId);
      console.log("this.userInfo => ", this.userInfo);
      console.log("this.phone => ", this.phone);
      console.log("this.deviceType => ", this.deviceType);
    },
    // 检测电话号码是否输入正确
    checkQueuesBtnIsDisabled (phone) {
      let phoneIsOk = /^1(3|4|5|7|8)\d{9}$/.test(phone);
      if (phoneIsOk) {
        this.btnQueuesIsDisabled = false;
      } else {
        this.btnQueuesIsDisabled = true;
      }
    },
    // 初始化用户是否已经排号
    initUserIsQueues (data) {
      this.userIsQueues = false;
      this.rowNumberIndex = -1;
      data.some((item, index) => {
        // 用户已经排号
        if (item.myQueue.id) {
          console.log("用户已经排号.....");
          this.globalData.queueId = item.myQueue.id;
          console.log("this.item.myQueue.id => ", item.myQueue.id);
          this.userIsQueues = true;
          this.rowNumberIndex = index;
          return true;
        }
      });
    },
    // 获取店铺排队信息
    requestShopQueuesInfo () {
      const url = "queues";
      const methods = "POST";
      const data = {
        "shop_id": this.shopId
      };
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        const resultData = result.data;
        // 初始化检测用户是否已经排号
        this.shopQueuesInfo = resultData;
        this.initUserIsQueues(resultData);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 创建排号
    requestQueuesApply (id) {
      const url = "queues/apply";
      const methods = "POST";
      const data = {
        "queue_type_id": id,
        "phone": this.phone
      };
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        this.globalData.queueId = result.data.id;
        this.requestShopQueuesInfo();
        this.handlePopupShow();
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 取消排号
    requestCancelQueues (queueId) {
      const url = "queues/cancel";
      const methods = "POST";
      const data = {
        "queue_id": queueId
      };
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        console.log("取消排队成功");
        this.requestShopQueuesInfo();
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 输入电话号码时执行的事件
    inputTel (e) {
      // const len = e.target.cursor;
      // if (len === 11) {
      //   mpvue.hideKeyboard();
      // }
      const value = e.target.value;
      this.checkQueuesBtnIsDisabled(value);
    },
    // 立即点餐
    immediatelyOrder (index) {
      const myQueue = this.shopQueuesInfo[index].myQueue;
      this.globalData.queueId = myQueue.id;
      this.globalData.order_type = "queue";
      const url = "../ordering/main";
      mpvue.redirectTo({ url });
    },
    // 控制弹窗是否显示
    handlePopupShow () {
      this.isShowPopup = !this.isShowPopup;
    },
    // 立即排号按钮 或者 取消排号
    clickQueue (index) {
      this.clickIndex = index;
      if (!this.userIsQueues) {
        this.handlePopupShow();
        this.checkQueuesBtnIsDisabled(this.phone);
      } else {
        Utils.showModal("提示", "是否确定取消排号").then(() => {
          const myQueueId = this.shopQueuesInfo[index].myQueue.id;
          this.globalData.queueId = "";
          console.log(myQueueId);
          this.requestCancelQueues(myQueueId);
        });
      }
    },
    // 立即排号弹窗按钮
    clickQueueAgain () {
      const queueId = this.shopQueuesInfo[this.clickIndex].id;
      this.requestQueuesApply(queueId);
    }
  },
  computed: {
    // 计算还要多少人正在排队
    calcQueueWaitNum () {
      const data = this.shopQueuesInfo;
      let num = 0;
      data.some(item => {
        if (item.myQueue.id) {
          num = parseInt(item.myQueue.wait_num, 10) - 1;
          return true;
        }
      });
      return num;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../static/styles/scss/variable";

.row-number {
  padding: 0 $scss_padding-LR $scss_padding-LR;
  .title {
    line-height: 86rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: #242424;
  }
  .item {
    background-color: #fff;
    border-radius: 10rpx;
    margin-bottom: 24rpx;
    &:last-child {
      margin-bottom: 0;
    }
    .dashed-wrapper {
      border-bottom: 0;
      padding: 0 22rpx;
      border-radius: 10rpx;
    }
    .status {
      padding-top: 42rpx;
    }
    .await {
      font-size: 28rpx;
      line-height: 1;
      color: #949494;
      padding: 20rpx 0 44rpx;
    }
    .cell {
      display: flex;
      justify-content: space-between;
      font-size: 34rpx;
      font-weight: 600;
      color: #242424;
      height: 56rpx;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
      }
      .right {
        font-size: 32rpx;
        font-weight: normal;
        color: #000;
      }
      &.handle {
        height: 88rpx;
        font-size: 28rpx;
        color: #282828;
        border-top: 2rpx solid $scss_border-color;
        .left {
          > div {
            display: flex;
            align-items: center;
          }
          span {
            margin-right: 12rpx;
          }
        }
        .right {
          color: #979797;
          height: 56rpx;
          width: 144rpx;
        }
      }
    }
  }
  // 排号结果
  .success {
    padding: 0 22rpx;
    height: 334rpx;
    border-top: 2rpx dashed $scss_border-color;
    position: relative;
    font-size: 26rpx;
    line-height: 1;
    color: #947fe8;
    text-align: center;
    p {
      &:nth-child(1) {
        font-size: 24rpx;
        line-height: 1;
        padding: 64rpx 0 38rpx;
        color: #979797;
      }
      &:nth-child(2) {
        font-size: 70rpx;
        font-weight: 700;
        line-height: 1;
        color: #282828;
        margin-bottom: 26rpx;
        &::after {
          content: "号";
          font-size: 28rpx;
        }
      }
      &:nth-child(3) {
        padding-bottom: 10rpx;
      }
    }
    .btn-order {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 176rpx;
      height: 176rpx;
      background-image: linear-gradient(59deg, #5feaff 0%, #394cff 100%);
      -webkit-background-image: linear-gradient(
        59deg,
        #5feaff 0%,
        #394cff 100%
      );
      box-shadow: inset -2px 1px 13px 0px rgba(0, 45, 240, 0.35);
      -webkit-box-shadow: inset -2px 1px 13px 0px rgba(0, 45, 240, 0.35);
      color: #fff;
      font-weight: 700;
      font-size: 30rpx;
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
      -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%);
      border-bottom-right-radius: 10rpx;
      span {
        position: absolute;
        right: 22rpx;
        bottom: 18rpx;
        line-height: 36rpx;
        width: 60rpx;
      }
    }
  }
  .popup-wrapper {
    .popup {
      position: absolute;
      z-index: 1001;
      width: 690rpx;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 10rpx;
      padding: 0 0 48rpx;
      .btn-wrapper {
        padding: 0 20rpx;
        height: 80rpx;
      }
      .title {
        height: 106rpx;
        padding: 0 40rpx;
        font-size: 32rpx;
        font-weight: 700;
        color: #010101;
        display: flex;
        align-items: center;
        span {
          margin-right: 8rpx;
        }
      }
      .input-wrapper {
        display: flex;
        height: 90rpx;
        padding: 0 40rpx;
        align-items: center;
        font-size: 28rpx;
        color: #000;
        margin-bottom: 114rpx;
        input {
          flex: 1;
          border-bottom: 2rpx solid #eee;
          padding-left: 28rpx;
          line-height: 40rpx;
          font-size: 28rpx;
          height: 100%;
        }
      }
    }
  }
}
</style>
